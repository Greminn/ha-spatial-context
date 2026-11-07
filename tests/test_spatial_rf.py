"""RF model: the panel's weak-link.test.ts cases, plus the server-side
extensions (path-loss exponent, floor slabs, measured kinds, pair folding).

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import math
import unittest

import spatial_support

# 100 units = 10 m, as weak-link.test.ts.
SCALE = {"points": [[0, 0], [100, 0]], "meters": 10}


def _wall(x):
    return {"id": f"w{x}", "material": "concrete_block", "points": [[x, -50], [x, 50]]}


class RFTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()
        cls.rf = cls.sp.rf

    def _home(self, pins, walls=(), scale=SCALE, links=()):
        L = self.sp.links
        return {
            "floors_meta": [{"floor_id": "f", "name": "F", "level": 0}],
            "layouts": {"f": {"scale": scale, "rooms": [], "walls": list(walls), "openings": [], "pins": pins}},
            "area_names": {},
            "devices_meta": {},
            "snapshots": [
                L.LinkSnapshot("zigbee", "z", "test", "t", [
                    L.LinkNode("A", "router", "a"), L.LinkNode("B", "router", "b"),
                ], list(links))
            ],
        }

    def _check(self, to_x, walls=(), lqi=100, scale=SCALE, settings=None):
        """checkWeakLink's equivalent: a pin at (0,0) and one at (to_x, 0),
        heights equal so the distance is the plan distance."""
        L = self.sp.links
        pins = [
            {"device_id": "a", "x": 0, "y": 0},
            {"device_id": "b", "x": to_x, "y": 0},
        ]
        link = L.Link("A", "B", "neighbor", L.LinkMetrics(lqi=lqi))
        model = spatial_support.build(self.sp, self._home(pins, walls, scale, [link]), settings)
        analysis = self.sp.findings.analyse(model)
        return analysis.links[0].report

    def test_lqi_to_dbm(self) -> None:
        self.assertEqual(self.rf.lqi_to_dbm(0), -100)
        self.assertEqual(self.rf.lqi_to_dbm(255), -30)
        self.assertEqual(self.rf.lqi_to_dbm(-10), -100)
        self.assertEqual(self.rf.lqi_to_dbm(999), -30)

    def test_no_scale_cannot_judge(self) -> None:
        report = self._check(50, scale=None)
        self.assertIsNone(report["predicted_dbm"])
        self.assertEqual(report["unknown"], "uncalibrated")

    def test_distance_and_walls(self) -> None:
        clear = self._check(50)
        self.assertAlmostEqual(clear["distance_m"], 5)
        self.assertEqual(clear["wall_db"], 0)
        walled = self._check(50, walls=[_wall(25)])
        self.assertGreater(walled["wall_db"], 0)
        self.assertLess(walled["predicted_dbm"], clear["predicted_dbm"])
        self.assertLess(walled["gap_db"], clear["gap_db"])
        # Same numbers as the panel: 5 - 40 - 20*log10(5).
        self.assertAlmostEqual(clear["predicted_dbm"], 5 - 40 - 20 * math.log10(5))
        self.assertAlmostEqual(clear["measured_dbm"], self.rf.lqi_to_dbm(100))
        self.assertEqual(clear["measured_kind"], "lqi")

    def test_under_a_metre_reads_as_a_metre(self) -> None:
        self.assertAlmostEqual(self._check(1)["predicted_dbm"], -35)

    def test_exponent_setting(self) -> None:
        steep = self._check(100, settings={"rf_path_loss_exponent": 3.0})
        self.assertAlmostEqual(steep["predicted_dbm"], 5 - 40 - 30 * math.log10(10))

    def test_slab_loss(self) -> None:
        params = self.rf.RFParams(slab_db=13)
        same = self.rf.predicted_dbm("zigbee", 5, 0, 0, params)
        two = self.rf.predicted_dbm("zigbee", 5, 0, 2, params)
        self.assertAlmostEqual(same - two, 26)
        self.assertEqual(self.rf.RFParams.from_settings({}).slab_db, 13)

    def test_pairs_take_the_weaker_direction_and_prefer_rssi(self) -> None:
        L = self.sp.links
        snap = L.LinkSnapshot("thread", "t", "x", "t", [], [
            L.Link("A", "B", "neighbor", L.LinkMetrics(rssi_dbm=-60, thread_lqi=3)),
            L.Link("B", "A", "neighbor", L.LinkMetrics(rssi_dbm=-72)),
            L.Link("B", "A", "route", L.LinkMetrics(path_cost=1)),
            L.Link("C", "D", "neighbor", L.LinkMetrics(lqi=200, lqi_norm=120.0)),
            L.Link("D", "C", "neighbor", L.LinkMetrics(lqi=1)),  # stale, ignored
            L.Link("E", "F", "neighbor", L.LinkMetrics(thread_lqi=2)),
        ])
        pairs = {(p.a, p.b): p for p in self.rf.aggregate_pairs([snap])}
        self.assertEqual(pairs[("A", "B")].measured(), (-72, "rssi"))
        self.assertEqual(pairs[("A", "B")].kinds, {"neighbor", "route"})
        self.assertEqual(pairs[("C", "D")].measured(), (self.rf.lqi_to_dbm(120), "lqi"))
        self.assertEqual(pairs[("E", "F")].measured(), (None, "thread_lqi"))

    def test_parent_direction(self) -> None:
        L = self.sp.links
        snap = L.LinkSnapshot("zigbee", "z", "x", "t", [], [
            L.Link("R", "E", "neighbor", attrs={"relationship": "Child"}),
            L.Link("E2", "R", "neighbor", attrs={"relationship": "Parent"}),
            L.Link("E3", "R2", "parent"),
        ])
        parents = {(p.a, p.b): p.parent for p in self.rf.aggregate_pairs([snap])}
        self.assertEqual(parents[("E", "R")], "R")
        self.assertEqual(parents[("E2", "R")], "R")
        self.assertEqual(parents[("E3", "R2")], "R2")


if __name__ == "__main__":
    unittest.main()
