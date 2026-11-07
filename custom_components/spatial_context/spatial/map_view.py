"""`get_map`'s optional fields: one floor or room, a compact form, and the
radio links between the exported devices.

Applied to the export after it is built, so a call with no fields never
reaches this module and returns exactly what it always did. With any field,
devices are also filed under the room their pin actually sits in (the
spatial model's server-side room), not the `room_id` the panel last saved,
which goes stale when rooms are redrawn or deleted.
"""

from __future__ import annotations

from typing import Any


class MapFilterError(ValueError):
    """A floor or room that matches nothing."""


def _matches(query: str, *values: Any) -> bool:
    folded = query.casefold().strip()
    return any(isinstance(v, str) and v.casefold() == folded for v in values)


def filter_map(
    data: dict[str, Any], floor: str | None = None, room: str | None = None
) -> dict[str, Any]:
    """Keep one floor (floor_id or name) and/or one room (id or name).
    Outdoor devices belong to no floor, so a filter drops them; a room
    filter also drops walls, which belong to the floor, not the room."""
    floors = data["floors"]
    if floor:
        floors = [f for f in floors if _matches(floor, f["floor_id"], f["name"])]
        if not floors:
            raise MapFilterError(f"No floor matches {floor!r}")
    if room:
        kept = []
        for f in floors:
            rooms = [r for r in f["rooms"] if _matches(room, r["id"], r["name"])]
            if rooms:
                kept.append({**f, "rooms": rooms, "walls": []})
        if not kept:
            raise MapFilterError(f"No room matches {room!r}")
        floors = kept
    return {**data, "floors": floors, "outdoor_devices": []}


def refile_devices(data: dict[str, Any], model: Any) -> dict[str, Any]:
    """Move each floor's devices to the room the model puts them in;
    devices in no room go to "Unassigned", as in the export."""
    floors = []
    for f in data["floors"]:
        devices = [d for r in f["rooms"] for d in r["devices"]]
        named = [r for r in f["rooms"] if r["id"] is not None]
        by_room: dict[Any, list[dict[str, Any]]] = {r["id"]: [] for r in named}
        unassigned = []
        for d in devices:
            placed = model.devices.get(d.get("device_id"))
            room_id = placed.room_id if placed is not None and placed.level_id == f["floor_id"] else None
            (by_room[room_id] if room_id in by_room else unassigned).append(d)
        rooms = [{**r, "devices": by_room[r["id"]]} for r in named]
        if unassigned:
            rooms.append({"id": None, "name": "Unassigned", "devices": unassigned})
        floors.append({**f, "rooms": rooms})
    return {**data, "floors": floors}


def _r(value: Any, digits: int) -> Any:
    return round(value, digits) if isinstance(value, float) else value


def _compact_device(device: dict[str, Any], room_name: str | None) -> dict[str, Any]:
    out = {k: v for k, v in device.items() if v is not None}
    if out.get("x_m") is not None:
        out.pop("x", None)
        out.pop("y", None)
    for key in ("x_m", "y_m", "height_m"):
        if key in out:
            out[key] = _r(out[key], 1)
    for key in ("x", "y"):
        if key in out:
            out[key] = _r(out[key], 1)
    if room_name is not None and out.get("area_name") == room_name:
        out.pop("area_name")
    return out


def compact_map(data: dict[str, Any]) -> dict[str, Any]:
    """Round metres to 0.1 and dB to 1, drop editor units where metres
    exist, and drop repeated labels and empty values."""
    floors = []
    for f in data["floors"]:
        rooms = [
            {
                **{k: v for k, v in r.items() if k != "devices" and v is not None},
                "devices": [_compact_device(d, r["name"]) for d in r["devices"]],
            }
            for r in f["rooms"]
        ]
        walls = []
        for w in f["walls"]:
            wall = {
                "id": w["id"],
                "material": w["material"],
                "thickness_cm": _r(w["thickness_cm"], 0),
                "attenuation_db": round(w["attenuation_db"]),
            }
            if w.get("points_m") is not None:
                wall["points_m"] = [[round(x, 1), round(y, 1)] for x, y in w["points_m"]]
            else:
                wall["points"] = w["points"]
            openings = []
            for o in w.get("openings", []):
                if o.get("x_m") is not None:
                    openings.append(
                        {
                            "type": o["type"],
                            "x_m": round(o["x_m"], 1),
                            "y_m": round(o["y_m"], 1),
                            "width_m": round(o["width_m"], 1),
                        }
                    )
                else:
                    openings.append({k: o[k] for k in ("type", "x", "y", "width")})
            if openings:
                wall["openings"] = openings
            walls.append(wall)
        floor_out: dict[str, Any] = {"floor_id": f["floor_id"], "name": f["name"]}
        if f.get("meters_per_unit") is None:
            floor_out["meters_per_unit"] = None  # says "uncalibrated"
        floor_out["rooms"] = rooms
        if walls:
            floor_out["walls"] = walls
        floors.append(floor_out)
    out = {
        **data,
        "floors": floors,
        "outdoor_devices": [_compact_device(d, None) for d in data["outdoor_devices"]],
    }
    if data.get("property_meters_per_unit") is None:
        out.pop("property_meters_per_unit", None)
    return out


def exported_device_ids(data: dict[str, Any]) -> set[str]:
    ids = {
        d["device_id"]
        for f in data["floors"]
        for r in f["rooms"]
        for d in r["devices"]
        if d.get("device_id")
    }
    ids.update(d["device_id"] for d in data["outdoor_devices"] if d.get("device_id"))
    return ids


def link_rows(analysis: Any, device_ids: set[str]) -> list[dict[str, Any]]:
    """Every link with both ends among `device_ids`, with its RF report,
    rounded. Ends are HA device ids, as in the rest of the export."""
    rows = []
    for link in analysis.links:
        if link.a not in device_ids or link.b not in device_ids:
            continue
        r = link.report
        row: dict[str, Any] = {
            "a": link.a,
            "b": link.b,
            "layer": link.layer,
            "network": link.network,
            "kinds": link.kinds,
        }
        if r["measured_dbm"] is not None:
            row["measured_dbm"] = round(r["measured_dbm"])
            row["measured_kind"] = r["measured_kind"]
        if r["distance_m"] is not None:
            row["distance_m"] = round(r["distance_m"], 1)
            row["walls"] = len(r["walls"])
            row["wall_db"] = round(r["wall_db"])
            row["slabs"] = r["slabs"]
            row["predicted_dbm"] = round(r["predicted_dbm"])
            if r["gap_db"] is not None:
                row["gap_db"] = round(r["gap_db"])
        rows.append(row)
    return rows


async def async_get_map_view(
    hass: Any,
    floor: str | None = None,
    room: str | None = None,
    compact: bool = False,
    include_links: bool = False,
) -> dict[str, Any]:
    """get_map with its optional fields applied."""
    from ..export import async_get_map_data

    from .findings import analyse
    from .model import async_build_model

    data = await async_get_map_data(hass)
    model = await async_build_model(hass)
    data = refile_devices(data, model)
    if floor or room:
        data = filter_map(data, floor, room)
    if include_links:
        data["links"] = link_rows(analyse(model), exported_device_ids(data))
    if compact:
        data = compact_map(data)
    return data
