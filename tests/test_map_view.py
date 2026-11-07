"""get_map: the export without fields is unchanged (golden file), and the
optional floor/room/compact/include_links fields (spatial/map_view.py).

Regenerate the golden file only for a deliberate export change:
    SPATIAL_WRITE_GOLDEN=1 python3 -m unittest discover -s tests -p test_map_view.py

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import copy
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import unittest

import spatial_support
from test_export import _load_export

GOLDEN = Path(__file__).parent / "fixtures" / "get_map_golden.json"

LAYOUT = {
    "rooms": [
        {"id": "r1", "name": "Lounge", "area_id": "lounge", "points": [[0, 0], [100, 0], [100, 100], [0, 100]]},
        {"id": "r2", "name": "", "area_id": "lounge", "points": [[100, 0], [200, 0], [200, 100], [100, 100]]},
    ],
    "pins": [
        {"device_id": "d1", "x": 50.123456, "y": 25.5, "room_id": "r1", "height_m": 1.25},
        {"device_id": "d2", "x": 150, "y": 50, "room_id": "r1"},  # stale room_id
        {"device_id": "d3", "x": 500, "y": 500, "room_id": None, "label_override": "Garden"},
    ],
    "walls": [
        {"id": "w1", "material": "timber_frame", "points": [[100, 0], [100, 100]]},
        {"id": "w2", "material": "concrete_block", "thickness_cm": 25, "points": [[0, 0], [200, 0]]},
    ],
    "openings": [{"id": "o1", "wallId": "w1", "type": "door", "x": 100, "y": 50, "width": 20}],
    "scale": {"points": [[0, 0], [100, 0]], "meters": 3},
}


class _FrozenDatetime(datetime):
    @classmethod
    def now(cls, tz=None):
        return datetime(2026, 11, 6, 12, 0, 0, tzinfo=timezone.utc)


def _export_data() -> dict:
    export = _load_export(copy.deepcopy(LAYOUT))
    export.datetime = _FrozenDatetime
    return asyncio.run(export.async_get_map_data(object()))


class GoldenTest(unittest.TestCase):
    def test_get_map_without_fields_is_unchanged(self) -> None:
        text = json.dumps(_export_data(), indent=1, ensure_ascii=False) + "\n"
        if os.environ.get("SPATIAL_WRITE_GOLDEN"):
            GOLDEN.write_text(text)
        self.assertEqual(text, GOLDEN.read_text())


class MapViewTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.data = _export_data()
        cls.sp = spatial_support.load_spatial()
        cls.mv = cls.sp.map_view

    def test_floor_and_room_filters(self) -> None:
        mv = self.mv
        self.assertEqual(mv.filter_map(self.data, floor="top floor")["floors"][0]["floor_id"], "f1")
        with self.assertRaises(mv.MapFilterError):
            mv.filter_map(self.data, floor="Cellar")
        one = mv.filter_map(self.data, room="r1")
        self.assertEqual([r["id"] for r in one["floors"][0]["rooms"]], ["r1"])
        # r2 has no name of its own and shows its area's, so both match.
        both = mv.filter_map(self.data, room="lounge")
        self.assertEqual([r["id"] for r in both["floors"][0]["rooms"]], ["r1", "r2"])
        self.assertEqual(one["floors"][0]["walls"], [])
        self.assertEqual(one["outdoor_devices"], [])
        # The input is not modified.
        self.assertEqual(len(self.data["floors"][0]["rooms"]), 3)

    def test_compact(self) -> None:
        compact = self.mv.compact_map(self.data)
        floor = compact["floors"][0]
        device = floor["rooms"][0]["devices"][0]
        self.assertEqual(device["x_m"], 1.5)
        self.assertNotIn("x", device)
        self.assertNotIn("area_name", device)  # same as the room's name
        wall = floor["walls"][0]
        self.assertNotIn("points", wall)
        self.assertNotIn("material_label", wall)
        self.assertEqual(wall["openings"][0], {"type": "door", "x_m": 3.0, "y_m": 1.5, "width_m": 0.6})
        self.assertLess(len(json.dumps(compact)), len(json.dumps(self.data)))

    def test_link_rows_only_between_exported_devices(self) -> None:
        sp = self.sp
        L = sp.links
        home = {
            "floors_meta": [{"floor_id": "f1", "name": "Top Floor", "level": 0}],
            "layouts": {"f1": copy.deepcopy(LAYOUT)},
            "area_names": {"lounge": "Lounge"},
            "devices_meta": {},
            "snapshots": [L.LinkSnapshot("zigbee", "z", "t", "t", [
                L.LinkNode("A", "router", "d1"), L.LinkNode("B", "router", "d2"), L.LinkNode("C", "router", "dx"),
            ], [
                L.Link("A", "B", "neighbor", L.LinkMetrics(lqi=120)),
                L.Link("A", "C", "neighbor", L.LinkMetrics(lqi=120)),
            ])],
        }
        analysis = sp.findings.analyse(spatial_support.build(sp, home))
        rows = self.mv.link_rows(analysis, self.mv.exported_device_ids(self.data))
        self.assertEqual(len(rows), 1)
        self.assertEqual((rows[0]["a"], rows[0]["b"]), ("d1", "d2"))
        self.assertEqual(rows[0]["walls"], 1)  # through the door in w1
        self.assertEqual(rows[0]["measured_kind"], "lqi")


if __name__ == "__main__":
    unittest.main()
