"""Wi-Fi link provider: UniFi client -> access point associations.

The port of wifi_mesh.py's UniFi paths into the link model. Two sources,
merged per (client MAC, AP MAC):

- the UniFi integration's own client list (`runtime_data.api.clients`,
  aiounifi), which holds every connected client whether or not its
  device_tracker is enabled, plus `signal` in dBm;
- device_tracker states carrying `ap_mac` (UniFi's client trackers), which
  also cover a client the controller list happens not to hold.

`signal` from aiounifi always fills `rssi_dbm`, also when the tracker
source found the association first. wifi_mesh.py's dedupe dropped the
second sighting and with it the only signal value; that is the Phase 1
RSSI fix, done here by merging instead of skipping. aiounifi's `rssi` is a
positive margin over the noise floor, not dBm, and is kept apart as
`snr_db`.

Integration internals are read through getattr, so a UniFi change degrades
to fewer links, never an error that breaks other layers.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from .common import NodeIndex, all_devices, utc_now_iso
from ..unifi_client import unifi_client_value
from .model import Link, LinkMetrics, LinkNode, LinkSnapshot

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

PROVIDER = "unifi"
NETWORK = "unifi"


def mac_key(value: Any) -> str | None:
    """A MAC in any common spelling as lower-case, colon-separated."""
    if not isinstance(value, str):
        return None
    digits = "".join(ch for ch in value.lower() if ch in "0123456789abcdef")
    if len(digits) != 12:
        return None
    return ":".join(digits[i : i + 2] for i in range(0, 12, 2))


def _dbm(value: Any) -> float | None:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        return None
    # A real Wi-Fi signal is negative dBm; 0 or a positive value is a
    # controller placeholder or the SNR-style `rssi`, not a signal level.
    return float(value) if value < 0 else None


def build_snapshot(
    clients: list[dict[str, Any]],
    access_points: list[dict[str, Any]],
    device_for_mac: dict[str, tuple[str | None, list[str]]] | None = None,
    captured_at: str | None = None,
) -> LinkSnapshot | None:
    """Build the Wi-Fi snapshot, or None when there is nothing to show.

    `clients`: [{mac, ap_mac, signal?, rssi?, name?, essid?, radio?, channel?,
    is_wired?}], from either source, possibly the same client twice.
    `access_points`: [{mac, name, model?}].
    `device_for_mac`: MAC -> (preferred HA device id, every candidate id).
    """
    device_for_mac = device_for_mac or {}
    nodes = NodeIndex()

    def device(mac: str) -> tuple[str | None, list[str]]:
        return device_for_mac.get(mac, (None, []))

    for ap in access_points:
        mac = mac_key(ap.get("mac"))
        if mac is None:
            continue
        device_id, candidates = device(mac)
        nodes.add(
            LinkNode(
                key=mac,
                role="access_point",
                device_id=device_id,
                name=ap.get("name"),
                attrs={"model": ap.get("model"), "device_ids": candidates},
            )
        )

    merged: dict[tuple[str, str], dict[str, Any]] = {}
    for client in clients:
        if client.get("is_wired"):
            continue
        mac = mac_key(client.get("mac"))
        ap_mac = mac_key(client.get("ap_mac"))
        if mac is None or ap_mac is None:
            continue
        entry = merged.setdefault((mac, ap_mac), {})
        for field in ("name", "essid", "radio", "channel"):
            if entry.get(field) is None and client.get(field) is not None:
                entry[field] = client[field]
        signal = _dbm(client.get("signal"))
        if signal is not None:
            entry["signal"] = signal
        snr = client.get("rssi")
        if isinstance(snr, (int, float)) and not isinstance(snr, bool) and snr >= 0:
            entry.setdefault("snr", snr)

    if not merged and not nodes.values():
        return None

    links: list[Link] = []
    for (mac, ap_mac), entry in merged.items():
        device_id, candidates = device(mac)
        nodes.add(
            LinkNode(
                key=mac,
                role="client",
                device_id=device_id,
                name=entry.get("name"),
                attrs={"device_ids": candidates},
            )
        )
        ap_device_id, ap_candidates = device(ap_mac)
        nodes.add(
            LinkNode(
                key=ap_mac,
                role="access_point",
                device_id=ap_device_id,
                attrs={"device_ids": ap_candidates},
            )
        )
        links.append(
            Link(
                source=mac,
                target=ap_mac,
                kind="association",
                metrics=LinkMetrics(rssi_dbm=entry.get("signal")),
                attrs={
                    "essid": entry.get("essid"),
                    "radio": entry.get("radio"),
                    "channel": entry.get("channel"),
                    "snr_db": entry.get("snr"),
                },
            )
        )

    return LinkSnapshot(
        layer="wifi",
        network=NETWORK,
        provider=PROVIDER,
        captured_at=captured_at or utc_now_iso(),
        nodes=nodes.values(),
        links=links,
    )


def _device_for_mac(hass: HomeAssistant, unifi_entry_ids: set[str]) -> dict[str, tuple[str | None, list[str]]]:
    """MAC -> (preferred device id, all candidates).

    The same Wi-Fi client is often two HA devices: UniFi's own client device
    and the one from the integration that controls it (ESPHome, Tuya, ...),
    which is the one a pin is placed for (see wifi_mesh.py). So the device
    that does not come only from UniFi is preferred, and every candidate is
    kept for callers that match against placed pins.
    """
    from homeassistant.helpers import device_registry as dr

    out: dict[str, list[Any]] = {}
    for device in all_devices(dr.async_get(hass)):
        for connection_type, value in device.connections:
            if connection_type != dr.CONNECTION_NETWORK_MAC:
                continue
            mac = mac_key(value)
            if mac is not None:
                out.setdefault(mac, []).append(device)

    result: dict[str, tuple[str | None, list[str]]] = {}
    for mac, devices in out.items():
        # A device belongs to one config entry (HA 2026.8+); prefer the one
        # another integration owns over UniFi's own client device.
        native = [d for d in devices if getattr(d, "config_entry_id", None) not in unifi_entry_ids]
        preferred = (native or devices)[0]
        result[mac] = (preferred.id, [d.id for d in devices])
    return result


def _controller_data(hass: HomeAssistant) -> tuple[list[dict], list[dict], set[str]]:
    """Clients and APs from every loaded UniFi entry's aiounifi controller."""
    from homeassistant.config_entries import ConfigEntryState

    clients: list[dict] = []
    aps: list[dict] = []
    entry_ids: set[str] = set()
    for entry in hass.config_entries.async_entries("unifi"):
        entry_ids.add(entry.entry_id)
        if entry.state is not ConfigEntryState.LOADED:
            continue
        api = getattr(getattr(entry, "runtime_data", None), "api", None)
        for handler_name, sink in (("clients", clients), ("devices", aps)):
            values = getattr(getattr(api, handler_name, None), "values", None)
            if not callable(values):
                continue
            try:
                items = list(values())
            except Exception:  # noqa: BLE001 - internals may change shape
                continue
            for item in items:
                if handler_name == "clients":
                    value = unifi_client_value
                    sink.append(
                        {
                            "mac": value(item, "mac"),
                            "ap_mac": value(item, "ap_mac", "access_point_mac", "ap_mac"),
                            "signal": value(item, "signal"),
                            "rssi": value(item, "rssi"),
                            "is_wired": bool(value(item, "is_wired")),
                            "name": value(item, "name") or value(item, "hostname"),
                            "essid": value(item, "essid"),
                            "radio": value(item, "radio"),
                            "channel": value(item, "channel"),
                        }
                    )
                elif getattr(item, "type", None) == "uap":
                    sink.append(
                        {
                            "mac": getattr(item, "mac", None),
                            "name": getattr(item, "name", None),
                            "model": getattr(item, "model", None),
                        }
                    )
    return clients, aps, entry_ids


def _tracker_clients(hass: HomeAssistant) -> list[dict]:
    """Clients from device_tracker states that carry `ap_mac`."""
    out = []
    for state in hass.states.async_all("device_tracker"):
        if state.state == "not_home":
            continue  # a disconnected client keeps its last ap_mac
        attributes = state.attributes
        if not attributes.get("ap_mac") or not attributes.get("mac"):
            continue
        out.append(
            {
                "mac": attributes.get("mac"),
                "ap_mac": attributes.get("ap_mac"),
                "name": attributes.get("friendly_name") or attributes.get("name"),
                "essid": attributes.get("essid"),
                "radio": attributes.get("radio"),
            }
        )
    return out


async def async_get_snapshots(
    hass: HomeAssistant, *, periodic: bool = False
) -> list[LinkSnapshot]:
    """The UniFi Wi-Fi snapshot, or none without UniFi data."""
    clients, aps, unifi_entry_ids = _controller_data(hass)
    clients.extend(_tracker_clients(hass))
    if not clients and not aps:
        return []
    snapshot = build_snapshot(clients, aps, _device_for_mac(hass, unifi_entry_ids))
    return [snapshot] if snapshot is not None else []
