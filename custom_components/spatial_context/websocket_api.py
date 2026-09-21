"""WebSocket API for Spatial Context.

Follows the same @websocket_api.websocket_command /
@websocket_api.async_response shape used throughout voice_satellite's
__init__.py.
"""

from __future__ import annotations

import math
from datetime import datetime, timezone

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import registry_snapshot, wifi_mesh, zigbee_mesh
from .storage import async_get_floor_layout, async_save_floor_layout, async_set_floor_building_id

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


@websocket_api.websocket_command({vol.Required("type"): "spatial_context/list_floors"})
@websocket_api.async_response
async def ws_list_floors(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """List every HA floor, annotated with whether it has a saved layout."""
    floors = await registry_snapshot.async_list_floors(hass)
    connection.send_result(msg["id"], {"floors": floors})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "spatial_context/get_layout",
        vol.Required("floor_id"): str,
    }
)
@websocket_api.async_response
async def ws_get_layout(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Return a single floor's stored layout, or an empty skeleton."""
    layout = await async_get_floor_layout(hass, msg["floor_id"])
    connection.send_result(msg["id"], layout)


_ROOM_SCHEMA = {
    vol.Required("id"): str,
    vol.Required("name"): str,
    vol.Optional("area_id"): vol.Any(str, None),
    vol.Required("points"): [[vol.Coerce(float)]],
}

_PIN_SCHEMA = {
    vol.Required("id"): str,
    vol.Required("entity_id"): str,
    vol.Required("x"): vol.Coerce(float),
    vol.Required("y"): vol.Coerce(float),
    vol.Optional("room_id"): vol.Any(str, None),
    vol.Optional("icon_override"): vol.Any(str, None),
    vol.Optional("label_override"): vol.Any(str, None),
    # Mounting height in metres above floor level — matters for e.g. mmWave
    # presence sensors, where low/high placement changes the detection cone.
    vol.Optional("height_m"): vol.Any(vol.Coerce(float), None),
}

_WALL_SCHEMA = {
    vol.Required("id"): str,
    vol.Required("material"): str,
    vol.Required("points"): [[vol.Coerce(float)]],
}

_OPENING_SCHEMA = {
    vol.Required("id"): str,
    vol.Required("wallId"): str,
    vol.Required("type"): vol.In(["door", "window"]),
    vol.Required("x"): vol.Coerce(float),
    vol.Required("y"): vol.Coerce(float),
    vol.Required("width"): vol.Coerce(float),
}

_SCALE_SCHEMA = vol.Any(
    {
        vol.Required("points"): [[vol.Coerce(float)]],
        vol.Required("meters"): vol.Coerce(float),
    },
    None,
)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "spatial_context/save_layout",
        vol.Required("floor_id"): str,
        vol.Required("background_image_id"): vol.Any(str, None),
        vol.Required("background_opacity"): vol.Coerce(float),
        vol.Required("background_offset_x"): vol.Coerce(float),
        vol.Required("background_offset_y"): vol.Coerce(float),
        vol.Required("background_scale"): vol.Coerce(float),
        vol.Required("building_id"): vol.Any(str, None),
        vol.Required("rooms"): [_ROOM_SCHEMA],
        vol.Required("pins"): [_PIN_SCHEMA],
        vol.Required("walls"): [_WALL_SCHEMA],
        vol.Required("openings"): [_OPENING_SCHEMA],
        vol.Required("scale"): _SCALE_SCHEMA,
    }
)
@websocket_api.async_response
async def ws_save_layout(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Full replace-save a single floor's layout."""
    wall_ids = {wall["id"] for wall in msg["walls"]}
    layout = {
        "background_image_id": msg["background_image_id"],
        "background_opacity": msg["background_opacity"],
        "background_offset_x": msg["background_offset_x"],
        "background_offset_y": msg["background_offset_y"],
        "background_scale": msg["background_scale"],
        "building_id": msg["building_id"],
        "rooms": msg["rooms"],
        "pins": msg["pins"],
        "walls": msg["walls"],
        # Drop any opening whose wall was deleted in this same save.
        "openings": [o for o in msg["openings"] if o["wallId"] in wall_ids],
        "scale": msg["scale"],
    }
    await async_save_floor_layout(hass, msg["floor_id"], layout)
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "spatial_context/set_building_id",
        vol.Required("floor_id"): str,
        vol.Required("building_id"): vol.Any(str, None),
    }
)
@websocket_api.async_response
async def ws_set_building_id(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Tag a floor as sharing a building/coordinate-system with another
    (see Align Floors, panel.ts's _onAlignApply) without touching the rest
    of its layout."""
    await async_set_floor_building_id(hass, msg["floor_id"], msg["building_id"])
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command({vol.Required("type"): "spatial_context/list_areas"})
@websocket_api.async_response
async def ws_list_areas(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """List every HA area, for the room-tracing area picker."""
    connection.send_result(msg["id"], {"areas": registry_snapshot.async_list_areas(hass)})


@websocket_api.websocket_command(
    {vol.Required("type"): "spatial_context/list_placeable_entities"}
)
@websocket_api.async_response
async def ws_list_placeable_entities(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Return every enabled entity, joined with device/area for display."""
    entities = await registry_snapshot.async_list_placeable_entities(hass)
    connection.send_result(msg["id"], {"entities": entities})


def _meters_per_unit(scale: dict | None) -> float | None:
    """Derive metres-per-stored-unit from a floor's two-point calibration segment."""
    if not scale:
        return None
    (x1, y1), (x2, y2) = scale["points"]
    unit_distance = math.hypot(x2 - x1, y2 - y1)
    if unit_distance == 0:
        return None
    return scale["meters"] / unit_distance


@websocket_api.websocket_command(
    {vol.Required("type"): "spatial_context/export_snapshot"}
)
@websocket_api.async_response
async def ws_export_snapshot(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Denormalized export: floors -> rooms -> devices, for a download.

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

        for pin in layout["pins"]:
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
            for room in layout["rooms"]
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

    connection.send_result(
        msg["id"],
        {
            "exported_at": datetime.now(timezone.utc).isoformat(),
            "floors": exported_floors,
        },
    )


@websocket_api.websocket_command({vol.Required("type"): "spatial_context/get_zigbee_mesh"})
@websocket_api.async_response
async def ws_get_zigbee_mesh(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Live Zigbee2MQTT network topology (see zigbee_mesh.py).

    Global/floor-agnostic, like list_areas/list_placeable_entities — the
    frontend cross-references against the current floor's placed pins.
    Slow (a `raw` networkmap request takes ~60-90s on this network), so this
    is only ever called on an explicit user "Refresh Mesh" action, never on
    panel load or a timer.
    """
    try:
        mesh = await zigbee_mesh.async_get_network_map(hass)
    except Exception as err:  # noqa: BLE001 - surface any failure to the frontend, not an unhandled rejection
        connection.send_error(msg["id"], "zigbee_mesh_failed", str(err))
        return
    connection.send_result(msg["id"], mesh)


@websocket_api.websocket_command({vol.Required("type"): "spatial_context/get_wifi_mesh"})
@websocket_api.async_response
async def ws_get_wifi_mesh(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Wi-Fi client→AP associations, read from entity states (see wifi_mesh.py).

    Best-effort — produces an empty link list for anyone without an
    integration that exposes `ap_mac` on its device_tracker states, not an
    error. Cheap (no network round-trip), unlike the Zigbee equivalent.
    """
    try:
        mesh = wifi_mesh.async_get_wifi_mesh(hass)
    except Exception as err:  # noqa: BLE001 - surface any failure to the frontend, not an unhandled rejection
        connection.send_error(msg["id"], "wifi_mesh_failed", str(err))
        return
    connection.send_result(msg["id"], mesh)


def async_register_commands(hass: HomeAssistant) -> None:
    """Register every Spatial Context WebSocket command."""
    websocket_api.async_register_command(hass, ws_list_floors)
    websocket_api.async_register_command(hass, ws_get_layout)
    websocket_api.async_register_command(hass, ws_save_layout)
    websocket_api.async_register_command(hass, ws_set_building_id)
    websocket_api.async_register_command(hass, ws_list_areas)
    websocket_api.async_register_command(hass, ws_list_placeable_entities)
    websocket_api.async_register_command(hass, ws_export_snapshot)
    websocket_api.async_register_command(hass, ws_get_zigbee_mesh)
    websocket_api.async_register_command(hass, ws_get_wifi_mesh)
