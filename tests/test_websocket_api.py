"""Tests for the WebSocket API (websocket_api.py).

Two kinds of check:

- Admin gating, read from the source. Every command except `version` must carry
  `require_admin`, so a command added later without it fails here. Needs nothing
  installed.
- The size limits on saves, run against the real schemas. Needs `voluptuous`
  (a dependency of Home Assistant), and is skipped without it.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import ast
import unittest

import stubs

try:
    import voluptuous as vol
except ModuleNotFoundError:  # pragma: no cover - CI installs it
    vol = None

OPEN_COMMANDS = {"spatial_context/version"}


def _commands() -> dict[str, set[str]]:
    """Command type -> the names of the decorators on its handler."""
    tree = ast.parse((stubs.PKG_DIR / "websocket_api.py").read_text())
    found: dict[str, set[str]] = {}
    for node in ast.walk(tree):
        if not isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            continue
        names: set[str] = set()
        command = None
        for decorator in node.decorator_list:
            target = decorator.func if isinstance(decorator, ast.Call) else decorator
            if isinstance(target, ast.Attribute):
                names.add(target.attr)
            if isinstance(decorator, ast.Call) and getattr(decorator.func, "attr", "") == "websocket_command":
                for const in ast.walk(decorator):
                    if isinstance(const, ast.Constant) and str(const.value).startswith("spatial_context/"):
                        command = const.value
        if command:
            found[command] = names
    return found


class AdminGatingTest(unittest.TestCase):
    def test_every_command_but_version_requires_admin(self) -> None:
        commands = _commands()
        self.assertGreaterEqual(len(commands), 15)
        ungated = sorted(
            name
            for name, decorators in commands.items()
            if name not in OPEN_COMMANDS and "require_admin" not in decorators
        )
        self.assertEqual(ungated, [], "commands any logged-in user could call")

    def test_the_panel_itself_is_admin_only(self) -> None:
        source = (stubs.PKG_DIR / "frontend.py").read_text()
        self.assertIn("require_admin=True", source)
        self.assertNotIn("require_admin=False", source)


@unittest.skipIf(vol is None, "voluptuous is not installed")
class SaveLimitsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        def websocket_command(schema):
            def decorate(func):
                func.schema = vol.Schema(schema)
                return func

            return decorate

        stubs.new_package("sc_ws_test")
        stubs.stub("homeassistant")
        stubs.stub("homeassistant.core", HomeAssistant=object, callback=lambda f: f)
        ws = stubs.stub(
            "homeassistant.components.websocket_api",
            websocket_command=websocket_command,
            async_response=lambda f: f,
            require_admin=lambda f: f,
            ActiveConnection=object,
        )
        stubs.stub("homeassistant.components", websocket_api=ws)
        for sibling in ("bluetooth_mesh", "debug", "registry_snapshot", "wifi_mesh", "zigbee_mesh"):
            stubs.stub(f"sc_ws_test.{sibling}")
        stubs.stub("sc_ws_test.export", async_get_map_data=None)
        stubs.stub(
            "sc_ws_test.storage",
            **{
                name: None
                for name in (
                    "async_get_floor_layout",
                    "async_get_property_layout",
                    "async_get_settings",
                    "async_save_floor_layout",
                    "async_save_property_layout",
                    "async_save_settings",
                    "async_set_floor_building_id",
                )
            },
        )
        cls.api = stubs.load("sc_ws_test", "websocket_api")

    def _layout(self, **overrides) -> dict:
        message = {
            "type": "spatial_context/save_layout",
            "floor_id": "up",
            "background_image_id": None,
            "background_opacity": 0.5,
            "background_offset_x": 0,
            "background_offset_y": 0,
            "background_scale": 1,
            "building_id": None,
            "view_box": None,
            "rooms": [],
            "pins": [],
            "walls": [],
            "openings": [],
            "scale": None,
        }
        message.update(overrides)
        return message

    def _validate(self, message: dict) -> None:
        self.api.ws_save_layout.schema(message)

    def test_an_ordinary_layout_is_accepted(self) -> None:
        room = {"id": "r1", "name": "Lounge", "points": [[0, 0], [10, 0], [10, 10]]}
        pin = {"id": "p1", "device_id": "abc", "x": 1, "y": 2}
        wall = {"id": "w1", "material": "glass", "points": [[0, 0], [5, 0]]}
        self._validate(self._layout(rooms=[room], pins=[pin], walls=[wall]))

    def test_too_many_rooms_are_refused(self) -> None:
        room = {"id": "r", "name": "x", "points": []}
        with self.assertRaises(vol.Invalid):
            self._validate(self._layout(rooms=[room] * (self.api._MAX_ITEMS + 1)))

    def test_a_huge_polygon_is_refused(self) -> None:
        room = {"id": "r", "name": "x", "points": [[0, 0]] * 10001}
        with self.assertRaises(vol.Invalid):
            self._validate(self._layout(rooms=[room]))

    def test_a_very_long_name_is_refused(self) -> None:
        room = {"id": "r", "name": "x" * 257, "points": []}
        with self.assertRaises(vol.Invalid):
            self._validate(self._layout(rooms=[room]))

    def test_a_very_long_floor_id_is_refused(self) -> None:
        with self.assertRaises(vol.Invalid):
            self._validate(self._layout(floor_id="f" * 257))

    def test_property_placements_are_limited_too(self) -> None:
        message = {
            "type": "spatial_context/save_property_layout",
            "background_image_id": None,
            "background_opacity": 0.5,
            "background_offset_x": 0,
            "background_offset_y": 0,
            "background_scale": 1,
            "view_box": None,
            "placements": [{}] * (self.api._MAX_ITEMS + 1),
        }
        with self.assertRaises(vol.Invalid):
            self.api.ws_save_property_layout.schema(message)

    def test_the_debug_log_batch_is_limited(self) -> None:
        entries = [{"event": "e"}] * 201
        with self.assertRaises(vol.Invalid):
            self.api.ws_debug_log.schema({"type": "spatial_context/debug_log", "entries": entries})


if __name__ == "__main__":
    unittest.main()
