"""Small helpers shared by the link providers and the store."""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from .model import LinkNode, LinkSnapshot


def utc_now_iso() -> str:
    """Capture time for a snapshot: ISO 8601, UTC, second precision."""
    return datetime.now(UTC).replace(microsecond=0).isoformat()


class NodeIndex:
    """Nodes of one snapshot, keyed by their layer-native key.

    Providers learn about a node from several places (its own report, a
    neighbour row, a route row). The first full report wins; a later
    mention only fills in what is still unknown, so a neighbour row can
    never downgrade a node that reported for itself.
    """

    def __init__(self) -> None:
        self._nodes: dict[str, LinkNode] = {}

    def __contains__(self, key: str) -> bool:
        return key in self._nodes

    def get(self, key: str) -> LinkNode | None:
        return self._nodes.get(key)

    def add(self, node: LinkNode) -> LinkNode:
        existing = self._nodes.get(node.key)
        if existing is None:
            self._nodes[node.key] = node
            return node
        if existing.device_id is None and node.device_id is not None:
            existing.device_id = node.device_id
        elif (
            node.device_id is not None
            and existing.device_id is not None
            and node.device_id != existing.device_id
        ):
            # Two HA devices claim the same address (a stale re-commission,
            # or one device registered by two integrations). Keep both ids
            # visible rather than silently dropping one.
            others = existing.attrs.setdefault("other_device_ids", [])
            if node.device_id not in others:
                others.append(node.device_id)
        if existing.role == "unknown" and node.role != "unknown":
            existing.role = node.role
        if existing.name is None and node.name is not None:
            existing.name = node.name
        for attr, value in node.attrs.items():
            existing.attrs.setdefault(attr, value)
        return existing

    def values(self) -> list[LinkNode]:
        return list(self._nodes.values())


def _drop_none(values: dict[str, Any]) -> dict[str, Any]:
    return {key: value for key, value in values.items() if value is not None}


def compact_snapshot_dict(snapshot: LinkSnapshot) -> dict[str, Any]:
    """`as_dict()` without the unset metric fields.

    A ZHA mesh has well over a thousand neighbour and route rows, and each
    row fills only one or two of the eight metric fields, so writing every
    `null` would roughly double the stored and sent size. `from_dict`
    restores the missing fields as None.
    """
    data = snapshot.as_dict()
    for link in data["links"]:
        link["metrics"] = _drop_none(link["metrics"])
    return data


def all_devices(device_registry: Any) -> list[Any]:
    """Every DeviceEntry in the registry, on old and new HA alike.

    HA 2026.x made iterating `registry.devices` yield the entries and
    deprecated using it as a mapping (`.values()` logs a warning); older
    versions iterate its keys. Iterate, and fall back to `.values()` only
    when the iteration turned out to be ids.
    """
    devices = list(device_registry.devices)
    if devices and isinstance(devices[0], str):
        return list(device_registry.devices.values())
    return devices
