"""Join the link snapshots onto the model, evaluate every link, and derive
findings: the things worth telling someone (or an AI) diagnosing a mesh.

Each finding is {type, severity, devices, detail}; `devices` are HA device
ids (ai.py turns them into short ids). Types:

- weak_link: measured signal far below what distance, walls and floors
  predict (`weak_link_threshold_db`, 0 turns it off; same rule as the
  panel's Connectivity Map).
- unplaced_infrastructure: a router, coordinator, border router or access
  point with links but no pin, so nothing about its coverage can be judged.
- area_mismatch: the room a pin sits in belongs to a different HA area than
  the device. One of the two is wrong.
- isolated_router: a Zigbee/Thread router with fewer than two router
  neighbours, a single point of failure for whatever routes through it.
- far_parent: an end device whose parent is more than 10 m away or behind
  three or more walls; it usually has a better router nearby.
- uncalibrated_level: a level with a plan but no scale, so no distances.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .rf import DEFAULT_WEAK_LINK_THRESHOLD_DB, RFParams, aggregate_pairs, evaluate

INFRA_ROLES = frozenset(
    {"coordinator", "router", "border_router", "leader", "access_point"}
)
MESH_ROUTER_ROLES = frozenset({"coordinator", "router", "border_router", "leader"})
FAR_PARENT_M = 10.0
FAR_PARENT_WALLS = 3
SEVERITY_ORDER = {"high": 0, "medium": 1, "low": 2}


@dataclass(slots=True)
class LinkReport:
    layer: str
    network: str
    a_key: str
    b_key: str
    a: str | None  # device ids, when the node maps to an HA device
    b: str | None
    kinds: list[str]
    parent: str | None  # node key
    report: dict[str, Any]


@dataclass(slots=True)
class Analysis:
    model: Any
    params: RFParams
    threshold_db: float
    # (layer, network, key) -> LinkNode
    nodes: dict[tuple[str, str, str], Any] = field(default_factory=dict)
    # device_id -> [(layer, network, node)]
    device_nodes: dict[str, list[tuple[str, str, Any]]] = field(default_factory=dict)
    links: list[LinkReport] = field(default_factory=list)
    findings: list[dict[str, Any]] = field(default_factory=list)
    networks: list[dict[str, Any]] = field(default_factory=list)

    def node_device(self, layer: str, network: str, key: str) -> Any:
        node = self.nodes.get((layer, network, key))
        if node is None or not node.device_id:
            return None
        return self.model.devices.get(node.device_id)

    def device_roles(self, device_id: str) -> list[str]:
        return sorted(
            {f"{layer}:{node.role}" for layer, _, node in self.device_nodes.get(device_id, [])}
        )

    def is_infrastructure(self, device_id: str) -> bool:
        return any(
            node.role in INFRA_ROLES for _, _, node in self.device_nodes.get(device_id, [])
        )


def analyse(model: Any) -> Analysis:
    """Evaluate every link in `model.snapshots` and collect findings."""
    settings = model.settings
    threshold = settings.get("weak_link_threshold_db")
    analysis = Analysis(
        model=model,
        params=RFParams.from_settings(settings),
        threshold_db=float(
            DEFAULT_WEAK_LINK_THRESHOLD_DB if threshold is None else threshold
        ),
    )

    for snap in model.snapshots:
        for node in snap.nodes:
            analysis.nodes[(snap.layer, snap.network, node.key)] = node
            if node.device_id and node.device_id in model.devices:
                analysis.device_nodes.setdefault(node.device_id, []).append(
                    (snap.layer, snap.network, node)
                )

    for obs in aggregate_pairs(model.snapshots):
        dev_a = analysis.node_device(obs.layer, obs.network, obs.a)
        dev_b = analysis.node_device(obs.layer, obs.network, obs.b)
        analysis.links.append(
            LinkReport(
                layer=obs.layer,
                network=obs.network,
                a_key=obs.a,
                b_key=obs.b,
                a=dev_a.device_id if dev_a else None,
                b=dev_b.device_id if dev_b else None,
                kinds=sorted(obs.kinds),
                parent=obs.parent,
                report=evaluate(model, obs, dev_a, dev_b, analysis.params),
            )
        )

    _network_stats(analysis)
    findings = analysis.findings
    findings.extend(_weak_links(analysis))
    findings.extend(_unplaced_infrastructure(analysis))
    findings.extend(_area_mismatch(analysis))
    findings.extend(_isolated_routers(analysis))
    findings.extend(_far_parents(analysis))
    findings.extend(_uncalibrated_levels(analysis))
    findings.sort(
        key=lambda f: (
            SEVERITY_ORDER.get(f["severity"], 9),
            -(f["detail"].get("gap_db") or 0),
            f["type"],
            [d or "" for d in f["devices"]],
        )
    )
    return analysis


def _network_stats(analysis: Analysis) -> None:
    model = analysis.model
    for snap in model.snapshots:
        linked = {k for link in snap.links for k in (link.source, link.target)}
        unmapped = sum(1 for n in snap.nodes if not n.device_id and n.key in linked)
        unplaced = sum(
            1
            for n in snap.nodes
            if n.device_id
            and n.device_id in model.devices
            and not model.devices[n.device_id].placed
        )
        analysis.networks.append(
            {
                "layer": snap.layer,
                "network": snap.network,
                "provider": snap.provider,
                "captured_at": snap.captured_at,
                "nodes": len(snap.nodes),
                "links": len(snap.links),
                "unmapped_nodes": unmapped,
                "unplaced_devices": unplaced,
                "errors": len(snap.errors),
            }
        )


def _weak_links(analysis: Analysis) -> list[dict[str, Any]]:
    if analysis.threshold_db <= 0:
        return []
    out = []
    for link in analysis.links:
        gap = link.report.get("gap_db")
        if gap is None or gap <= analysis.threshold_db:
            continue
        out.append(
            {
                "type": "weak_link",
                "severity": "high" if gap > analysis.threshold_db + 15 else "medium",
                "devices": [link.a, link.b],
                "detail": {"layer": link.layer, **_rf_detail(link.report)},
            }
        )
    return out


def _rf_detail(report: dict[str, Any]) -> dict[str, Any]:
    return {
        "distance_m": report["distance_m"],
        "walls": len(report["walls"]),
        "wall_db": report["wall_db"],
        "slabs": report["slabs"],
        "predicted_dbm": report["predicted_dbm"],
        "measured_dbm": report["measured_dbm"],
        "measured_kind": report["measured_kind"],
        "gap_db": report["gap_db"],
    }


def _unplaced_infrastructure(analysis: Analysis) -> list[dict[str, Any]]:
    linked: set[tuple[str, str, str]] = set()
    for link in analysis.links:
        linked.add((link.layer, link.network, link.a_key))
        linked.add((link.layer, link.network, link.b_key))
    out: dict[str, dict[str, Any]] = {}
    for (layer, network, key), node in sorted(analysis.nodes.items()):
        if node.role not in INFRA_ROLES or (layer, network, key) not in linked:
            continue
        device = analysis.model.devices.get(node.device_id) if node.device_id else None
        if device is None or device.placed:
            continue
        entry = out.setdefault(
            device.device_id,
            {
                "type": "unplaced_infrastructure",
                "severity": "medium",
                "devices": [device.device_id],
                "detail": {"roles": []},
            },
        )
        entry["detail"]["roles"].append(f"{layer}:{node.role}")
    return list(out.values())


def _area_mismatch(analysis: Analysis) -> list[dict[str, Any]]:
    model = analysis.model
    out = []
    for device in model.devices.values():
        if not device.room_id or not device.area_id:
            continue
        room = model.rooms.get(device.room_id)
        if room is None or not room.area_id or room.area_id == device.area_id:
            continue
        out.append(
            {
                "type": "area_mismatch",
                "severity": "low",
                "devices": [device.device_id],
                "detail": {
                    "room": room.id,
                    "room_area": model.area_names.get(room.area_id, room.area_id),
                    "device_area": model.area_names.get(device.area_id, device.area_id),
                },
            }
        )
    return out


def _isolated_routers(analysis: Analysis) -> list[dict[str, Any]]:
    neighbours: dict[tuple[str, str, str], set[str]] = {}
    networks_with_tables: set[tuple[str, str]] = set()
    for link in analysis.links:
        if link.layer not in ("zigbee", "thread") or "neighbor" not in link.kinds:
            continue
        networks_with_tables.add((link.layer, link.network))
        for me, other in ((link.a_key, link.b_key), (link.b_key, link.a_key)):
            other_node = analysis.nodes.get((link.layer, link.network, other))
            if other_node is not None and other_node.role in MESH_ROUTER_ROLES:
                neighbours.setdefault((link.layer, link.network, me), set()).add(other)
    out = []
    for (layer, network, key), node in sorted(analysis.nodes.items()):
        if (layer, network) not in networks_with_tables:
            continue
        # The coordinator of a one-router mesh is not "isolated"; it is the mesh.
        if node.role not in ("router", "leader", "border_router") or not node.device_id:
            continue
        count = len(neighbours.get((layer, network, key), ()))
        if count >= 2:
            continue
        out.append(
            {
                "type": "isolated_router",
                "severity": "high" if count == 0 else "medium",
                "devices": [node.device_id],
                "detail": {"layer": layer, "router_neighbours": count},
            }
        )
    return out


def _far_parents(analysis: Analysis) -> list[dict[str, Any]]:
    out = []
    for link in analysis.links:
        if link.parent is None or link.a is None or link.b is None:
            continue
        child_key = link.b_key if link.parent == link.a_key else link.a_key
        child = analysis.nodes.get((link.layer, link.network, child_key))
        if child is None or child.role != "end_device":
            continue
        report = link.report
        if report["distance_m"] is None:
            continue
        solid = sum(1 for w in report["walls"] if not w["opening"])
        if report["distance_m"] <= FAR_PARENT_M and solid < FAR_PARENT_WALLS:
            continue
        parent_device = link.a if link.parent == link.a_key else link.b
        child_device = link.b if parent_device == link.a else link.a
        out.append(
            {
                "type": "far_parent",
                "severity": "medium",
                "devices": [child_device, parent_device],
                "detail": {"layer": link.layer, **_rf_detail(report), "solid_walls": solid},
            }
        )
    return out


def _uncalibrated_levels(analysis: Analysis) -> list[dict[str, Any]]:
    model = analysis.model
    out = []
    for level in model.level_order():
        if level.calibrated:
            continue
        pins = sum(1 for d in model.devices.values() if d.level_id == level.id)
        if not pins and not level.rooms:
            continue
        out.append(
            {
                "type": "uncalibrated_level",
                "severity": "medium" if pins else "low",
                "devices": [],
                "detail": {"level": level.id, "pins": pins},
            }
        )
    return out
