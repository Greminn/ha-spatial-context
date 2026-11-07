import type { Room, Wall } from "./types";

/** "Generate walls from room outlines": walls along every room edge, an
 * edge two rooms share becoming one interior wall, an edge only one room
 * has becoming an exterior wall, and stretches an existing wall already
 * covers left alone. Pure; the panel turns the result into walls (one undo
 * step).
 *
 * Rooms traced on the inside faces of a real wall sit a wall's thickness
 * apart, so "shared" means collinear within `tolerance` (in plan units)
 * and overlapping along the line, and the generated wall runs down the
 * middle. */

export const EXTERIOR_WALL_MATERIAL = "brick_veneer";
export const INTERIOR_WALL_MATERIAL = "timber_frame";

/** Two shared edges count as the same wall line within this many metres
 * (a thick wall's two faces) on a calibrated floor. */
export const WALL_TOLERANCE_M = 0.35;
/** The same in plan units on an uncalibrated floor (the plan is 1000 wide). */
export const WALL_TOLERANCE_UNITS = 6;
/** Edges this many degrees apart still count as parallel. */
const ANGLE_TOLERANCE_DEG = 3;

export interface GeneratedWall {
  points: [[number, number], [number, number]];
  exterior: boolean;
  material: string;
}

type Pt = [number, number];

interface Edge {
  a: Pt;
  b: Pt;
  roomId: string;
  /** Unit direction, angle folded into [0, π). */
  dx: number;
  dy: number;
  length: number;
}

function makeEdge(a: Pt, b: Pt, roomId: string): Edge | null {
  let dx = b[0] - a[0];
  let dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  if (length === 0) return null;
  dx /= length;
  dy /= length;
  // Fold so opposite windings of the same line point the same way.
  if (dy < 0 || (dy === 0 && dx < 0)) {
    dx = -dx;
    dy = -dy;
  }
  return { a, b, roomId, dx, dy, length };
}

function parallel(
  e: { dx: number; dy: number },
  f: { dx: number; dy: number },
) {
  const cross = Math.abs(e.dx * f.dy - e.dy * f.dx);
  return cross <= Math.sin((ANGLE_TOLERANCE_DEG * Math.PI) / 180);
}

/** Perpendicular distance from p to the infinite line through e. */
function lineDistance(e: Edge, p: Pt): number {
  return Math.abs((p[0] - e.a[0]) * -e.dy + (p[1] - e.a[1]) * e.dx);
}

function collinear(e: Edge, f: Edge, tolerance: number): boolean {
  return (
    parallel(e, f) &&
    lineDistance(e, f.a) <= tolerance &&
    lineDistance(e, f.b) <= tolerance
  );
}

/** Union-find over edges that lie on one line. */
function groupCollinear(edges: Edge[], tolerance: number): Edge[][] {
  const parent = edges.map((_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]!]!;
      i = parent[i]!;
    }
    return i;
  };
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      if (collinear(edges[i]!, edges[j]!, tolerance)) {
        parent[find(i)] = find(j);
      }
    }
  }
  const groups = new Map<number, Edge[]>();
  edges.forEach((e, i) => {
    const root = find(i);
    const list = groups.get(root);
    if (list) list.push(e);
    else groups.set(root, [e]);
  });
  return [...groups.values()];
}

interface Line {
  /** Unit direction. */
  dx: number;
  dy: number;
  /** Signed offset along the normal (-dy, dx). */
  offset: number;
}

function lineOf(group: Edge[]): Line {
  let dx = 0;
  let dy = 0;
  let total = 0;
  for (const e of group) {
    dx += e.dx * e.length;
    dy += e.dy * e.length;
    total += e.length;
  }
  const n = Math.hypot(dx, dy) || 1;
  dx /= n;
  dy /= n;
  // Length-weighted mid-line of every edge in the group.
  let offset = 0;
  for (const e of group) {
    const mid: Pt = [(e.a[0] + e.b[0]) / 2, (e.a[1] + e.b[1]) / 2];
    offset += (mid[0] * -dy + mid[1] * dx) * e.length;
  }
  return { dx, dy, offset: offset / total };
}

const along = (line: Line, p: Pt) => p[0] * line.dx + p[1] * line.dy;
const pointAt = (line: Line, t: number): Pt => [
  t * line.dx - line.offset * line.dy,
  t * line.dy + line.offset * line.dx,
];

