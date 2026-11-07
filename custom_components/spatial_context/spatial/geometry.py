"""Plane geometry for the spatial engine, unit-agnostic.

Ports of the panel's frontend/src/canvas/geometry.ts and rf-path.ts, so the
server computes the same rooms and wall crossings the plan shows. Keep them
in sync: tests/test_spatial_geometry.py reuses the TypeScript test cases.

Points are `(x, y)` pairs (lists or tuples) in whatever unit the caller
uses. A floor's stored units and metres both work; only the opening
tolerance is a length, and the caller passes it in its own unit.
"""

from __future__ import annotations

from collections.abc import Callable, Sequence
import math
from typing import Any

Point = Sequence[float]

# Rough loss through an opening in dB (rf-path.ts OPENING_LOSS_DB). A doorway
# is open or a timber door; a window is glass. Deliberately small next to a
# solid wall.
OPENING_LOSS_DB = {"door": 2.0, "window": 3.0}

# How close to an opening's span, in floor units, a crossing must fall to
# count as going through it (rf-path.ts OPENING_TOLERANCE).
OPENING_TOLERANCE_UNITS = 0.5

# Two crossings of the same wall closer than this are one crossing: a path
# through a polyline wall's corner meets both of its segments at one point.
_SAME_POINT_TOLERANCE = 1e-6


def distance(a: Point, b: Point) -> float:
    """Straight-line distance between two points."""
    return math.hypot(b[0] - a[0], b[1] - a[1])


