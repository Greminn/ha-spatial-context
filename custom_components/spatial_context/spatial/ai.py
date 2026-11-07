"""Compact, deterministic outputs for AI assistants.

`get_map` is the whole plan: every polygon point, every wall, every pin, in
editor units and metres. On a large home that is far more than an assistant
should read to answer "why is the hallway sensor dropping off?". These
builders answer the questions it actually asks, in a bounded size:

- summary(): the house at a glance: levels, rooms with adjacency, radio
  infrastructure and where it is, networks, the top findings, and what is
  approximate. No polygons. Budget 8,000 tokens on a ~300-device home.
- device_context(device): one device: where, which radios, every link with
  distance/walls/predicted/measured, findings, nearest infrastructure.
- path(a, b): what is between two devices.
- weak_links(layer?, level?): links measured far below the prediction.
- room(room): one room: devices, neighbours, findings.
- device_context/path budget: 2,000 tokens.

Rules: metres to 0.1, dB to 1; short ids (`l1` level, `r3` room, `d12`
device), always next to a name; lists capped with a `more` count. Ids are
assigned in a stable order (level, room, name), so the same layout gives the
same ids. Devices, rooms and levels resolve by HA id, short id, exact name or
a unique case-insensitive substring.
"""

from __future__ import annotations

import json
import math
from typing import Any

from .findings import INFRA_ROLES, Analysis, analyse
from .model import PROPERTY_LEVEL_ID, Device, SpatialModel
from .rf import predicted_dbm

TOOLS = ("summary", "device_context", "path", "weak_links", "room")

SUMMARY_MAX_INFRA = 80
SUMMARY_MAX_FINDINGS = 25
CONTEXT_MAX_LINKS = 20
CONTEXT_MAX_FINDINGS = 8
CONTEXT_NEAREST = 5
PATH_MAX_WALLS = 25
WEAK_MAX = 25
ROOM_MAX_DEVICES = 60

APPROX_LQI = (
    "Zigbee signal is LQI (0-255, vendor-specific, ordinal) mapped onto dBm with a "
    "straight line; rank links with it, do not read it as a measurement."
)
APPROX_MODEL = (
    "predicted_dbm is a rough log-distance model (tx - 40 dB at 1 m - 10*n*log10(d) - "
    "walls - floors); gap_db = predicted - measured, positive = weaker than expected."
)


# Findings use the same short keys as link rows.
_FINDING_KEYS = {
    "distance_m": "d_m",
    "predicted_dbm": "pred_dbm",
    "measured_dbm": "meas_dbm",
    "measured_kind": "meas",
    "slabs": "floors",
}


class NotFound(LookupError):
    """A device, room or level that does not resolve; the message lists
    candidates."""


def estimate_tokens(obj: Any) -> int:
    """Rough token count of an output as an assistant receives it: one token
    per ~3.5 characters of compact JSON."""
    return math.ceil(len(_dumps(obj)) / 3.5)


def _dumps(obj: Any) -> str:
    return json.dumps(obj, separators=(",", ":"), ensure_ascii=False)


def _m(value: float | None) -> float | None:
    return None if value is None else round(value, 1)


def _db(value: float | None) -> int | None:
    return None if value is None else int(round(value))


def _capped(items: list[Any], limit: int) -> dict[str, Any]:
    out: dict[str, Any] = {"items": items[:limit]}
    if len(items) > limit:
        out["more"] = len(items) - limit
    return out


