"""Where the spatial engine reads radio links from.

The link store (`links/store.py`: persisted ZHA, Thread, UniFi and Z2M
snapshots) is the source. While it holds nothing yet (not set up, or
before its first refresh) this falls back to what the integration already
has: the Zigbee mesh cache (`zigbee_mesh`, Z2M or ZHA, filled when someone
loads the mesh layer or runs `refresh_zigbee_mesh`) and the Wi-Fi
associations (`wifi_mesh`, read from HA's own entity states). Neither
fallback triggers a radio scan.
"""

from __future__ import annotations

from datetime import datetime, timezone
import logging
from typing import Any

from ..links.model import Link, LinkMetrics, LinkNode, LinkSnapshot

_LOGGER = logging.getLogger(__name__)

# Z2M node `type` / ZHA `device_type` -> the common model's role.
_ZIGBEE_ROLES = {
    "coordinator": "coordinator",
    "router": "router",
    "enddevice": "end_device",
    "end_device": "end_device",
}


async def async_get_snapshots(hass: Any) -> list[LinkSnapshot]:
    """The latest snapshot per network, from the link store if installed."""
    try:
        from ..links import store  # type: ignore[attr-defined]
    except ImportError:
        store = None
    if store is not None and hasattr(store, "async_get_snapshots"):
        snapshots = list(await store.async_get_snapshots(hass))
        if snapshots:
            return snapshots
        # The store is empty until its first refresh (two minutes after HA
        # starts, on a fresh install): meanwhile use what is cached already.
    return _legacy_snapshots(hass)


def _legacy_snapshots(hass: Any) -> list[LinkSnapshot]:
    snapshots: list[LinkSnapshot] = []
    try:
        from ..zigbee_mesh import get_cached_network_map

        mesh = get_cached_network_map(hass)
        if mesh:
            snapshots.append(zigbee_snapshot(mesh))
    except Exception:  # noqa: BLE001 - a broken layer must not hide the others
        _LOGGER.debug("No Zigbee links for the spatial engine", exc_info=True)
    try:
        from ..wifi_mesh import async_get_wifi_mesh

        wifi = async_get_wifi_mesh(hass)
        if wifi.get("links"):
            snapshots.append(wifi_snapshot(wifi))
    except Exception:  # noqa: BLE001
        _LOGGER.debug("No Wi-Fi links for the spatial engine", exc_info=True)
    return snapshots


def _iso(epoch: float | None) -> str:
    when = datetime.fromtimestamp(epoch, timezone.utc) if epoch else datetime.now(timezone.utc)
    return when.isoformat(timespec="seconds")


def zigbee_snapshot(mesh: dict[str, Any]) -> LinkSnapshot:
    """The zigbee_mesh cache ({nodes, links, fetched_at}, links already merged
    per pair with the reciprocity-corrected `lqi`) as a snapshot keyed by
    IEEE (the cache has no NWK addresses)."""
    nodes = [
        LinkNode(
            key=str(node["ieee"]),
            role=_ZIGBEE_ROLES.get(str(node.get("type") or "").replace(" ", "").lower(), "unknown"),  # type: ignore[arg-type]
            device_id=node.get("device_id"),
            name=node.get("friendly_name"),
        )
        for node in mesh.get("nodes", [])
    ]
    roles = {node.key: node.role for node in nodes}
    links = []
    for pair in mesh.get("links", []):
        source, target = str(pair["source_ieee"]), str(pair["target_ieee"])
        readings = pair.get("lqi_readings") or []
        metrics = LinkMetrics(
            lqi=min(readings) if readings else None,
            lqi_norm=float(pair["lqi"]) if pair.get("lqi") else None,
        )
        kind = "neighbor"
        if pair.get("parent_child"):
            # The cache keeps no direction; an end device's parent is the
            # other end.
            if roles.get(source) == "end_device":
                kind = "parent"
            elif roles.get(target) == "end_device":
                source, target, kind = target, source, "parent"
        links.append(Link(source=source, target=target, kind=kind, metrics=metrics))  # type: ignore[arg-type]
    return LinkSnapshot(
        layer="zigbee",
        network="zigbee",
        provider="zigbee_mesh_cache",
        captured_at=_iso(mesh.get("fetched_at")),
        nodes=nodes,
        links=links,
    )


def wifi_snapshot(wifi: dict[str, Any]) -> LinkSnapshot:
    """wifi_mesh's client -> AP links as association links, keyed by HA
    device id (wifi_mesh resolves MACs to devices and does not return them)."""
    nodes: dict[str, LinkNode] = {}
    links = []
    for link in wifi.get("links", []):
        client, ap = link["source_device_id"], link["target_device_id"]
        nodes.setdefault(ap, LinkNode(key=ap, role="access_point", device_id=ap))
        nodes[ap].role = "access_point"
        nodes.setdefault(client, LinkNode(key=client, role="client", device_id=client))
        links.append(
            Link(
                source=client,
                target=ap,
                kind="association",
                metrics=LinkMetrics(rssi_dbm=link.get("rssi_dbm")),
            )
        )
    return LinkSnapshot(
        layer="wifi",
        network="wifi",
        provider="wifi_mesh",
        captured_at=_iso(None),
        nodes=list(nodes.values()),
        links=links,
    )
