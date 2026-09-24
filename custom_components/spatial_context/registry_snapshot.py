"""Live reads from HA's own floor/area/entity/device registries.

Spatial Context never keeps its own copy of "what floors/areas/entities
exist" — that's HA's job (floor_registry, area_registry, entity_registry,
device_registry). This module only projects those live registries into
the shapes the frontend needs.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    device_registry as dr,
    entity_registry as er,
    floor_registry as fr,
)
from homeassistant.loader import async_get_integration

from .storage import async_get_all_layouts, async_save_all_layouts_raw

# Entity domains that represent an actual kind of physical device worth a
# pin/icon on the map. Deliberately excludes domains that are inherently
# config/metadata/administrative even when they hang off a real device
# (button, update, select, number, text, time, event, notify, image,
# remote, weather) — those are never a meaningful "what kind of thing is
# this" answer for placement, and listing them as filter-chip choices in
# the picker just adds noise (see entity-picker-sidebar.ts's domain chips).
_PLACEABLE_DOMAINS = frozenset(
    {
        "light",
        "switch",
        "sensor",
        "binary_sensor",
        "climate",
        "lock",
        "cover",
        "camera",
        "media_player",
        "fan",
        "humidifier",
        "vacuum",
        "alarm_control_panel",
        "water_heater",
        "device_tracker",
        "valve",
        "siren",
        "assist_satellite",
    }
)

# Mirrors frontend/src/canvas/device-display.ts's DOMAIN_PRIORITY exactly —
# keep both in sync if this list changes. See pick_display_entity below for
# why this exists at all (a device's icon/name has to come from *some*
# entity, chosen automatically, never surfaced to a human as a choice).
_DOMAIN_PRIORITY = [
    "light",
    "switch",
    "climate",
    "media_player",
    "lock",
    "cover",
    "fan",
    "vacuum",
    "alarm_control_panel",
    "valve",
    "humidifier",
    "siren",
    "water_heater",
    "camera",
    "assist_satellite",
    "device_tracker",
    "binary_sensor",
    "sensor",
]


def pick_display_entity(
    device_id: str | None,
    entities: list[dict[str, Any]],
) -> dict[str, Any] | None:
    """The one entity, among every placeable entity of `device_id`, that
    best represents the device for display purposes (export's entity_id/
    name/domain/device_class) — same ranking as
    frontend/src/canvas/device-display.ts's pickDisplayEntity, used by
    export.py so the exported JSON's per-device fields match what the UI
    itself would show, and used directly by the frontend's own device
    picker/pin icon resolution too (not just export parity) — without
    ever asking a human to choose an entity. None when there's no
    device_id to work from, or the device currently has no placeable
    entities at all.
    """
    if not device_id:
        return None
    candidates = [e for e in entities if e.get("device_id") == device_id]
    if not candidates:
        return None

    def _category_rank(entity: dict[str, Any]) -> int:
        category = entity.get("entity_category")
        return 2 if category == "config" else 1 if category else 0

    def _domain_rank(entity: dict[str, Any]) -> int:
        domain = entity.get("domain")
        return _DOMAIN_PRIORITY.index(domain) if domain in _DOMAIN_PRIORITY else len(
            _DOMAIN_PRIORITY
        )

    candidates.sort(key=lambda e: (_category_rank(e), _domain_rank(e)))
    return candidates[0]


def _content_bounds(layout: dict[str, Any]) -> dict[str, float] | None:
    """A floor's traced footprint extent (rooms + walls only, not pins) —
    used by the Property tab to lock a building's placement rectangle to
    its real proportions instead of letting it be freely squashed/
    stretched (see websocket_api.py's _PLACEMENT_SCHEMA `aspect_ratio`).
    Two floors sharing a building_id (Align Floors) already share one
    coordinate system, so their bounds can be unioned directly by the
    frontend without any further transform.
    """
    points: list[list[float]] = []
    for room in layout.get("rooms", []):
        points.extend(room.get("points", []))
    for wall in layout.get("walls", []):
        points.extend(wall.get("points", []))
    if not points:
        return None
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    return {"min_x": min(xs), "min_y": min(ys), "max_x": max(xs), "max_y": max(ys)}


async def async_list_floors(hass: HomeAssistant) -> list[dict[str, Any]]:
    """List every floor known to HA, annotated with whether it has a saved
    layout, which building it belongs to, and its traced footprint extent.

    `building_id` lets the frontend group floors into buildings (see the
    Property tab) without a per-floor round-trip — Top Floor + Bottom Floor
    of the same house share a non-null building_id (set by Align Floors);
    a floor that's never been aligned to anything (a detached Garage, say)
    comes back with building_id None and is its own building.
    """
    floor_registry = fr.async_get(hass)
    all_layouts = await async_get_all_layouts(hass)
    floors = []
    for floor in floor_registry.async_list_floors():
        layout = all_layouts.get(floor.floor_id)
        floors.append(
            {
                "floor_id": floor.floor_id,
                "name": floor.name,
                "level": floor.level,
                "icon": floor.icon,
                "has_layout": layout is not None,
                "building_id": layout.get("building_id") if layout else None,
                "content_bounds": _content_bounds(layout) if layout else None,
            }
        )
    # Matches HA's own Settings -> Areas page: highest level first (top
    # floor down to the ground/bottom), with unleveled floors (a detached
    # Garage, say — `level` is never set on it) sorting last rather than
    # being coerced to 0 and landing in the middle of the numbered floors.
    floors.sort(
        key=lambda f: f["level"] if f["level"] is not None else float("-inf"),
        reverse=True,
    )
    return floors


async def async_migrate_pin_device_ids(hass: HomeAssistant) -> None:
    """One-time backfill for pins saved before Pin.device_id existed —
    every pin used to carry only an entity_id, and a pin's real identity is
    the physical device, not whichever entity happened to be chosen to
    represent it (a UniFi AP's every entity is diagnostic/config, so the
    auto-picked "primary" entity used to become the pin's whole identity,
    with no way to correctly detect it as "already placed" if a different
    entity of the same device was offered elsewhere — see
    pick_display_entity below, which replaces that auto-pick everywhere
    now that entity_id is gone from the schema entirely: a human placing a
    device should never see or choose an entity, only the device).

    Runs once at integration setup (see __init__.py's async_setup) so every
    downstream reader — storage.py's cross-floor dedup, this module's own
    placed-floor tracking below, the frontend's mesh-link resolution — can
    assume device_id is present from then on, with no per-call fallback
    scattered everywhere. Drops the legacy entity_id key once it's no
    longer needed — the new schema never has it, and pick_display_entity
    computes a display entity fresh from device_id every time instead of
    trusting a stored choice — but ONLY once device_id actually resolves.
    An entity that doesn't currently resolve to a device (temporarily
    disabled, integration mid-reload, briefly orphaned) keeps its
    entity_id untouched rather than losing the one clue that could still
    resolve it, so this function harmlessly gets another shot at it on
    every future HA restart — it never gives up on a pin permanently. A
    pin that never resolves still renders fine either way (a generic
    icon/"Unknown device" label — see canvas/device-display.ts, never a
    raw entity_id string, which was never meant for a person to see
    anyway); it just can't join device-level dedup or mesh resolution
    until it does.
    """
    entity_registry = er.async_get(hass)
    all_layouts = await async_get_all_layouts(hass)
    changed = False
    for layout in all_layouts.values():
        for pin in layout.get("pins", []):
            if pin.get("device_id"):
                # Already migrated — drop a leftover entity_id if one's
                # somehow still present (shouldn't happen, but keep
                # storage clean going forward).
                if pin.pop("entity_id", None) is not None:
                    changed = True
                continue
            old_entity_id = pin.get("entity_id")
            if not old_entity_id:
                continue
            entry = entity_registry.async_get(old_entity_id)
            if entry and entry.device_id:
                pin["device_id"] = entry.device_id
                pin.pop("entity_id", None)
                changed = True
    if changed:
        await async_save_all_layouts_raw(hass, all_layouts)


async def async_list_placeable_entities(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Snapshot every entity that represents a real physical device, joined
    with its device/area for display.

    Placement is meant to answer "where does this physical thing sit in the
    house" — so this deliberately excludes entities with no device at all
    (automations, scripts, scenes, zones, persons, most helpers) and devices
    that are themselves non-physical (`entry_type == service`, e.g. an
    integration's hub/bridge container entity).

    Diagnostic/config entities (firmware update, restart button,
    signal-strength sensor) are NOT excluded by `entity_category` here —
    some real physical devices (a UniFi access point, say) have nothing
    else, and dropping them would make the device unplaceable entirely.
    `entity_category` is passed through instead so the frontend's
    per-device grouping can prefer a device's main entity and only fall
    back to a diagnostic one when that's all a device has.

    Domain is filtered, though (`_PLACEABLE_DOMAINS`) — a device's `update`/
    `button`/`select`/`number`/`text`/`time`/`event` entities are never a
    meaningful "what kind of thing is this" answer, and a device whose only
    entities are of those domains isn't something worth placing at all.
    """
    entity_registry = er.async_get(hass)
    device_registry = dr.async_get(hass)
    area_registry = ar.async_get(hass)
    floor_registry = fr.async_get(hass)

    # Which floor (if any) each *device* is currently placed on, across
    # every floor's saved layout — a device only physically exists in one
    # place, so the picker needs this to stop a device already placed on
    # Bottom Floor (via any of its entities) from also being placeable on
    # Top Floor via a *different* entity. Keyed on device_id, not
    # entity_id — a pin's identity is the device it represents, not
    # whichever entity was chosen to display it (see
    # async_migrate_pin_device_ids). (storage.py's save path already
    # enforces the same one-place invariant by silently stripping a moved
    # device's old pin; this is the read-side half that lets the frontend
    # warn *before* that happens instead of only after.)
    all_layouts = await async_get_all_layouts(hass)
    device_id_to_floor_id: dict[str, str] = {}
    for floor_id, layout in all_layouts.items():
        for pin in layout.get("pins", []):
            if pin.get("device_id"):
                device_id_to_floor_id[pin["device_id"]] = floor_id

    # The device's OWN integration — not `entry.platform` on whichever
    # entity happens to be picked as representative. A helper integration
    # (switch_as_x presenting a switch as a light, powercalc computing a
    # virtual power/energy sensor, Dynamic Energy Cost, a utility meter,
    # ...) can attach its own entities to another integration's device
    # without ever registering itself as an owner of that device — so
    # `entry.platform` genuinely varies entity-by-entity on a device like
    # that (confirmed live: a Zigbee2MQTT-owned device with a switch_as_x
    # "light" entity and two powercalc "sensor" entities alongside its real
    # mqtt entities), even though device_name and everything else here is
    # already a true device-level fact. Resolved from the device's own
    # config entry (`config_entry_id` — the modern single-owner model;
    # `primary_config_entry` is just a deprecated compatibility shim over
    # this same field) instead, once per *unique device* rather than per
    # entity or per entry.platform.
    device_integration_domains: dict[str, str | None] = {}
    for device in device_registry.devices:
        config_entry = (
            hass.config_entries.async_get_entry(device.config_entry_id)
            if device.config_entry_id
            else None
        )
        device_integration_domains[device.id] = (
            config_entry.domain if config_entry else None
        )

    # Resolved to a human-readable name + the brands.home-assistant.io icon
    # slug once per *unique* domain (a handful, even in a house with
    # hundreds of devices) rather than once per device. brands.home-
    # assistant.io is the same public, unauthenticated CDN the HA frontend
    # itself uses for every integration logo — generic, no house-specific
    # credentials involved.
    platforms = {d for d in device_integration_domains.values() if d}
    integration_names: dict[str, str] = {}
    for domain in platforms:
        try:
            integration = await async_get_integration(hass, domain)
            integration_names[domain] = integration.name
        except Exception:  # noqa: BLE001 - a missing/uninstallable integration shouldn't break the whole list
            integration_names[domain] = domain

    entities: list[dict[str, Any]] = []
    for entry in entity_registry.entities.values():
        if entry.disabled_by is not None:
            continue
        if entry.device_id is None:
            continue
        if entry.domain not in _PLACEABLE_DOMAINS:
            continue

        device = device_registry.async_get(entry.device_id)
        if device is None or device.entry_type is not None:
            continue

        area_id = entry.area_id or device.area_id
        area = area_registry.async_get_area(area_id) if area_id else None

        state = hass.states.get(entry.entity_id)
        name = state.name if state is not None else (
            entry.name or entry.original_name or entry.entity_id
        )

        placed_floor_id = device_id_to_floor_id.get(entry.device_id)
        placed_floor = floor_registry.async_get_floor(placed_floor_id) if placed_floor_id else None
        integration_domain = device_integration_domains.get(entry.device_id)

        entities.append(
            {
                "entity_id": entry.entity_id,
                "name": name,
                "domain": entry.domain,
                "device_class": entry.device_class or entry.original_device_class,
                "area_id": area_id,
                "area_name": area.name if area else None,
                "device_id": entry.device_id,
                "device_name": device.name_by_user or device.name,
                "entity_category": entry.entity_category,
                "integration_domain": integration_domain,
                "integration_name": integration_names.get(integration_domain)
                if integration_domain
                else None,
                "placed_floor_id": placed_floor_id,
                "placed_floor_name": placed_floor.name if placed_floor else placed_floor_id,
            }
        )

    # Case-insensitive so a title-cased helper-integration entity (e.g. a
    # Dynamic Energy Cost sensor) doesn't sort ahead of a device's own
    # lowercase entity name just because uppercase letters sort first —
    # cosmetic list ordering only, doesn't itself decide which entity
    # represents a device (see pick_display_entity / frontend's
    # pickDisplayEntity for that ranking).
    entities.sort(key=lambda e: (e["name"] or e["entity_id"]).casefold())
    return entities


def async_list_areas(hass: HomeAssistant) -> list[dict[str, Any]]:
    """Snapshot every HA area, for the room-tracing area picker."""
    area_registry = ar.async_get(hass)
    areas = [
        {
            "area_id": area.id,
            "name": area.name,
            "floor_id": area.floor_id,
            "icon": area.icon,
        }
        for area in area_registry.async_list_areas()
    ]
    areas.sort(key=lambda a: a["name"])
    return areas
