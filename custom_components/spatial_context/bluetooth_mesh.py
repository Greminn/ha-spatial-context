"""Bluetooth address → HA device candidates, for the Bluetooth layer (#4).

The links themselves come live from HA core's own
`bluetooth/subscribe_advertisements` WebSocket command (what Settings →
Bluetooth → Visualization uses), subscribed directly by the panel — each
advertisement names the BLE device (`address`), the scanner that heard it
(`source`) and its `rssi`. This module only answers "which HA device is
this address?", the same way HA's own visualization does: the device
registry's `bluetooth` connections.

One addition over HA's visualization: a scanner's own device (created by
the `bluetooth` integration for an ESPHome proxy, say) is rarely the one a
person places — they place the proxy's ESPHome device. The scanner device
points at it with `via_device_id` (confirmed live on a house with six
ESPHome proxies), so that parent is offered as a candidate too. As with
wifi_mesh.py, every candidate is returned and the panel draws whichever
one is actually placed.
"""

from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr


def async_get_bluetooth_devices(hass: HomeAssistant) -> dict[str, Any]:
    """Return {"devices": {ADDRESS: [device_id, ...]}}, addresses uppercase
    (as advertisements report them)."""
    device_registry = dr.async_get(hass)
    devices: dict[str, list[str]] = {}
    for device in device_registry.devices.values():
        for connection_type, value in device.connections:
            if connection_type != dr.CONNECTION_BLUETOOTH:
                continue
            candidates = devices.setdefault(value.upper(), [])
            candidates.append(device.id)
            if device.via_device_id and device.via_device_id not in candidates:
                candidates.append(device.via_device_id)
    return {"devices": devices}