class SpatialAI:
    """Builders over one model snapshot. Build per request: the model reads
    the stored layout and the latest link snapshots."""

    def __init__(self, model: SpatialModel, analysis: Analysis | None = None) -> None:
        self.model = model
        self.analysis = analysis or analyse(model)
        self._assign_ids()

    # -- ids and lookups ---------------------------------------------------

    def _assign_ids(self) -> None:
        model = self.model
        levels = model.level_order()
        self.level_sid = {lv.id: f"l{i + 1}" for i, lv in enumerate(levels)}
        self.level_sid[PROPERTY_LEVEL_ID] = "outdoor"
        level_rank = {lv.id: i for i, lv in enumerate(levels)}
        rooms = sorted(
            model.rooms.values(),
            key=lambda r: (level_rank.get(r.level_id, 99), r.name.casefold(), r.id),
        )
        self.room_sid = {r.id: f"r{i + 1}" for i, r in enumerate(rooms)}
        room_rank = {r.id: i for i, r in enumerate(rooms)}

        def device_key(d: Device) -> tuple:
            if d.placed:
                return (
                    0,
                    level_rank.get(d.level_id, 98),  # type: ignore[arg-type]
                    room_rank.get(d.room_id, 10**6),  # type: ignore[arg-type]
                    d.name.casefold(),
                    d.device_id,
                )
            return (1, 0, 0, d.name.casefold(), d.device_id)

        devices = sorted(model.devices.values(), key=device_key)
        self.device_sid = {d.device_id: f"d{i + 1}" for i, d in enumerate(devices)}
        buildings = sorted({lv.building_id for lv in levels if lv.building_id})
        self.building_sid = {b: f"b{i + 1}" for i, b in enumerate(buildings)}
        self._sid_device = {sid: did for did, sid in self.device_sid.items()}
        self._sid_room = {sid: rid for rid, sid in self.room_sid.items()}
        self._sid_level = {sid: lid for lid, sid in self.level_sid.items()}

    def _ref(self, device_id: str | None, key: str | None = None, layer: str | None = None) -> dict[str, Any]:
        if device_id and device_id in self.model.devices:
            return {"id": self.device_sid[device_id], "name": self.model.devices[device_id].name}
        return {"id": None, "name": f"{layer}:{key}" if layer else key}

    def _room_ref(self, room_id: str | None) -> str | None:
        return self.room_sid.get(room_id) if room_id else None

    def resolve_device(self, query: str) -> Device:
        model = self.model
        if query in model.devices:
            return model.devices[query]
        if query in self._sid_device:
            return model.devices[self._sid_device[query]]
        return _resolve(
            query, [(d.name, d) for d in model.devices.values()], "device",
            lambda d: f"{self.device_sid[d.device_id]} {d.name}",
        )

    def resolve_room(self, query: str):
        model = self.model
        if query in model.rooms:
            return model.rooms[query]
        if query in self._sid_room:
            return model.rooms[self._sid_room[query]]
        candidates = [(r.name, r) for r in model.rooms.values()]
        candidates += [
            (model.area_names[r.area_id], r)
            for r in model.rooms.values()
            if r.area_id in model.area_names
        ]
        return _resolve(query, candidates, "room", lambda r: f"{self.room_sid[r.id]} {r.name}")

    def resolve_level(self, query: str):
        model = self.model
        if query in model.levels:
            return model.levels[query]
        if query in self._sid_level and self._sid_level[query] in model.levels:
            return model.levels[self._sid_level[query]]
        return _resolve(
            query, [(lv.name, lv) for lv in model.levels.values()], "level",
            lambda lv: f"{self.level_sid[lv.id]} {lv.name}",
        )

    # -- shared pieces ---------------------------------------------------

    def _where(self, device: Device) -> dict[str, Any]:
        out: dict[str, Any] = {
            "level": self.level_sid.get(device.level_id) if device.level_id else None,
            "room": self._room_ref(device.room_id),
        }
        if device.room_id:
            out["room_name"] = self.model.rooms[device.room_id].name
        if device.x_m is not None:
            out["pos_m"] = [_m(device.x_m), _m(device.y_m), _m(device.z_m)]
        if device.placed:
            out["position_confidence"] = _confidence(device)
        return out

    def _finding(self, finding: dict[str, Any]) -> dict[str, Any]:
        detail = {}
        for key, value in finding["detail"].items():
            if value is None or (key == "slabs" and not value):
                continue
            if key.endswith("_m"):
                value = _m(value)
            elif key.endswith("_db") or key.endswith("_dbm"):
                value = _db(value)
            elif key == "level":
                value = self.level_sid.get(value, value)
            elif key == "room":
                value = self._room_ref(value)
            detail[_FINDING_KEYS.get(key, key)] = value
        return {
            "type": finding["type"],
            "sev": finding["severity"],
            "devices": [self._ref(d) for d in finding["devices"] if d],
            **detail,
        }

    def _link_row(self, link, me: str | None = None) -> dict[str, Any]:
        r = link.report
        if me is not None:
            other_dev, other_key = (link.b, link.b_key) if link.a == me else (link.a, link.a_key)
            row: dict[str, Any] = {"to": self._ref(other_dev, other_key, link.layer)}
        else:
            row = {
                "a": self._ref(link.a, link.a_key, link.layer),
                "b": self._ref(link.b, link.b_key, link.layer),
            }
        row["layer"] = link.layer
        row["kinds"] = link.kinds
        if link.parent is not None:
            parent_dev = link.a if link.parent == link.a_key else link.b
            row["parent"] = self.device_sid.get(parent_dev) if parent_dev else link.parent
        if r["distance_m"] is not None:
            row["d_m"] = _m(r["distance_m"])
            row["walls"] = len(r["walls"])
            row["wall_db"] = _db(r["wall_db"])
            if r["slabs"]:
                row["floors"] = r["slabs"]
            row["pred_dbm"] = _db(r["predicted_dbm"])
        elif r["unknown"]:
            row["geometry"] = r["unknown"]
        if r["measured_dbm"] is not None:
            row["meas_dbm"] = _db(r["measured_dbm"])
            row["meas"] = r["measured_kind"]
            if r["gap_db"] is not None:
                row["gap_db"] = _db(r["gap_db"])
        return row

    def _approximate(self) -> list[str]:
        model, analysis = self.model, self.analysis
        notes = [APPROX_MODEL]
        if any(link.report["measured_kind"] == "lqi" for link in analysis.links):
            notes.append(APPROX_LQI)
        uncal = [self.level_sid[lv.id] for lv in model.level_order() if not lv.calibrated]
        if uncal:
            notes.append(f"Uncalibrated levels (no distances): {', '.join(uncal)}.")
        borrowed = [
            self.level_sid[lv.id]
            for lv in model.level_order()
            if lv.calibrated and lv.scale_from != lv.id
        ]
        if borrowed:
            notes.append(f"Scale borrowed from another floor of the building: {', '.join(borrowed)}.")
        unplaced = sum(1 for d in model.devices.values() if not d.placed and d.device_id in analysis.device_nodes)
        if unplaced:
            notes.append(f"{unplaced} radio devices are not placed; their links have no geometry.")
        rough = sum(1 for d in model.devices.values() if d.placed and d.approximate)
        if rough:
            notes.append(
                f"{rough} devices have approximate positions (bulk-placed in their room, "
                "not where they really are): their distances and walls crossed are rough."
            )
        unmapped = sum(n["unmapped_nodes"] for n in analysis.networks)
        if unmapped:
            notes.append(f"{unmapped} radio nodes are not HA devices (e.g. other ecosystems' routers).")
        separate = {lv.building_id for lv in model.levels.values()}
        if len(model.levels) > 1 and (None in separate or len(separate) > 1):
            notes.append("Levels in different buildings (no shared building_id) have no cross-level distances.")
        return notes

    # -- tools ---------------------------------------------------------------

    def summary(self) -> dict[str, Any]:
        model, analysis = self.model, self.analysis
        adjacency = model.adjacency()
        dev_by_level: dict[str | None, int] = {}
        dev_by_room: dict[str | None, int] = {}
        for d in model.devices.values():
            if d.placed:
                dev_by_level[d.level_id] = dev_by_level.get(d.level_id, 0) + 1
                dev_by_room[d.room_id] = dev_by_room.get(d.room_id, 0) + 1

        levels = []
        for lv in model.level_order():
            levels.append(
                {
                    "id": self.level_sid[lv.id],
                    "name": lv.name,
                    "elev_m": _m(lv.elevation_m),
                    "building": self.building_sid.get(lv.building_id),
                    "calibrated": lv.calibrated,
                    "rooms": len(lv.rooms),
                    "devices": dev_by_level.get(lv.id, 0),
                }
            )
        outdoor = dev_by_level.get(PROPERTY_LEVEL_ID, 0)

        rooms = []
        for room_id, sid in sorted(self.room_sid.items(), key=lambda kv: int(kv[1][1:])):
            room = model.rooms[room_id]
            row: dict[str, Any] = {
                "id": sid,
                "name": room.name,
                "level": self.level_sid[room.level_id],
                "devices": dev_by_room.get(room_id, 0),
            }
            if room.area_m2 is not None:
                row["m2"] = _m(room.area_m2)
            adj = sorted((self.room_sid[r] for r in adjacency.get(room_id, [])), key=lambda s: int(s[1:]))
            if adj:
                row["adj"] = adj
            rooms.append(row)

        neighbours: dict[str, int] = {}
        for link in analysis.links:
            for dev in (link.a, link.b):
                if dev:
                    neighbours[dev] = neighbours.get(dev, 0) + 1
        infra = []
        for device_id in sorted(
            (d for d in analysis.device_nodes if analysis.is_infrastructure(d)),
            key=lambda d: int(self.device_sid[d][1:]),
        ):
            device = model.devices[device_id]
            roles = sorted(
                f"{layer}:{node.role}"
                for layer, _, node in analysis.device_nodes[device_id]
                if node.role in INFRA_ROLES
            )
            row = {"id": self.device_sid[device_id], "name": device.name, "roles": roles}
            if device.placed:
                row["level"] = self.level_sid.get(device.level_id)
                row["room"] = self._room_ref(device.room_id)
                row["position_confidence"] = _confidence(device)
            else:
                row["placed"] = False
            row["links"] = neighbours.get(device_id, 0)
            infra.append(row)

        counts: dict[str, int] = {}
        for f in analysis.findings:
            counts[f["type"]] = counts.get(f["type"], 0) + 1
        findings = [self._finding(f) for f in _diverse(analysis.findings, SUMMARY_MAX_FINDINGS)]

        placed = sum(1 for d in model.devices.values() if d.placed)
        approximate = sum(1 for d in model.devices.values() if d.placed and d.approximate)
        stale = sum(
            1 for d in model.devices.values()
            if d.placed and d.level_id != PROPERTY_LEVEL_ID and d.stored_room_id != d.room_id
        )
        out: dict[str, Any] = {
            "units": {"distance": "m", "signal": "dBm", "loss": "dB"},
            "levels": levels,
            "rooms": rooms,
            "devices": {
                "known": len(model.devices),
                "placed": placed,
                "approximate_positions": approximate,
                "outdoor": outdoor,
                "room_recomputed": stale,
            },
            "infrastructure": _capped(infra, SUMMARY_MAX_INFRA),
            "networks": [
                {
                    "layer": n["layer"],
                    "network": n["network"],
                    "nodes": n["nodes"],
                    "links": n["links"],
                    "unmapped": n["unmapped_nodes"],
                    "unplaced": n["unplaced_devices"],
                    "captured_at": n["captured_at"],
                    **({"errors": n["errors"]} if n["errors"] else {}),
                }
                for n in analysis.networks
            ],
            "findings": {
                "counts": counts,
                "top": findings,
                **({"more": len(analysis.findings) - len(findings)} if len(analysis.findings) > len(findings) else {}),
            },
            "rf_model": {
                "exponent": analysis.params.exponent,
                "floor_db": analysis.params.slab_db,
                "weak_threshold_db": analysis.threshold_db,
            },
            "approximate": self._approximate(),
        }
        return out

    def device_context(self, query: str) -> dict[str, Any]:
        device = self.resolve_device(query)
        model, analysis = self.model, self.analysis
        did = device.device_id
        info: dict[str, Any] = {
            "id": self.device_sid[did],
            "name": device.name,
            "integration": device.integration,
            "area": model.area_names.get(device.area_id) if device.area_id else None,
            "placed": device.placed,
            **self._where(device),
        }
        radios = [
            {"layer": layer, "network": network, "role": node.role, "key": node.key}
            for layer, network, node in analysis.device_nodes.get(did, [])
        ]
        links = [link for link in analysis.links if did in (link.a, link.b)]

        def link_order(link) -> tuple:
            is_parent = 0 if link.parent is not None else 1
            gap = link.report.get("gap_db")
            meas = link.report.get("measured_dbm")
            return (is_parent, -(gap if gap is not None else -1e9), -(meas if meas is not None else -1e9))

        links.sort(key=link_order)
        rows = []
        for link in links:
            row = self._link_row(link, me=did)
            gap = link.report.get("gap_db")
            if analysis.threshold_db > 0 and gap is not None and gap > analysis.threshold_db:
                row["weak"] = True
            rows.append(row)
        # Weak links are already marked on their link row.
        findings = [
            self._finding(f)
            for f in analysis.findings
            if did in f["devices"] and f["type"] != "weak_link"
        ]
        out: dict[str, Any] = {
            "device": info,
            "radios": radios,
            "links": _capped(rows, CONTEXT_MAX_LINKS),
            "findings": _capped(findings, CONTEXT_MAX_FINDINGS),
        }
        nearest = self._nearest_infrastructure(device, {r["layer"] for r in radios})
        if nearest:
            out["nearest_infrastructure"] = nearest
        if device.room_id:
            peers = sorted(
                (d for d in model.devices.values() if d.room_id == device.room_id and d.device_id != did),
                key=lambda d: int(self.device_sid[d.device_id][1:]),
            )
            out["room_peers"] = _capped([self._ref(d.device_id) for d in peers], 10)
        return out

    def _nearest_infrastructure(self, device: Device, layers: set[str]) -> list[dict[str, Any]]:
        if device.x_m is None:
            return []
        model, analysis = self.model, self.analysis
        rows = []
        for other_id, nodes in analysis.device_nodes.items():
            if other_id == device.device_id:
                continue
            infra_layers = sorted({layer for layer, _, n in nodes if n.role in INFRA_ROLES and (not layers or layer in layers)})
            if not infra_layers:
                continue
            other = model.devices[other_id]
            path = model.path(device, other)
            if path is None:
                continue
            wall_db = sum(c["db"] for c in path["crossings"])
            layer = infra_layers[0]
            rows.append(
                (
                    path["distance_m"],
                    {
                        **self._ref(other_id),
                        "layers": infra_layers,
                        "d_m": _m(path["distance_m"]),
                        "walls": len(path["crossings"]),
                        "pred_dbm": _db(predicted_dbm(layer, path["distance_m"], wall_db, path["slabs"], analysis.params)),
                    },
                )
            )
        rows.sort(key=lambda r: (r[0], r[1]["id"]))
        return [r[1] for r in rows[:CONTEXT_NEAREST]]

    def path(self, query_a: str, query_b: str) -> dict[str, Any]:
        a, b = self.resolve_device(query_a), self.resolve_device(query_b)
        model, analysis = self.model, self.analysis
        out: dict[str, Any] = {
            "a": {**self._ref(a.device_id), **self._where(a)},
            "b": {**self._ref(b.device_id), **self._where(b)},
        }
        geo = model.path(a, b)
        if geo is None:
            out["geometry"] = model.path_unknown_reason(a, b)
        else:
            wall_db = sum(c["db"] for c in geo["crossings"])
            walls = [
                {
                    "material": c["material"],
                    "db": _db(c["db"]),
                    **({"opening": c["through_opening"]} if c["through_opening"] else {}),
                    **({"level": self.level_sid[c["level_id"]]} if not geo["same_level"] else {}),
                }
                for c in geo["crossings"]
            ]
            out.update(
                distance_m=_m(geo["distance_m"]),
                same_level=geo["same_level"],
                floors=geo["slabs"],
                walls=_capped(walls, PATH_MAX_WALLS),
                wall_db=_db(wall_db),
                rooms_on_path=self._rooms_on_path(a, b),
            )
            layers = {layer for layer, _, _ in analysis.device_nodes.get(a.device_id, [])} & {
                layer for layer, _, _ in analysis.device_nodes.get(b.device_id, [])
            } or {"zigbee"}
            out["pred_dbm"] = {
                layer: _db(predicted_dbm(layer, geo["distance_m"], wall_db, geo["slabs"], analysis.params))
                for layer in sorted(layers)
            }
        measured = [
            self._link_row(link)
            for link in analysis.links
            if {link.a, link.b} == {a.device_id, b.device_id}
        ]
        if measured:
            out["links"] = measured
        return out

    def _rooms_on_path(self, a: Device, b: Device, samples: int = 48) -> list[str]:
        """Room names along the straight path, in order, sampled. Cross-level
        paths switch level at the midpoint of the height change."""
        model = self.model
        names: list[str] = []
        for i in range(samples + 1):
            t = i / samples
            x = a.x_m + (b.x_m - a.x_m) * t  # type: ignore[operator]
            y = a.y_m + (b.y_m - a.y_m) * t  # type: ignore[operator]
            level_id = a.level_id if t <= 0.5 or a.level_id == b.level_id else b.level_id
            room_id = model.room_at(level_id, x, y)  # type: ignore[arg-type]
            label = f"{self.room_sid[room_id]} {model.rooms[room_id].name}" if room_id else "(outside rooms)"
            if not names or names[-1] != label:
                names.append(label)
        return names

    def weak_links(self, layer: str | None = None, level: str | None = None) -> dict[str, Any]:
        analysis = self.analysis
        level_id = self.resolve_level(level).id if level else None
        checked = 0
        rows = []
        for link in analysis.links:
            if layer and link.layer != layer:
                continue
            if level_id:
                levels = {
                    self.model.devices[d].level_id for d in (link.a, link.b) if d
                }
                if level_id not in levels:
                    continue
            if link.report.get("gap_db") is None:
                continue
            checked += 1
            if analysis.threshold_db > 0 and link.report["gap_db"] > analysis.threshold_db:
                rows.append(link)
        rows.sort(key=lambda link: -link.report["gap_db"])
        out: dict[str, Any] = {
            "threshold_db": analysis.threshold_db,
            "checked": checked,
            "weak": _capped([self._link_row(link) for link in rows], WEAK_MAX),
        }
        if analysis.threshold_db <= 0:
            out["note"] = "The weak-link check is off (threshold 0)."
        if any(link.report["measured_kind"] == "lqi" for link in rows):
            out["note_lqi"] = APPROX_LQI
        return out

    def room(self, query: str) -> dict[str, Any]:
        room = self.resolve_room(query)
        model, analysis = self.model, self.analysis
        info: dict[str, Any] = {
            "id": self.room_sid[room.id],
            "name": room.name,
            "level": self.level_sid[room.level_id],
            "area": model.area_names.get(room.area_id) if room.area_id else None,
        }
        level = model.levels[room.level_id]
        if room.area_m2 is not None and level.meters_per_unit:
            mpu = level.meters_per_unit
            xs = [p[0] * mpu for p in room.points]
            ys = [p[1] * mpu for p in room.points]
            info["m2"] = _m(room.area_m2)
            info["size_m"] = [_m(max(xs) - min(xs)), _m(max(ys) - min(ys))]
        adjacent = [
            {"id": self.room_sid[r], "name": model.rooms[r].name}
            for r in sorted(model.adjacency().get(room.id, []), key=lambda r: int(self.room_sid[r][1:]))
        ]
        members = sorted(
            (d for d in model.devices.values() if d.room_id == room.id),
            key=lambda d: int(self.device_sid[d.device_id][1:]),
        )
        member_ids = {d.device_id for d in members}
        devices = [
            {
                **self._ref(d.device_id),
                "integration": d.integration,
                "position_confidence": _confidence(d),
                **({"roles": self.analysis.device_roles(d.device_id)} if d.device_id in analysis.device_nodes else {}),
            }
            for d in members
        ]
        inside = outside = 0
        for link in analysis.links:
            ends = {link.a, link.b} & member_ids
            if not ends:
                continue
            if {link.a, link.b} <= member_ids:
                inside += 1
            else:
                outside += 1
        findings = [
            self._finding(f)
            for f in analysis.findings
            if member_ids & set(f["devices"]) or f["detail"].get("room") == room.id
        ]
        return {
            "room": info,
            "adjacent": adjacent,
            "devices": _capped(devices, ROOM_MAX_DEVICES),
            "links": {"within": inside, "to_other_rooms": outside},
            "findings": _capped(findings, CONTEXT_MAX_FINDINGS),
        }

    def run(self, tool: str, args: dict[str, Any]) -> dict[str, Any]:
        """Dispatch one tool call by name (shared by llm.py and the query
        service)."""
        if tool == "summary":
            return self.summary()
        if tool == "device_context":
            return self.device_context(_required(args, "device"))
        if tool == "path":
            return self.path(_required(args, "a"), _required(args, "b"))
        if tool == "weak_links":
            return self.weak_links(args.get("layer"), args.get("level"))
        if tool == "room":
            return self.room(_required(args, "room"))
        raise ValueError(f"Unknown tool {tool!r}; expected one of {', '.join(TOOLS)}")


