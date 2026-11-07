"""The Home Assistant glue, end to end with stubbed registries and storage:
async_build_model, the links adapter's fallback to the existing Zigbee cache
and Wi-Fi links, async_run_tool, and get_map with fields.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import json
import math
import sys
import types
import unittest

import spatial_support
import stubs

LAYOUT = {
    "building_id": None,
    "scale": {"points": [[0, 0], [100, 0]], "meters": 5},
    "rooms": [
        {"id": "r1", "name": "Hall", "area_id": "hall", "points": [[0, 0], [100, 0], [100, 100], [0, 100]]},
        {"id": "r2", "name": "", "area_id": "office", "points": [[100, 0], [200, 0], [200, 100], [100, 100]]},
    ],
    "walls": [{"id": "w1", "material": "brick_veneer", "points": [[100, -10], [100, 110]]}],
    "openings": [],
    "pins": [
        {"device_id": "coord", "x": 20, "y": 50, "room_id": "r1"},
        {"device_id": "plug", "x": 180, "y": 50, "room_id": "r1"},  # stale: really in r2
        {"device_id": "ap", "x": 50, "y": 90, "room_id": "r1"},
    ],
}


def _setup():
    sp = spatial_support.load_spatial()
    pkg = spatial_support.PKG
    entities = [
        {"device_id": "coord", "entity_id": "update.coord", "name": "Coordinator firmware", "domain": "update",
         "device_class": None, "area_name": "Hall", "device_name": "ZBT-1", "integration_domain": "zha"},
        {"device_id": "plug", "entity_id": "switch.plug", "name": "Desk plug", "domain": "switch",
         "device_class": None, "area_name": "Office", "device_name": "Desk Plug", "integration_domain": "zha"},
        {"device_id": "ap", "entity_id": "sensor.ap", "name": "AP", "domain": "sensor",
         "device_class": None, "area_name": "Hall", "device_name": "Hall AP", "integration_domain": "unifi"},
    ]

    async def list_floors(hass):
        return [{"floor_id": "main", "name": "Main", "level": 0}]

    async def list_entities(hass):
        return entities

    registry = sys.modules[f"{pkg}.registry_snapshot"]
    registry.async_list_floors = list_floors
    registry.async_list_areas = lambda hass: [
        {"area_id": "hall", "name": "Hall"}, {"area_id": "office", "name": "Office"}
    ]
    registry.async_list_placeable_entities = list_entities
    registry.pick_display_entity = lambda device_id, ents: next(
        (e for e in ents if e["device_id"] == device_id), None
    )

    async def all_layouts(hass):
        return {"main": LAYOUT}

    async def floor_layout(hass, floor_id):
        return LAYOUT

    async def property_layout(hass):
        return {"placements": [], "pins": []}

    async def settings(hass):
        return {"weak_link_threshold_db": 25, "floor_height_m": 3.0}

    def mpu(scale):
        (x1, y1), (x2, y2) = scale["points"]
        return scale["meters"] / math.hypot(x2 - x1, y2 - y1)

    storage = sys.modules[f"{pkg}.storage"]
    storage.async_get_all_layouts = all_layouts
    storage.async_get_floor_layout = floor_layout
    storage.async_get_property_layout = property_layout
    storage.async_get_settings = settings
    storage.live_layouts = lambda layouts, ids: {k: v for k, v in layouts.items() if k in ids}
    storage.live_placements = lambda floors, placements: placements
    storage.meters_per_unit = lambda scale: mpu(scale) if scale else None
    storage.property_meters_per_unit = lambda floors, placements: None
    # export.py bound these names when it was imported.
    for name in ("async_get_all_layouts", "async_get_floor_layout", "async_get_property_layout",
                 "live_layouts", "live_placements", "meters_per_unit", "property_meters_per_unit"):
        setattr(sp.export, name, getattr(storage, name))

    devices = {
        "coord": types.SimpleNamespace(name="ZBT-1", name_by_user=None, area_id="hall", config_entries=set()),
        "plug": types.SimpleNamespace(name="Desk Plug", name_by_user=None, area_id="hall", config_entries=set()),
        "ap": types.SimpleNamespace(name="Hall AP", name_by_user="Hall AP", area_id="hall", config_entries=set()),
    }
    registry_stub = types.SimpleNamespace(async_get=lambda device_id: devices.get(device_id))
    helpers = stubs.stub("homeassistant.helpers")
    helpers.device_registry = stubs.stub("homeassistant.helpers.device_registry", async_get=lambda hass: registry_stub)

    stubs.stub(f"{pkg}.zigbee_mesh", get_cached_network_map=lambda hass: {
        "nodes": [
            {"ieee": "00:01", "friendly_name": "Coordinator", "device_id": "coord", "type": "Coordinator"},
            {"ieee": "00:02", "friendly_name": "Plug", "device_id": "plug", "type": "Router"},
        ],
        "links": [{"source_ieee": "00:01", "target_ieee": "00:02", "lqi": 30, "lqi_readings": [40, 30], "parent_child": False}],
        "fetched_at": 1_762_430_400,
    })
    stubs.stub(f"{pkg}.wifi_mesh", async_get_wifi_mesh=lambda hass: {
        "links": [{"source_device_id": "plug", "target_device_id": "ap", "rssi_dbm": -55}]
    })
    return sp


class GlueTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = _setup()

    def test_build_model_and_run_tools(self) -> None:
        hass = types.SimpleNamespace(config_entries=None, data={})
        model = asyncio.run(self.sp.model.async_build_model(hass))
        self.assertEqual(model.devices["plug"].name, "Desk Plug")
        self.assertEqual(model.devices["plug"].room_id, "r2")
        self.assertEqual([s.layer for s in model.snapshots], ["zigbee", "wifi"])

        summary = asyncio.run(self.sp.ai.async_run_tool(hass, "summary", {}))
        self.assertEqual(summary["devices"]["room_recomputed"], 1)
        self.assertEqual(summary["findings"]["counts"].get("weak_link"), 1)
        self.assertEqual(summary["findings"]["counts"].get("area_mismatch"), 1)
        context = asyncio.run(self.sp.ai.async_run_tool(hass, "device_context", {"device": "desk plug"}))
        self.assertEqual(context["device"]["room_name"], "Office")
        self.assertEqual({row["layer"] for row in context["links"]["items"]}, {"zigbee", "wifi"})
        path = asyncio.run(self.sp.ai.async_run_tool(hass, "path", {"a": "ZBT-1", "b": "Desk Plug"}))
        self.assertEqual(path["walls"]["items"][0]["material"], "brick_veneer")
        self.assertEqual(path["rooms_on_path"][0].split(" ", 1)[1], "Hall")

    def test_get_map_with_fields(self) -> None:
        hass = types.SimpleNamespace(config_entries=None, data={})
        data = asyncio.run(self.sp.map_view.async_get_map_view(hass, room="Office", compact=True, include_links=True))
        # The plug's saved room_id says Hall; with fields, it is filed where
        # its pin is. Its links go to devices outside the room, so none.
        office = data["floors"][0]["rooms"]
        self.assertEqual([r["name"] for r in office], ["Office"])
        self.assertEqual([d["device_id"] for d in office[0]["devices"]], ["plug"])
        self.assertEqual(data["links"], [])
        full = asyncio.run(self.sp.map_view.async_get_map_view(hass, include_links=True))
        self.assertEqual(len(full["links"]), 2)
        json.dumps(full)


if __name__ == "__main__":
    unittest.main()
