"""Persistent layout storage for Spatial Context.

Follows the same Store-wrapped-in-a-lock pattern as voice_satellite's
settings_store.py: a single JSON document at
/config/.storage/spatial_context.storage, keyed by floor_id.
"""

from __future__ import annotations

import asyncio
import math
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_STORE_VERSION = 1
_STORE_KEY = f"{DOMAIN}.layout"

# Where an outdoor device placed on the Property tab is reported as placed,
# in the spots that otherwise carry a floor_id (the device picker's
# "placed on" hint, the export). Can't collide with an HA floor_id, which
# is always a slug.
PROPERTY_LOCATION_ID = "__property__"


def _store(hass: HomeAssistant) -> Store[dict[str, Any]]:
    return Store(hass, _STORE_VERSION, _STORE_KEY)


def _lock(hass: HomeAssistant) -> asyncio.Lock:
    key = f"{DOMAIN}_storage_lock"
    if key not in hass.data:
        hass.data[key] = asyncio.Lock()
    return hass.data[key]


async def _async_load_all(hass: HomeAssistant) -> dict[str, Any]:
    data = await _store(hass).async_load()
    if not data or "floors" not in data:
        return {"floors": {}, "property": None, "settings": _empty_settings()}
    data.setdefault("property", None)
    data.setdefault("settings", _empty_settings())
    return data


def _empty_floor() -> dict[str, Any]:
    return {
        "background_image_id": None,
        "background_opacity": 0.5,
        # Where/how big the background image is drawn within this floor's
        # own stored coordinate space — (0, 0, 1) reproduces the old
        # hardcoded "always full BASE_WIDTH from the origin" behavior
        # exactly, so every floor saved before these fields existed picks
        # up identical defaults with no migration needed. Only Align Floors
        # (see websocket_api.py/panel.ts) ever sets these to anything else.
        "background_offset_x": 0.0,
        "background_offset_y": 0.0,
        "background_scale": 1.0,
        # Which "building" this floor belongs to — null until Align Floors
        # links two floors together (see websocket_api.py's set_building_id
        # and panel.ts's _onAlignApply). Two floors sharing a non-null
        # building_id are understood to share one coordinate system (e.g.
        # Top Floor + Bottom Floor of the same house); a floor that's a
        # genuinely separate structure (a detached Garage, say) stays null
        # forever unless it's deliberately aligned to something too.
        "building_id": None,
        # Saved pan/zoom (see websocket_api.py's _VIEW_BOX_SCHEMA), restored
        # whenever this floor is opened — None on a floor whose view was
        # never explicitly saved.
        "view_box": None,
        "rooms": [],
        "pins": [],
        "walls": [],
        "openings": [],
        "scale": None,
    }


def _empty_property() -> dict[str, Any]:
    return {
        "background_image_id": None,
        "background_opacity": 0.85,
        "background_offset_x": 0.0,
        "background_offset_y": 0.0,
        "background_scale": 1.0,
        # Saved pan/zoom, restored whenever the Property tab is opened.
        "view_box": None,
        # Each placement is a labeled, rotatable rectangle marking one
        # building's footprint on the property photo. `floor_id` is the
        # representative/anchor floor used for navigation ("go to floor")
        # and as the name/icon fallback; `building_id` mirrors
        # FloorLayout.building_id when the anchor floor has one (null for a
        # standalone floor acting as its own building, e.g. a detached
        # garage never aligned to anything).
        #
        # `source_bounds` ({min_x, min_y, max_x, max_y}, floor-plan units) is
        # the building's traced footprint the rectangle was fitted to — the
        # floor-plan box it maps onto, so a floor position converts to a
        # property position and back. Stored, not recomputed live: drawing
        # more rooms later (an outdoor deck, say) grows the footprint, which
        # would otherwise silently stretch every mapping.
        "placements": [],
        # Outdoor device pins (garden lights, say) — same shape as a floor
        # pin, but positioned on the property photo. A device lives in one
        # place only, across floors and here (see the save functions).
        "pins": [],
    }


