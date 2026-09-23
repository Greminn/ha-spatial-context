"""WebSocket API for Spatial Context.

Follows the same @websocket_api.websocket_command /
@websocket_api.async_response shape used throughout voice_satellite's
__init__.py.
"""

from __future__ import annotations

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant

from . import registry_snapshot, wifi_mesh, zigbee_mesh
from .export import async_get_map_data
from .storage import (
    async_get_floor_layout,
    async_get_property_layout,
    async_save_floor_layout,
    async_save_property_layout,
    async_set_floor_building_id,
)


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
    # Optional, not Required — a wall saved before this field existed and
    # never individually re-edited since would round-trip through a save
    # without one, and that must not fail validation.
    vol.Optional("thickness_cm"): vol.Any(vol.Coerce(float), None),
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

_VIEW_BOX_SCHEMA = vol.Any(
    {
        vol.Required("x"): vol.Coerce(float),
        vol.Required("y"): vol.Coerce(float),
        vol.Required("w"): vol.Coerce(float),
        vol.Required("h"): vol.Coerce(float),
    },
    None,
)

_PLACEMENT_SCHEMA = {
    vol.Required("id"): str,
    # None for a standalone floor acting as its own building (never
    # aligned to anything, e.g. a detached Garage) — mirrors
    # FloorLayout.building_id.
    vol.Optional("building_id"): vol.Any(str, None),
    vol.Required("floor_id"): str,
    vol.Optional("label_override"): vol.Any(str, None),
    vol.Required("x"): vol.Coerce(float),
    vol.Required("y"): vol.Coerce(float),
    vol.Required("width"): vol.Coerce(float),
    vol.Required("height"): vol.Coerce(float),
    vol.Required("rotation_deg"): vol.Coerce(float),
    # width/height's locked ratio, captured from the building's traced
    # footprint at placement time (see registry_snapshot.py's
    # _content_bounds) — resize preserves this instead of letting the
    # rectangle be freely squashed/stretched away from the real shape.
    vol.Required("aspect_ratio"): vol.Coerce(float),
}


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
        vol.Required("view_box"): _VIEW_BOX_SCHEMA,
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
        "view_box": msg["view_box"],
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


@websocket_api.websocket_command(
    {vol.Required("type"): "spatial_context/get_property_layout"}
)
@websocket_api.async_response
async def ws_get_property_layout(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Return the whole-property layout (background photo + building
    placements — see the Property tab), or an empty skeleton."""
    layout = await async_get_property_layout(hass)
    connection.send_result(msg["id"], layout)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "spatial_context/save_property_layout",
        vol.Required("background_image_id"): vol.Any(str, None),
        vol.Required("background_opacity"): vol.Coerce(float),
        vol.Required("background_offset_x"): vol.Coerce(float),
        vol.Required("background_offset_y"): vol.Coerce(float),
        vol.Required("background_scale"): vol.Coerce(float),
        vol.Required("view_box"): _VIEW_BOX_SCHEMA,
        vol.Required("placements"): [_PLACEMENT_SCHEMA],
    }
)
@websocket_api.async_response
async def ws_save_property_layout(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict,
) -> None:
    """Full replace-save of the whole-property layout."""
    layout = {
        "background_image_id": msg["background_image_id"],
        "background_opacity": msg["background_opacity"],
        "background_offset_x": msg["background_offset_x"],
        "background_offset_y": msg["background_offset_y"],
        "background_scale": msg["background_scale"],
        "view_box": msg["view_box"],
        "placements": msg["placements"],
    }
    await async_save_property_layout(hass, layout)
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
    connection.send_result(
        msg["id"],
        await async_get_map_data(hass),
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
    websocket_api.async_register_command(hass, ws_get_property_layout)
    websocket_api.async_register_command(hass, ws_save_property_layout)
    websocket_api.async_register_command(hass, ws_list_areas)
    websocket_api.async_register_command(hass, ws_list_placeable_entities)
    websocket_api.async_register_command(hass, ws_export_snapshot)
    websocket_api.async_register_command(hass, ws_get_zigbee_mesh)
    websocket_api.async_register_command(hass, ws_get_wifi_mesh)
