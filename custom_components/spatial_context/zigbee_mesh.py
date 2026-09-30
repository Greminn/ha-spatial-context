"""Live Zigbee2MQTT network topology, fetched on demand via MQTT request/response.

The processed network map is cached in `hass.data` once fetched
— not storage.py's Store, since this is live network state, not user-edited
layout. A call may serve the cache instantly or force a fresh MQTT round
trip, per caller request (see `async_get_network_map`'s `force_refresh`) —
letting a scheduled automation (the `refresh_zigbee_mesh` service) pre-warm
the cache well before anyone opens the panel.
"""

from __future__ import annotations

import asyncio
import json
import logging
import math
import time
from dataclasses import dataclass
from typing import Any

from homeassistant.components import mqtt
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from .const import DOMAIN
from .storage import async_get_settings

_LOGGER = logging.getLogger(__name__)

_REQUEST_TOPIC = "zigbee2mqtt/bridge/request/networkmap"
_RESPONSE_TOPIC = "zigbee2mqtt/bridge/response/networkmap"
_CACHE_KEY = "zigbee_mesh_cache"


@dataclass
class _ZigbeeMeshCache:
    """In-memory only — cleared on every HA restart, never persisted."""

    mesh: dict[str, Any] | None = None
    fetched_at: float | None = None  # time.time() epoch seconds


def _cache(hass: HomeAssistant) -> _ZigbeeMeshCache:
    return hass.data.setdefault(DOMAIN, {}).setdefault(_CACHE_KEY, _ZigbeeMeshCache())


def get_cached_network_map(hass: HomeAssistant) -> dict[str, Any] | None:
    """The last successful result, or None — never triggers a scan. Lets the
    panel show a warm cache the moment the Zigbee layer is picked, without
    risking a 1-2 minute MQTT round trip nobody asked for."""
    cache = _cache(hass)
    if cache.mesh is None:
        return None
    return {**cache.mesh, "fetched_at": cache.fetched_at}


async def async_get_network_map(
    hass: HomeAssistant, force_refresh: bool = False
) -> dict[str, Any]:
    """Request Z2M's live network topology, or serve the last successful
    result from cache.

    Returns {"nodes": [{ieee, friendly_name, device_id, type}], "links":
    [{source_ieee, target_ieee, lqi, lqi_readings, parent_child,
    source_device_id, target_device_id}], "fetched_at"} — every neighbor
    pair, unreduced (see `_merge_links`). Deliberately global/
    floor-agnostic, mirroring list_areas/list_placeable_entities — the
    frontend cross-references against placed pins and picks what to draw.
    """
    cache = _cache(hass)
    if not force_refresh and cache.mesh is not None:
        return {**cache.mesh, "fetched_at": cache.fetched_at}

    # `type: raw` polls every router's neighbor/routing table over the air —
    # on a ~70-node mesh a response has been observed taking anywhere from
    # ~90s up to ~130s (confirmed by direct MQTT round-trip testing), so the
    # timeout needs real headroom above the slow end of that range rather
    # than sitting right on top of it — and a larger mesh needs more still,
    # hence it's user-configurable (Settings) rather than a fixed constant.
    settings = await async_get_settings(hass)
    timeout = settings["zigbee_timeout_seconds"]

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
        payload = await asyncio.wait_for(response, timeout=timeout)
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
            "type": node.get("type"),
        }
        for node in nodes
    ]

    out_links = [
        {
            **link,
            "source_device_id": ieee_to_device_id.get(link["source_ieee"]),
            "target_device_id": ieee_to_device_id.get(link["target_ieee"]),
        }
        for link in _merge_links(links)
    ]

    cache.mesh = {"nodes": out_nodes, "links": out_links}
    cache.fetched_at = time.time()
    return {**cache.mesh, "fetched_at": cache.fetched_at}


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


