"""Regression test for the map export (`spatial_context.get_map` / Export JSON).

Runs without Home Assistant installed: the HA and sibling modules the export
needs are replaced by small stubs, so this exercises export.py's own logic.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import importlib.util
import math
import sys
import types
import unittest
from pathlib import Path

EXPORT = (
    Path(__file__).resolve().parent.parent
    / "custom_components"
    / "spatial_context"
    / "export.py"
)

LAYOUT = {
    "rooms": [{"id": "r1", "name": "Lounge"}],
    "pins": [{"device_id": "d1", "x": 100, "y": 50, "room_id": "r1"}],
    "walls": [{"id": "w1", "material": "timber_frame", "points": [[0, 0], [100, 0]]}],
    "openings": [],
    # 100 units = 2 m, so 0.02 m per unit.
    "scale": {"points": [[0, 0], [100, 0]], "meters": 2},
}


def _load_export(layout: dict | None = None) -> types.ModuleType:
    layout = LAYOUT if layout is None else layout
    pkg = types.ModuleType("sc_test")
    pkg.__path__ = []  # type: ignore[attr-defined]
    sys.modules["sc_test"] = pkg

    ha = types.ModuleType("homeassistant")
    core = types.ModuleType("homeassistant.core")
    core.HomeAssistant = object  # type: ignore[attr-defined]
    sys.modules["homeassistant"] = ha
    sys.modules["homeassistant.core"] = core

    registry = types.ModuleType("sc_test.registry_snapshot")

    async def list_floors(hass):
        return [{"floor_id": "f1", "name": "Top Floor"}]

    async def list_entities(hass):
        return [
            {
                "device_id": "d1",
                "entity_id": "light.lamp",
                "name": "Lamp",
                "domain": "light",
                "device_class": None,
                "area_name": "Lounge",
            }
        ]

    registry.async_list_floors = list_floors  # type: ignore[attr-defined]
    registry.async_list_placeable_entities = list_entities  # type: ignore[attr-defined]
    registry.pick_display_entity = (  # type: ignore[attr-defined]
        lambda device_id, entities: entities[0] if entities else None
    )
    sys.modules["sc_test.registry_snapshot"] = registry

    storage = types.ModuleType("sc_test.storage")

    async def floor_layout(hass, floor_id):
        return layout

    async def all_layouts(hass):
        return {"f1": layout}

    async def property_layout(hass):
        return {"placements": [], "pins": []}

    def meters_per_unit(scale):
        if not scale:
            return None
        (x1, y1), (x2, y2) = scale["points"]
        distance = math.hypot(x2 - x1, y2 - y1)
        return scale["meters"] / distance if distance else None

    storage.async_get_floor_layout = floor_layout  # type: ignore[attr-defined]
    storage.async_get_all_layouts = all_layouts  # type: ignore[attr-defined]
    storage.async_get_property_layout = property_layout  # type: ignore[attr-defined]
    storage.live_layouts = lambda layouts, ids: layouts  # type: ignore[attr-defined]
    storage.live_placements = lambda floors, placements: placements  # type: ignore[attr-defined]
    storage.meters_per_unit = meters_per_unit  # type: ignore[attr-defined]
    storage.property_meters_per_unit = lambda floors, placements: None  # type: ignore[attr-defined]
    sys.modules["sc_test.storage"] = storage

    spec = importlib.util.spec_from_file_location("sc_test.export", EXPORT)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    sys.modules["sc_test.export"] = module
    spec.loader.exec_module(module)
    return module


class ExportTest(unittest.TestCase):
    def test_calibrated_floor_exports_real_units(self) -> None:
        export = _load_export()
        data = asyncio.run(export.async_get_map_data(object()))

        floor = data["floors"][0]
        self.assertEqual(floor["name"], "Top Floor")
        self.assertAlmostEqual(floor["meters_per_unit"], 0.02)

        device = floor["rooms"][0]["devices"][0]
        self.assertEqual(device["entity_id"], "light.lamp")
        self.assertAlmostEqual(device["x_m"], 2.0)
        self.assertAlmostEqual(device["y_m"], 1.0)

        wall = floor["walls"][0]
        self.assertEqual(wall["thickness_cm"], 10)
        self.assertAlmostEqual(wall["attenuation_db"], 3.0)
        self.assertAlmostEqual(wall["points_m"][1][0], 2.0)

        self.assertEqual(data["outdoor_devices"], [])

    def test_uncalibrated_floor_has_no_real_units(self) -> None:
        export = _load_export(dict(LAYOUT, scale=None))
        data = asyncio.run(export.async_get_map_data(object()))
        floor = data["floors"][0]
        self.assertIsNone(floor["meters_per_unit"])
        self.assertIsNone(floor["rooms"][0]["devices"][0]["x_m"])
        self.assertIsNone(floor["walls"][0]["points_m"])


if __name__ == "__main__":
    unittest.main()