type Interval = [number, number];

/** `intervals` minus `cut`, both lists of [start, end]. */
export function subtractIntervals(
  intervals: Interval[],
  cut: Interval[],
): Interval[] {
  let out = intervals.map(([a, b]): Interval => [a, b]);
  for (const [c0, c1] of cut) {
    const next: Interval[] = [];
    for (const [a, b] of out) {
      if (c1 <= a || c0 >= b) {
        next.push([a, b]);
        continue;
      }
      if (c0 > a) next.push([a, c0]);
      if (c1 < b) next.push([c1, b]);
    }
    out = next;
  }
  return out;
}

/** The pieces of one wall line: where only one room has an edge
 * (exterior) and where two or more do (shared, interior). Touching pieces
 * of the same kind merge. */
export function classifyCoverage(
  spans: { start: number; end: number; roomId: string }[],
): { start: number; end: number; shared: boolean }[] {
  const cuts = [...new Set(spans.flatMap((s) => [s.start, s.end]))].sort(
    (a, b) => a - b,
  );
  const out: { start: number; end: number; shared: boolean }[] = [];
  for (let i = 0; i + 1 < cuts.length; i++) {
    const a = cuts[i]!;
    const b = cuts[i + 1]!;
    const mid = (a + b) / 2;
    const rooms = new Set(
      spans.filter((s) => s.start <= mid && s.end >= mid).map((s) => s.roomId),
    );
    if (rooms.size === 0) continue;
    const shared = rooms.size >= 2;
    const last = out[out.length - 1];
    if (last && last.end === a && last.shared === shared) last.end = b;
    else out.push({ start: a, end: b, shared });
  }
  return out;
}

export interface WallsFromRoomsInput {
  rooms: Room[];
  existingWalls: Wall[];
  /** Plan units: how far apart two edges may be and still be one wall. */
  tolerance: number;
}

export function wallsFromRooms(input: WallsFromRoomsInput): GeneratedWall[] {
  const { tolerance } = input;
  const edges: Edge[] = [];
  for (const room of input.rooms) {
    const pts = room.points;
    if (pts.length < 3) continue;
    for (let i = 0; i < pts.length; i++) {
      const e = makeEdge(pts[i]!, pts[(i + 1) % pts.length]!, room.id);
      if (e) edges.push(e);
    }
  }
  const existing: Edge[] = [];
  for (const wall of input.existingWalls) {
    for (let i = 0; i + 1 < wall.points.length; i++) {
      const e = makeEdge(wall.points[i]!, wall.points[i + 1]!, wall.id);
      if (e) existing.push(e);
    }
  }

  const out: GeneratedWall[] = [];
  for (const group of groupCollinear(edges, tolerance)) {
    const line = lineOf(group);
    const spans = group.map((e) => {
      const t0 = along(line, e.a);
      const t1 = along(line, e.b);
      return {
        start: Math.min(t0, t1),
        end: Math.max(t0, t1),
        roomId: e.roomId,
      };
    });
    // Existing walls on this line, as intervals along it.
    const covered: Interval[] = existing
      .filter((w) =>
        group.some(
          (e) => collinear(e, w, tolerance) || collinear(w, e, tolerance),
        ),
      )
      .map((w) => {
        const t0 = along(line, w.a);
        const t1 = along(line, w.b);
        // Within tolerance of a covered end counts as covered, so a wall
        // drawn a touch short doesn't leave a sliver.
        return [Math.min(t0, t1) - tolerance, Math.max(t0, t1) + tolerance];
      });
    for (const piece of classifyCoverage(spans)) {
      for (const [a, b] of subtractIntervals(
        [[piece.start, piece.end]],
        covered,
      )) {
        if (b - a <= tolerance) continue;
        out.push({
          points: [pointAt(line, a), pointAt(line, b)],
          exterior: !piece.shared,
          material: piece.shared
            ? INTERIOR_WALL_MATERIAL
            : EXTERIOR_WALL_MATERIAL,
        });
      }
    }
  }
  return out;
}

/** Plan-unit tolerance for this floor. */
export function wallTolerance(unitsPerMeter: number | null): number {
  return unitsPerMeter && unitsPerMeter > 0
    ? WALL_TOLERANCE_M * unitsPerMeter
    : WALL_TOLERANCE_UNITS;
}
