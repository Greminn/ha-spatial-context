"""Live Wi-Fi client→access-point associations, read from HA's own entity
states — no separate router/controller credentials.

Best-effort, like zigbee_mesh.py's dependency on Z2M: this only produces
links for entities whose current state happens to carry an `ap_mac`
attribute. HA's `unifi` integration does this for every wireless
device_tracker it creates; other router integrations may or may not.
Users without such an integration configured simply get zero links, not
an error. TP-Link Omada is the one exception, read from its integration's
own client data instead (see `_omada_links`).
"""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er


def _build_mac_to_device_ids(device_registry: dr.DeviceRegistry) -> dict[str, list[str]]:
    """MAC address -> every device_id that claims that connection, built
    once by scanning every device's own `connections` set directly.

    Not just an AP-side lookup: the SAME physical Wi-Fi client is very
    commonly registered as *two* separate HA devices — one from the
    `unifi` integration's own client-tracking (which is what a
    device_tracker entity's own `device_id` points at), and one from
    whatever integration natively controls it (esphome, hue, tuya, ...),
    which is almost always the device a pin actually gets placed for.
    Confirmed live: this house's "Kitchen Presence Sensor" exists as two
    separate device registry entries, one per integration, both carrying
    the identical MAC in `connections`. A single mac -> device_id dict
    would silently pick whichever device happened to be registered last;
    returning every candidate and letting the frontend match against
    whichever one actually has a placed pin sidesteps that ambiguity
    entirely (see `async_get_wifi_mesh`).

    Not `device_registry.async_get_device_by_connection()` either — recent
    HA versions require a `config_entry_id` argument on that helper
    (device connections are no longer guaranteed unique across config
    entries, the same reality zigbee_mesh.py's IEEE-to-device-id map
    already works around the same way), which doesn't fit this generic
    "any device, from any integration" lookup at all. Direct iteration +
    a plain dict avoids that entirely and is also just one pass instead of
    one registry call per Wi-Fi client entity.
    """
    mac_to_device_ids: dict[str, list[str]] = {}
    for device in device_registry.devices:
        for connection_type, value in device.connections:
            if connection_type == dr.CONNECTION_NETWORK_MAC:
                mac_to_device_ids.setdefault(dr.format_mac(value), []).append(device.id)
        # TP-Link Deco (custom tplink_deco integration) registers each node
        # by an identifier holding its MAC, with no `connections` at all —
        # index, don't unpack: some integrations (goecharger_api2) register
        # identifiers longer than the usual (domain, id) pair, matching the
        # same defensive style zigbee_mesh.py's IEEE-to-device-id map uses.
        for identifier in device.identifiers:
            if len(identifier) > 1 and identifier[0] == "tplink_deco":
                mac_to_device_ids.setdefault(dr.format_mac(identifier[1]), []).append(device.id)
    return mac_to_device_ids


def _build_signal_strength_by_device(hass: HomeAssistant, entity_registry: er.EntityRegistry) -> dict[str, float]:
    """device_id -> dBm, from any entity with the standard `signal_strength`
    device_class on that same device.

    Deliberately same-device-id only — a device_tracker's client and its
    own self-reported wifi signal can live on different device registry
    entries across integrations/platforms (confirmed live: this house's
    unifi-tracked "Cat Feeder 2" and its petkit-reported RSSI sensor are
    two separate devices, even sharing the same MAC in `connections`).
    Reconciling that with a heuristic cross-device join would be exactly
    the kind of fragile device-identity guessing this house has been
    burned by before (ZHA/Z2M label loss, duplicate entity IDs after
    reflashes) — so this only ever wins when a single integration reports
    both, and stays silent (not wrong) otherwise.
    """
    signal_by_device: dict[str, float] = {}
    for entry in entity_registry.entities.values():
        if entry.disabled_by is not None or entry.device_id is None:
            continue
        if entry.domain != "sensor":
            continue
        state = hass.states.get(entry.entity_id)
        if state is None or state.attributes.get("device_class") != "signal_strength":
            continue
        try:
            signal_by_device[entry.device_id] = float(state.state)
        except ValueError:
            continue
    return signal_by_device


def async_get_wifi_mesh(hass: HomeAssistant) -> dict[str, Any]:
    """Return {"links": [{"source_device_id", "target_device_id", "rssi_dbm"}]}.

    No "nodes" — the frontend's mesh-link resolution only ever reads
    `.links`, so there's nothing else worth building here.

    Both ends are resolved via MAC (the client's own `mac` state attribute,
    and the AP's `ap_mac`), not via any entity's own `device_id` — a
    device_tracker's `device_id` points at the `unifi`-integration's own
    client-tracking device, which is frequently a *different* HA device
    than the one a pin actually gets placed for (see
    `_build_mac_to_device_ids`). Since a MAC can resolve to more than one
    candidate device, one link is emitted per (client candidate, AP
    candidate) pair — harmless duplication, since the frontend only ever
    draws a link when both ends also resolve to a placed pin, so every
    candidate except the one actually placed simply fails to match anything.
    """
    entity_registry = er.async_get(hass)
    device_registry = dr.async_get(hass)
    signal_by_device = _build_signal_strength_by_device(hass, entity_registry)
    mac_to_device_ids = _build_mac_to_device_ids(device_registry)

    links: list[dict[str, Any]] = []
    for entry in entity_registry.entities.values():
        if entry.disabled_by is not None:
            continue

        state = hass.states.get(entry.entity_id)
        if state is None:
            continue
        # TP-Link Deco (custom tplink_deco) keeps the last `deco_mac` on
        # disconnected clients, so a stale/away tracker would otherwise
        # draw a phantom link.
        if state.state == "not_home":
            continue

        # TP-Link Deco names the parent node `deco_mac` instead of UniFi's
        # `ap_mac`; a Deco node's own tracker carries its uplink node there
        # too, so this also draws the mesh backhaul (satellite -> main node).
        ap_mac = state.attributes.get("ap_mac") or state.attributes.get("deco_mac")
        client_mac = state.attributes.get("mac")
        if not ap_mac or not client_mac:
            continue

        client_device_ids = mac_to_device_ids.get(dr.format_mac(client_mac), [])
        ap_device_ids = mac_to_device_ids.get(dr.format_mac(ap_mac), [])
        if not client_device_ids or not ap_device_ids:
            continue

        for client_device_id in client_device_ids:
            for ap_device_id in ap_device_ids:
                links.append(
                    {
                        "source_device_id": client_device_id,
                        "target_device_id": ap_device_id,
                        "rssi_dbm": signal_by_device.get(client_device_id),
                    }
                )

    links.extend(_omada_links(hass, mac_to_device_ids, links))
    links.extend(_unifi_client_links(hass, mac_to_device_ids, links))
    return {"links": links}


