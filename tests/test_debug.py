"""Tests for the opt-in debug log (debug.py): what is written, what is scrubbed
out of it, and what the public debug report may contain.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import json
import tempfile
import unittest
from pathlib import Path

import stubs

SETTINGS = {"debug_logging": True}


async def _get_settings(hass):
    return SETTINGS


async def _get_all_layouts(hass):
    return {"up": {"rooms": [1, 2], "walls": [], "openings": [], "pins": [1], "scale": None}}


async def _get_property_layout(hass):
    return {"placements": [], "pins": []}


async def _get_integration(hass, domain):
    return type("Integration", (), {"version": "1.0.0"})()


stubs.new_package("sc_debug_test")
stubs.stub("homeassistant")
stubs.stub("homeassistant.const", __version__="2026.10.0")
stubs.stub("homeassistant.core", HomeAssistant=object)
stubs.stub("homeassistant.loader", async_get_integration=_get_integration)
stubs.stub(
    "sc_debug_test.storage",
    async_get_all_layouts=_get_all_layouts,
    async_get_property_layout=_get_property_layout,
    async_get_settings=_get_settings,
)
stubs.load("sc_debug_test", "const")
debug = stubs.load("sc_debug_test", "debug")

STACK = "Error: boom\n at https://ha.example.com:8123/spatial_context_panel.js?v=1:10:5"


def run(coro):
    return asyncio.run(coro)


class DebugLogTest(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.hass = stubs.FakeHass(self._tmp.name)
        self.log = Path(self._tmp.name) / debug.LOG_FILENAME
        SETTINGS["debug_logging"] = True

    def _lines(self) -> list[dict]:
        return [json.loads(line) for line in self.log.read_text().splitlines()]

    def test_scrub_removes_origins_and_ip_addresses_but_not_browser_versions(self) -> None:
        text = "at http://10.20.30.40:8123/x and ws://homeassistant.local:8123/y from 192.168.0.9 in Chrome/120.0.0.0"
        scrubbed = debug._scrub(text)
        self.assertNotIn("10.20.30.40", scrubbed)
        self.assertNotIn("homeassistant.local", scrubbed)
        self.assertNotIn("192.168.0.9", scrubbed)
        self.assertIn("Chrome/120.0.0.0", scrubbed)

    def test_entries_are_written_scrubbed(self) -> None:
        run(debug.async_append_debug_entries(self.hass, [{"event": "js_error", "stack": STACK}]))
        (entry,) = self._lines()
        self.assertEqual(entry["event"], "js_error")
        self.assertNotIn("ha.example.com", entry["stack"])
        self.assertIn("<origin>/spatial_context_panel.js", entry["stack"])

    def test_nothing_is_written_when_debug_logging_is_off(self) -> None:
        SETTINGS["debug_logging"] = False
        run(debug.async_append_debug_entries(self.hass, [{"event": "x"}]))
        self.assertFalse(self.log.exists())

    def test_an_oversized_entry_is_cut_down_to_its_event_name(self) -> None:
        run(debug.async_append_debug_entries(self.hass, [{"event": "big", "blob": "x" * 20000}]))
        (entry,) = self._lines()
        self.assertEqual((entry["event"], entry["truncated"]), ("big", True))
        self.assertNotIn("blob", entry)

    def test_the_report_scrubs_lines_logged_before_the_scrubbing_existed(self) -> None:
        self.log.write_text(json.dumps({"event": "js_error", "stack": STACK}) + "\nnot json at 10.9.8.7\n")
        report = run(debug.async_build_debug_report(self.hass))
        text = json.dumps(report)
        self.assertNotIn("ha.example.com", text)
        self.assertNotIn("10.9.8.7", text)
        self.assertEqual(report["floors"]["up"]["rooms"], 2)

    def test_the_report_holds_counts_not_names_or_positions(self) -> None:
        report = run(debug.async_build_debug_report(self.hass))
        self.assertEqual(set(report["floors"]["up"]), {"rooms", "walls", "openings", "pins", "has_scale", "has_background", "aligned"})


if __name__ == "__main__":
    unittest.main()
