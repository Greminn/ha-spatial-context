"""ZHA link provider: zigpy's neighbour and route tables as a LinkSnapshot.

Reads what ZHA already holds, through the same `zha_device_info` dict ZHA's
own websocket API sends its network visualization page. Nothing is scanned
here: zigpy refreshes its topology on its own schedule (and zha_mesh.py's
panel path can ask for a scan), so a periodic refresh of this provider costs
no radio traffic at all.

Not a documented integration API (see zha_mesh.py): if ZHA changes these
dicts, the failure lands in the snapshot's `errors` and nothing else breaks.
"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from ..zigbee_mesh import _STALE_LQI, _reporter_scales
from .common import NodeIndex, utc_now_iso
from .model import Link, LinkMetrics, LinkNode, LinkSnapshot, Role

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

PROVIDER = "zha"
NETWORK = "zha"

_ROLE: dict[str, Role] = {
    "Coordinator": "coordinator",
    "Router": "router",
    "EndDevice": "end_device",
}

# zigpy's Neighbor.Relationship names. PreviousChild is a device that has
# since left this parent: zigpy keeps the row, but it is history, not a link
# (the Phase 1 stale-relationship fix drops it the same way).
_RELATIONSHIP = {
    "Parent": "parent",
    "Child": "child",
    "Sibling": "sibling",
    "NoneOfTheAbove": "none",
}
_DROPPED_RELATIONSHIPS = {"PreviousChild"}

# Route rows that describe a usable path. Discovery_Underway, Discovery_Failed,
# Inactive and Validation_Underway are not (yet) routes.
_ACTIVE_ROUTE = "Active"


def nwk_key(value: Any) -> str | None:
    """A zigpy NWK (int, NWK object, "0x4ef3" or "4EF3") as "0x4EF3"."""
    if value is None:
        return None
    if isinstance(value, int):
        number = value
    else:
        text = str(value).strip()
        try:
            number = int(text, 16)
        except ValueError:
            return None
    if not 0 <= number <= 0xFFFF:
        return None
    return f"0x{number:04X}"


def _int_or_none(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def build_snapshot(
    infos: list[dict[str, Any]], captured_at: str | None = None
) -> LinkSnapshot:
    """Turn ZHA's per-device info dicts into one snapshot.

    Each device is keyed by its NWK. Neighbour rows name the neighbour by
    IEEE and NWK; the IEEE is looked up in the device list first, because a
    device that rejoined has a new NWK while an old neighbour row may still
    carry the previous one.
    """
    nodes = NodeIndex()
    nwk_by_ieee: dict[str, str] = {}
    for info in infos:
        ieee = str(info.get("ieee")) if info.get("ieee") is not None else None
        key = nwk_key(info.get("nwk")) or ieee
        if key is None:
            continue
        if ieee:
            nwk_by_ieee[ieee] = key
        nodes.add(
            LinkNode(
                key=key,
                role=_ROLE.get(str(info.get("device_type")), "unknown"),
                device_id=info.get("device_reg_id"),
                name=info.get("user_given_name") or info.get("name"),
                attrs={
                    "ieee": ieee,
                    "power_source": info.get("power_source"),
                    "available": info.get("available"),
                    # The device's last hop as the coordinator heard it.
                    "lqi": _int_or_none(info.get("lqi")),
                    "rssi": _int_or_none(info.get("rssi")),
                    "manufacturer": info.get("manufacturer"),
                    "model": info.get("model"),
                },
            )
        )

    links: list[Link] = []
    readings: dict[tuple[str, str], int] = {}  # (reporter, neighbour) -> LQI
    for info in infos:
        ieee = str(info.get("ieee")) if info.get("ieee") is not None else None
        reporter = nwk_key(info.get("nwk")) or ieee
        if reporter is None:
            continue

        for neighbor in info.get("neighbors") or []:
            relationship = neighbor.get("relationship")
            if relationship in _DROPPED_RELATIONSHIPS:
                continue
            neighbor_ieee = (
                str(neighbor["ieee"]) if neighbor.get("ieee") is not None else None
            )
            target = nwk_by_ieee.get(neighbor_ieee or "") or nwk_key(neighbor.get("nwk"))
            if target is None or target == reporter:
                continue
            node = nodes.add(
                LinkNode(
                    key=target,
                    role=_ROLE.get(str(neighbor.get("device_type")), "unknown"),
                    attrs={"ieee": neighbor_ieee},
                )
            )
            # Only neighbour rows say whether a node keeps its receiver on
            # (a sleepy end device does not), so it is learnt from them.
            rx_on = neighbor.get("rx_on_when_idle")
            if rx_on in ("On", "Off"):
                node.attrs.setdefault("rx_on_when_idle", rx_on == "On")

            lqi = _int_or_none(neighbor.get("lqi"))
            if lqi is not None and lqi > _STALE_LQI:
                readings[(reporter, target)] = lqi
            links.append(
                Link(
                    source=reporter,
                    target=target,
                    kind="neighbor",
                    metrics=LinkMetrics(lqi=lqi),
                    attrs={
                        "relationship": _RELATIONSHIP.get(
                            str(relationship), "unknown"
                        )
                    },
                )
            )

        for route in info.get("routes") or []:
            if route.get("route_status") != _ACTIVE_ROUTE:
                continue
            dest = nwk_key(route.get("dest_nwk"))
            next_hop = nwk_key(route.get("next_hop"))
            if dest is None or dest == reporter:
                continue
            nodes.add(LinkNode(key=dest))
            if next_hop is not None and next_hop != reporter:
                nodes.add(LinkNode(key=next_hop))
            links.append(
                Link(
                    source=reporter,
                    target=dest,
                    kind="route",
                    attrs={
                        # The radio hop actually taken; equals `target` when
                        # the destination is a direct neighbour.
                        "next_hop": next_hop,
                        "many_to_one": bool(route.get("many_to_one")),
                    },
                )
            )

    # LQI scales differ per chipset; reuse the reciprocity fit the panel's
    # Zigbee layer uses (zigbee_mesh._reporter_scales), keyed by NWK here.
    scales = _reporter_scales(readings)
    for link in links:
        if link.kind != "neighbor":
            continue
        reading = readings.get((link.source, link.target))
        if reading is None:
            continue
        link.metrics.lqi_norm = round(
            max(0.0, min(255.0, reading / scales.get(link.source, 1.0))), 1
        )

    return LinkSnapshot(
        layer="zigbee",
        network=NETWORK,
        provider=PROVIDER,
        captured_at=captured_at or utc_now_iso(),
        nodes=nodes.values(),
        links=links,
    )


def _device_infos(hass: HomeAssistant) -> list[dict[str, Any]] | None:
    """ZHA's device info dicts, or None when ZHA is not set up (yet)."""
    if "zha" not in hass.config.components:
        return None
    try:
        from homeassistant.components.zha.helpers import get_zha_gateway_proxy
    except ImportError:
        return None
    try:
        proxy = get_zha_gateway_proxy(hass)
    except (KeyError, ValueError):
        # No gateway yet (still starting, or the radio failed to come up).
        return None
    device_proxies = getattr(proxy, "device_proxies", None) or {}
    return [device.zha_device_info for device in list(device_proxies.values())]


async def async_get_snapshots(
    hass: HomeAssistant, *, periodic: bool = False
) -> list[LinkSnapshot]:
    """The ZHA snapshot, or none when ZHA isn't running. Never scans."""
    infos = _device_infos(hass)
    if not infos:
        return []
    return [build_snapshot(infos)]
