import type { Room } from "../types";

export function distance(
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  return Math.hypot(bx - ax, by - ay);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Where a ray from (px, py) in direction (dx, dy) exits an axis-aligned
 * box, or null if it's already heading away from every edge (dx/dy both
 * zero, or the box is degenerate). Assumes (px, py) starts inside the box
 * — used to project a cross-floor mesh stub from a pin out to the edge of
 * the floor's traced content in a real compass bearing (see panel.ts's
 * `_projectStubTowardBuilding`). */
export function rayBoxExit(
  px: number,
  py: number,
  dx: number,
  dy: number,
  box: { minX: number; minY: number; maxX: number; maxY: number },
): { x: number; y: number } | null {
  const tx =
    dx > 0 ? (box.maxX - px) / dx : dx < 0 ? (box.minX - px) / dx : Infinity;
  const ty =
    dy > 0 ? (box.maxY - py) / dy : dy < 0 ? (box.minY - py) / dy : Infinity;
  const t = Math.min(tx, ty);
  if (!isFinite(t) || t <= 0) return null;
  return { x: px + dx * t, y: py + dy * t };
}

/** Even-odd ray casting point-in-polygon test. */
export function pointInPolygon(
  x: number,
  y: number,
  points: [number, number][],
): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const pi = points[i]!;
    const pj = points[j]!;
    const [xi, yi] = pi;
    const [xj, yj] = pj;
    const intersects =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** First room (in list order) whose polygon contains the point, else null. */
export function findRoomForPoint(
  x: number,
  y: number,
  rooms: Room[],
): string | null {
  for (const room of rooms) {
    if (room.points.length >= 3 && pointInPolygon(x, y, room.points)) {
      return room.id;
    }
  }
  return null;
}

export function centroid(points: [number, number][]): [number, number] {
  if (points.length === 0) return [0, 0];
  let sx = 0;
  let sy = 0;
  for (const [x, y] of points) {
    sx += x;
    sy += y;
  }
  return [sx / points.length, sy / points.length];
}

/** Shortest distance from point (px,py) to segment (ax,ay)-(bx,by). */
export function pointToSegmentDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(px, py, ax, ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / lengthSquared;
  t = clamp(t, 0, 1);
  return distance(px, py, ax + t * dx, ay + t * dy);
}

/** Shortest distance from a point to any segment of an open polyline. */
export function pointToPolylineDistance(
  px: number,
  py: number,
  points: [number, number][],
): number {
  let min = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, ay] = points[i]!;
    const [bx, by] = points[i + 1]!;
    min = Math.min(min, pointToSegmentDistance(px, py, ax, ay, bx, by));
  }
  return min;
}

/** Edge midpoints of a closed ring (room polygon) — wraps last back to first. */
export function edgeMidpoints(points: [number, number][]): [number, number][] {
  const mids: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i]!;
    const b = points[(i + 1) % points.length]!;
    mids.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
  }
  return mids;
}

/** Segment midpoints of an open polyline (wall) — no wraparound. */
export function openSegmentMidpoints(
  points: [number, number][],
): [number, number][] {
  const mids: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    mids.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
  }
  return mids;
}

/** Closest point on an open polyline to (x,y), plus which segment it fell on. */
export function nearestPointOnPolyline(
  points: [number, number][],
  x: number,
  y: number,
): { point: [number, number]; segmentIndex: number } {
  let best: { point: [number, number]; segmentIndex: number; dist: number } = {
    point: points[0]!,
    segmentIndex: 0,
    dist: Infinity,
  };
  for (let i = 0; i < points.length - 1; i++) {
    const [ax, ay] = points[i]!;
    const [bx, by] = points[i + 1]!;
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSquared = dx * dx + dy * dy;
    let t =
      lengthSquared === 0 ? 0 : ((x - ax) * dx + (y - ay) * dy) / lengthSquared;
    t = clamp(t, 0, 1);
    const point: [number, number] = [ax + t * dx, ay + t * dy];
    const d = distance(x, y, point[0], point[1]);
    if (d < best.dist) best = { point, segmentIndex: i, dist: d };
  }
  return { point: best.point, segmentIndex: best.segmentIndex };
}

/** Closest point on a closed ring (room polygon) to (x,y), including the
 * closing edge back to the first vertex — nearestPointOnPolyline doesn't
 * wrap, so this feeds it the ring with the first point appended. */
export function nearestPointOnClosedPolygon(
  points: [number, number][],
  x: number,
  y: number,
): { point: [number, number]; segmentIndex: number } {
  if (points.length === 0) return { point: [x, y], segmentIndex: 0 };
  return nearestPointOnPolyline([...points, points[0]!], x, y);
}

/**
 * If `candidate` is within `threshold` of being perfectly horizontal or
 * vertical relative to `anchor`, snap it onto that axis. Prefers whichever
 * axis it's closer to when within threshold of both (i.e. near `anchor`
 * itself). Returns `candidate` unchanged otherwise.
 */
export function snapToAxis(
  anchor: [number, number],
  candidate: [number, number],
  threshold: number,
): [number, number] {
  const [ax, ay] = anchor;
  const [cx, cy] = candidate;
  const dx = Math.abs(cx - ax);
  const dy = Math.abs(cy - ay);
  if (dx > threshold && dy > threshold) return candidate;
  return dx <= dy ? [ax, cy] : [cx, ay];
}

/** Unit direction vector of one segment of a polyline. */
export function segmentDirection(
  points: [number, number][],
  segmentIndex: number,
): [number, number] {
  const [ax, ay] = points[segmentIndex]!;
  const [bx, by] = points[segmentIndex + 1] ?? points[segmentIndex]!;
  const len = distance(ax, ay, bx, by) || 1;
  return [(bx - ax) / len, (by - ay) / len];
}

/** A door/window's two rendered endpoints (its crossing-line's ends) along
 * its wall's own local direction at that point — shared by
 * floorplan-canvas.ts's _openingEndpoints (which feeds it live-drag/edit
 * preview coordinates) and pin-tool.ts's findOpeningAt (which needs the
 * opening's real on-screen extent, not just its center point, to hit-test
 * clicks across its whole length rather than only a small radius around
 * its middle). Null when the wall has fewer than two points. */
export function openingEndpoints(
  x: number,
  y: number,
  width: number,
  wallPoints: [number, number][],
): [[number, number], [number, number]] | null {
  if (wallPoints.length < 2) return null;
  const { segmentIndex } = nearestPointOnPolyline(wallPoints, x, y);
  const [dx, dy] = segmentDirection(wallPoints, segmentIndex);
  const half = width / 2;
  return [
    [x - dx * half, y - dy * half],
    [x + dx * half, y + dy * half],
  ];
}
