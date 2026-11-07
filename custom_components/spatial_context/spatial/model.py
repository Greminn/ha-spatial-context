"""A metric model of the house, built from the stored layout and HA's
registries.

The stored layout is in each floor's own editor units, with a pin's
`room_id` written by the panel when the pin was last saved. That is the
right shape for an editor but not for reasoning: distances need metres,
cross-floor geometry needs to know which floors share a coordinate system,
and a stored `room_id` goes stale when a room is redrawn or deleted while
its pins stay put (the export then files those devices under a room that no
longer exists, or under none). So the model:

- recomputes every device's room from where its pin sits, on the server;
- converts to metres with the floor's calibration, or, for a floor that has
  none, with another calibrated floor of the same building (Align Floors
  puts aligned floors in one coordinate system, so one scale fits all);
- puts each level at `level x floor_height_m` and each device at that plus
  its pin height (default 1.0 m);
- only relates two floors geometrically when they share a `building_id`.
  Separate structures (a detached garage) have unrelated coordinates.

A floor with no usable scale is kept (its rooms and room membership still
work in editor units) but flagged, and gets no metric output.

`build_model` is pure; `async_build_model` gathers its inputs from Home
Assistant.
"""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field
import math
from typing import Any

from . import geometry

DEFAULT_FLOOR_HEIGHT_M = 3.0
DEFAULT_PIN_HEIGHT_M = 1.0
PROPERTY_LEVEL_ID = "__property__"

# Rooms sharing at least this much boundary (metres) are adjacent, and two
# traced edges this close (metres) count as the same wall line.
ADJACENCY_MIN_SHARED_M = 0.5
ADJACENCY_TOLERANCE_M = 0.3


@dataclass(slots=True)
class Level:
    """One HA floor that has a layout."""

    id: str
    name: str
    level: int | None
    building_id: str | None
    meters_per_unit: float | None
    # Floor id whose calibration this level borrows (itself when calibrated
    # directly), None when uncalibrated.
    scale_from: str | None
    elevation_m: float
    rooms: list[dict[str, Any]] = field(default_factory=list)
    walls: list[dict[str, Any]] = field(default_factory=list)
    openings: list[dict[str, Any]] = field(default_factory=list)

    @property
    def calibrated(self) -> bool:
        return self.meters_per_unit is not None


@dataclass(slots=True)
class Room:
    id: str
    level_id: str
    name: str
    area_id: str | None
    points: list[list[float]]
    area_m2: float | None
    centroid_m: tuple[float, float] | None


@dataclass(slots=True)
class Device:
    device_id: str
    name: str
    area_id: str | None = None
    integration: str | None = None
    level_id: str | None = None  # None = not placed anywhere
    x: float | None = None  # editor units
    y: float | None = None
    x_m: float | None = None
    y_m: float | None = None
    z_m: float | None = None
    room_id: str | None = None  # recomputed from the pin position
    stored_room_id: str | None = None  # what the saved pin says
    # Bulk-placed by area and not yet dragged or confirmed: the room is
    # right, the exact point is a guess.
    approximate: bool = False

    @property
    def placed(self) -> bool:
        return self.level_id is not None


