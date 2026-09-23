"""Persistent layout storage for Spatial Context.

Follows the same Store-wrapped-in-a-lock pattern as voice_satellite's
settings_store.py: a single JSON document at
/config/.storage/spatial_context.storage, keyed by floor_id.
"""

from __future__ import annotations

import asyncio
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_STORE_VERSION = 1
_STORE_KEY = f"{DOMAIN}.layout"


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
        return {"floors": {}, "property": None}
    data.setdefault("property", None)
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
        "placements": [],
    }


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

    Also strips any pin sharing an entity_id with a pin in `layout` from
    every *other* floor — an entity only physically exists in one place,
    so placing it here means it can no longer be "still" placed elsewhere.
    """
    async with _lock(hass):
        data = await _async_load_all(hass)
        moved_entity_ids = {pin["entity_id"] for pin in layout.get("pins", [])}

        for other_floor_id, other_layout in data["floors"].items():
            if other_floor_id == floor_id:
                continue
            other_layout["pins"] = [
                pin
                for pin in other_layout.get("pins", [])
                if pin["entity_id"] not in moved_entity_ids
            ]

        data["floors"][floor_id] = layout
        await _store(hass).async_save(data)


async def async_get_property_layout(hass: HomeAssistant) -> dict[str, Any]:
    """Return the stored whole-property layout, or an empty skeleton."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        return {**_empty_property(), **(data.get("property") or {})}


async def async_save_property_layout(
    hass: HomeAssistant,
    layout: dict[str, Any],
) -> None:
    """Replace-save the single whole-property layout."""
    async with _lock(hass):
        data = await _async_load_all(hass)
        data["property"] = layout
        await _store(hass).async_save(data)
