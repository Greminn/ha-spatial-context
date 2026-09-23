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

from .storage import async_get_all_layouts

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

    # Which floor (if any) each entity is *currently* placed on, across
    # every floor's saved layout — an entity only physically exists in one
    # place, so the picker needs this to stop a device already placed on
    # Bottom Floor from also being placeable on Top Floor. (storage.py's
    # save path already enforces the same one-place invariant by silently
    # stripping a moved entity's old pin; this is the read-side half that
    # lets the frontend warn *before* that happens instead of only after.)
    all_layouts = await async_get_all_layouts(hass)
    entity_id_to_floor_id: dict[str, str] = {}
    for floor_id, layout in all_layouts.items():
        for pin in layout.get("pins", []):
            entity_id_to_floor_id[pin["entity_id"]] = floor_id

    # `entry.platform` is the integration domain slug (e.g. "unifiprotect",
    # "apple_tv") that set up this entity — already on every registry entry,
    # no need to chase it through the device's config_entries. Resolved to a
    # human-readable name + the brands.home-assistant.io icon slug once per
    # *unique* platform (a handful, even in a house with hundreds of
    # entities) rather than once per entity. brands.home-assistant.io is the
    # same public, unauthenticated CDN the HA frontend itself uses for every
    # integration logo — generic, no house-specific credentials involved.
    platforms = {entry.platform for entry in entity_registry.entities.values() if entry.platform}
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

        placed_floor_id = entity_id_to_floor_id.get(entry.entity_id)
        placed_floor = floor_registry.async_get_floor(placed_floor_id) if placed_floor_id else None

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
                "integration_domain": entry.platform,
                "integration_name": integration_names.get(entry.platform)
                if entry.platform
                else None,
                "placed_floor_id": placed_floor_id,
                "placed_floor_name": placed_floor.name if placed_floor else placed_floor_id,
            }
        )

    entities.sort(key=lambda e: e["name"] or e["entity_id"])
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
