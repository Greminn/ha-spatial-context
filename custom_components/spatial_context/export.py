"""Export data helpers for Spatial Context."""

from __future__ import annotations

import math
from datetime import datetime, timezone
from typing import Any

from homeassistant.core import HomeAssistant

from . import registry_snapshot
from .storage import async_get_floor_layout

# Mirrors frontend/src/canvas/materials.ts — keep both in sync if this list
# changes. attenuation_db is an approximate 2.4GHz RF signal loss for a
# single wall of that material, useful context for reasoning about
# Zigbee/Wi-Fi mesh coverage.
_WALL_MATERIALS = {
    "timber_frame": {"label": "Timber framed (drywall)", "attenuation_db": 3},
    "brick_veneer": {"label": "Brick veneer", "attenuation_db": 6},
    "concrete_block": {"label": "Concrete / block", "attenuation_db": 12},
    "glass": {"label": "Glass", "attenuation_db": 2},
    "steel_frame": {"label": "Steel frame", "attenuation_db": 10},
}
_DEFAULT_WALL_MATERIAL = "timber_frame"


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
    entity_by_id = {
        e["entity_id"]: e for e in await registry_snapshot.async_list_placeable_entities(hass)
    }

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
            entity = entity_by_id.get(pin["entity_id"])
            height_m = pin.get("height_m")
            device = {
                "entity_id": pin["entity_id"],
                "name": pin.get("label_override")
                or (entity["name"] if entity else pin["entity_id"]),
                "domain": entity["domain"] if entity else pin["entity_id"].split(".")[0],
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
                "attenuation_db": _WALL_MATERIALS.get(
                    wall.get("material", _DEFAULT_WALL_MATERIAL),
                    _WALL_MATERIALS[_DEFAULT_WALL_MATERIAL],
                )["attenuation_db"],
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
