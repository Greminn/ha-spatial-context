"""Export data helpers for Spatial Context."""

from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant

from . import registry_snapshot
from .storage import async_get_floor_layout

# Mirrors frontend/src/canvas/materials.ts — keep both in sync if this list
# changes. attenuation_db_per_cm is an approximate 2.4GHz RF signal loss
# *per centimetre* of that material — a wall's total attenuation is that
# rate times its actual thickness_cm (see _wall_attenuation_db), not a
# single flat number, since a thicker wall of the same material blocks
# more. default_thickness_cm is only the fallback for a wall saved before
# thickness_cm existed at all.
_WALL_MATERIALS = {
    "timber_frame": {
        "label": "Timber framed (drywall)",
        "attenuation_db_per_cm": 0.3,
        "default_thickness_cm": 10,
    },
    "brick_veneer": {
        "label": "Brick veneer",
        "attenuation_db_per_cm": 0.55,
        "default_thickness_cm": 11,
    },
    "concrete_block": {
        "label": "Concrete / block",
        "attenuation_db_per_cm": 0.6,
        "default_thickness_cm": 20,
    },
    "aerated_concrete_block": {
        "label": "Aerated/foam concrete block (plastered)",
        "attenuation_db_per_cm": 0.37,
        "default_thickness_cm": 13,
    },
    "ceramic_poroton_block": {
        "label": "Ceramic / Poroton block",
        "attenuation_db_per_cm": 0.42,
        "default_thickness_cm": 25,
    },
    "glass": {
        "label": "Glass",
        "attenuation_db_per_cm": 2,
        "default_thickness_cm": 1,
    },
    "steel_frame": {
        "label": "Steel frame",
        "attenuation_db_per_cm": 1,
        "default_thickness_cm": 10,
    },
}
_DEFAULT_WALL_MATERIAL = "timber_frame"


def _wall_thickness_cm(wall: dict) -> float:
    """A wall's effective thickness — its own stored value, or its
    material's default when missing (a wall saved before thickness_cm
    existed)."""
    material = _WALL_MATERIALS.get(
        wall.get("material", _DEFAULT_WALL_MATERIAL),
        _WALL_MATERIALS[_DEFAULT_WALL_MATERIAL],
    )
    return wall.get("thickness_cm") or material["default_thickness_cm"]


def _wall_attenuation_db(wall: dict) -> float:
    material = _WALL_MATERIALS.get(
        wall.get("material", _DEFAULT_WALL_MATERIAL),
        _WALL_MATERIALS[_DEFAULT_WALL_MATERIAL],
    )
    return material["attenuation_db_per_cm"] * _wall_thickness_cm(wall)


def _meters_per_unit(scale: dict | None) -> float | None:
    """Derive metres-per-stored-unit from a floor's two-point calibration segment."""
    if not scale:
        return None
    (x1, y1), (x2, y2) = scale["points"]
    unit_distance = math.hypot(x2 - x1, y2 - y1)
    if unit_distance == 0:
        return None
    return scale["meters"] / unit_distance


async def async_get_map_data(hass: HomeAssistant) -> dict[str, Any]:
    """Denormalized export: floors -> rooms -> devices.

    Every device carries both its raw stored x/y and, when the floor has
    been calibrated (see `scale`/`meters_per_unit`), real-world x_m/y_m and
    height_m — enough for a consumer to compute actual distances between
    devices without needing to know anything about the editor's internal
    coordinate space.
    """
    floors_meta = await registry_snapshot.async_list_floors(hass)
    placeable_entities = await registry_snapshot.async_list_placeable_entities(hass)

    exported_floors = []
    for floor_meta in floors_meta:
        layout = await async_get_floor_layout(hass, floor_meta["floor_id"])
        meters_per_unit = _meters_per_unit(layout.get("scale"))

        rooms_by_id = {room["id"]: room for room in layout["rooms"]}
        room_devices: dict[str | None, list[dict]] = {
            room_id: [] for room_id in rooms_by_id
        }
        room_devices[None] = []

        for pin in layout.get("pins", []):
            # The export is explicitly AI-agent-facing context (unlike the
            # UI, which a human uses and which never surfaces entity_id at
            # all — see types.ts's Pin doc comment) — so entity_id/domain
            # are still worth including here, derived fresh from device_id
            # via the same automatic ranking the UI's icon uses, rather
            # than a stored choice.
            device_id = pin.get("device_id")
            entity = registry_snapshot.pick_display_entity(device_id, placeable_entities)
            height_m = pin.get("height_m")
            device = {
                "device_id": device_id,
                "entity_id": entity["entity_id"] if entity else None,
                "name": pin.get("label_override")
                or (entity["name"] if entity else "Unknown device"),
                "domain": entity["domain"] if entity else None,
                "device_class": entity["device_class"] if entity else None,
                "area_name": entity["area_name"] if entity else None,
                "x": pin["x"],
                "y": pin["y"],
                "x_m": pin["x"] * meters_per_unit if meters_per_unit else None,
                "y_m": pin["y"] * meters_per_unit if meters_per_unit else None,
                "height_m": height_m,
            }
            room_devices.setdefault(pin.get("room_id"), []).append(device)

        exported_rooms = [
            {
                "id": room["id"],
                "name": room["name"],
                "devices": room_devices.get(room["id"], []),
            }
            for room in layout.get("rooms", [])
        ]
        unplaced = room_devices.get(None, [])
        if unplaced:
            exported_rooms.append({"id": None, "name": "Unassigned", "devices": unplaced})

        openings_by_wall: dict[str, list[dict]] = {}
        for opening in layout.get("openings", []):
            openings_by_wall.setdefault(opening["wallId"], []).append(
                {
                    "type": opening["type"],
                    "x": opening["x"],
                    "y": opening["y"],
                    "width": opening["width"],
                    "x_m": opening["x"] * meters_per_unit if meters_per_unit else None,
                    "y_m": opening["y"] * meters_per_unit if meters_per_unit else None,
                    "width_m": opening["width"] * meters_per_unit if meters_per_unit else None,
                }
            )

        exported_walls = [
            {
                "id": wall["id"],
                "material": wall.get("material", _DEFAULT_WALL_MATERIAL),
                "material_label": _WALL_MATERIALS.get(
                    wall.get("material", _DEFAULT_WALL_MATERIAL),
                    _WALL_MATERIALS[_DEFAULT_WALL_MATERIAL],
                )["label"],
                "thickness_cm": _wall_thickness_cm(wall),
                "attenuation_db": _wall_attenuation_db(wall),
                "points": wall["points"],
                "points_m": (
                    [[px * meters_per_unit, py * meters_per_unit] for px, py in wall["points"]]
                    if meters_per_unit
                    else None
                ),
                "openings": openings_by_wall.get(wall["id"], []),
            }
            for wall in layout.get("walls", [])
        ]

        exported_floors.append(
            {
                "floor_id": floor_meta["floor_id"],
                "name": floor_meta["name"],
                "meters_per_unit": meters_per_unit,
                "rooms": exported_rooms,
                "walls": exported_walls,
            }
        )

    return {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "floors": exported_floors,
    }
