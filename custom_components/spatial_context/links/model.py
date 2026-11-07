"""Common data model for radio-link snapshots (Zigbee, Thread, Wi-Fi, Bluetooth).

Every link provider (ZHA, Zigbee2MQTT, Matter/Thread, UniFi, ...) turns its
integration's native topology into one `LinkSnapshot` per network. The
snapshots are persisted by the link store, so the panel and AI tools read the
last known topology instead of triggering a radio scan.

Keys are layer-native addresses as strings: Zigbee NWK ("0x4EF3"), Thread
RLOC16 ("0x1000"), Wi-Fi/BLE MAC (lower-case, colon separated). `device_id`
is the HA device registry id when the node maps to an HA device, else None
(for example an Apple-only Thread router heard as a neighbour).
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Literal

Layer = Literal["zigbee", "thread", "wifi", "bluetooth"]
Role = Literal[
    "coordinator",
    "router",
    "end_device",
    "border_router",
    "leader",
    "access_point",
    "client",
    "scanner",
    "unknown",
]
LinkKind = Literal["neighbor", "route", "parent", "association"]


@dataclass(slots=True)
class LinkNode:
    """One radio node in a network."""

    key: str
    role: Role = "unknown"
    device_id: str | None = None
    name: str | None = None
    attrs: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class LinkMetrics:
    """Measured link quality. Every field is optional; providers fill what they have.

    lqi: Zigbee LQI 0-255 as reported by the source node (vendor-specific, ordinal).
    lqi_norm: Zigbee LQI after Spatial Context's per-reporter scale correction.
    thread_lqi: Thread link quality 0-3.
    rssi_dbm: measured signal strength in dBm (Thread AverageRssi, UniFi signal, BLE).
    last_rssi_dbm: most recent RSSI sample (Thread LastRssi).
    path_cost: Thread route path cost.
    frame_error_rate / message_error_rate: Thread neighbour error rates, 0-100 %.
    """

    lqi: int | None = None
    lqi_norm: float | None = None
    thread_lqi: int | None = None
    rssi_dbm: float | None = None
    last_rssi_dbm: float | None = None
    path_cost: int | None = None
    frame_error_rate: float | None = None
    message_error_rate: float | None = None


@dataclass(slots=True)
class Link:
    """A directed observation: `source` reports hearing or routing via `target`."""

    source: str
    target: str
    kind: LinkKind = "neighbor"
    metrics: LinkMetrics = field(default_factory=LinkMetrics)
    attrs: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class LinkSnapshot:
    """Topology of one network at one point in time."""

    layer: Layer
    network: str
    provider: str
    captured_at: str
    nodes: list[LinkNode] = field(default_factory=list)
    links: list[Link] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    # Network-wide facts a provider knows (Thread channel, PAN id, leader,
    # border routers). Additive: older stored snapshots simply have none.
    attrs: dict[str, Any] = field(default_factory=dict)

    def as_dict(self) -> dict[str, Any]:
        """Return a JSON-serialisable dict (for storage and websocket)."""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> LinkSnapshot:
        """Rebuild a snapshot from `as_dict()` output."""
        return cls(
            layer=data["layer"],
            network=data["network"],
            provider=data["provider"],
            captured_at=data["captured_at"],
            nodes=[LinkNode(**n) for n in data.get("nodes", [])],
            links=[
                Link(
                    source=link["source"],
                    target=link["target"],
                    kind=link.get("kind", "neighbor"),
                    metrics=LinkMetrics(**link.get("metrics", {})),
                    attrs=link.get("attrs", {}),
                )
                for link in data.get("links", [])
            ],
            errors=list(data.get("errors", [])),
            attrs=dict(data.get("attrs", {})),
        )
