/** Click inside walls to trace the room (#46): finds the closed shape the
 * walls make around a point. The walls are cut where they cross or touch,
 * treated as a planar graph, and the smallest closed face holding the
 * point is returned. A gap in the walls leaves the point in the open
 * outside, so nothing is returned and the caller falls back to tracing by
 * hand. Doors and windows sit on walls, so they never open a gap. */

import { pointInPolygon } from "./canvas/geometry";

type Pt = [number, number];
type Seg = [Pt, Pt];

/** Where `p` sits along the infinite line a→b, and how far from it. */
function projectOnto(p: Pt, a: Pt, b: Pt): { t: number; dist: number } {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return { t: 0, dist: Math.hypot(p[0] - a[0], p[1] - a[1]) };
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  return {
    t,
    dist: Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy)),
  };
}

/** The crossing of two segments, as a fraction along `s`, or null. */
function crossing(s: Seg, o: Seg): number | null {
  const [a, b] = s;
  const [c, d] = o;
  const r: Pt = [b[0] - a[0], b[1] - a[1]];
  const q: Pt = [d[0] - c[0], d[1] - c[1]];
  const denom = r[0] * q[1] - r[1] * q[0];
  if (Math.abs(denom) < 1e-12) return null;
  const t = ((c[0] - a[0]) * q[1] - (c[1] - a[1]) * q[0]) / denom;
  const u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / denom;
  return t > 0 && t < 1 && u >= 0 && u <= 1 ? t : null;
}

function wallSegments(walls: { points: [number, number][] }[]): Seg[] {
  const out: Seg[] = [];
  for (const wall of walls) {
    for (let i = 0; i + 1 < wall.points.length; i++) {
      const a = wall.points[i]!;
      const b = wall.points[i + 1]!;
      if (a[0] !== b[0] || a[1] !== b[1]) out.push([a, b]);
    }
  }
  return out;
}

/** Cuts every segment at the points where another wall crosses it or
 * ends on it (within `tol`), so every junction becomes a graph node. */
function splitSegments(segs: Seg[], tol: number): Seg[] {
  const out: Seg[] = [];
  for (const seg of segs) {
    const [a, b] = seg;
    const cuts: number[] = [];
    for (const other of segs) {
      if (other === seg) continue;
      const t = crossing(seg, other);
      if (t !== null) cuts.push(t);
      for (const end of other) {
        const { t: along, dist } = projectOnto(end, a, b);
        if (dist <= tol && along > 0 && along < 1) cuts.push(along);
      }
    }
    cuts.sort((x, y) => x - y);
    let prev = a;
    for (const t of cuts) {
      const p: Pt = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
      out.push([prev, p]);
      prev = p;
    }
    out.push([prev, b]);
  }
  return out;
}

interface Graph {
  nodes: Pt[];
  adj: Map<number, number[]>;
}

/** Merges points closer than `tol` into one node and joins the segment
 * ends; dead-end stubs are pruned, as they enclose nothing. */
function buildGraph(segs: Seg[], tol: number): Graph {
  const nodes: Pt[] = [];
  const nodeFor = (p: Pt): number => {
    for (let i = 0; i < nodes.length; i++) {
      if (Math.hypot(nodes[i]![0] - p[0], nodes[i]![1] - p[1]) <= tol) return i;
    }
    nodes.push(p);
    return nodes.length - 1;
  };
  const adj = new Map<number, number[]>();
  const link = (u: number, v: number) => {
    const list = adj.get(u) ?? [];
    if (!list.includes(v)) list.push(v);
    adj.set(u, list);
  };
  for (const [a, b] of segs) {
    const u = nodeFor(a);
    const v = nodeFor(b);
    if (u === v) continue;
    link(u, v);
    link(v, u);
  }
  let pruned = true;
  while (pruned) {
    pruned = false;
    for (const [u, list] of adj) {
      if (list.length > 1) continue;
      adj.delete(u);
      for (const v of list) {
        const rest = (adj.get(v) ?? []).filter((n) => n !== u);
        adj.set(v, rest);
      }
      pruned = true;
    }
  }
  return { nodes, adj };
}

function signedArea(points: Pt[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i]!;
    const [x2, y2] = points[(i + 1) % points.length]!;
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

/** Every closed face of the graph, walked edge by edge. Inner faces come
 * out with a positive area; each connected piece also has one outer face
 * with a negative area, which is dropped by the caller. */
function faces(graph: Graph): Pt[][] {
  const { nodes, adj } = graph;
  const sorted = new Map<number, number[]>();
  for (const [u, list] of adj) {
    sorted.set(
      u,
      [...list].sort(
        (p, q) =>
          Math.atan2(nodes[p]![1] - nodes[u]![1], nodes[p]![0] - nodes[u]![0]) -
          Math.atan2(nodes[q]![1] - nodes[u]![1], nodes[q]![0] - nodes[u]![0]),
      ),
    );
  }
  const seen = new Set<string>();
  const out: Pt[][] = [];
  for (const [u, list] of sorted) {
    for (const v of list) {
      if (seen.has(`${u}>${v}`)) continue;
      const cycle: number[] = [];
      let a = u;
      let b = v;
      let guard = 0;
      while (!seen.has(`${a}>${b}`) && guard++ < 100000) {
        seen.add(`${a}>${b}`);
        cycle.push(a);
        const around = sorted.get(b)!;
        const back = around.indexOf(a);
        const next = around[(back - 1 + around.length) % around.length]!;
        a = b;
        b = next;
      }
      if (cycle.length >= 3) out.push(cycle.map((i) => nodes[i]!));
    }
  }
  return out;
}

/** Drops vertices that sit on a straight line between their neighbours,
 * so a wall cut at several junctions comes back as one room edge. */
export function dropCollinear(points: Pt[], tol: number): Pt[] {
  let pts = points;
  let changed = true;
  while (changed && pts.length > 3) {
    changed = false;
    for (let i = 0; i < pts.length; i++) {
      const prev = pts[(i - 1 + pts.length) % pts.length]!;
      const next = pts[(i + 1) % pts.length]!;
      if (projectOnto(pts[i]!, prev, next).dist <= tol) {
        pts = pts.filter((_, k) => k !== i);
        changed = true;
        break;
      }
    }
  }
  return pts;
}

/** The corners of the closed space the walls make around `point`, or null
 * when the point is not in an enclosed space (a gap, or open ground). */
export function enclosedRegion(
  point: Pt,
  walls: { points: [number, number][] }[],
  tol: number,
): Pt[] | null {
  const segs = splitSegments(wallSegments(walls), tol);
  if (segs.length < 3) return null;
  const graph = buildGraph(segs, tol);
  let best: Pt[] | null = null;
  let bestArea = Infinity;
  for (const face of faces(graph)) {
    const area = signedArea(face);
    if (area <= 0 || area >= bestArea) continue;
    if (!pointInPolygon(point[0], point[1], face)) continue;
    best = face;
    bestArea = area;
  }
  return best ? dropCollinear(best, tol) : null;
}
