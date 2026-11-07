"""Loads the links/ package without Home Assistant, for the link tests.

The test package's __path__ points at the real integration folder, so the
providers' relative imports (`.model`, `..zigbee_mesh`) load the real files;
only Home Assistant and the siblings those files touch are stubbed.
"""

from __future__ import annotations

import importlib
import json
import sys
import types
from pathlib import Path
from unittest import mock

import stubs

PACKAGE = "sc_links"
FIXTURES = Path(__file__).resolve().parent / "fixtures" / "home"


class FakeStore:
    """homeassistant.helpers.storage.Store, kept in a class-level dict so a
    second instance with the same key reads what the first one saved."""

    files: dict[str, object] = {}

    def __init__(self, hass, version, key, *args, **kwargs) -> None:
        self.key = key
        self.version = version
        self.pending = None

    async def async_load(self):
        data = FakeStore.files.get(self.key)
        # A JSON round trip, like the real file, so nothing non-serialisable slips through.
        return None if data is None else json.loads(json.dumps(data))

    def async_delay_save(self, data_func, delay=0):
        self.pending = data_func
        FakeStore.files[self.key] = json.loads(json.dumps(data_func()))


def stub_ha() -> None:
    """The Home Assistant modules links/ and zigbee_mesh.py import."""
    stubs.stub_ha_core()
    stubs.stub("homeassistant.components", mqtt=stubs.stub("homeassistant.components.mqtt"))
    stubs.stub(
        "homeassistant.helpers",
        device_registry=stubs.stub("homeassistant.helpers.device_registry"),
    )
    stubs.stub(
        "homeassistant.helpers.event",
        async_call_later=mock.Mock(return_value=mock.Mock()),
        async_track_time_interval=mock.Mock(return_value=mock.Mock()),
    )
    stubs.stub("homeassistant.helpers.start", async_at_started=mock.Mock(return_value=mock.Mock()))
    stubs.stub("homeassistant.helpers.storage", Store=FakeStore)


def load() -> types.SimpleNamespace:
    """Fresh copies of every links module (and the real zigbee_mesh)."""
    for name in list(sys.modules):
        if name == PACKAGE or name.startswith(f"{PACKAGE}."):
            del sys.modules[name]

    stub_ha()

    package = stubs.stub(PACKAGE)
    package.__path__ = [str(stubs.PKG_DIR)]  # type: ignore[attr-defined]
    stubs.stub(f"{PACKAGE}.const", DOMAIN="spatial_context")
    stubs.stub(f"{PACKAGE}.storage", async_get_settings=mock.AsyncMock())

    modules = {
        name: importlib.import_module(f"{PACKAGE}.links.{name}")
        for name in ("model", "common", "zha", "z2m", "thread", "unifi", "store")
    }
    modules["zigbee_mesh"] = sys.modules[f"{PACKAGE}.zigbee_mesh"]
    return types.SimpleNamespace(**modules)


def fixture(name: str):
    """A captured sample-home fixture, or None when it hasn't been captured."""
    path = FIXTURES / name
    if not path.exists():
        return None
    return json.loads(path.read_text())


def zha_infos(zha: dict) -> list[dict]:
    """The ZHA fixture as zha.build_snapshot's input. Diagnostics carry
    `device_id`; zha_device_info calls it device_reg_id."""
    return [{**d, "device_reg_id": d["device_id"]} for d in zha["devices"]]


def thread_inputs(thread: dict) -> tuple[list[dict], list[dict]]:
    """The Matter/Thread fixture as thread.build_snapshots' input."""
    nodes = [
        {
            "node_id": d["node_id"],
            "available": (d.get("node_diagnostics") or {}).get("available"),
            "device_id": d["device_id"],
            "name": d["name"],
            "attributes": d.get("attributes") or {},
        }
        for d in thread["devices"]
    ]
    # The thread integration's mDNS data has no usable extended address in
    # the fixture, so border routers can only be listed, not matched.
    border_routers = [
        {
            "network_name": net["network_name"],
            "name": br["name"],
            "vendor": br["vendor_name"],
            "model": br["model_name"],
            "extended_address": None,
        }
        for net in thread["networks"]
        for br in net["border_routers"]
    ]
    return nodes, border_routers


def wifi_inputs(wifi: dict, mac_key) -> tuple[list[dict], list[dict], dict]:
    """The UniFi fixture as unifi.build_snapshot's input."""
    clients = [
        {
            "mac": c["mac"],
            "ap_mac": c["ap_mac"],
            "signal": c["signal_dbm"],
            "rssi": c["rssi"],
            "name": c["name"],
            "essid": c["essid"],
            "radio": c["radio"],
            "channel": c["channel"],
        }
        for c in wifi["clients"]
    ]
    aps = [{"mac": a["mac"], "name": a["name"], "model": a["model"]} for a in wifi["aps"]]
    devices = {
        mac_key(x["mac"]): (x["ha_device_id"], [x["ha_device_id"]])
        for x in wifi["clients"] + wifi["aps"]
        if x.get("ha_device_id")
    }
    return clients, aps, devices