def _unifi_client_links(
    hass: HomeAssistant,
    mac_to_device_ids: dict[str, list[str]],
    existing: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Client→AP links for UniFi clients whose device_tracker is disabled.

    The attribute loop above only sees *enabled* trackers — a disabled
    entity has no state, so its `ap_mac` is invisible (seen live: two ESP
    devices with no Wi-Fi link for exactly that reason). The UniFi
    integration still polls every connected client regardless of which
    entities are enabled, in its hub's `api.clients` (aiounifi).

    Same caveat as `_omada_links`: integration internals, not a public API,
    so everything is getattr-guarded and degrades to zero extra links.
    Deduplicated against links already found.
    """
    seen = {(link["source_device_id"], link["target_device_id"]) for link in existing}
    links: list[dict[str, Any]] = []
    for entry in hass.config_entries.async_entries("unifi"):
        if entry.state is not ConfigEntryState.LOADED:
            continue
        api = getattr(getattr(entry, "runtime_data", None), "api", None)
        clients = getattr(api, "clients", None)
        values = getattr(clients, "values", None)
        if not callable(values):
            continue
        try:
            client_list = list(values())
        except Exception:  # noqa: BLE001 - internals may change shape; never break the Wi-Fi layer
            continue
        for client in client_list:
            if getattr(client, "is_wired", False):
                continue
            client_mac = getattr(client, "mac", None)
            ap_mac = getattr(client, "ap_mac", None)
            if not client_mac or not ap_mac:
                continue
            # UniFi's `signal` is dBm (negative); its `rssi` is a positive
            # margin over noise, so only `signal` maps onto our dBm scale.
            signal = getattr(client, "signal", None)
            rssi_dbm = signal if isinstance(signal, (int, float)) and signal < 0 else None
            for client_device_id in mac_to_device_ids.get(dr.format_mac(client_mac), []):
                for ap_device_id in mac_to_device_ids.get(dr.format_mac(ap_mac), []):
                    if (client_device_id, ap_device_id) in seen:
                        continue
                    seen.add((client_device_id, ap_device_id))
                    links.append(
                        {
                            "source_device_id": client_device_id,
                            "target_device_id": ap_device_id,
                            "rssi_dbm": rssi_dbm,
                        }
                    )
    return links


def _omada_links(
    hass: HomeAssistant,
    mac_to_device_ids: dict[str, list[str]],
    existing: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """Client→AP links from HA core's `tplink_omada` integration (#31).

    Omada's device_trackers carry no `ap_mac` and are disabled by default,
    so the attribute loop above finds nothing — but the integration's own
    clients coordinator already polls every wireless client with `mac`,
    `ap_mac` and `rssi` (dBm). Reading it costs no extra controller
    requests and needs no credentials.

    Not a public API: `runtime_data.clients_coordinator` is the
    integration's internals (patch contributed with #31, against Omada
    Software Controller v6 / EAP613). Everything is `getattr`-guarded so a
    future core change degrades to zero Omada links, never an error.
    """
    seen = {(link["source_device_id"], link["target_device_id"]) for link in existing}
    links: list[dict[str, Any]] = []
    # async_entries + a state check, not async_loaded_entries — that helper
    # is newer than this integration's minimum HA version (hacs.json).
    for entry in hass.config_entries.async_entries("tplink_omada"):
        if entry.state is not ConfigEntryState.LOADED:
            continue
        controller = getattr(entry, "runtime_data", None)
        coordinator = getattr(controller, "clients_coordinator", None)
        clients = getattr(coordinator, "data", None) or {}
        for client in clients.values() if isinstance(clients, dict) else clients:
            client_mac = getattr(client, "mac", None)
            ap_mac = getattr(client, "ap_mac", None)  # wired clients have none
            if not client_mac or not ap_mac:
                continue
            rssi = getattr(client, "rssi", None)
            for client_device_id in mac_to_device_ids.get(dr.format_mac(client_mac), []):
                for ap_device_id in mac_to_device_ids.get(dr.format_mac(ap_mac), []):
                    if (client_device_id, ap_device_id) in seen:
                        continue
                    seen.add((client_device_id, ap_device_id))
                    links.append(
                        {
                            "source_device_id": client_device_id,
                            "target_device_id": ap_device_id,
                            "rssi_dbm": rssi if isinstance(rssi, (int, float)) else None,
                        }
                    )
    return links
