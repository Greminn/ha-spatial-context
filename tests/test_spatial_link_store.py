"""The spatial engine on the link store (WS-L + WS-S together).

The sample-home fixtures go through the real providers' builders (ZHA, Matter /
Thread, UniFi), into the real link store (saved and reloaded, as across a
restart), out through spatial/links_adapter.py, and into the AI summary with
a small synthetic floor plan (each HA area a 4 x 5 m room). Checks that the
adapter reads the store rather than its legacy fallback, that every layer
arrives, and that the outputs stay inside their token budgets.

Skipped when the fixtures are not in the tree.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import importlib
import json
import random
import sys
import types
import unittest
from unittest import mock

import links_harness
import spatial_support

_AREAS = links_harness.fixture("areas.json")
_ZHA = links_harness.fixture("zha_devices.json")
_THREAD = links_harness.fixture("matter_thread.json")
_WIFI = links_harness.fixture("unifi_wifi.json")


def _plan(areas: dict, device_ids: set[str], names: dict[str, str]) -> dict:
    u = spatial_support.UNITS_PER_M
    rng = random.Random(11)
    layouts = {
        f["floor_id"]: {"building_id": "b", "scale": spatial_support.SCALE, "rooms": [], "walls": [], "openings": [], "pins": []}
        for f in areas["floors"]
    }
    room_box = {}
    for area in areas["areas"]:
        lay = layouts.get(area.get("floor_id"))
        if lay is None:
            continue
        n = len(lay["rooms"])
        x0, y0 = (n % 5) * 4 * u, (n // 5) * 5 * u
        box = [[x0, y0], [x0 + 4 * u, y0], [x0 + 4 * u, y0 + 5 * u], [x0, y0 + 5 * u]]
        lay["rooms"].append({"id": f"room_{area['area_id']}", "name": "", "area_id": area["area_id"], "points": box})
        lay["walls"].append({"id": f"wall_{area['area_id']}", "material": "timber_frame", "points": box + [box[0]]})
        room_box[area["area_id"]] = (area["floor_id"], box)
    devices_meta = {}
    for device_id in sorted(device_ids):
        area_id = areas["device_area"].get(device_id)
        devices_meta[device_id] = {"name": names.get(device_id, device_id), "area_id": area_id}
        if area_id in room_box:
            fid, box = room_box[area_id]
            layouts[fid]["pins"].append({
                "device_id": device_id,
                "x": rng.uniform(box[0][0] + 3, box[1][0] - 3),
                "y": rng.uniform(box[0][1] + 3, box[2][1] - 3),
            })
    return {
        "floors_meta": areas["floors"],
        "layouts": layouts,
        "area_names": {a["area_id"]: a["name"] for a in areas["areas"]},
        "devices_meta": devices_meta,
    }


@unittest.skipIf(None in (_AREAS, _ZHA, _THREAD, _WIFI), "sample-home fixtures not captured")
class LinkStoreToSpatialTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()
        pkg = spatial_support.PKG
        links_harness.stub_ha()
        # zigbee_mesh.py (imported by the ZHA provider) reads the settings.
        sys.modules[f"{pkg}.storage"].async_get_settings = mock.AsyncMock(return_value={})
        L = types.SimpleNamespace(
            **{name: importlib.import_module(f"{pkg}.links.{name}") for name in ("zha", "thread", "unifi", "store")}
        )
        cls.L = L
        built = {
            "zha": [L.zha.build_snapshot(links_harness.zha_infos(_ZHA))],
            "thread": L.thread.build_snapshots(*links_harness.thread_inputs(_THREAD)),
            "unifi": [L.unifi.build_snapshot(*links_harness.wifi_inputs(_WIFI, L.unifi.mac_key))],
        }
        cls.built = built

        def provider(name, layer):
            async def fetch(hass, *, periodic=False):
                return built[name]

            return L.store.Provider(name, layer, fetch)

        links_harness.FakeStore.files.clear()

        async def scenario():
            hass = types.SimpleNamespace(data={})
            store = await L.store.async_setup_link_store(hass)
            store.providers = (provider("zha", "zigbee"), provider("thread", "thread"), provider("unifi", "wifi"))
            await L.store.async_refresh(hass)
            # A restart: a fresh hass loads the saved snapshots from disk.
            restarted = types.SimpleNamespace(data={})
            await L.store.async_setup_link_store(restarted)
            return await cls.sp.adapter.async_get_snapshots(restarted)

        cls.snapshots = asyncio.run(scenario())

        names = {d["device_id"]: d["name"] for d in _ZHA["devices"]}
        names.update({d["device_id"]: d["name"] for d in _THREAD["devices"]})
        names.update({x["ha_device_id"]: x["name"] for x in _WIFI["clients"] + _WIFI["aps"] if x.get("ha_device_id")})
        device_ids = {n.device_id for s in cls.snapshots for n in s.nodes if n.device_id}
        home = {**_plan(_AREAS, device_ids, names), "snapshots": cls.snapshots}
        cls.model = spatial_support.build(cls.sp, home)
        cls.ai = cls.sp.ai.SpatialAI(cls.model)

    def test_the_adapter_reads_the_reloaded_store(self) -> None:
        providers = {s.provider for s in self.snapshots}
        self.assertNotIn("legacy", " ".join(providers))
        self.assertEqual({s.layer for s in self.snapshots}, {"zigbee", "thread", "wifi"})
        expected = sum(len(s.links) for snaps in self.built.values() for s in snaps)
        self.assertEqual(sum(len(s.links) for s in self.snapshots), expected)
        self.assertGreater(expected, 1500)

    def test_summary_covers_every_layer_within_budget(self) -> None:
        summary = self.ai.summary()
        tokens = self.sp.ai.estimate_tokens(summary)
        self.assertLessEqual(tokens, 8000)
        layers = {n["layer"] for n in summary["networks"]}
        self.assertEqual(layers, {"zigbee", "thread", "wifi"})
        self.assertIn("router", json.dumps(summary["infrastructure"]))

    def test_tools_run_within_budget(self) -> None:
        worst = max(self.sp.ai.estimate_tokens(self.ai.device_context(d)) for d in self.model.devices)
        self.assertLessEqual(worst, 2000)
        for layer in ("zigbee", "thread", "wifi"):
            self.assertLessEqual(self.sp.ai.estimate_tokens(self.ai.weak_links(layer=layer)), 2000)
        thread_devices = sorted(
            {n.device_id for s in self.snapshots if s.layer == "thread" for n in s.nodes if n.device_id}
            & set(self.model.devices)
        )
        self.assertGreaterEqual(len(thread_devices), 2)
        path = self.ai.path(thread_devices[0], thread_devices[-1])
        self.assertLessEqual(self.sp.ai.estimate_tokens(path), 2000)


if __name__ == "__main__":
    unittest.main()