@dataclass(slots=True)
class SpatialModel:
    levels: dict[str, Level]
    rooms: dict[str, Room]
    devices: dict[str, Device]
    area_names: dict[str, str]
    settings: dict[str, Any]
    wall_db: Callable[[dict[str, Any]], float]
    snapshots: list[Any] = field(default_factory=list)
    _adjacency: dict[str, list[str]] | None = None

    def level_order(self) -> list[Level]:
        """Lowest level first; unleveled floors last, then by name."""
        return sorted(
            self.levels.values(),
            key=lambda lv: (lv.level is None, lv.level or 0, lv.name.casefold(), lv.id),
        )

    def path(self, a: Device, b: Device) -> dict[str, Any] | None:
        """Geometry of the straight path between two placed devices:
        {distance_m, same_level, slabs, crossings[{level_id, wall_id,
        material, db, through_opening}]}. None when there is no metric
        relation (either end unplaced or uncalibrated, or different
        buildings), with the reason in `path_unknown_reason`."""
        if self.path_unknown_reason(a, b) is not None:
            return None
        assert a.x_m is not None and b.x_m is not None
        dz = (b.z_m or 0.0) - (a.z_m or 0.0)
        d = math.sqrt((b.x_m - a.x_m) ** 2 + (b.y_m - a.y_m) ** 2 + dz**2)  # type: ignore[operator]
        if a.level_id == PROPERTY_LEVEL_ID:
            # Outdoors: the Property tab has no walls.
            return {"distance_m": d, "same_level": True, "slabs": 0, "crossings": []}
        la, lb = self.levels[a.level_id], self.levels[b.level_id]  # type: ignore[index]
        if la.id == lb.id:
            crossings = self._crossings(la, (a.x, a.y), (b.x, b.y))
            return {"distance_m": d, "same_level": True, "slabs": 0, "crossings": crossings}
        # Different levels of one building: split the 2D path where it passes
        # each level's height band, and count each level's walls on its part.
        building = sorted(
            (lv for lv in self.levels.values() if lv.building_id == la.building_id),
            key=lambda lv: lv.elevation_m,
        )
        za, zb = a.z_m or 0.0, b.z_m or 0.0
        crossings: list[dict[str, Any]] = []
        for i, lv in enumerate(building):
            lo = lv.elevation_m if i > 0 else -math.inf
            hi = building[i + 1].elevation_m if i + 1 < len(building) else math.inf
            t0, t1 = _t_band(za, zb, lo, hi)
            if t1 <= t0:
                continue
            p0 = (a.x + (b.x - a.x) * t0, a.y + (b.y - a.y) * t0)  # type: ignore[operator]
            p1 = (a.x + (b.x - a.x) * t1, a.y + (b.y - a.y) * t1)  # type: ignore[operator]
            crossings.extend(self._crossings(lv, p0, p1))
        slabs = abs((la.level or 0) - (lb.level or 0)) or 1
        return {"distance_m": d, "same_level": False, "slabs": slabs, "crossings": crossings}

    def path_unknown_reason(self, a: Device, b: Device) -> str | None:
        if not a.placed or not b.placed:
            return "unplaced"
        if a.x_m is None or b.x_m is None:
            return "uncalibrated"
        if (a.level_id == PROPERTY_LEVEL_ID) != (b.level_id == PROPERTY_LEVEL_ID):
            # The Property tab is its own coordinate system.
            return "different_buildings"
        if a.level_id == b.level_id:
            return None
        la, lb = self.levels[a.level_id], self.levels[b.level_id]  # type: ignore[index]
        if la.building_id is None or la.building_id != lb.building_id:
            return "different_buildings"
        return None

    def _crossings(
        self, level: Level, p0: tuple, p1: tuple
    ) -> list[dict[str, Any]]:
        result = geometry.walls_crossed(
            p0, p1, level.walls, level.openings, self.wall_db
        )
        return [
            {
                "level_id": level.id,
                "wall_id": c["wall_id"],
                "material": c["material"],
                "db": c["db"],
                "through_opening": c["through_opening"],
            }
            for c in result["crossings"]
        ]

    def adjacency(self) -> dict[str, list[str]]:
        """Room id -> ids of rooms on the same level sharing a boundary of at
        least ADJACENCY_MIN_SHARED_M. Calibrated levels only (the tolerance is
        a real length)."""
        if self._adjacency is not None:
            return self._adjacency
        adj: dict[str, list[str]] = {room_id: [] for room_id in self.rooms}
        for level in self.levels.values():
            if not level.calibrated:
                continue
            mpu = level.meters_per_unit
            rooms = [
                (r["id"], [[p[0] * mpu, p[1] * mpu] for p in r["points"]])  # type: ignore[operator]
                for r in level.rooms
                if len(r.get("points") or []) >= 3 and r["id"] in self.rooms
            ]
            for i, (id_a, poly_a) in enumerate(rooms):
                for id_b, poly_b in rooms[i + 1 :]:
                    shared = geometry.shared_edges(poly_a, poly_b, ADJACENCY_TOLERANCE_M)
                    if sum(geometry.distance(s, e) for s, e in shared) >= ADJACENCY_MIN_SHARED_M:
                        adj[id_a].append(id_b)
                        adj[id_b].append(id_a)
        self._adjacency = adj
        return adj

    def room_at(self, level_id: str, x_m: float, y_m: float) -> str | None:
        level = self.levels.get(level_id)
        if level is None or not level.calibrated:
            return None
        mpu = level.meters_per_unit
        return geometry.find_room_for_point(x_m / mpu, y_m / mpu, level.rooms)  # type: ignore[operator]


