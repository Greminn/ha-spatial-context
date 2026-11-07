"""Tests for the Wi-Fi layer (wifi_mesh.py): client→AP links from tracker
attributes, plus UniFi's own client list.

Runs without Home Assistant installed — the registries, states and the UniFi
hub are small fakes.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import enum
import types
import unittest

import stubs

CLIENT_MAC = "aa:00:00:00:00:01"
AP_MAC = "aa:00:00:00:00:02"


class _State(enum.Enum):
    LOADED = "loaded"
    NOT_LOADED = "not_loaded"


def _load(devices: list, entities: list) -> types.ModuleType:
    device_registry = stubs.stub(
        "homeassistant.helpers.device_registry",
        CONNECTION_NETWORK_MAC="mac",
        format_mac=lambda mac: mac.lower(),
        async_get=lambda hass: types.SimpleNamespace(devices=devices),
        DeviceRegistry=object,
    )
    entity_registry = stubs.stub(
        "homeassistant.helpers.entity_registry",
        async_get=lambda hass: types.SimpleNamespace(
            entities={e.entity_id: e for e in entities}
        ),
        EntityRegistry=object,
    )
    stubs.stub("homeassistant")
    stubs.stub("homeassistant.core", HomeAssistant=object)
    stubs.stub("homeassistant.config_entries", ConfigEntryState=_State)
    stubs.stub(
        "homeassistant.helpers",
        device_registry=device_registry,
        entity_registry=entity_registry,
    )
    stubs.new_package("sc_wifi_test")
    return stubs.load("sc_wifi_test", "wifi_mesh")


def _device(device_id: str, mac: str) -> types.SimpleNamespace:
    return types.SimpleNamespace(
        id=device_id, connections={("mac", mac)}, identifiers=set()
    )


def _entity(entity_id: str, device_id: str) -> types.SimpleNamespace:
    return types.SimpleNamespace(
        entity_id=entity_id,
        device_id=device_id,
        disabled_by=None,
        domain=entity_id.split(".")[0],
    )


class _Hass:
    def __init__(self, states: dict, unifi_clients: list) -> None:
        self.states = types.SimpleNamespace(get=states.get)
        hub = types.SimpleNamespace(
            api=types.SimpleNamespace(
                clients=types.SimpleNamespace(values=lambda: unifi_clients)
            )
        )
        entry = types.SimpleNamespace(state=_State.LOADED, runtime_data=hub)
        self.config_entries = types.SimpleNamespace(
            async_entries=lambda domain: [entry] if domain == "unifi" else []
        )


def _tracker_state() -> types.SimpleNamespace:
    return types.SimpleNamespace(
        state="home", attributes={"mac": CLIENT_MAC, "ap_mac": AP_MAC}
    )


def _client(signal: object) -> types.SimpleNamespace:
    return types.SimpleNamespace(
        is_wired=False, mac=CLIENT_MAC, ap_mac=AP_MAC, signal=signal
    )


class UnifiSignalTest(unittest.TestCase):
    def setUp(self) -> None:
        devices = [_device("client", CLIENT_MAC), _device("ap", AP_MAC)]
        self.wifi_mesh = _load(devices, [_entity("device_tracker.esp", "client")])

    def _links(self, states: dict, clients: list) -> list:
        return self.wifi_mesh.async_get_wifi_mesh(_Hass(states, clients))["links"]

    def test_unifi_signal_fills_in_an_enabled_trackers_link(self) -> None:
        links = self._links({"device_tracker.esp": _tracker_state()}, [_client(-61)])
        self.assertEqual(
            links,
            [{"source_device_id": "client", "target_device_id": "ap", "rssi_dbm": -61}],
        )

    def test_a_signal_sensor_reading_is_kept(self) -> None:
        self.wifi_mesh = _load(
            [_device("client", CLIENT_MAC), _device("ap", AP_MAC)],
            [
                _entity("device_tracker.esp", "client"),
                _entity("sensor.esp_signal", "client"),
            ],
        )
        states = {
            "device_tracker.esp": _tracker_state(),
            "sensor.esp_signal": types.SimpleNamespace(
                state="-48", attributes={"device_class": "signal_strength"}
            ),
        }
        (link,) = self._links(states, [_client(-61)])
        self.assertEqual(link["rssi_dbm"], -48.0)

    def test_a_disabled_tracker_still_gets_a_link_from_unifi(self) -> None:
        (link,) = self._links({}, [_client(-70)])
        self.assertEqual(link["rssi_dbm"], -70)

    def test_unifis_positive_rssi_margin_is_not_used_as_dbm(self) -> None:
        (link,) = self._links({"device_tracker.esp": _tracker_state()}, [_client(35)])
        self.assertIsNone(link["rssi_dbm"])


class AiounifiClientShapeTest(unittest.TestCase):
    """Real aiounifi clients name the AP `access_point_mac` and keep the
    controller's keys (`ap_mac`, `signal`, `is_wired`) in `raw`."""

    def setUp(self) -> None:
        self.wifi_mesh = _load([_device("client", CLIENT_MAC), _device("ap", AP_MAC)], [])

    def test_a_client_shaped_like_aiounifi_gets_its_link(self) -> None:
        client = types.SimpleNamespace(
            mac=CLIENT_MAC,
            access_point_mac=AP_MAC,
            raw={"mac": CLIENT_MAC, "ap_mac": AP_MAC, "is_wired": False, "signal": -64},
        )
        links = self.wifi_mesh.async_get_wifi_mesh(_Hass({}, [client]))["links"]
        self.assertEqual(links, [{"source_device_id": "client", "target_device_id": "ap", "rssi_dbm": -64}])

    def test_a_wired_client_in_raw_is_skipped(self) -> None:
        client = types.SimpleNamespace(raw={"mac": CLIENT_MAC, "ap_mac": AP_MAC, "is_wired": True, "signal": -64})
        links = self.wifi_mesh.async_get_wifi_mesh(_Hass({}, [client]))["links"]
        self.assertEqual(links, [])

if __name__ == "__main__":
    unittest.main()
