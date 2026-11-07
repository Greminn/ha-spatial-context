"""Geometry parity with the panel: the cases from frontend/src/canvas/
geometry.test.ts and rf-path.test.ts, run against spatial/geometry.py.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import unittest

import spatial_support

SQUARE = [[0, 0], [10, 0], [10, 10], [0, 10]]


def _wall(wid, points, material="concrete_block", thickness_cm=None):
    wall = {"id": wid, "material": material, "points": points}
    if thickness_cm is not None:
        wall["thickness_cm"] = thickness_cm
    return wall


def _opening(oid, wall_id, kind, x, y, width):
    return {"id": oid, "wallId": wall_id, "type": kind, "x": x, "y": y, "width": width}


class GeometryParityTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()
        cls.g = cls.sp.geometry

    # geometry.test.ts

    def test_point_in_polygon_including_concave(self) -> None:
        g = self.g
        self.assertTrue(g.point_in_polygon(5, 5, SQUARE))
        self.assertFalse(g.point_in_polygon(15, 5, SQUARE))
        ell = [[0, 0], [10, 0], [10, 4], [4, 4], [4, 10], [0, 10]]
        self.assertTrue(g.point_in_polygon(2, 8, ell))
        self.assertFalse(g.point_in_polygon(8, 8, ell))

    def test_find_room_for_point(self) -> None:
        g = self.g
        rooms = [
            {"id": "a", "points": SQUARE},
            {"id": "b", "points": [[20, 0], [30, 0], [30, 10]]},
        ]
        self.assertEqual(g.find_room_for_point(5, 5, rooms), "a")
        self.assertEqual(g.find_room_for_point(28, 2, rooms), "b")
        self.assertIsNone(g.find_room_for_point(50, 50, rooms))
        self.assertIsNone(
            g.find_room_for_point(1, 1, [{"id": "line", "points": [[0, 0], [5, 5]]}])
        )

    # rf-path.test.ts: segmentIntersection

    def test_segment_intersection(self) -> None:
        g = self.g
        self.assertEqual(g.segment_intersection([0, 0], [10, 10], [0, 10], [10, 0]), (5, 5))
        self.assertIsNone(g.segment_intersection([0, 0], [1, 1], [5, 0], [5, 10]))
        self.assertIsNone(g.segment_intersection([0, 0], [10, 0], [0, 1], [10, 1]))
        self.assertIsNone(g.segment_intersection([0, 0], [10, 0], [2, 0], [8, 0]))

    # rf-path.test.ts: pathLoss

    def _loss(self, a, b, walls, openings=()):
        return self.g.walls_crossed(a, b, walls, list(openings), self.sp.wall_db)

    def test_path_loss_cases(self) -> None:
        vertical = _wall("w1", [[5, -10], [5, 10]])
        db = self.sp.wall_db(vertical)
        self.assertAlmostEqual(db, 12.0)  # concrete 0.6 dB/cm x 20 cm

        clear = self._loss([0, 0], [4, 0], [vertical])
        self.assertEqual(clear["total_db"], 0)
        self.assertEqual(clear["crossings"], [])

        one = self._loss([0, 0], [10, 0], [vertical])
        self.assertEqual(len(one["crossings"]), 1)
        self.assertAlmostEqual(one["total_db"], db)

        second = _wall("w2", [[8, -10], [8, 10]])
        two = self._loss([0, 0], [10, 0], [vertical, second])
        self.assertEqual([c["wall_id"] for c in two["crossings"]], ["w1", "w2"])
        self.assertAlmostEqual(two["total_db"], db * 2)

    def test_a_wall_corner_counts_once(self) -> None:
        corner = _wall("c", [[5, -5], [5, 0], [10, 5]])
        self.assertEqual(len(self._loss([0, 0], [8, 0], [corner])["crossings"]), 1)

    def test_openings(self) -> None:
        g = self.g
        vertical = _wall("w1", [[5, -10], [5, 10]])
        db = self.sp.wall_db(vertical)
        through = self._loss([0, 0], [10, 0], [vertical], [_opening("d", "w1", "door", 5, 0, 2)])
        self.assertEqual(through["crossings"][0]["through_opening"], "door")
        self.assertEqual(through["total_db"], g.OPENING_LOSS_DB["door"])

        missed = self._loss([0, 0], [10, 0], [vertical], [_opening("d", "w1", "door", 5, 8, 2)])
        self.assertIsNone(missed["crossings"][0]["through_opening"])
        self.assertAlmostEqual(missed["total_db"], db)

        other = self._loss([0, 0], [10, 0], [vertical], [_opening("d", "other", "door", 5, 0, 2)])
        self.assertAlmostEqual(other["total_db"], db)

    def test_walls_with_fewer_than_two_points_are_skipped(self) -> None:
        self.assertEqual(self._loss([0, 0], [10, 0], [_wall("s", [[5, 0]])])["total_db"], 0)

    # Server-only helpers

    def test_area_and_centroid(self) -> None:
        g = self.g
        self.assertAlmostEqual(g.polygon_area(SQUARE), 100)
        self.assertEqual(g.centroid(SQUARE), (5, 5))
        ell = [[0, 0], [10, 0], [10, 4], [4, 4], [4, 10], [0, 10]]
        self.assertAlmostEqual(g.polygon_area(ell), 64)
        cx, cy = g.centroid(ell)
        self.assertLess(cx, 5)  # pulled toward the heavy corner
        self.assertAlmostEqual(cx, cy)

    def test_shared_edges(self) -> None:
        g = self.g
        right = [[10, 0], [20, 0], [20, 10], [10, 10]]
        shared = g.shared_edges(SQUARE, right, 0.1)
        self.assertEqual(len(shared), 1)
        self.assertAlmostEqual(g.distance(*shared[0]), 10)
        # A hand-traced gap within tolerance still counts; a corner touch does not.
        nudged = [[10.05, 2], [20, 2], [20, 8], [10.05, 8]]
        self.assertAlmostEqual(sum(g.distance(*s) for s in g.shared_edges(SQUARE, nudged, 0.1)), 6)
        diagonal = [[10, 10], [20, 10], [20, 20], [10, 20]]
        self.assertEqual(g.shared_edges(SQUARE, diagonal, 0.1), [])


if __name__ == "__main__":
    unittest.main()
