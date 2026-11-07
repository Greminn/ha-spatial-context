"""Zigbee2MQTT link provider: the cached Z2M network map as a LinkSnapshot.

A Z2M `networkmap` request makes every router answer over the air and can
take minutes on a large mesh (see zigbee_mesh.py), so this provider never
starts one from the periodic refresh. A periodic run only converts the
result zigbee_mesh.py already cached (from the panel's "Load mesh" or the
`refresh_zigbee_mesh` service); an explicit refresh scans only when nothing
has been cached yet.

The cache holds merged pairs, not the directed neighbour rows: each link
here is one pair, with `lqi_norm` the weaker scale-corrected reading and the
raw readings kept in `attrs`.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from .common import NodeIndex, utc_now_iso
from .model import Link, LinkMetrics, LinkNode, LinkSnapshot, Role
from .zha import nwk_key

if TYPE_CHECKING:
    from homeassistant.core import HomeAssistant

PROVIDER = "z2m"
NETWORK = "zigbee2mqtt"

_ROLE: dict[str, Role] = {
    "Coordinator": "coordinator",
    "Router": "router",
    "EndDevice": "end_device",
}


def build_snapshot(
    mesh: dict[str, Any], captured_at: str | None = None
) -> LinkSnapshot:
    """Convert zigbee_mesh.py's cached map ({nodes, links, fetched_at})."""
    nodes = NodeIndex()
    key_by_ieee: dict[str, str] = {}
    for node in mesh.get("nodes") or []:
        ieee = node.get("ieee")
        key = nwk_key(node.get("nwk")) or ieee
        if not key:
            continue
        if ieee:
            key_by_ieee[ieee] = key
        nodes.add(
            LinkNode(
                key=key,
                role=_ROLE.get(str(node.get("type")), "unknown"),
                device_id=node.get("device_id"),
                name=node.get("friendly_name"),
                attrs={"ieee": ieee},
            )
        )

    links: list[Link] = []
    for pair in mesh.get("links") or []:
        source = key_by_ieee.get(pair.get("source_ieee")) or pair.get("source_ieee")
        target = key_by_ieee.get(pair.get("target_ieee")) or pair.get("target_ieee")
        if not source or not target or source == target:
            continue
        for key, ieee in ((source, pair.get("source_ieee")), (target, pair.get("target_ieee"))):
            nodes.add(LinkNode(key=key, attrs={"ieee": ieee}))
        readings = list(pair.get("lqi_readings") or [])
        links.append(
            Link(
                source=source,
                target=target,
                kind="neighbor",
                metrics=LinkMetrics(
                    lqi=max(readings) if readings else None,
                    # An empty `lqi_readings` means only stale rows: no data.
                    lqi_norm=float(pair["lqi"]) if readings and pair.get("lqi") is not None else None,
                ),
                attrs={
                    "relationship": "parent_child" if pair.get("parent_child") else "sibling",
                    "lqi_readings": readings,
                    "merged_pair": True,
                },
            )
        )

    fetched_at = mesh.get("fetched_at")
    if captured_at is None and isinstance(fetched_at, (int, float)):
        from datetime import UTC, datetime

        captured_at = datetime.fromtimestamp(fetched_at, UTC).replace(microsecond=0).isoformat()

    return LinkSnapshot(
        layer="zigbee",
        network=NETWORK,
        provider=PROVIDER,
        captured_at=captured_at or utc_now_iso(),
        nodes=nodes.values(),
        links=links,
    )


async def async_get_snapshots(
    hass: HomeAssistant, *, periodic: bool = False
) -> list[LinkSnapshot]:
    """The Z2M snapshot, or none when Zigbee2MQTT isn't in use.

    `periodic=True` only reads the cache; otherwise a scan runs only if no
    map has been fetched since HA started.
    """
    if "mqtt" not in hass.config.components:
        return []
    from .. import zigbee_mesh

    # No Zigbee2MQTT devices in the registry: either ZHA runs the mesh, or
    # MQTT is used for something else. Asking for a network map then would
    # only wait out the full timeout for an answer that never comes.
    if not zigbee_mesh._build_ieee_to_device_id_map(hass):
        return []
    if periodic:
        mesh = zigbee_mesh.get_cached_network_map(hass)
    else:
        mesh = await zigbee_mesh.async_get_network_map(hass, force_refresh=False)
    if not mesh:
        return []
    return [build_snapshot(mesh)]