def layout_bounds(layout: dict[str, Any]) -> dict[str, float] | None:
    """A floor's traced footprint extent (rooms + walls only, not pins), or
    None when nothing's been traced."""
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


def _building_bounds(
    floors: dict[str, dict[str, Any]], placement: dict[str, Any]
) -> dict[str, float] | None:
    """Union footprint of every floor in a placement's building — floors
    sharing a building_id already share one coordinate system."""
    building_id = placement.get("building_id")
    member_layouts = [
        layout
        for floor_id, layout in floors.items()
        if (building_id is not None and layout.get("building_id") == building_id)
        or floor_id == placement["floor_id"]
    ]
    boxes = [b for b in map(layout_bounds, member_layouts) if b is not None]
    if not boxes:
        return None
    return {
        "min_x": min(b["min_x"] for b in boxes),
        "min_y": min(b["min_y"] for b in boxes),
        "max_x": max(b["max_x"] for b in boxes),
        "max_y": max(b["max_y"] for b in boxes),
    }


def live_layouts(
    floors: dict[str, dict[str, Any]], live_floor_ids: set[str]
) -> dict[str, dict[str, Any]]:
    """`floors` minus layouts whose floor has since been deleted in HA
    (#37). They no longer hold devices as "placed", but their data stays
    in storage: HA derives floor_id from the name, so re-creating a floor
    with the same name brings its layout back."""
    return {fid: layout for fid, layout in floors.items() if fid in live_floor_ids}


