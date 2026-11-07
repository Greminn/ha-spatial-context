"""AI outputs (spatial/ai.py) on a synthetic large home: token budgets,
determinism, lookups, and that the summary carries no raw geometry.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import json
import os
import unittest

import spatial_support

SUMMARY_BUDGET = 8000
CONTEXT_BUDGET = 2000


class SyntheticHomeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()
        cls.home = spatial_support.synthetic_home()
        cls.ai = cls.sp.ai.SpatialAI(spatial_support.build(cls.sp, cls.home))

    def test_the_home_is_realistically_large(self) -> None:
        home = self.home
        self.assertEqual(len(home["devices_meta"]), 300)
        self.assertEqual(sum(len(lay["rooms"]) for lay in home["layouts"].values()), 60)
        self.assertGreaterEqual(sum(len(s.links) for s in home["snapshots"]), 1400)

    def test_summary_fits_its_budget(self) -> None:
        summary = self.ai.summary()
        tokens = self.sp.ai.estimate_tokens(summary)
        if os.environ.get("SPATIAL_PRINT"):
            print(f"\nsummary: {tokens} tokens")
            print(json.dumps(summary, indent=1, ensure_ascii=False)[:3000])
        self.assertLessEqual(tokens, SUMMARY_BUDGET)
        self.assertEqual(len(summary["rooms"]), 60)
        self.assertEqual(len(summary["levels"]), 2)
        self.assertTrue(summary["infrastructure"]["items"])
        self.assertTrue(summary["findings"]["top"])

    def test_summary_has_no_polygons_and_says_what_is_approximate(self) -> None:
        text = json.dumps(self.ai.summary())
        self.assertNotIn('"points', text)
        self.assertIn("LQI", text)
        self.assertIn("not placed", text)

    def test_every_device_context_and_path_fits(self) -> None:
        worst_context = max(
            self.sp.ai.estimate_tokens(self.ai.device_context(did)) for did in self.home["devices_meta"]
        )
        self.assertLessEqual(worst_context, CONTEXT_BUDGET)
        ids = sorted(self.home["devices_meta"])
        worst_path = max(
            self.sp.ai.estimate_tokens(self.ai.path(a, b)) for a in ids[:40] for b in ids[-40:]
        )
        self.assertLessEqual(worst_path, CONTEXT_BUDGET)
        for room in list(self.ai.model.rooms)[:10]:
            self.assertLessEqual(self.sp.ai.estimate_tokens(self.ai.room(room)), CONTEXT_BUDGET)
        self.assertLessEqual(self.sp.ai.estimate_tokens(self.ai.weak_links()), CONTEXT_BUDGET * 2)

    def test_output_is_deterministic(self) -> None:
        again = self.sp.ai.SpatialAI(spatial_support.build(self.sp, spatial_support.synthetic_home()))
        self.assertEqual(json.dumps(again.summary()), json.dumps(self.ai.summary()))
        self.assertEqual(json.dumps(again.device_context("dev001")), json.dumps(self.ai.device_context("dev001")))

    def test_cross_level_path(self) -> None:
        main = next(d for d in self.ai.model.devices.values() if d.level_id == "main")
        upper = next(d for d in self.ai.model.devices.values() if d.level_id == "upper")
        path = self.ai.path(main.device_id, upper.device_id)
        self.assertFalse(path["same_level"])
        self.assertEqual(path["floors"], 1)
        self.assertIn("pred_dbm", path)

    def test_weak_links_filters(self) -> None:
        everything = self.ai.weak_links()
        zigbee = self.ai.weak_links(layer="zigbee")
        upper = self.ai.weak_links(level="Upper")
        self.assertGreater(everything["checked"], zigbee["checked"])
        self.assertLess(upper["checked"], everything["checked"])
        self.assertIn("note_lqi", zigbee)


class LookupTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()
        home = spatial_support.synthetic_home()
        cls.ai = cls.sp.ai.SpatialAI(spatial_support.build(cls.sp, home))

    def test_devices_resolve_by_id_short_id_name_and_substring(self) -> None:
        ai = self.ai
        device = ai.model.devices["dev010"]
        sid = ai.device_sid["dev010"]
        self.assertIs(ai.resolve_device("dev010"), device)
        self.assertIs(ai.resolve_device(sid), device)
        self.assertIs(ai.resolve_device(device.name.upper()), device)
        self.assertIs(ai.resolve_device(device.name[2:].lower()), device)

    def test_ambiguous_and_missing(self) -> None:
        with self.assertRaises(self.sp.ai.NotFound) as ctx:
            self.ai.resolve_device("Light")
        self.assertIn("several", str(ctx.exception))
        with self.assertRaises(self.sp.ai.NotFound):
            self.ai.resolve_device("no such thing")

    def test_rooms_and_levels(self) -> None:
        ai = self.ai
        room = next(r for r in ai.model.rooms.values() if r.area_id == "area_0")
        self.assertIs(ai.resolve_room(ai.room_sid[room.id]), room)
        self.assertIs(ai.resolve_room(room.name), room)
        self.assertEqual(ai.resolve_level("l2").id, "upper")
        self.assertEqual(ai.resolve_level("main").id, "main")

    def test_run_dispatch(self) -> None:
        ai = self.ai
        self.assertIn("levels", ai.run("summary", {}))
        self.assertIn("device", ai.run("device_context", {"device": "dev001"}))
        with self.assertRaises(ValueError):
            ai.run("path", {"a": "dev001"})
        with self.assertRaises(ValueError):
            ai.run("nope", {})


class PositionConfidenceTest(unittest.TestCase):
    """Bulk-placed pins carry `approximate`; the AI outputs say per device
    whether a position is "approximate" or "confirmed"."""

    @classmethod
    def setUpClass(cls) -> None:
        cls.sp = spatial_support.load_spatial()
        home = spatial_support.synthetic_home()
        pin = next(
            p for lay in home["layouts"].values() for p in lay["pins"] if p["device_id"] == "dev010"
        )
        pin["approximate"] = True
        cls.ai = cls.sp.ai.SpatialAI(spatial_support.build(cls.sp, home))

    def test_model_reads_the_flag(self) -> None:
        devices = self.ai.model.devices
        self.assertTrue(devices["dev010"].approximate)
        self.assertEqual(sum(d.approximate for d in devices.values()), 1)

    def test_device_context_path_and_room(self) -> None:
        ai = self.ai
        self.assertEqual(ai.device_context("dev010")["device"]["position_confidence"], "approximate")
        other = next(d for d in ai.model.devices.values() if d.placed and d.device_id != "dev010")
        self.assertEqual(ai.device_context(other.device_id)["device"]["position_confidence"], "confirmed")
        path = ai.path("dev010", other.device_id)
        self.assertEqual(path["a"]["position_confidence"], "approximate")
        self.assertEqual(path["b"]["position_confidence"], "confirmed")
        room = ai.room(ai.model.devices["dev010"].room_id)
        row = next(d for d in room["devices"]["items"] if d["id"] == ai.device_sid["dev010"])
        self.assertEqual(row["position_confidence"], "approximate")

    def test_summary_counts_and_notes_them(self) -> None:
        summary = self.ai.summary()
        self.assertEqual(summary["devices"]["approximate_positions"], 1)
        self.assertTrue(any("approximate positions" in n for n in summary["approximate"]))
        for row in summary["infrastructure"]["items"]:
            if row.get("placed") is not False:
                self.assertIn(row["position_confidence"], ("approximate", "confirmed"))

    def test_unplaced_devices_have_no_confidence(self) -> None:
        ai = self.ai
        unplaced = next((d for d in ai.model.devices.values() if not d.placed), None)
        if unplaced is None:
            self.skipTest("synthetic home has no unplaced device")
        self.assertNotIn("position_confidence", ai.device_context(unplaced.device_id)["device"])


if __name__ == "__main__":
    unittest.main()
