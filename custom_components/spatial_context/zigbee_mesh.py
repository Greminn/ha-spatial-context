"""Live Zigbee2MQTT network topology, fetched on demand via MQTT request/response.

Deliberately not persisted anywhere — this is live network state, not
user-edited layout, so it has no place in storage.py's Store. Every call
re-requests the network map fresh.
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

from homeassistant.components import mqtt
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

_LOGGER = logging.getLogger(__name__)

_REQUEST_TOPIC = "zigbee2mqtt/bridge/request/networkmap"
_RESPONSE_TOPIC = "zigbee2mqtt/bridge/response/networkmap"
# `type: raw` polls every router's neighbor/routing table over the air —
# on this house's ~70-node mesh a response has been observed taking
# anywhere from ~90s up to ~130s (confirmed by direct MQTT round-trip
# testing), so the timeout needs real headroom above the slow end of that
# range rather than sitting right on top of it.
_RESPONSE_TIMEOUT = 180


async def async_get_network_map(hass: HomeAssistant) -> dict[str, Any]:
    """Request Z2M's live network topology and reduce it to placeable links.

    Returns {"nodes": [{ieee, friendly_name, device_id}], "links": [{source_ieee,
    target_ieee, lqi, source_device_id, target_device_id}]}. Deliberately
    global/floor-agnostic, mirroring list_areas/list_placeable_entities — the
    frontend cross-references against the current floor's placed pins.
    """
    loop = asyncio.get_running_loop()
    response: asyncio.Future[dict[str, Any]] = loop.create_future()

    @callback
    def _on_message(msg: Any) -> None:
        if response.done():
            return
        try:
            payload = json.loads(msg.payload)
        except (json.JSONDecodeError, TypeError):
            return
        response.set_result(payload)

    unsubscribe = await mqtt.async_subscribe(hass, _RESPONSE_TOPIC, _on_message)
    try:
        await mqtt.async_publish(hass, _REQUEST_TOPIC, json.dumps({"type": "raw"}))
        payload = await asyncio.wait_for(response, timeout=_RESPONSE_TIMEOUT)
    finally:
        unsubscribe()

    if payload.get("status") != "ok":
        raise RuntimeError(f"Zigbee2MQTT networkmap request failed: {payload}")

    value = payload["data"]["value"]
    nodes = value.get("nodes", [])
    links = value.get("links", [])

    ieee_to_device_id = _build_ieee_to_device_id_map(hass)

    out_nodes = [
        {
            "ieee": node["ieeeAddr"],
            "friendly_name": node.get("friendlyName", node["ieeeAddr"]),
            "device_id": ieee_to_device_id.get(node["ieeeAddr"]),
        }
        for node in nodes
    ]

    out_links = [
        {
            "source_ieee": link["source_ieee"],
            "target_ieee": link["target_ieee"],
            "lqi": link["lqi"],
            "source_device_id": ieee_to_device_id.get(link["source_ieee"]),
            "target_device_id": ieee_to_device_id.get(link["target_ieee"]),
        }
        for link in _reduce_links(links)
    ]

    return {"nodes": out_nodes, "links": out_links}


def _build_ieee_to_device_id_map(hass: HomeAssistant) -> dict[str, str]:
    """Join key: a Z2M-sourced HA device carries identifier
    ("mqtt", "zigbee2mqtt_<ieeeAddr>") — confirmed live against this
    house's own device registry, not assumed from docs.

    The Zigbee2MQTT Bridge device itself (the coordinator) is the one
    exception: its identifier is "zigbee2mqtt_bridge_<ieeeAddr>", an extra
    "bridge_" segment every other device doesn't have — confirmed live,
    not assumed. A plain `removeprefix("zigbee2mqtt_")` would leave
    "bridge_<ieeeAddr>" for that one device, which never matches the bare
    IEEE address Z2M's networkmap reports for the coordinator node, so
    every link touching the coordinator would silently vanish. Extracting
    from the last "0x" onward handles both forms uniformly.
    """
    device_registry = dr.async_get(hass)
    mapping: dict[str, str] = {}
    for device in device_registry.devices:
        for identifier in device.identifiers:
            # Normally (domain, value), but not every integration's
            # identifiers are a strict 2-tuple — index instead of unpacking.
            if len(identifier) != 2:
                continue
            domain, value = identifier
            if domain != "mqtt" or "zigbee2mqtt" not in value:
                continue
            ieee_start = value.rfind("0x")
            if ieee_start == -1:
                continue
            mapping[value[ieee_start:]] = device.id
    return mapping


def _reduce_links(links: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Keep each source node's single strongest outgoing link.

    Z2M's `raw` networkmap is a full neighbor-table dump (every pair of
    devices within radio range of each other), not the active routing tree.
    Keeping only the highest-linkquality link per source approximates the
    tree Z2M's own map view draws, without needing to parse `routes`.
    """
    best: dict[str, dict[str, Any]] = {}
    for link in links:
        source_ieee = link["sourceIeeeAddr"]
        lqi = link.get("linkquality", link.get("lqi", 0))
        current = best.get(source_ieee)
        if current is None or lqi > current["lqi"]:
            best[source_ieee] = {
                "source_ieee": source_ieee,
                "target_ieee": link["targetIeeeAddr"],
                "lqi": lqi,
            }
    return list(best.values())
