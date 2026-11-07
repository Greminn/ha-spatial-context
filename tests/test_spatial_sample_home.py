"""The AI summary on real radio data: the anonymized sample-home fixtures
(tests/fixtures/home/, ZHA neighbour/route tables and UniFi associations)
combined with synthetic floor-plan geometry, since the fixtures carry no
plan. Skipped when the fixtures are not in the tree; point
SPATIAL_SAMPLE_FIXTURES at a copy to run it anyway.

The fixtures are converted with a small local reader rather than the link
store's providers, so this test does not depend on them.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import json
import os
from pathlib import Path
import random
import unittest

import spatial_support

FIXTURES = Path(os.environ.get("SPATIAL_SAMPLE_FIXTURES") or Path(__file__).parent / "fixtures" / "home")
_ROLE = {"Coordinator": "coordinator", "Router": "router", "EndDevice": "end_device"}


def _load(name: str) -> dict:
    return json.loads((FIXTURES / name).read_text())


def _zha_snapshot(L, zha: dict):
    nodes: dict[str, object] = {}
    links = []
    for dev in zha["devices"]:
        if dev.get("nwk"):
            nodes[dev["nwk"]] = L.LinkNode(dev["nwk"], _ROLE.get(dev.get("device_type"), "unknown"), dev["device_id"])
    for dev in zha["devices"]:
        source = dev.get("nwk")
        if not source:
            continue
        for n in dev.get("neighbors") or []:
            if n.get("relationship") == "PreviousChild" or not n.get("nwk"):
                continue
            nodes.setdefault(n["nwk"], L.LinkNode(n["nwk"], _ROLE.get(n.get("device_type"), "unknown"), None))
            links.append(L.Link(source, n["nwk"], "neighbor", L.LinkMetrics(lqi=n.get("lqi")),
                                {"relationship": str(n.get("relationship", "")).lower()}))
        for r in dev.get("routes") or []:
            if r.get("route_status") == "Active" and r.get("next_hop"):
                links.append(L.Link(source, r["next_hop"], "route", L.LinkMetrics(), {"dest": r.get("dest_nwk")}))
    return L.LinkSnapshot("zigbee", "zha", "fixture", zha["_meta"]["capture_date"], list(nodes.values()), links)


def _wifi_snapshot(L, wifi: dict):
    aps = {ap["ap_id"]: ap for ap in wifi["aps"]}
    nodes, links = {}, []
    for ap in aps.values():
        nodes[ap["mac"]] = L.LinkNode(ap["mac"], "access_point", ap.get("ha_device_id"))
    for client in wifi["clients"]:
        ap = aps.get(client.get("ap_id"))
        if not ap:
            continue
        nodes[client["mac"]] = L.LinkNode(client["mac"], "client", client.get("ha_device_id"))
        links.append(L.Link(client["mac"], ap["mac"], "association", L.LinkMetrics(rssi_dbm=client.get("signal_dbm"))))
    return L.LinkSnapshot("wifi", "unifi", "fixture", wifi["_meta"].get("capture_date", "2026-11-06"), list(nodes.values()), links)


@unittest.skipUnless((FIXTURES / "zha_devices.json").exists(), "sample-home fixtures not present")
class SampleHomeFixtureTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()
        L = cls.sp.links
        areas = _load("areas.json")
        zha, wifi = _load("zha_devices.json"), _load("unifi_wifi.json")
        rng = random.Random(3)

        # Synthetic plan: each HA area is a 4 x 5 m room on its floor.
        u = spatial_support.UNITS_PER_M
        layouts = {f["floor_id"]: {"building_id": "home", "scale": spatial_support.SCALE, "rooms": [],
                                   "walls": [], "openings": [], "pins": []} for f in areas["floors"]}
        room_box = {}
        for i, area in enumerate(a for a in areas["areas"] if a.get("floor_id") in layouts):
            lay = layouts[area["floor_id"]]
            n = len(lay["rooms"])
            x0, y0 = (n % 5) * 4 * u, (n // 5) * 5 * u
            box = [[x0, y0], [x0 + 4 * u, y0], [x0 + 4 * u, y0 + 5 * u], [x0, y0 + 5 * u]]
            lay["rooms"].append({"id": f"room_{area['area_id']}", "name": "", "area_id": area["area_id"], "points": box})
            lay["walls"].append({"id": f"wall_{area['area_id']}", "material": "timber_frame", "points": box + [box[0]]})
            room_box[area["area_id"]] = (area["floor_id"], box)

        devices_meta = {}
        names = {d["device_id"]: (d["name"], "zha") for d in zha["devices"]}
        names.update({d["ha_device_id"]: (d["name"], "unifi") for d in wifi["aps"] if d.get("ha_device_id")})
        for device_id, area_id in sorted(areas["device_area"].items()):
            name, integration = names.get(device_id, (device_id, None))
            devices_meta[device_id] = {"name": name, "area_id": area_id, "integration": integration}
            if area_id in room_box and rng.random() < 0.85:
                fid, box = room_box[area_id]
                layouts[fid]["pins"].append({
                    "device_id": device_id,
                    "x": rng.uniform(box[0][0] + 3, box[1][0] - 3),
                    "y": rng.uniform(box[0][1] + 3, box[2][1] - 3),
                })
        home = {
            "floors_meta": areas["floors"],
            "layouts": layouts,
            "area_names": {a["area_id"]: a["name"] for a in areas["areas"]},
            "devices_meta": devices_meta,
            "snapshots": [_zha_snapshot(L, zha), _wifi_snapshot(L, wifi)],
        }
        cls.links = sum(len(s.links) for s in home["snapshots"])
        cls.ai = cls.sp.ai.SpatialAI(spatial_support.build(cls.sp, home))

    def test_summary_budget_on_real_links(self) -> None:
        summary = self.ai.summary()
        tokens = self.sp.ai.estimate_tokens(summary)
        if os.environ.get("SPATIAL_PRINT"):
            print(f"\nsample-home links: {self.links}, summary: {tokens} tokens, findings: {summary['findings']['counts']}")
        self.assertGreater(self.links, 1500)
        self.assertLessEqual(tokens, 8000)
        self.assertIn("router", json.dumps(summary["infrastructure"]))
        self.assertTrue(any("LQI" in note for note in summary["approximate"]))

    def test_contexts_fit_on_real_links(self) -> None:
        worst = max(
            self.sp.ai.estimate_tokens(self.ai.device_context(did)) for did in self.ai.model.devices
        )
        self.assertLessEqual(worst, 2000)


if __name__ == "__main__":
    unittest.main()
