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


class CodeFingerprintTest(unittest.TestCase):
    """A restart is only asked for when backend code changed, not for a
    panel-only release that just bumps the version."""

    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.root = Path(self._tmp.name)
        (self.root / "www").mkdir()
        (self.root / "translations").mkdir()
        (self.root / "__init__.py").write_text("x = 1\n")
        (self.root / "services.yaml").write_text("get_map: {}\n")
        (self.root / "translations" / "en.json").write_text("{}")
        (self.root / "www" / "panel.js").write_text("old panel")
        self._manifest("1.0.1-beta.4")
        self.before = debug.code_fingerprint(self.root)

    def _manifest(self, version: str, **extra) -> None:
        (self.root / "manifest.json").write_text(json.dumps({"domain": "spatial_context", "version": version, **extra}))

    def test_a_panel_only_release_keeps_the_fingerprint(self) -> None:
        (self.root / "www" / "panel.js").write_text("new panel")
        self._manifest("1.0.1-beta.5")
        (self.root / "__pycache__").mkdir()
        (self.root / "__pycache__" / "x.json").write_text("noise")
        self.assertEqual(debug.code_fingerprint(self.root), self.before)

    def test_python_services_translations_and_manifest_changes_change_it(self) -> None:
        for change in (
            lambda: (self.root / "__init__.py").write_text("x = 2\n"),
            lambda: (self.root / "services.yaml").write_text("get_map: {fields: {}}\n"),
            lambda: (self.root / "translations" / "en.json").write_text('{"a": 1}'),
            lambda: self._manifest("1.0.1-beta.4", requirements=["x==1"]),
        ):
            before = debug.code_fingerprint(self.root)
            change()
            self.assertNotEqual(debug.code_fingerprint(self.root), before)

    def test_version_info_asks_for_a_restart_only_when_the_code_differs(self) -> None:
        hass = stubs.FakeHass(self._tmp.name)
        hass.data = {"spatial_context": {"loaded_version": "1.0.1-beta.4"}}
        running = debug._LOADED_CODE
        self.addCleanup(setattr, debug, "_LOADED_CODE", running)
        on_disk = debug.code_fingerprint()
        debug._LOADED_CODE = on_disk
        info = run(debug.async_get_version_info(hass))
        self.assertFalse(info["restart_required"])
        self.assertEqual(info["installed_code"], on_disk)
        debug._LOADED_CODE = "0000000000000000"
        self.assertTrue(run(debug.async_get_version_info(hass))["restart_required"])

    def test_without_a_fingerprint_it_falls_back_to_versions(self) -> None:
        hass = stubs.FakeHass(self._tmp.name)
        hass.data = {"spatial_context": {"loaded_version": "0.0.1"}}
        running = debug._LOADED_CODE
        self.addCleanup(setattr, debug, "_LOADED_CODE", running)
        debug._LOADED_CODE = None
        self.assertTrue(run(debug.async_get_version_info(hass))["restart_required"])


if __name__ == "__main__":
    unittest.main()
