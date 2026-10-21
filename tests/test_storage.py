"""Tests for the saved-layout storage (storage.py): the rules that keep a
device in one place, older saves loading with today's defaults, the
newer-version refusal, and the per-version backup wiring.

Runs without Home Assistant: its Store is replaced by an in-memory one.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import tempfile
import unittest
from pathlib import Path

import stubs


class FakeStore:
    """Home Assistant's Store, reduced to load/save against `hass.stored`."""

    def __class_getitem__(cls, item):
        return cls

    def __init__(self, hass, version, key) -> None:
        self.hass, self.version, self.key = hass, version, key

    async def async_load(self):
        return self.hass.stored.get(self.key)

    async def async_save(self, data) -> None:
        self.hass.stored[self.key] = data


stubs.new_package("sc_storage_test")
stubs.stub("homeassistant")
stubs.stub("homeassistant.core", HomeAssistant=object)
stubs.stub("homeassistant.helpers")
stubs.stub("homeassistant.helpers.storage", Store=FakeStore)
stubs.load("sc_storage_test", "const")
stubs.load("sc_storage_test", "backup")
storage = stubs.load("sc_storage_test", "storage")

KEY = "spatial_context.layout"


def run(coro):
    return asyncio.run(coro)


def pin(device_id, x=0):
    return {"id": f"pin-{device_id}", "device_id": device_id, "x": x, "y": 0}


class DeviceInOnePlaceTest(unittest.TestCase):
    def setUp(self) -> None:
        self.hass = stubs.FakeHass()
        self.hass.stored[KEY] = {
            "floors": {
                "up": {**storage._empty_floor(), "pins": [pin("a"), pin("b")]},
                "down": {**storage._empty_floor(), "pins": [pin("c")]},
            },
            "property": {**storage._empty_property(), "pins": [pin("d")]},
            "settings": storage._empty_settings(),
        }

    def test_placing_a_device_on_a_floor_removes_it_elsewhere(self) -> None:
        layout = {**storage._empty_floor(), "pins": [pin("c"), pin("d")]}
        run(storage.async_save_floor_layout(self.hass, "up", layout))
        data = self.hass.stored[KEY]
        self.assertEqual([p["device_id"] for p in data["floors"]["up"]["pins"]], ["c", "d"])
        self.assertEqual(data["floors"]["down"]["pins"], [])
        self.assertEqual(data["property"]["pins"], [])

    def test_a_pin_with_no_device_id_is_never_matched(self) -> None:
        self.hass.stored[KEY]["floors"]["down"]["pins"].append({"id": "orphan", "x": 1, "y": 1})
        layout = {**storage._empty_floor(), "pins": [{"id": "orphan2", "x": 1, "y": 1}]}
        run(storage.async_save_floor_layout(self.hass, "up", layout))
        self.assertIn("orphan", [p["id"] for p in self.hass.stored[KEY]["floors"]["down"]["pins"]])

    def test_placing_an_outdoor_device_removes_it_from_floors(self) -> None:
        layout = {**storage._empty_property(), "pins": [pin("a")]}
        run(storage.async_save_property_layout(self.hass, layout))
        data = self.hass.stored[KEY]
        self.assertEqual([p["device_id"] for p in data["floors"]["up"]["pins"]], ["b"])
        self.assertEqual([p["device_id"] for p in data["property"]["pins"]], ["a"])


