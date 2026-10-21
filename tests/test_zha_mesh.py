"""Test for the ZHA topology source (#40): ZHA's neighbor tables become the
same nodes/links shape the Zigbee2MQTT path returns.

Runs without Home Assistant installed — the HA and sibling modules are
stubbed, and ZHA's device info is faked — so this exercises zha_mesh.py's
conversion plus the real `_merge_links` it feeds.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import importlib.util
import sys
import types
import unittest
from pathlib import Path
from unittest import mock

PKG = Path(__file__).resolve().parent.parent / "custom_components" / "spatial_context"


def _stub(name: str, **attrs: object) -> types.ModuleType:
    module = types.ModuleType(name)
    module.__dict__.update(attrs)
    sys.modules[name] = module
    return module


def _load(name: str) -> types.ModuleType:
    spec = importlib.util.spec_from_file_location(
        f"spatial_context.{name}", PKG / f"{name}.py", submodule_search_locations=None
    )
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def _setup() -> tuple[types.ModuleType, types.ModuleType]:
    _stub("homeassistant")
    _stub("homeassistant.components", mqtt=_stub("homeassistant.components.mqtt"))
    _stub("homeassistant.core", HomeAssistant=object, callback=lambda f: f)
    _stub(
        "homeassistant.helpers",
        device_registry=_stub("homeassistant.helpers.device_registry"),
    )
    pkg = _stub("spatial_context")
    pkg.__path__ = [str(PKG)]
    _stub("spatial_context.const", DOMAIN="spatial_context")
    _stub("spatial_context.storage", async_get_settings=mock.AsyncMock())
    return _load("zigbee_mesh"), _load("zha_mesh")


def _info(ieee: str, device_type: str, neighbors: list[dict]) -> dict:
    return {
        "ieee": ieee,
        "name": f"name-{ieee}",
        "user_given_name": None,
        "device_reg_id": f"dev-{ieee}",
        "device_type": device_type,
        "neighbors": neighbors,
    }


def _nb(ieee: str, lqi: str, relationship: str) -> dict:
    return {"ieee": ieee, "lqi": lqi, "relationship": relationship}


class ZhaMeshTest(unittest.TestCase):
    def test_neighbor_tables_become_merged_links(self) -> None:
        zigbee_mesh, zha_mesh = _setup()
        infos = [
            _info("c", "Coordinator", [_nb("r", "200", "Child")]),
            _info("r", "Router", [_nb("c", "180", "Parent"), _nb("e", "90", "Child")]),
            _info("e", "EndDevice", [_nb("r", "70", "Parent")]),
            _info("lone", "Router", [_nb("ghost", "5", "Sibling")]),
        ]
        with mock.patch.object(zha_mesh, "_device_infos", return_value=infos):
            mesh = asyncio.run(
                zha_mesh.async_fetch_zha_mesh(
                    None, False, 30, zigbee_mesh._merge_links
                )
            )

        self.assertEqual(
            {n["ieee"]: n["device_id"] for n in mesh["nodes"]},
            {"c": "dev-c", "r": "dev-r", "e": "dev-e", "lone": "dev-lone"},
        )
        by_pair = {
            frozenset((link["source_ieee"], link["target_ieee"])): link
            for link in mesh["links"]
        }
        self.assertEqual(len(by_pair), 3)
        cr = by_pair[frozenset(("c", "r"))]
        # Both sides reported: the weaker corrected reading wins, raw kept.
        self.assertEqual(cr["lqi_readings"], [200, 180])
        self.assertTrue(cr["parent_child"])
        self.assertEqual(cr["source_device_id"] in ("dev-c", "dev-r"), True)
        # A neighbor ZHA doesn't know has no HA device, so it is never drawn.
        ghost = by_pair[frozenset(("lone", "ghost"))]
        self.assertFalse(ghost["parent_child"])
        self.assertIsNone(
            ghost["source_device_id"]
            if ghost["source_ieee"] == "ghost"
            else ghost["target_device_id"]
        )

    def test_unparseable_lqi_is_not_counted_as_zero(self) -> None:
        zigbee_mesh, zha_mesh = _setup()
        infos = [
            _info("a", "Router", [_nb("b", "None", "Sibling")]),
            _info("b", "Router", [_nb("a", "120", "Sibling")]),
        ]
        with mock.patch.object(zha_mesh, "_device_infos", return_value=infos):
            mesh = asyncio.run(
                zha_mesh.async_fetch_zha_mesh(
                    None, False, 30, zigbee_mesh._merge_links
                )
            )
        (link,) = mesh["links"]
        self.assertEqual(link["lqi_readings"], [120])
        self.assertEqual(link["lqi"], 120)

    def test_stale_zero_and_one_readings_do_not_define_a_link(self) -> None:
        zigbee_mesh, _ = _setup()

        def link(source: str, target: str, lqi: int) -> dict:
            return {
                "sourceIeeeAddr": source,
                "targetIeeeAddr": target,
                "linkquality": lqi,
                "relationship": 2,
            }

        merged = zigbee_mesh._merge_links(
            [
                # Reads 0 one way and 79 the other: a link at 79.
                link("a", "b", 0),
                link("b", "a", 79),
                # Only stale readings: no data, not a weak link.
                link("c", "d", 1),
                link("d", "c", 0),
                # A stale 1 against a real 49: still a link at 49.
                link("e", "f", 49),
                link("f", "e", 1),
            ]
        )
        by_pair = {
            frozenset((m["source_ieee"], m["target_ieee"])): m for m in merged
        }
        ab = by_pair[frozenset(("a", "b"))]
        self.assertEqual(ab["lqi_readings"], [79])
        self.assertGreater(ab["lqi"], 0)
        cd = by_pair[frozenset(("c", "d"))]
        self.assertEqual(cd["lqi_readings"], [])
        ef = by_pair[frozenset(("e", "f"))]
        self.assertEqual(ef["lqi_readings"], [49])


if __name__ == "__main__":
    unittest.main()