def live_placements(
    floors: dict[str, dict[str, Any]], placements: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    """Property placements whose building still has a floor in `floors`
    (already filtered by live_layouts): the anchor floor itself, or any
    floor sharing its building_id. Mirrored by frontend/src/panel.ts's
    _livePlacements — keep both in sync."""
    live_building_ids = {
        layout.get("building_id") for layout in floors.values()
    } - {None}
    return [
        p
        for p in placements
        if p["floor_id"] in floors or p.get("building_id") in live_building_ids
    ]


def meters_per_unit(scale: dict | None) -> float | None:
    """Derive metres-per-stored-unit from a floor's two-point calibration segment."""
    if not scale:
        return None
    (x1, y1), (x2, y2) = scale["points"]
    unit_distance = math.hypot(x2 - x1, y2 - y1)
    if unit_distance == 0:
        return None
    return scale["meters"] / unit_distance


def property_meters_per_unit(
    floors: dict[str, dict[str, Any]], placements: list[dict[str, Any]]
) -> float | None:
    """Metres per Property-tab unit, derived from a placed building whose
    floors are calibrated (#6) — no separate calibration step. A placement
    is its building's traced footprint (`source_bounds`, floor units)
    scaled to `width` site-photo units (aspect locked, so x and y agree),
    so one conversion follows from the other. With several calibrated
    buildings the largest placement wins: the bigger the rectangle, the
    less a slightly-off fit against the photo matters. None when no placed
    building has a calibrated floor.

    Mirrored by frontend/src/panel.ts's _propertyMetersPerUnit — keep both
    in sync."""
    best: tuple[float, float] | None = None  # (area, metres per unit)
    for placement in placements:
        bounds = placement.get("source_bounds")
        width = placement.get("width") or 0
        if not bounds or width <= 0:
            continue
        source_width = bounds["max_x"] - bounds["min_x"]
        if source_width <= 0:
            continue
        floor_mpu = _building_meters_per_unit(floors, placement)
        if floor_mpu is None:
            continue
        area = width * (placement.get("height") or 0)
        if best is None or area > best[0]:
            best = (area, floor_mpu * source_width / width)
    return best[1] if best else None


def _building_meters_per_unit(
    floors: dict[str, dict[str, Any]], placement: dict[str, Any]
) -> float | None:
    """A placement's building scale — its anchor floor's calibration, else
    any other floor in the building (they share one coordinate system, so
    any calibrated one applies to all)."""
    anchor = floors.get(placement["floor_id"])
    mpu = meters_per_unit(anchor.get("scale")) if anchor else None
    if mpu is not None:
        return mpu
    building_id = placement.get("building_id")
    if building_id is None:
        return None
    for layout in floors.values():
        if layout.get("building_id") == building_id:
            mpu = meters_per_unit(layout.get("scale"))
            if mpu is not None:
                return mpu
    return None


def _empty_settings() -> dict[str, Any]:
    return {
        # "metric" or "imperial" — display/input unit for wall thickness,
        # device height, scale calibration, and door/window width. Shared
        # by every viewer (see websocket_api.py's get/save_settings), same
        # as floors/property — this is a fact about the house, not a
        # per-browser preference, so it deliberately doesn't live in
        # localStorage. Storage everywhere else stays real metric SI
        # regardless of this setting; only display/input converts.
        "unit_system": "metric",
        # Zigbee `raw` networkmap timeout, seconds (see zigbee_mesh.py) — the
        # default is enough for a ~70-node mesh; a much larger mesh (100+
        # devices) can need more headroom. User-configurable since only the
        # user knows their own mesh size.
        "zigbee_timeout_seconds": 180,
        # Floor tab display order: "top_down" (highest level first, matching
        # HA's own Areas page) or "ground_up" (#30). Display only — `level`
        # itself is never touched, so the rest of HA reads it normally.
        "floor_order": "top_down",
        # HA device the Zigbee coordinator is drawn at, when the radio is a
        # separate device from the Zigbee2MQTT Bridge (e.g. an SLZB-06
        # network adapter from its own integration — #27). None = the
        # Bridge device, which Z2M's own identifiers already map to.
        "zigbee_coordinator_device_id": None,
        # Save layout edits automatically a few seconds after each change
        # (#32) — the panel's own debounce; the manual Save button still
        # works either way.
        "auto_save": True,
        # Send panel events to <config>/spatial_context_debug.log (see
        # debug.py) — off unless someone is chasing a problem.
        "debug_logging": False,
    }


async def async_get_settings(hass: HomeAssistant) -> dict[str, Any]:
    """Return the stored app-wide settings, or defaults."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        return {**_empty_settings(), **(data.get("settings") or {})}


async def async_save_settings(hass: HomeAssistant, settings: dict[str, Any]) -> None:
    """Replace-save the app-wide settings."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        data["settings"] = settings
        await _store(hass).async_save(data)


async def async_get_floor_layout(hass: HomeAssistant, floor_id: str) -> dict[str, Any]:
    """Return the stored layout for a single floor, or an empty skeleton.

    Merged over `_empty_floor()`'s defaults rather than returned raw — a
    floor saved before a new field existed (background_offset_x/y/scale,
    say) would otherwise come back missing keys the frontend expects on
    every layout.
    """
    async with _lock(hass):
        data = await _async_load_all(hass)
        return {**_empty_floor(), **data["floors"].get(floor_id, {})}


async def async_get_all_layouts(hass: HomeAssistant) -> dict[str, dict[str, Any]]:
    """Return every stored floor's layout, keyed by floor_id."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        return data["floors"]


async def async_floor_has_layout(hass: HomeAssistant, floor_id: str) -> bool:
    """Whether a floor has ever been saved (vs. never touched)."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        return floor_id in data["floors"]


async def async_set_floor_building_id(
    hass: HomeAssistant,
    floor_id: str,
    building_id: str | None,
) -> None:
    """Tag a single floor with a building_id without touching anything else
    about its layout.

    Align Floors needs to tag *both* the floor being viewed and the floor
    it was aligned against with the same building_id — but the floor being
    viewed may have other, unrelated edits pending that the user hasn't
    chosen to Save yet. A full `async_save_floor_layout` of that floor as a
    side effect of Apply would silently persist those too; this patches
    just the one field directly in storage instead.
    """
    async with _lock(hass):
        data = await _async_load_all(hass)
        layout = {**_empty_floor(), **data["floors"].get(floor_id, {})}
        layout["building_id"] = building_id
        data["floors"][floor_id] = layout
        await _store(hass).async_save(data)


async def async_save_floor_layout(
    hass: HomeAssistant,
    floor_id: str,
    layout: dict[str, Any],
) -> None:
    """Replace-save a single floor's layout.

    Also strips any pin sharing a device_id with a pin in `layout` from
    every *other* floor — a device only physically exists in one place, so
    placing it here means it can no longer be "still" placed elsewhere,
    regardless of which of that device's entities backs each pin. Keyed on
    device_id (not entity_id) so this catches the same physical device
    being re-placed via a *different* entity too. Pins with no device_id
    (an orphaned entity that no longer resolves to a device — see
    registry_snapshot.py's migration) are left alone on other floors,
    since there's nothing to safely match them against.
    """
    async with _lock(hass):
        data = await _async_load_all(hass)
        moved_device_ids = {
            pin["device_id"] for pin in layout.get("pins", []) if pin.get("device_id")
        }

        for other_floor_id, other_layout in data["floors"].items():
            if other_floor_id == floor_id:
                continue
            other_layout["pins"] = _without_devices(
                other_layout.get("pins", []), moved_device_ids
            )
        # ...and from the Property tab's outdoor pins.
        if data.get("property"):
            data["property"]["pins"] = _without_devices(
                data["property"].get("pins", []), moved_device_ids
            )

        data["floors"][floor_id] = layout
        await _store(hass).async_save(data)


def _without_devices(
    pins: list[dict[str, Any]], device_ids: set[str]
) -> list[dict[str, Any]]:
    """`pins` minus any placing one of `device_ids` — pins with no
    device_id are kept, since there's nothing to safely match them on."""
    return [
        pin
        for pin in pins
        if not pin.get("device_id") or pin["device_id"] not in device_ids
    ]


async def async_save_all_layouts_raw(
    hass: HomeAssistant,
    floors: dict[str, dict[str, Any]],
) -> None:
    """Write every floor's layout back as-is, with none of
    async_save_floor_layout's per-save cross-floor dedup logic — only used
    by registry_snapshot.py's one-time pin device_id migration, which reads
    and rewrites all floors together and has already reasoned about the
    whole set itself."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        data["floors"] = floors
        await _store(hass).async_save(data)


async def async_get_property_layout(hass: HomeAssistant) -> dict[str, Any]:
    """Return the stored whole-property layout, or an empty skeleton.

    A placement saved before `source_bounds` existed gets it filled from
    its building's footprint *as it is now*, and persisted right away — so
    it's pinned to the footprint the rectangle was actually fitted to,
    before any later drawing (an outdoor deck) grows it.
    """
    async with _lock(hass):
        data = await _async_load_all(hass)
        layout = {**_empty_property(), **(data.get("property") or {})}
        missing = [p for p in layout["placements"] if "source_bounds" not in p]
        if missing:
            for placement in missing:
                placement["source_bounds"] = _building_bounds(
                    data["floors"], placement
                )
            data["property"] = layout
            await _store(hass).async_save(data)
        return layout


async def async_save_property_layout(
    hass: HomeAssistant,
    layout: dict[str, Any],
) -> None:
    """Replace-save the single whole-property layout. Outdoor pins placed
    here are stripped from every floor — a device lives in one place."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        outdoor_device_ids = {
            pin["device_id"] for pin in layout.get("pins", []) if pin.get("device_id")
        }
        for floor_layout in data["floors"].values():
            floor_layout["pins"] = _without_devices(
                floor_layout.get("pins", []), outdoor_device_ids
            )
        data["property"] = layout
        await _store(hass).async_save(data)