def _merge_links(links: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Collapse Z2M's directed neighbor-table entries into one link per pair.

    Z2M's `raw` networkmap is a full neighbor-table dump: each entry is a
    neighbor (`source`) as listed in the table of the router that was polled
    (`target`), with the LQI *that router* measured. Most router pairs
    therefore appear twice, once from each side.

    No reduction happens here — the frontend decides what to draw, because
    only it knows which floor each device is placed on (issue #27: a
    floor-agnostic "strongest link per source" cap structurally dropped
    every cross-floor link and all but one coordinator link).

    LQI isn't comparable across chipsets — confirmed live: Hue A60 bulbs
    report ~252 for every neighbor regardless of distance, while a TI
    coordinator averages ~60. So each reading is first divided by its
    reporter's scale (see `_reporter_scales`), and a pair's `lqi` is the
    *weaker* corrected reading — the weaker direction is also what
    Zigbee's own link cost uses. `lqi_readings` keeps the raw values.
    """
    readings: dict[tuple[str, str], int] = {}  # (reporter, neighbor) -> LQI
    pairs: dict[frozenset[str], dict[str, Any]] = {}
    for link in links:
        source_ieee = link["sourceIeeeAddr"]
        target_ieee = link["targetIeeeAddr"]
        if source_ieee == target_ieee:
            continue
        lqi = link.get("linkquality")
        if lqi is None:
            lqi = link.get("lqi")
        # An explicit null means "not measured" — leave it out rather than
        # count it as 0, which would drag the pair's weaker side to zero.
        if lqi is not None:
            readings[(target_ieee, source_ieee)] = lqi
        entry = pairs.setdefault(
            frozenset((source_ieee, target_ieee)),
            {
                "source_ieee": source_ieee,
                "target_ieee": target_ieee,
                "parent_child": False,
            },
        )
        # 0 = parent, 1 = child — the actual route for an end device, as
        # opposed to 2 = sibling (merely in range).
        if link.get("relationship") in (0, 1):
            entry["parent_child"] = True

    scale = _reporter_scales(readings)
    out = []
    for pair, entry in pairs.items():
        a, b = tuple(pair)
        raw = [
            (reporter, readings[(reporter, neighbor)])
            for reporter, neighbor in ((a, b), (b, a))
            if (reporter, neighbor) in readings
        ]
        corrected = [
            max(0, min(255, round(lqi / scale.get(reporter, 1.0))))
            for reporter, lqi in raw
        ]
        out.append(
            {
                "source_ieee": entry["source_ieee"],
                "target_ieee": entry["target_ieee"],
                "lqi": min(corrected, default=0),
                "lqi_readings": sorted((lqi for _, lqi in raw), reverse=True),
                "parent_child": entry["parent_child"],
            }
        )
    return out


# Readings below this are "barely heard" (Z-Stack lists stale neighbors at
# 0-1) — too noisy for a ratio, so they don't feed the scale fit.
_MIN_FIT_LQI = 5


def _reporter_scales(readings: dict[tuple[str, str], int]) -> dict[str, float]:
    """Each reporting device's LQI scale factor, estimated from reciprocity.

    Radio links are close to symmetric, so where both ends of a pair
    reported, a consistent ratio between the two readings is the
    reporters' scales differing, not the link: log(reading a→b) −
    log(reading b→a) ≈ log(scale a) − log(scale b). A least-squares fit
    over every two-sided pair (iterated to convergence, centered so the
    typical device is 1.0) recovers each reporter's scale. On a real
    ~70-node mesh it singled out exactly the three saturating Hue A60 bulbs
    (~1.7-2.0x) and the TI coordinator (~0.5x, from 35 pairs).

    Proportional rather than an additive offset, so a barely-heard reading
    of 1 stays near zero instead of being lifted into a usable-looking
    link. A reporter with few two-sided pairs is shrunk toward 1.0 (the
    `+ 2` prior), so a single noisy pair can't swing it; one with none at
    all gets no correction.
    """
    diffs: dict[str, list[tuple[str, float]]] = {}
    for (reporter, neighbor), lqi in readings.items():
        back = readings.get((neighbor, reporter))
        if back is not None and lqi >= _MIN_FIT_LQI and back >= _MIN_FIT_LQI:
            diffs.setdefault(reporter, []).append(
                (neighbor, math.log(lqi) - math.log(back))
            )

    log_scale = dict.fromkeys(diffs, 0.0)
    for _ in range(100):
        new = {
            reporter: sum(d + log_scale[neighbor] for neighbor, d in entries)
            / (len(entries) + 2)
            for reporter, entries in diffs.items()
        }
        mean = sum(new.values()) / len(new) if new else 0.0
        new = {reporter: value - mean for reporter, value in new.items()}
        converged = all(abs(new[r] - log_scale[r]) < 1e-4 for r in new)
        log_scale = new
        if converged:
            break
    return {reporter: math.exp(value) for reporter, value in log_scale.items()}
