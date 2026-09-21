import { distance } from "./geometry";

/** In-progress room trace: a growing list of vertices not yet committed as a Room. */
export interface PendingTrace {
  points: [number, number][];
}

export function startTrace(): PendingTrace {
  return { points: [] };
}

/**
 * Add a vertex to a pending trace. If the new point lands within
 * `closeThreshold` of the first vertex (and there are already >= 3),
 * the trace is reported as closed instead of adding a duplicate point.
 */
export function addTracePoint(
  trace: PendingTrace,
  x: number,
  y: number,
  closeThreshold: number,
): { trace: PendingTrace; closed: boolean } {
  if (trace.points.length >= 3) {
    const [fx, fy] = trace.points[0]!;
    if (distance(fx, fy, x, y) <= closeThreshold) {
      return { trace, closed: true };
    }
  }
  return { trace: { points: [...trace.points, [x, y]] }, closed: false };
}
