"""The metric model (spatial/model.py) and findings (spatial/findings.py) on
small hand-made layouts.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import unittest

import spatial_support

SCALE = {"points": [[0, 0], [100, 0]], "meters": 10}  # 10 units per metre
ROOM_A = {"id": "ra", "name": "Lounge", "area_id": "lounge", "points": [[0, 0], [50, 0], [50, 50], [0, 50]]}
ROOM_B = {"id": "rb", "name": "", "area_id": "kitchen", "points": [[50, 0], [100, 0], [100, 50], [50, 50]]}
AREAS = {"lounge": "Lounge", "kitchen": "Kitchen"}


def _layout(pins, scale=SCALE, building_id=None, rooms=(ROOM_A, ROOM_B), walls=()):
    return {"scale": scale, "building_id": building_id, "rooms": list(rooms),
            "walls": list(walls), "openings": [], "pins": pins}


class ModelTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()

    def _model(self, layouts, floors=None, devices=None, settings=None, snapshots=()):
        floors = floors or [{"floor_id": fid, "name": fid.title(), "level": i} for i, fid in enumerate(layouts)]
        return spatial_support.build(
            self.sp,
            {"floors_meta": floors, "layouts": layouts, "area_names": AREAS,
             "devices_meta": devices or {}, "snapshots": list(snapshots)},
            settings,
        )

    def test_room_is_recomputed_on_the_server(self) -> None:
        # The stored room_id is stale (pin moved) or points at a deleted room.
        pins = [
            {"device_id": "d1", "x": 75, "y": 25, "room_id": "ra"},
            {"device_id": "d2", "x": 25, "y": 25, "room_id": "deleted"},
            {"device_id": "d3", "x": 500, "y": 500, "room_id": "ra"},
        ]
        model = self._model({"f": _layout(pins)})
        self.assertEqual(model.devices["d1"].room_id, "rb")
        self.assertEqual(model.devices["d2"].room_id, "ra")
        self.assertIsNone(model.devices["d3"].room_id)
        self.assertEqual(model.devices["d1"].stored_room_id, "ra")
        self.assertEqual(model.rooms["rb"].name, "Kitchen")  # follows its area
        self.assertAlmostEqual(model.rooms["ra"].area_m2, 25)

    def test_metres_and_heights(self) -> None:
        pins = [{"device_id": "d1", "x": 30, "y": 40, "height_m": 2.0}, {"device_id": "d2", "x": 0, "y": 0}]
        model = self._model({"g": _layout([]), "f": _layout(pins)}, settings={"floor_height_m": 2.5})
        d1, d2 = model.devices["d1"], model.devices["d2"]
        self.assertEqual((d1.x_m, d1.y_m), (3.0, 4.0))
        self.assertAlmostEqual(d1.z_m, 2.5 + 2.0)  # level 1
        self.assertAlmostEqual(d2.z_m, 2.5 + 1.0)  # default pin height
        self.assertAlmostEqual(model.path(d1, d2)["distance_m"], (9 + 16 + 1) ** 0.5)

    def test_uncalibrated_floor_has_rooms_but_no_metres(self) -> None:
        model = self._model({"f": _layout([{"device_id": "d1", "x": 25, "y": 25}], scale=None)})
        self.assertFalse(model.levels["f"].calibrated)
        self.assertEqual(model.devices["d1"].room_id, "ra")
        self.assertIsNone(model.devices["d1"].x_m)
        findings = self.sp.findings.analyse(model).findings
        self.assertEqual([f["type"] for f in findings], ["uncalibrated_level"])

    def test_a_floor_borrows_its_buildings_scale(self) -> None:
        model = self._model({
            "a": _layout([], building_id="house"),
            "b": _layout([{"device_id": "d1", "x": 10, "y": 0}], scale=None, building_id="house"),
        })
        self.assertTrue(model.levels["b"].calibrated)
        self.assertEqual(model.levels["b"].scale_from, "a")
        self.assertEqual(model.devices["d1"].x_m, 1.0)

    def test_cross_level_geometry_only_within_a_building(self) -> None:
        wall_low = {"id": "low", "material": "timber_frame", "points": [[20, -10], [20, 60]]}
        wall_up = {"id": "up", "material": "concrete_block", "points": [[80, -10], [80, 60]]}
        layouts = {
            "ground": _layout([{"device_id": "a", "x": 0, "y": 10}], building_id="h", walls=[wall_low]),
            "upper": _layout([{"device_id": "b", "x": 100, "y": 10}], building_id="h", walls=[wall_up]),
        }
        model = self._model(layouts)
        path = model.path(model.devices["a"], model.devices["b"])
        self.assertFalse(path["same_level"])
        self.assertEqual(path["slabs"], 1)
        # The low wall is crossed on the ground floor part, the high one upstairs.
        self.assertEqual(sorted((c["level_id"], c["wall_id"]) for c in path["crossings"]),
                         [("ground", "low"), ("upper", "up")])
        self.assertAlmostEqual(path["distance_m"], (10**2 + 3**2) ** 0.5)

        layouts["upper"]["building_id"] = None
        model = self._model(layouts)
        self.assertIsNone(model.path(model.devices["a"], model.devices["b"]))
        self.assertEqual(model.path_unknown_reason(model.devices["a"], model.devices["b"]), "different_buildings")

    def test_adjacency(self) -> None:
        far = {"id": "rc", "name": "Shed", "points": [[300, 0], [350, 0], [350, 50], [300, 50]]}
        model = self._model({"f": _layout([], rooms=[ROOM_A, ROOM_B, far])})
        adj = model.adjacency()
        self.assertEqual(adj["ra"], ["rb"])
        self.assertEqual(adj["rc"], [])

    def test_property_pins_are_outdoor(self) -> None:
        home = {"floors_meta": [{"floor_id": "f", "name": "F", "level": 0}],
                "layouts": {"f": _layout([{"device_id": "in", "x": 10, "y": 10}])},
                "property": {"pins": [{"device_id": "out", "x": 5, "y": 5}]}, "property_mpu": 0.5,
                "area_names": {}, "devices_meta": {}}
        model = spatial_support.build(self.sp, home)
        self.assertEqual(model.devices["out"].x_m, 2.5)
        self.assertEqual(model.path_unknown_reason(model.devices["in"], model.devices["out"]), "different_buildings")


class FindingsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()

    def test_every_finding_type(self) -> None:
        L = self.sp.links
        walls = [{"id": f"w{x}", "material": "timber_frame", "points": [[x, -10], [x, 60]]} for x in (60, 70, 80)]
        pins = [
            {"device_id": "coord", "x": 10, "y": 10},
            {"device_id": "r1", "x": 20, "y": 10},
            {"device_id": "r2", "x": 30, "y": 10},
            {"device_id": "lonely", "x": 40, "y": 10},
            {"device_id": "child", "x": 95, "y": 10},  # behind 3 walls from r2
            {"device_id": "misplaced", "x": 75, "y": 40},  # in the kitchen, area lounge
        ]
        nodes = [
            L.LinkNode("C", "coordinator", "coord"), L.LinkNode("R1", "router", "r1"),
            L.LinkNode("R2", "router", "r2"), L.LinkNode("R3", "router", "lonely"),
            L.LinkNode("E", "end_device", "child"), L.LinkNode("U", "router", "unplaced"),
            L.LinkNode("X", "router", None),
        ]
        lq = lambda v: L.LinkMetrics(lqi=v, lqi_norm=float(v))  # noqa: E731
        links = [
            L.Link("C", "R1", "neighbor", lq(240)), L.Link("R1", "C", "neighbor", lq(240)),
            L.Link("C", "R2", "neighbor", lq(230)), L.Link("R1", "R2", "neighbor", lq(10)),  # weak
            L.Link("R2", "R3", "neighbor", lq(200)),  # lonely: only one router neighbour
            L.Link("R2", "E", "neighbor", lq(150), {"relationship": "Child"}),
            L.Link("U", "C", "neighbor", lq(100)), L.Link("X", "C", "neighbor", lq(100)),
        ]
        snap = L.LinkSnapshot("zigbee", "z", "test", "t", nodes, links)
        home = {
            "floors_meta": [{"floor_id": "f", "name": "F", "level": 0}, {"floor_id": "g", "name": "Garage", "level": None}],
            "layouts": {"f": _layout(pins, walls=walls), "g": _layout([{"device_id": "g1", "x": 1, "y": 1}], scale=None)},
            "area_names": AREAS,
            "devices_meta": {"misplaced": {"name": "Lamp", "area_id": "lounge"}, "unplaced": {"name": "Plug"}},
            "snapshots": [snap],
        }
        analysis = self.sp.findings.analyse(spatial_support.build(self.sp, home))
        by_type = {}
        for f in analysis.findings:
            by_type.setdefault(f["type"], []).append(f["devices"])
        self.assertEqual(by_type["weak_link"], [["r1", "r2"]])
        self.assertEqual(by_type["unplaced_infrastructure"], [["unplaced"]])
        self.assertEqual(by_type["area_mismatch"], [["misplaced"]])
        self.assertIn(["lonely"], by_type["isolated_router"])
        self.assertNotIn(["coord"], by_type["isolated_router"])
        self.assertEqual(by_type["far_parent"], [["child", "r2"]])
        self.assertEqual(by_type["uncalibrated_level"], [[]])
        for f in analysis.findings:
            self.assertEqual(set(f), {"type", "severity", "devices", "detail"})
        self.assertEqual(analysis.networks[0]["unmapped_nodes"], 1)

    def test_threshold_zero_turns_weak_links_off(self) -> None:
        L = self.sp.links
        pins = [{"device_id": "a", "x": 0, "y": 0}, {"device_id": "b", "x": 50, "y": 0}]
        snap = L.LinkSnapshot("zigbee", "z", "t", "t", [L.LinkNode("A", "router", "a"), L.LinkNode("B", "router", "b")],
                              [L.Link("A", "B", "neighbor", L.LinkMetrics(lqi=5))])
        home = {"floors_meta": [{"floor_id": "f", "name": "F", "level": 0}], "layouts": {"f": _layout(pins)},
                "area_names": {}, "devices_meta": {}, "snapshots": [snap]}
        on = self.sp.findings.analyse(spatial_support.build(self.sp, home))
        off = self.sp.findings.analyse(spatial_support.build(self.sp, home, {"weak_link_threshold_db": 0}))
        weak = lambda a: [f for f in a.findings if f["type"] == "weak_link"]  # noqa: E731
        self.assertEqual(len(weak(on)), 1)
        self.assertEqual(weak(off), [])


if __name__ == "__main__":
    unittest.main()