def _t_band(za: float, zb: float, lo: float, hi: float) -> tuple[float, float]:
    """The part [t0, t1] of the path (z going from za to zb) inside the
    height band [lo, hi)."""
    if za == zb:
        return (0.0, 1.0) if lo <= za < hi else (0.0, 0.0)
    ta, tb = (lo - za) / (zb - za), (hi - za) / (zb - za)
    t0, t1 = min(ta, tb), max(ta, tb)
    return max(0.0, t0), min(1.0, t1)


def _scale(layout: dict[str, Any]) -> float | None:
    """storage.meters_per_unit, repeated here to keep this module pure."""
    scale = layout.get("scale")
    if not scale:
        return None
    (x1, y1), (x2, y2) = scale["points"]
    units = math.hypot(x2 - x1, y2 - y1)
    if units == 0 or not scale.get("meters"):
        return None
    return scale["meters"] / units


def build_model(
    floors_meta: list[dict[str, Any]],
    layouts: dict[str, dict[str, Any]],
    property_layout: dict[str, Any] | None,
    property_mpu: float | None,
    area_names: dict[str, str],
    devices_meta: dict[str, dict[str, Any]],
    settings: dict[str, Any],
    wall_db: Callable[[dict[str, Any]], float],
    room_name: Callable[[str | None, str | None, dict[str, str]], str],
) -> SpatialModel:
    """Build the model from plain data.

    floors_meta: registry_snapshot.async_list_floors rows (floor_id, name,
    level). layouts: stored layouts of live floors. devices_meta: device_id
    -> {name, area_id, integration} for every device worth knowing (placed,
    placeable or seen in a link snapshot).
    """
    floor_height = float(settings.get("floor_height_m") or DEFAULT_FLOOR_HEIGHT_M)

    # A floor's own calibration, else one borrowed from its building.
    own_scale = {fid: _scale(layout) for fid, layout in layouts.items()}
    building_scale: dict[str, tuple[str, float]] = {}
    for fid in sorted(layouts):
        building_id = layouts[fid].get("building_id")
        if building_id and own_scale[fid] is not None and building_id not in building_scale:
            building_scale[building_id] = (fid, own_scale[fid])  # type: ignore[assignment]

    levels: dict[str, Level] = {}
    rooms: dict[str, Room] = {}
    devices: dict[str, Device] = {}

    def device(device_id: str) -> Device:
        if device_id not in devices:
            meta = devices_meta.get(device_id, {})
            devices[device_id] = Device(
                device_id=device_id,
                name=meta.get("name") or device_id,
                area_id=meta.get("area_id"),
                integration=meta.get("integration"),
            )
        return devices[device_id]

    for meta in floors_meta:
        fid = meta["floor_id"]
        layout = layouts.get(fid)
        if layout is None:
            continue
        building_id = layout.get("building_id")
        mpu, scale_from = own_scale.get(fid), fid
        if mpu is None and building_id in building_scale:
            scale_from, mpu = building_scale[building_id]
        if mpu is None:
            scale_from = None
        level_num = meta.get("level")
        level = Level(
            id=fid,
            name=meta.get("name") or fid,
            level=level_num,
            building_id=building_id,
            meters_per_unit=mpu,
            scale_from=scale_from,
            elevation_m=(level_num or 0) * floor_height,
            rooms=list(layout.get("rooms") or []),
            walls=list(layout.get("walls") or []),
            openings=list(layout.get("openings") or []),
        )
        levels[fid] = level

        for raw in level.rooms:
            points = raw.get("points") or []
            metric = [[p[0] * mpu, p[1] * mpu] for p in points] if mpu else None
            rooms[raw["id"]] = Room(
                id=raw["id"],
                level_id=fid,
                name=room_name(raw.get("name"), raw.get("area_id"), area_names),
                area_id=raw.get("area_id"),
                points=points,
                area_m2=geometry.polygon_area(metric) if metric and len(metric) >= 3 else None,
                centroid_m=geometry.centroid(metric) if metric and len(metric) >= 3 else None,
            )

        for pin in layout.get("pins") or []:
            device_id = pin.get("device_id")
            if not device_id:
                continue
            dev = device(device_id)
            if pin.get("label_override"):
                dev.name = pin["label_override"]
            dev.level_id = fid
            dev.x, dev.y = pin["x"], pin["y"]
            dev.approximate = bool(pin.get("approximate", False))
            dev.stored_room_id = pin.get("room_id")
            dev.room_id = geometry.find_room_for_point(pin["x"], pin["y"], level.rooms)
            if mpu:
                height = pin.get("height_m")
                dev.x_m, dev.y_m = pin["x"] * mpu, pin["y"] * mpu
                dev.z_m = level.elevation_m + (
                    height if height is not None else DEFAULT_PIN_HEIGHT_M
                )

    for pin in (property_layout or {}).get("pins") or []:
        device_id = pin.get("device_id")
        if not device_id:
            continue
        dev = device(device_id)
        if pin.get("label_override"):
            dev.name = pin["label_override"]
        dev.level_id = PROPERTY_LEVEL_ID
        dev.x, dev.y = pin["x"], pin["y"]
        dev.approximate = bool(pin.get("approximate", False))
        if property_mpu:
            height = pin.get("height_m")
            dev.x_m, dev.y_m = pin["x"] * property_mpu, pin["y"] * property_mpu
            dev.z_m = height if height is not None else DEFAULT_PIN_HEIGHT_M

    for device_id in devices_meta:
        device(device_id)

    return SpatialModel(
        levels=levels,
        rooms=rooms,
        devices=devices,
        area_names=area_names,
        settings=settings,
        wall_db=wall_db,
    )


