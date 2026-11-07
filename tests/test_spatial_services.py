"""Services (services.py) for the spatial engine, with Home Assistant
stubbed: get_map with no fields is the plain export, its fields go through
map_view; `query` is admin-only and response-only; `update_settings` keeps
fields it is not given. Also the WebSocket settings save keeping settings
the panel does not send, and the links adapter's fallbacks.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import sys
import types
import unittest

import stubs

try:
    import voluptuous as vol
except ModuleNotFoundError:  # pragma: no cover - CI installs it
    vol = None


_Unauthorized = stubs.Unauthorized
_UnknownUser = stubs.UnknownUser
_HAError = stubs.HomeAssistantError


class _Hass:
    def __init__(self) -> None:
        self.registered: dict = {}
        self.services = types.SimpleNamespace(async_register=self._register)
        self.auth = types.SimpleNamespace(async_get_user=self._get_user)
        self.users = {
            "admin": types.SimpleNamespace(is_admin=True),
            "user": types.SimpleNamespace(is_admin=False),
        }

    def _register(self, domain, service, handler, schema=None, supports_response=None) -> None:
        self.registered[service] = (handler, schema, supports_response)

    async def _get_user(self, user_id):
        return self.users.get(user_id)


def _call(data=None, user_id=None):
    return types.SimpleNamespace(data=data or {}, context=types.SimpleNamespace(user_id=user_id))


@unittest.skipIf(vol is None, "voluptuous is not installed")
class ServicesTest(unittest.TestCase):
    def setUp(self) -> None:
        self.calls: list = []
        self.saved: dict = {}
        self.full_map = {"floors": [], "outdoor_devices": [], "marker": object()}

        async def get_map(hass):
            self.calls.append("get_map")
            return self.full_map

        async def get_view(hass, **kwargs):
            self.calls.append(("view", kwargs))
            if kwargs.get("floor") == "nope":
                raise MapFilterError("No floor matches 'nope'")
            return {"view": kwargs}

        async def run_tool(hass, tool, args):
            self.calls.append(("query", tool, args))
            if args.get("device") == "missing":
                raise NotFound("No device matches 'missing'")
            return {"tool": tool}

        async def get_settings(hass):
            return {"unit_system": "metric", "llm_tools_enabled": False, "floor_height_m": 3.0}

        async def save_settings(hass, settings):
            self.saved = settings

        class MapFilterError(ValueError):
            pass

        class NotFound(LookupError):
            pass

        stubs.stub_ha_core()
        stubs.stub_ha_services()
        pkg = "sc_spatial_services_test"
        stubs.new_package(pkg)
        stubs.new_package(f"{pkg}.spatial")
        stubs.stub(f"{pkg}.const", DOMAIN="spatial_context")
        stubs.stub(f"{pkg}.export", async_get_map_data=get_map)
        stubs.stub(f"{pkg}.zigbee_mesh", async_get_network_map=None)
        stubs.stub(f"{pkg}.storage", async_get_settings=get_settings, async_save_settings=save_settings)
        stubs.stub(
            f"{pkg}.spatial.ai",
            TOOLS=("summary", "device_context", "path", "weak_links", "room"),
            NotFound=NotFound,
            async_run_tool=run_tool,
        )
        stubs.stub(f"{pkg}.spatial.map_view", MapFilterError=MapFilterError, async_get_map_view=get_view)
        services = stubs.load(pkg, "services")
        self.hass = _Hass()
        asyncio.run(services.async_setup_services(self.hass))

    def _run(self, service, data=None, user_id=None):
        handler, schema, _ = self.hass.registered[service]
        return asyncio.run(handler(_call(schema(data or {}) if schema else data, user_id)))

    def test_get_map_without_fields_is_the_plain_export(self) -> None:
        self.assertIs(self._run("get_map"), self.full_map)
        self.assertEqual(self.calls, ["get_map"])

    def test_get_map_fields(self) -> None:
        result = self._run("get_map", {"floor": "Main", "compact": True})
        self.assertEqual(result["view"]["floor"], "Main")
        self.assertTrue(result["view"]["compact"])
        self.assertFalse(result["view"]["include_links"])
        with self.assertRaises(_HAError):
            self._run("get_map", {"floor": "nope"})
        with self.assertRaises(vol.Invalid):
            self._run("get_map", {"floors": "x"})

    def test_query_is_admin_only_and_response_only(self) -> None:
        _, schema, response = self.hass.registered["query"]
        self.assertEqual(response, "only")
        self.assertEqual(self._run("query", {"tool": "summary"}, "admin"), {"tool": "summary"})
        self.assertEqual(self._run("query", {"tool": "summary"}), {"tool": "summary"})  # automation
        with self.assertRaises(_Unauthorized):
            self._run("query", {"tool": "summary"}, "user")
        with self.assertRaises(_UnknownUser):
            self._run("query", {"tool": "summary"}, "ghost")
        with self.assertRaises(_HAError):
            self._run("query", {"tool": "device_context", "device": "missing"})
        with self.assertRaises(vol.Invalid):
            schema({"tool": "drop_tables"})
        self.assertEqual(self.calls[0], ("query", "summary", {}))

    def test_update_settings_keeps_what_it_is_not_given(self) -> None:
        self._run("update_settings", {"llm_tools_enabled": True}, "admin")
        self.assertEqual(self.saved, {"unit_system": "metric", "llm_tools_enabled": True, "floor_height_m": 3.0})
        with self.assertRaises(vol.Invalid):
            self._run("update_settings", {"floor_height_m": 50})
        with self.assertRaises(_Unauthorized):
            self._run("update_settings", {"llm_tools_enabled": True}, "user")


@unittest.skipIf(vol is None, "voluptuous is not installed")
class SaveSettingsTest(unittest.TestCase):
    def test_settings_the_panel_does_not_send_are_kept(self) -> None:
        saved: dict = {}
        stored = {"unit_system": "imperial", "llm_tools_enabled": True, "floor_height_m": 2.7, "weak_link_threshold_db": 10}

        async def get_settings(hass):
            return dict(stored)

        async def save_settings(hass, settings):
            saved.update(settings)

        def websocket_command(schema):
            def decorate(func):
                func.schema = vol.Schema(schema)
                return func

            return decorate

        pkg = "sc_settings_test"
        stubs.new_package(pkg)
        stubs.stub_ha_core()
        ws = stubs.stub(
            "homeassistant.components.websocket_api",
            websocket_command=websocket_command,
            async_response=lambda f: f,
            require_admin=lambda f: f,
            ActiveConnection=object,
        )
        stubs.stub("homeassistant.components", websocket_api=ws)
        for sibling in ("bluetooth_mesh", "debug", "registry_snapshot", "wifi_mesh", "zigbee_mesh"):
            stubs.stub(f"{pkg}.{sibling}")
        stubs.stub(f"{pkg}.export", async_get_map_data=None)
        stubs.stub(
            f"{pkg}.storage",
            async_get_settings=get_settings,
            async_save_settings=save_settings,
            **{
                name: None
                for name in (
                    "async_get_floor_layout",
                    "async_get_property_layout",
                    "async_save_floor_layout",
                    "async_save_property_layout",
                    "async_set_floor_building_id",
                )
            },
        )
        api = stubs.load(pkg, "websocket_api")
        # Exactly what the panel sends today (ha-client.ts saveSettings).
        msg = api.ws_save_settings.schema(
            {
                "type": "spatial_context/save_settings",
                "unit_system": "metric",
                "zigbee_timeout_seconds": 180,
                "floor_order": "top_down",
                "zigbee_coordinator_device_id": None,
                "thread_border_router_device_id": None,
                "auto_save": True,
                "debug_logging": False,
            }
        )
        msg["id"] = 1
        connection = types.SimpleNamespace(send_result=lambda *a: None)
        asyncio.run(api.ws_save_settings(object(), connection, msg))
        self.assertEqual(saved["unit_system"], "metric")
        self.assertTrue(saved["llm_tools_enabled"])
        self.assertEqual(saved["floor_height_m"], 2.7)
        # Settings with a schema default behave as before: reset when omitted.
        self.assertEqual(saved["weak_link_threshold_db"], 25)
        with self.assertRaises(vol.Invalid):
            api.ws_save_settings.schema({**msg, "floor_height_m": 0.5})


class LinksAdapterTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        import spatial_support

        cls.sp = spatial_support.load_spatial()

    def test_zigbee_cache_becomes_a_snapshot(self) -> None:
        mesh = {
            "nodes": [
                {"ieee": "aa", "friendly_name": "Coord", "device_id": "c", "type": "Coordinator"},
                {"ieee": "bb", "friendly_name": "Plug", "device_id": "p", "type": "Router"},
                {"ieee": "cc", "friendly_name": "Sensor", "device_id": "s", "type": "EndDevice"},
            ],
            "links": [
                {"source_ieee": "aa", "target_ieee": "bb", "lqi": 120, "lqi_readings": [200, 130], "parent_child": False},
                {"source_ieee": "bb", "target_ieee": "cc", "lqi": 90, "lqi_readings": [90], "parent_child": True},
            ],
            "fetched_at": 1_700_000_000,
        }
        snap = self.sp.adapter.zigbee_snapshot(mesh)
        self.assertEqual([n.role for n in snap.nodes], ["coordinator", "router", "end_device"])
        neighbor, parent = snap.links
        self.assertEqual((neighbor.kind, neighbor.metrics.lqi_norm, neighbor.metrics.lqi), ("neighbor", 120.0, 130))
        self.assertEqual((parent.source, parent.target, parent.kind), ("cc", "bb", "parent"))
        self.assertTrue(snap.captured_at.startswith("2023-11-14"))

    def test_wifi_links_become_associations(self) -> None:
        snap = self.sp.adapter.wifi_snapshot(
            {"links": [{"source_device_id": "phone", "target_device_id": "ap1", "rssi_dbm": -61}]}
        )
        roles = {n.key: n.role for n in snap.nodes}
        self.assertEqual(roles, {"ap1": "access_point", "phone": "client"})
        self.assertEqual(snap.links[0].metrics.rssi_dbm, -61)

    def test_the_link_store_wins_when_present(self) -> None:
        pkg = self.sp.adapter.__name__.rsplit(".", 2)[0]
        marker = [object()]

        async def from_store(hass):
            return marker

        store = stubs.stub(f"{pkg}.links.store", async_get_snapshots=from_store)
        sys.modules[f"{pkg}.links"].store = store
        try:
            self.assertEqual(asyncio.run(self.sp.adapter.async_get_snapshots(object())), marker)
        finally:
            del sys.modules[f"{pkg}.links.store"]
            delattr(sys.modules[f"{pkg}.links"], "store")


if __name__ == "__main__":
    unittest.main()