class OlderSavesTest(unittest.TestCase):
    def test_empty_store_gives_defaults(self) -> None:
        hass = stubs.FakeHass()
        self.assertEqual(run(storage.async_get_all_layouts(hass)), {})
        self.assertEqual(run(storage.async_get_settings(hass)), storage._empty_settings())

    def test_a_floor_saved_before_newer_fields_still_loads_with_them(self) -> None:
        hass = stubs.FakeHass()
        hass.stored[KEY] = {"floors": {"up": {"rooms": [{"id": "r", "name": "Lounge"}]}}}
        layout = run(storage.async_get_floor_layout(hass, "up"))
        self.assertEqual(layout["rooms"][0]["name"], "Lounge")
        self.assertEqual(layout["background_scale"], 1.0)
        self.assertIsNone(layout["building_id"])

    def test_a_missing_settings_key_falls_back_to_its_default(self) -> None:
        hass = stubs.FakeHass()
        hass.stored[KEY] = {"floors": {}, "settings": {"unit_system": "imperial"}}
        settings = run(storage.async_get_settings(hass))
        self.assertEqual(settings["unit_system"], "imperial")
        self.assertEqual(settings["zigbee_timeout_seconds"], 180)
        self.assertTrue(settings["auto_save"])

    def test_a_placement_without_source_bounds_gets_them_and_keeps_them(self) -> None:
        hass = stubs.FakeHass()
        floor = {**storage._empty_floor(), "walls": [{"id": "w", "points": [[0, 0], [10, 20]]}]}
        placement = {"id": "p", "floor_id": "up", "building_id": None}
        hass.stored[KEY] = {
            "floors": {"up": floor},
            "property": {**storage._empty_property(), "placements": [placement]},
        }
        layout = run(storage.async_get_property_layout(hass))
        bounds = {"min_x": 0, "min_y": 0, "max_x": 10, "max_y": 20}
        self.assertEqual(layout["placements"][0]["source_bounds"], bounds)
        self.assertEqual(hass.stored[KEY]["property"]["placements"][0]["source_bounds"], bounds)


class NewerVersionTest(unittest.TestCase):
    def test_current_major_version_passes_through_untouched(self) -> None:
        store = storage._store(stubs.FakeHass())
        data = {"floors": {}}
        self.assertIs(run(store._async_migrate_func(1, 1, data)), data)

    def test_a_newer_major_version_is_refused(self) -> None:
        store = storage._store(stubs.FakeHass())
        with self.assertRaisesRegex(NotImplementedError, "storage version 2"):
            run(store._async_migrate_func(2, 1, {"floors": {}}))


class BackupWiringTest(unittest.TestCase):
    def test_backs_up_the_real_storage_file_by_version(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            storage_dir = Path(tmp) / ".storage"
            storage_dir.mkdir()
            (storage_dir / KEY).write_text('{"floors": {}}')
            run(storage.async_backup_layout(stubs.FakeHass(tmp), "1.0.0"))
            self.assertTrue((storage_dir / f"{KEY}.backup-1.0.0").is_file())


class ScaleTest(unittest.TestCase):
    def test_metres_per_unit(self) -> None:
        self.assertAlmostEqual(
            storage.meters_per_unit({"points": [[0, 0], [100, 0]], "meters": 2}), 0.02
        )
        self.assertIsNone(storage.meters_per_unit(None))
        self.assertIsNone(storage.meters_per_unit({"points": [[5, 5], [5, 5]], "meters": 2}))

    def test_property_scale_comes_from_a_calibrated_building(self) -> None:
        floors = {
            "up": {
                **storage._empty_floor(),
                "scale": {"points": [[0, 0], [100, 0]], "meters": 2},
            }
        }
        placement = {
            "floor_id": "up",
            "building_id": None,
            "source_bounds": {"min_x": 0, "min_y": 0, "max_x": 1000, "max_y": 500},
            "width": 200,
            "height": 100,
        }
        # 1000 floor units = 20 m, drawn 200 property units wide.
        self.assertAlmostEqual(storage.property_meters_per_unit(floors, [placement]), 0.1)
        self.assertIsNone(storage.property_meters_per_unit({"up": storage._empty_floor()}, [placement]))

    def test_deleted_floors_are_hidden_but_not_forgotten(self) -> None:
        floors = {"up": {}, "gone": {}}
        self.assertEqual(list(storage.live_layouts(floors, {"up"})), ["up"])
        placements = [{"floor_id": "up"}, {"floor_id": "gone", "building_id": None}]
        self.assertEqual(storage.live_placements({"up": {}}, placements), [{"floor_id": "up"}])


if __name__ == "__main__":
    unittest.main()
