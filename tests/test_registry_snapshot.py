"""Tests for the Place device list (registry_snapshot.py's
async_list_placeable_entities), for a ZHA coordinator with no enabled
entities (#60): it is offered as an entity-less `device.<id>` entry.

Runs without Home Assistant installed: the registries, the integration
loader, storage and ZHA are small stand-ins. placeable_rules.py is the real
file.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import types
import unittest

import stubs

PROPERTY = "__property__"


def _device(device_id: str, name: str = "Radio", entry_type=None, area_id=None):
    return types.SimpleNamespace(
        id=device_id,
        name=name,
        name_by_user=None,
        entry_type=entry_type,
        identifiers={("zha", device_id)},
        area_id=area_id,
        config_entry_id="zha_entry",
    )


def _entity(entity_id: str, device_id: str):
    return types.SimpleNamespace(
        entity_id=entity_id,
        device_id=device_id,
        domain=entity_id.split(".")[0],
        disabled_by=None,
        area_id=None,
        name=None,
        original_name=entity_id,
        device_class=None,
        original_device_class=None,
        entity_category=None,
    )


def _list(devices: list, entities: list, coordinators: set, layouts: dict | None = None):
    by_id = {d.id: d for d in devices}
    areas = {"office": types.SimpleNamespace(name="Office")}
    floors = {"f1": types.SimpleNamespace(floor_id="f1", name="Top Floor")}

    stubs.stub("homeassistant")
    stubs.stub("homeassistant.core", HomeAssistant=object)
    helpers = stubs.stub("homeassistant.helpers")
    helpers.device_registry = stubs.stub(
        "homeassistant.helpers.device_registry",
        async_get=lambda hass: types.SimpleNamespace(
            devices=devices, async_get=by_id.get
        ),
    )
    helpers.entity_registry = stubs.stub(
        "homeassistant.helpers.entity_registry",
        async_get=lambda hass: types.SimpleNamespace(
            entities={e.entity_id: e for e in entities}
        ),
        RegistryEntry=object,
    )
    helpers.area_registry = stubs.stub(
        "homeassistant.helpers.area_registry",
        async_get=lambda hass: types.SimpleNamespace(async_get_area=areas.get),
    )
    helpers.floor_registry = stubs.stub(
        "homeassistant.helpers.floor_registry",
        async_get=lambda hass: types.SimpleNamespace(
            async_list_floors=lambda: list(floors.values()),
            async_get_floor=floors.get,
        ),
    )

    async def get_integration(hass, domain):
        return types.SimpleNamespace(name="Zigbee Home Automation")

    stubs.stub("homeassistant.loader", async_get_integration=get_integration)

    async def all_layouts(hass):
        return layouts or {}

    async def property_layout(hass):
        return {"pins": []}

    stubs.new_package("sc_snapshot_test")
    stubs.stub(
        "sc_snapshot_test.storage",
        PROPERTY_LOCATION_ID=PROPERTY,
        async_get_all_layouts=all_layouts,
        async_get_property_layout=property_layout,
        async_save_all_layouts_raw=None,
        layout_bounds=None,
        live_layouts=lambda layouts, floor_ids: {
            k: v for k, v in layouts.items() if k in floor_ids
        },
        meters_per_unit=None,
    )
    stubs.stub(
        "sc_snapshot_test.zha_mesh",
        coordinator_device_ids=lambda hass: set(coordinators),
    )
    stubs.load("sc_snapshot_test", "placeable_rules")
    snapshot = stubs.load("sc_snapshot_test", "registry_snapshot")

    hass = types.SimpleNamespace(
        config_entries=types.SimpleNamespace(
            async_get_entry=lambda entry_id: types.SimpleNamespace(domain="zha")
        ),
        states=types.SimpleNamespace(get=lambda entity_id: None),
    )
    return asyncio.run(snapshot.async_list_placeable_entities(hass))


class CoordinatorWithoutEntitiesTest(unittest.TestCase):
    def test_a_coordinator_with_no_entities_is_listed(self) -> None:
        rows = _list([_device("c1", area_id="office")], [], {"c1"})
        self.assertEqual(len(rows), 1)
        row = rows[0]
        self.assertEqual(row["entity_id"], "device.c1")
        self.assertEqual(row["domain"], "device")
        self.assertEqual(row["device_id"], "c1")
        self.assertEqual(row["device_name"], "Radio")
        self.assertEqual(row["area_name"], "Office")
        self.assertEqual(row["integration_name"], "Zigbee Home Automation")
        self.assertIsNone(row["placed_floor_id"])

    def test_a_coordinator_with_an_entity_is_not_listed_twice(self) -> None:
        rows = _list([_device("c1")], [_entity("sensor.radio_temp", "c1")], {"c1"})
        self.assertEqual([r["entity_id"] for r in rows], ["sensor.radio_temp"])

    def test_a_coordinator_with_only_an_update_entity_is_not_listed_twice(self) -> None:
        rows = _list([_device("c1")], [_entity("update.radio_fw", "c1")], {"c1"})
        self.assertEqual([r["entity_id"] for r in rows], ["update.radio_fw"])

    def test_a_placed_coordinator_reports_its_floor(self) -> None:
        layouts = {"f1": {"pins": [{"device_id": "c1"}]}}
        (row,) = _list([_device("c1")], [], {"c1"}, layouts)
        self.assertEqual(row["placed_floor_id"], "f1")
        self.assertEqual(row["placed_floor_name"], "Top Floor")

    def test_a_service_device_is_not_offered(self) -> None:
        rows = _list([_device("c1", entry_type="service")], [], {"c1"})
        self.assertEqual(rows, [])

    def test_a_coordinator_missing_from_the_registry_is_skipped(self) -> None:
        self.assertEqual(_list([], [], {"gone"}), [])


if __name__ == "__main__":
    unittest.main()
