"""Shared setup for the spatial engine tests: load the real `spatial/`
package without Home Assistant, the real wall-loss table from export.py, and
a synthetic large home (~300 devices, 2 levels, 60 rooms, ~1,500 links)
generated deterministically.
"""

from __future__ import annotations

import importlib
import math
import random
import sys
import types
from typing import Any

import stubs

PKG = "sc_spatial"


def load_spatial() -> types.SimpleNamespace:
    """Import the real spatial modules as package `sc_spatial`. export.py is
    loaded for its material table, with its HA-facing imports stubbed."""
    for name in [m for m in sys.modules if m == PKG or m.startswith(PKG + ".")]:
        del sys.modules[name]
    package = stubs.new_package(PKG)
    package.__path__ = [str(stubs.PKG_DIR)]  # type: ignore[attr-defined]
    stubs.stub_ha_core()
    stubs.stub(f"{PKG}.registry_snapshot")
    stubs.stub(
        f"{PKG}.storage",
        **{
            name: None
            for name in (
                "async_get_all_layouts",
                "async_get_floor_layout",
                "async_get_property_layout",
                "live_layouts",
                "live_placements",
                "meters_per_unit",
                "property_meters_per_unit",
            )
        },
    )
    export = importlib.import_module(f"{PKG}.export")
    return types.SimpleNamespace(
        geometry=importlib.import_module(f"{PKG}.spatial.geometry"),
        model=importlib.import_module(f"{PKG}.spatial.model"),
        rf=importlib.import_module(f"{PKG}.spatial.rf"),
        findings=importlib.import_module(f"{PKG}.spatial.findings"),
        ai=importlib.import_module(f"{PKG}.spatial.ai"),
        map_view=importlib.import_module(f"{PKG}.spatial.map_view"),
        adapter=importlib.import_module(f"{PKG}.spatial.links_adapter"),
        links=importlib.import_module(f"{PKG}.links.model"),
        room_names=importlib.import_module(f"{PKG}.room_names"),
        export=export,
        wall_db=export._wall_attenuation_db,
    )


def build(sp: types.SimpleNamespace, home: dict[str, Any], settings: dict | None = None):
    """A SpatialModel from a home dict (see synthetic_home)."""
    model = sp.model.build_model(
        home["floors_meta"],
        home["layouts"],
        home.get("property"),
        home.get("property_mpu"),
        home["area_names"],
        home["devices_meta"],
        {**DEFAULT_SETTINGS, **(settings or {})},
        sp.wall_db,
        sp.room_names.room_display_name,
    )
    model.snapshots = home.get("snapshots", [])
    return model


DEFAULT_SETTINGS = {
    "floor_height_m": 3.0,
    "weak_link_threshold_db": 25,
    "rf_path_loss_exponent": 2.0,
    "rf_slab_loss_db": 13,
}

# 25 editor units = 1 m.
SCALE = {"points": [[0, 0], [100, 0]], "meters": 4}
UNITS_PER_M = 25

_ROOM_NAMES = [
    "Kitchen", "Living Room", "Dining Room", "Hallway", "Entry", "Office",
    "Bedroom", "Bathroom", "Laundry", "Pantry", "Garage", "Mudroom",
    "Guest Room", "Closet", "Family Room", "Den", "Studio", "Gym",
]
_KINDS = [
    "Light", "Motion", "Plug", "Contact", "Temperature", "Switch", "Leak",
    "Blind", "Speaker", "Camera", "Button", "Bulb",
]


