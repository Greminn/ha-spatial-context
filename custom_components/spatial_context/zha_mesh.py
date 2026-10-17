"""Live Zigbee network topology from ZHA (#40).

ZHA keeps zigpy's neighbor tables itself and shows them on its own
visualization page (`zha/devices` -> each device's `neighbors`), so unlike
Zigbee2MQTT there is no MQTT request to make: the topology is read straight
from the running ZHA gateway, and a refresh asks zigpy to re-scan it.

The result has exactly the shape zigbee_mesh.py returns for Zigbee2MQTT —
nodes and unreduced pairs — and goes through the same `_merge_links`, so
the panel draws it unchanged.

Uses ZHA's own `get_zha_gateway_proxy` and each device proxy's
`zha_device_info` (the dict ZHA's websocket API sends its frontend), not a
documented integration API: if ZHA changes them, the failure surfaces as an
error on the panel's Zigbee layer, and nothing else is affected.
"""

from __future__ import annotations

import asyncio
import logging
from collections.abc import Callable
from typing import Any

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

# zigpy's neighbor relationship names -> Z2M's numeric codes, which
# `_merge_links` reads (0 = parent, 1 = child, 2 = sibling).
_RELATIONSHIP = {"Parent": 0, "Child": 1}


def _gateway_proxy(hass: HomeAssistant) -> Any:
    from homeassistant.components.zha.helpers import get_zha_gateway_proxy

    return get_zha_gateway_proxy(hass)


def _device_infos(hass: HomeAssistant) -> list[dict[str, Any]]:
    proxy = _gateway_proxy(hass)
    return [d.zha_device_info for d in proxy.device_proxies.values()]


async def async_fetch_zha_mesh(
    hass: HomeAssistant,
    force_refresh: bool,
    timeout: float,
    merge_links: Callable[[list[dict[str, Any]]], list[dict[str, Any]]],
) -> dict[str, Any]:
    """Nodes and merged links from ZHA's topology, scanning first when asked
    (or when nothing has been scanned yet)."""
    infos = _device_infos(hass)
    if force_refresh or not any(info.get("neighbors") for info in infos):
        topology = _gateway_proxy(hass).gateway.application_controller.topology
        _LOGGER.debug("Scanning ZHA topology (timeout %ss)", timeout)
        await asyncio.wait_for(topology.scan(), timeout=timeout)
        infos = _device_infos(hass)

    nodes = [
        {
            "ieee": str(info["ieee"]),
            "friendly_name": info.get("user_given_name") or info.get("name"),
            "device_id": info.get("device_reg_id"),
            "type": info.get("device_type"),
        }
        for info in infos
    ]
    device_id_by_ieee = {node["ieee"]: node["device_id"] for node in nodes}

    # Each entry is a neighbor listed in a reporting device's table — the
    # same meaning as a Z2M `raw` link (source = neighbor, target = reporter).
    raw_links = []
    for info in infos:
        reporter = str(info["ieee"])
        for neighbor in info.get("neighbors") or []:
            try:
                lqi = int(neighbor["lqi"])
            except (KeyError, TypeError, ValueError):
                lqi = None
            raw_links.append(
                {
                    "sourceIeeeAddr": str(neighbor["ieee"]),
                    "targetIeeeAddr": reporter,
                    "linkquality": lqi,
                    "relationship": _RELATIONSHIP.get(
                        neighbor.get("relationship"), 2
                    ),
                }
            )

    links = [
        {
            **link,
            "source_device_id": device_id_by_ieee.get(link["source_ieee"]),
            "target_device_id": device_id_by_ieee.get(link["target_ieee"]),
        }
        for link in merge_links(raw_links)
    ]
    return {"nodes": nodes, "links": links}