def _diverse(findings: list[dict[str, Any]], limit: int) -> list[dict[str, Any]]:
    """The first `limit` findings (already ordered by severity), but with no
    type taking more than its share while others wait: 140 weak links must
    not hide the one unplaced router. Keeps the original order."""
    per_type = max(3, limit // 3)
    chosen: list[int] = []
    taken: dict[str, int] = {}
    for i, f in enumerate(findings):
        if len(chosen) >= limit:
            break
        if taken.get(f["type"], 0) < per_type:
            chosen.append(i)
            taken[f["type"]] = taken.get(f["type"], 0) + 1
    for i in range(len(findings)):
        if len(chosen) >= limit:
            break
        if i not in chosen:
            chosen.append(i)
    return [findings[i] for i in sorted(chosen)]


def _confidence(device: Device) -> str:
    """How far to trust a placed device's point: "approximate" for a pin
    bulk-placed by area and not yet dragged or confirmed, else "confirmed"."""
    return "approximate" if device.approximate else "confirmed"


def _required(args: dict[str, Any], key: str) -> str:
    value = args.get(key)
    if not value:
        raise ValueError(f"'{key}' is required")
    return str(value)


def _resolve(query: str, candidates: list[tuple[str, Any]], what: str, label) -> Any:
    """Exact name (case-insensitive), else a unique substring."""
    folded = query.casefold().strip()
    exact = _unique([obj for name, obj in candidates if name and name.casefold() == folded])
    if len(exact) == 1:
        return exact[0]
    pool = exact or _unique([obj for name, obj in candidates if name and folded in name.casefold()])
    if len(pool) == 1:
        return pool[0]
    if not pool:
        raise NotFound(f"No {what} matches {query!r}")
    options = sorted(label(obj) for obj in pool)
    shown = ", ".join(options[:8]) + (f" (+{len(options) - 8} more)" if len(options) > 8 else "")
    raise NotFound(f"{query!r} matches several {what}s: {shown}")


def _unique(items: list[Any]) -> list[Any]:
    seen: set[int] = set()
    out = []
    for item in items:
        if id(item) not in seen:
            seen.add(id(item))
            out.append(item)
    return out


async def async_run_tool(hass: Any, tool: str, args: dict[str, Any]) -> dict[str, Any]:
    """Build the model from Home Assistant and run one tool."""
    from .model import async_build_model

    return SpatialAI(await async_build_model(hass)).run(tool, args)