async def async_build_model(hass: Any) -> SpatialModel:
    """Gather the layout, registries, settings and link snapshots from Home
    Assistant and build the model.

    Imports are local so the pure parts of this package load without Home
    Assistant (the tests run that way)."""
    from homeassistant.helpers import device_registry as dr

    from .. import registry_snapshot
    from ..export import _wall_attenuation_db
    from ..room_names import room_display_name
    from ..storage import (
        async_get_all_layouts,
        async_get_property_layout,
        async_get_settings,
        live_layouts,
        live_placements,
        property_meters_per_unit,
    )
    from .links_adapter import async_get_snapshots

    floors_meta = await registry_snapshot.async_list_floors(hass)
    layouts = live_layouts(
        await async_get_all_layouts(hass), {f["floor_id"] for f in floors_meta}
    )
    property_layout = await async_get_property_layout(hass)
    property_mpu = property_meters_per_unit(
        layouts, live_placements(layouts, property_layout.get("placements", []))
    )
    area_names = {
        a["area_id"]: a["name"] for a in registry_snapshot.async_list_areas(hass)
    }
    settings = await async_get_settings(hass)
    snapshots = await async_get_snapshots(hass)

    device_registry = dr.async_get(hass)
    devices_meta: dict[str, dict[str, Any]] = {}
    for entity in await registry_snapshot.async_list_placeable_entities(hass):
        device_id = entity.get("device_id")
        if device_id and device_id not in devices_meta:
            devices_meta[device_id] = {
                "name": entity.get("device_name") or entity.get("name"),
                "integration": entity.get("integration_domain"),
            }
    referenced = {
        node.device_id
        for snapshot in snapshots
        for node in snapshot.nodes
        if node.device_id
    }
    for device_id in set(devices_meta) | referenced:
        entry = device_registry.async_get(device_id)
        if entry is None:
            continue
        meta = devices_meta.setdefault(device_id, {})
        meta.setdefault("name", entry.name_by_user or entry.name)
        meta["area_id"] = entry.area_id
        if not meta.get("integration"):
            config_entry_id = getattr(entry, "config_entry_id", None)
            config_entry = (
                hass.config_entries.async_get_entry(config_entry_id)
                if config_entry_id
                else None
            )
            meta["integration"] = config_entry.domain if config_entry else None

    model = build_model(
        floors_meta,
        layouts,
        property_layout,
        property_mpu,
        area_names,
        devices_meta,
        settings,
        _wall_attenuation_db,
        room_display_name,
    )
    model.snapshots = snapshots
    return model