def point_in_polygon(x: float, y: float, points: Sequence[Point]) -> bool:
    """Even-odd ray casting, identical to geometry.ts pointInPolygon."""
    inside = False
    j = len(points) - 1
    for i in range(len(points)):
        xi, yi = points[i][0], points[i][1]
        xj, yj = points[j][0], points[j][1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            inside = not inside
        j = i
    return inside


def find_room_for_point(
    x: float, y: float, rooms: Sequence[dict[str, Any]]
) -> str | None:
    """First room (in list order) whose polygon contains the point, like
    geometry.ts findRoomForPoint. Shapes with fewer than three corners are
    not rooms."""
    for room in rooms:
        points = room.get("points") or []
        if len(points) >= 3 and point_in_polygon(x, y, points):
            return room["id"]
    return None


def polygon_area(points: Sequence[Point]) -> float:
    """Unsigned shoelace area."""
    total = 0.0
    n = len(points)
    for i in range(n):
        x1, y1 = points[i][0], points[i][1]
        x2, y2 = points[(i + 1) % n][0], points[(i + 1) % n][1]
        total += x1 * y2 - x2 * y1
    return abs(total) / 2


def centroid(points: Sequence[Point]) -> tuple[float, float]:
    """Area centroid of a polygon. Falls back to the corner average for a
    degenerate shape (geometry.ts centroid is always the corner average;
    the area centroid is the better "where is this room" for an L shape)."""
    n = len(points)
    if n == 0:
        return (0.0, 0.0)
    a = cx = cy = 0.0
    for i in range(n):
        x1, y1 = points[i][0], points[i][1]
        x2, y2 = points[(i + 1) % n][0], points[(i + 1) % n][1]
        cross = x1 * y2 - x2 * y1
        a += cross
        cx += (x1 + x2) * cross
        cy += (y1 + y2) * cross
    if abs(a) < 1e-12:
        return (sum(p[0] for p in points) / n, sum(p[1] for p in points) / n)
    return (cx / (3 * a), cy / (3 * a))


def segment_intersection(
    p1: Point, p2: Point, p3: Point, p4: Point
) -> tuple[float, float] | None:
    """Where segment p1-p2 crosses p3-p4, or None when they do not meet
    (including parallel and collinear segments), as rf-path.ts."""
    rx, ry = p2[0] - p1[0], p2[1] - p1[1]
    sx, sy = p4[0] - p3[0], p4[1] - p3[1]
    denom = rx * sy - ry * sx
    if denom == 0:
        return None
    qx, qy = p3[0] - p1[0], p3[1] - p1[1]
    t = (qx * sy - qy * sx) / denom
    u = (qx * ry - qy * rx) / denom
    if t < 0 or t > 1 or u < 0 or u > 1:
        return None
    return (p1[0] + t * rx, p1[1] + t * ry)


def point_to_segment_distance(p: Point, a: Point, b: Point) -> float:
    """Shortest distance from p to segment a-b."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    length_sq = dx * dx + dy * dy
    if length_sq == 0:
        return distance(p, a)
    t = max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length_sq))
    return distance(p, (a[0] + t * dx, a[1] + t * dy))


def _nearest_segment_index(points: Sequence[Point], x: float, y: float) -> int:
    """geometry.ts nearestPointOnPolyline's segmentIndex."""
    best_index, best_dist = 0, math.inf
    for i in range(len(points) - 1):
        d = point_to_segment_distance((x, y), points[i], points[i + 1])
        if d < best_dist:
            best_index, best_dist = i, d
    return best_index


def opening_endpoints(
    x: float, y: float, width: float, wall_points: Sequence[Point]
) -> tuple[tuple[float, float], tuple[float, float]] | None:
    """A door/window's two ends along its wall's local direction, as
    geometry.ts openingEndpoints. None when the wall has under two points."""
    if len(wall_points) < 2:
        return None
    index = _nearest_segment_index(wall_points, x, y)
    a = wall_points[index]
    b = wall_points[index + 1] if index + 1 < len(wall_points) else a
    length = distance(a, b) or 1.0
    dx, dy = (b[0] - a[0]) / length, (b[1] - a[1]) / length
    half = width / 2
    return ((x - dx * half, y - dy * half), (x + dx * half, y + dy * half))


def _opening_at(
    wall: dict[str, Any],
    openings: Sequence[dict[str, Any]],
    x: float,
    y: float,
    tolerance: float,
) -> dict[str, Any] | None:
    for opening in openings:
        if opening.get("wallId") != wall.get("id"):
            continue
        ends = opening_endpoints(
            opening["x"], opening["y"], opening["width"], wall["points"]
        )
        if ends and point_to_segment_distance((x, y), ends[0], ends[1]) <= tolerance:
            return opening
    return None


def walls_crossed(
    a: Point,
    b: Point,
    walls: Sequence[dict[str, Any]],
    openings: Sequence[dict[str, Any]],
    wall_db: Callable[[dict[str, Any]], float],
    opening_tolerance: float = OPENING_TOLERANCE_UNITS,
) -> dict[str, Any]:
    """The walls the straight path a-b crosses and their total loss, a port
    of rf-path.ts pathLoss. A wall counts once per place the path meets it;
    a crossing inside a door or window costs the opening's loss instead.

    Returns {"total_db", "crossings": [{wall_id, material, x, y, db,
    through_opening}]}. `wall_db(wall)` gives a solid wall's loss (the
    material catalog lives in export.py)."""
    crossings: list[dict[str, Any]] = []
    for wall in walls:
        points = wall.get("points") or []
        if len(points) < 2:
            continue
        solid_db = wall_db(wall)
        seen: list[tuple[float, float]] = []
        for i in range(len(points) - 1):
            hit = segment_intersection(a, b, points[i], points[i + 1])
            if hit is None:
                continue
            if any(
                abs(s[0] - hit[0]) <= _SAME_POINT_TOLERANCE
                and abs(s[1] - hit[1]) <= _SAME_POINT_TOLERANCE
                for s in seen
            ):
                continue
            seen.append(hit)
            opening = _opening_at(wall, openings, hit[0], hit[1], opening_tolerance)
            crossings.append(
                {
                    "wall_id": wall.get("id"),
                    "material": wall.get("material"),
                    "x": hit[0],
                    "y": hit[1],
                    "db": OPENING_LOSS_DB.get(opening["type"], 0.0)
                    if opening
                    else solid_db,
                    "through_opening": opening["type"] if opening else None,
                }
            )
    return {"total_db": sum(c["db"] for c in crossings), "crossings": crossings}


def shared_edges(
    poly_a: Sequence[Point], poly_b: Sequence[Point], tol: float
) -> list[tuple[tuple[float, float], tuple[float, float]]]:
    """The stretches of boundary two polygons share: pieces of an edge of
    `poly_a` that an edge of `poly_b` runs along, within `tol` (rooms traced
    by hand never line up exactly). Used for room adjacency."""
    out: list[tuple[tuple[float, float], tuple[float, float]]] = []
    na, nb = len(poly_a), len(poly_b)
    if na < 2 or nb < 2:
        return out
    for i in range(na):
        a1, a2 = poly_a[i], poly_a[(i + 1) % na]
        length = distance(a1, a2)
        if length <= tol:
            continue
        ux, uy = (a2[0] - a1[0]) / length, (a2[1] - a1[1]) / length
        for j in range(nb):
            b1, b2 = poly_b[j], poly_b[(j + 1) % nb]
            # Both ends of b's edge close to a's line...
            off1 = abs((b1[0] - a1[0]) * uy - (b1[1] - a1[1]) * ux)
            off2 = abs((b2[0] - a1[0]) * uy - (b2[1] - a1[1]) * ux)
            if off1 > tol or off2 > tol:
                continue
            # ...and overlapping it along its length.
            t1 = (b1[0] - a1[0]) * ux + (b1[1] - a1[1]) * uy
            t2 = (b2[0] - a1[0]) * ux + (b2[1] - a1[1]) * uy
            lo, hi = max(0.0, min(t1, t2)), min(length, max(t1, t2))
            if hi - lo > tol:
                out.append(
                    (
                        (a1[0] + ux * lo, a1[1] + uy * lo),
                        (a1[0] + ux * hi, a1[1] + uy * hi),
                    )
                )
    return out