def _grid_level(fid: str, cols: int, rows: int, w_m: float, h_m: float, start: int, rng: random.Random):
    """Rooms on a cols x rows grid, one wall line per grid line (exterior
    brick, interior timber, a few concrete), a door in the middle of every
    interior wall between two rooms."""
    u = UNITS_PER_M
    rooms, walls, openings = [], [], []
    for r in range(rows):
        for c in range(cols):
            n = start + r * cols + c
            x0, y0 = c * w_m * u, r * h_m * u
            x1, y1 = x0 + w_m * u, y0 + h_m * u
            rooms.append(
                {
                    "id": f"room-{fid}-{r}-{c}",
                    "name": "" if n % 3 == 0 else f"{_ROOM_NAMES[n % len(_ROOM_NAMES)]} {n}",
                    "area_id": f"area_{n}",
                    "points": [[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
                }
            )
    for c in range(cols + 1):
        x = c * w_m * u
        material = "brick_veneer" if c in (0, cols) else ("concrete_block" if c == cols // 2 else "timber_frame")
        wid = f"wall-{fid}-v{c}"
        walls.append({"id": wid, "material": material, "points": [[x, 0], [x, rows * h_m * u]]})
        if 0 < c < cols:
            for r in range(rows):
                openings.append(
                    {"id": f"door-{wid}-{r}", "wallId": wid, "type": "door",
                     "x": x, "y": (r + 0.5) * h_m * u, "width": 0.9 * u}
                )
    for r in range(rows + 1):
        y = r * h_m * u
        material = "brick_veneer" if r in (0, rows) else "timber_frame"
        walls.append({"id": f"wall-{fid}-h{r}", "material": material, "points": [[0, y], [cols * w_m * u, y]]})
    return rooms, walls, openings


def synthetic_home(seed: int = 7) -> dict[str, Any]:
    """A deterministic large home: Main (45 rooms) and Upper (15 rooms) in one
    building, 300 devices (250 placed), Zigbee (133 nodes), two Thread
    networks and Wi-Fi (6 APs), ~1,500 directed links."""
    sp_links = importlib.import_module(f"{PKG}.links.model")
    LinkNode, Link, LinkMetrics, LinkSnapshot = (
        sp_links.LinkNode, sp_links.Link, sp_links.LinkMetrics, sp_links.LinkSnapshot,
    )
    rng = random.Random(seed)
    main_rooms, main_walls, main_openings = _grid_level("main", 9, 5, 4.4, 6.0, 0, rng)
    up_rooms, up_walls, up_openings = _grid_level("upper", 5, 3, 4.0, 5.0, 45, rng)
    layouts = {
        "main": {"building_id": "house", "scale": SCALE, "rooms": main_rooms,
                 "walls": main_walls, "openings": main_openings, "pins": []},
        "upper": {"building_id": "house", "scale": SCALE, "rooms": up_rooms,
                  "walls": up_walls, "openings": up_openings, "pins": []},
    }
    floors_meta = [
        {"floor_id": "main", "name": "Main", "level": 0},
        {"floor_id": "upper", "name": "Upper", "level": 1},
    ]
    all_rooms = [("main", r) for r in main_rooms] + [("upper", r) for r in up_rooms]
    area_names = {}
    for i, (_, room) in enumerate(all_rooms):
        area_names[room["area_id"]] = room["name"] or f"{_ROOM_NAMES[i % len(_ROOM_NAMES)]} Area {i}"

    devices_meta: dict[str, dict[str, Any]] = {}
    positions: dict[str, tuple[str, float, float]] = {}
    integrations = ["zha"] * 133 + ["matter"] * 40 + ["unifi"] * 6 + ["esphome"] * 60 + ["hue"] * 30 + ["sonos"] * 31
    for i in range(300):
        did = f"dev{i:03d}"
        fid, room = all_rooms[(i * 7) % len(all_rooms)] if i % 9 else all_rooms[i % len(all_rooms)]
        (x0, y0), _, (x1, y1), _ = room["points"]
        x = rng.uniform(x0 + 5, x1 - 5)
        y = rng.uniform(y0 + 5, y1 - 5)
        area = room["area_id"] if i % 50 else "area_0"  # a few area mismatches
        name = f"{area_names[room['area_id']]} {_KINDS[i % len(_KINDS)]} {i}"
        devices_meta[did] = {"name": name, "area_id": area, "integration": integrations[i]}
        if i % 6 != 5:  # 250 placed, 50 not
            pin = {"id": f"pin{i}", "device_id": did, "x": x, "y": y,
                   "room_id": room["id"] if i % 40 else None, "height_m": 2.4 if i % 11 == 0 else None}
            layouts[fid]["pins"].append(pin)
            positions[did] = (fid, x / UNITS_PER_M, y / UNITS_PER_M)

    def dist(a: str, b: str) -> float:
        if a not in positions or b not in positions:
            return 8.0
        fa, xa, ya = positions[a]
        fb, xb, yb = positions[b]
        return math.hypot(xa - xb, ya - yb) + (3.0 if fa != fb else 0.0)

    snapshots = []
    # Zigbee: dev000 coordinator, dev001-060 routers, dev061-132 end devices.
    zb_nodes, zb_links = [], []
    zb_ids = [f"dev{i:03d}" for i in range(133)]
    key = {did: f"0x{0x1000 + i:04X}" for i, did in enumerate(zb_ids)}
    for i, did in enumerate(zb_ids):
        role = "coordinator" if i == 0 else "router" if i <= 60 else "end_device"
        zb_nodes.append(LinkNode(key=key[did], role=role, device_id=did, name=devices_meta[did]["name"]))
    routers = zb_ids[:61]
    for a in routers:
        near = sorted((r for r in routers if r != a), key=lambda r: dist(a, r))[:10]
        for b in near:
            lqi = max(2, min(255, int(255 - dist(a, b) * 9 + rng.uniform(-30, 30))))
            if rng.random() < 0.03:
                lqi = rng.randint(5, 25)  # interference
            zb_links.append(Link(source=key[a], target=key[b], kind="neighbor",
                                 metrics=LinkMetrics(lqi=lqi, lqi_norm=float(lqi)),
                                 attrs={"relationship": "Sibling"}))
        for b in rng.sample(routers, 8):
            if b != a:
                zb_links.append(Link(source=key[a], target=key[b], kind="route"))
    for e in zb_ids[61:]:
        parent = min(routers, key=lambda r: dist(e, r)) if rng.random() > 0.1 else rng.choice(routers)
        lqi = max(2, min(255, int(240 - dist(e, parent) * 10)))
        zb_links.append(Link(source=key[parent], target=key[e], kind="neighbor",
                             metrics=LinkMetrics(lqi=lqi, lqi_norm=float(lqi)), attrs={"relationship": "Child"}))
        zb_links.append(Link(source=key[e], target=key[parent], kind="neighbor",
                             metrics=LinkMetrics(lqi=lqi, lqi_norm=float(lqi)), attrs={"relationship": "Parent"}))
    snapshots.append(LinkSnapshot("zigbee", "zha-ch20", "zha", "2026-11-06T12:00:00+00:00", zb_nodes, zb_links))

    # Thread: two networks; HA's has a border router with no HA device.
    for net, ids in (("ha-thread", range(133, 163)), ("apple-home", range(163, 173))):
        nodes, links = [], []
        tids = [f"dev{i:03d}" for i in ids]
        rloc = {did: f"0x{(j + 1) * 0x400:04X}" for j, did in enumerate(tids)}
        for j, did in enumerate(tids):
            role = "leader" if j == 0 else "router" if j < len(tids) // 2 else "end_device"
            nodes.append(LinkNode(key=rloc[did], role=role, device_id=did))
        nodes.append(LinkNode(key="0xFC00", role="border_router", device_id=None, name="Apple TV"))
        trouters = [d for d, n in zip(tids, nodes) if n.role in ("leader", "router")]
        for a in trouters:
            for b in sorted((r for r in trouters if r != a), key=lambda r: dist(a, r))[:5]:
                rssi = -40 - 20 * math.log10(max(dist(a, b), 1)) - rng.uniform(0, 25)
                links.append(Link(source=rloc[a], target=rloc[b], kind="neighbor",
                                  metrics=LinkMetrics(rssi_dbm=round(rssi), thread_lqi=3 if rssi > -70 else 1)))
            links.append(Link(source=rloc[a], target="0xFC00", kind="neighbor", metrics=LinkMetrics(rssi_dbm=-60)))
        for e in tids:
            if e in trouters:
                continue
            parent = min(trouters, key=lambda r: dist(e, r))
            links.append(Link(source=rloc[e], target=rloc[parent], kind="parent",
                              metrics=LinkMetrics(rssi_dbm=round(-45 - 2 * dist(e, parent)))))
        snapshots.append(LinkSnapshot("thread", net, "matter", "2026-11-06T12:00:00+00:00", nodes, links))

    # Wi-Fi: 6 APs (dev173-178, one unplaced), 120 clients.
    aps = [f"dev{i:03d}" for i in range(173, 179)]
    nodes = [LinkNode(key=ap, role="access_point", device_id=ap) for ap in aps]
    links = []
    for i in range(179, 299):
        client = f"dev{i:03d}"
        ap = min(aps, key=lambda a: dist(client, a))
        nodes.append(LinkNode(key=client, role="client", device_id=client))
        links.append(Link(source=client, target=ap, kind="association",
                          metrics=LinkMetrics(rssi_dbm=round(-30 - 25 * math.log10(max(dist(client, ap), 1)) - rng.uniform(0, 15)))))
    snapshots.append(LinkSnapshot("wifi", "unifi", "unifi", "2026-11-06T12:00:00+00:00", nodes, links))

    return {
        "floors_meta": floors_meta,
        "layouts": layouts,
        "area_names": area_names,
        "devices_meta": devices_meta,
        "snapshots": snapshots,
    }
