"""Live Wi-Fi client→access-point associations, read from HA's own entity
states — no separate router/controller credentials.

Best-effort, like zigbee_mesh.py's dependency on Z2M: this only produces
links for entities whose current state happens to carry an `ap_mac`
attribute. HA's `unifi` integration does this for every wireless
device_tracker it creates; other router integrations may or may not.
Users without such an integration configured simply get zero links, not
an error.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr, entity_registry as er


def _build_mac_to_device_id(device_registry: dr.DeviceRegistry) -> dict[str, str]:
    """MAC address -> device_id, built once by scanning every device's own
    `connections` set directly.

    Not `device_registry.async_get_device_by_connection()` — recent HA
    versions require a `config_entry_id` argument on that helper (device
    connections are no longer guaranteed unique across config entries, the
    same reality zigbee_mesh.py's IEEE-to-device-id map already works
    around the same way), which doesn't fit this generic "any AP, from any
    integration" lookup at all. Direct iteration + a plain dict avoids that
    entirely and is also just one pass instead of one registry call per
    Wi-Fi client entity.
    """
    mac_to_device_id: dict[str, str] = {}
    for device in device_registry.devices:
        for connection_type, value in device.connections:
            if connection_type == dr.CONNECTION_NETWORK_MAC:
                mac_to_device_id[value] = device.id
    return mac_to_device_id


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
    """
    entity_registry = er.async_get(hass)
    device_registry = dr.async_get(hass)
    signal_by_device = _build_signal_strength_by_device(hass, entity_registry)
    mac_to_device_id = _build_mac_to_device_id(device_registry)

    links: list[dict[str, Any]] = []
    for entry in entity_registry.entities.values():
        if entry.disabled_by is not None or entry.device_id is None:
            continue

        state = hass.states.get(entry.entity_id)
        if state is None:
            continue

        ap_mac = state.attributes.get("ap_mac")
        if not ap_mac:
            continue

        ap_device_id = mac_to_device_id.get(dr.format_mac(ap_mac))
        if ap_device_id is None:
            continue

        links.append(
            {
                "source_device_id": entry.device_id,
                "target_device_id": ap_device_id,
                "rssi_dbm": signal_by_device.get(entry.device_id),
            }
        )

    return {"links": links}
