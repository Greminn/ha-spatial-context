/** Which walls a straight radio path crosses, and how much signal they cost
 * (#28, #29). Pure geometry on a floor's own coordinates, with no scale or
 * link data, so the heatmap and the "worse than the walls predict" check can
 * share it and it can be tested on its own.
 *
 * A wall crossing costs the wall's attenuation (see materials.ts). A crossing
 * that goes through a door or window opening in that wall costs the opening's
 * loss instead, since the signal passes through the gap, not the wall. */

import type { Opening, OpeningType, Wall } from "../types";
import { openingEndpoints, pointToSegmentDistance } from "./geometry";
import { wallAttenuationDb, wallThicknessCm } from "./materials";

/** Rough loss through an opening in dB. A doorway is open or a timber door;
 * a window is glass. Deliberately small next to a solid wall, and a single
 * number, not a model of door or glazing types. */
export const OPENING_LOSS_DB: Record<OpeningType, number> = {
  door: 2,
  window: 3,
};

/** How close to an opening's span, in floor units, a crossing must fall to
 * count as going through it. Absorbs rounding where an opening sits at the
 * very edge of its wall segment. */
const OPENING_TOLERANCE = 0.5;

/** Two crossings of the same wall closer than this are one crossing: a path
 * that passes exactly through a polyline wall's corner meets both of its
 * segments at the same point. */
const SAME_POINT_TOLERANCE = 1e-6;

export interface WallCrossing {
  wallId: string;
  /** Where the path meets the wall, in floor units. */
  x: number;
  y: number;
  /** The loss this crossing costs. */
  db: number;
  /** Set when the path goes through a door or window rather than the wall. */
  throughOpening: OpeningType | null;
}

export interface PathLoss {
  /** Sum of every crossing's loss. */
  totalDb: number;
  crossings: WallCrossing[];
}

/** Where segment p1-p2 crosses segment p3-p4, or null when they do not meet
 * (including when they are parallel or lie along each other). */
export function segmentIntersection(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number],
  p4: [number, number],
): { x: number; y: number } | null {
  const rx = p2[0] - p1[0];
  const ry = p2[1] - p1[1];
  const sx = p4[0] - p3[0];
  const sy = p4[1] - p3[1];
  const denom = rx * sy - ry * sx;
  if (denom === 0) return null;
  const qx = p3[0] - p1[0];
  const qy = p3[1] - p1[1];
  const t = (qx * sy - qy * sx) / denom;
  const u = (qx * ry - qy * rx) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: p1[0] + t * rx, y: p1[1] + t * ry };
}

function openingAt(
  wall: Wall,
  openings: Opening[],
  x: number,
  y: number,
): Opening | null {
  for (const opening of openings) {
    if (opening.wallId !== wall.id) continue;
    const ends = openingEndpoints(
      opening.x,
      opening.y,
      opening.width,
      wall.points,
    );
    if (!ends) continue;
    if (
      pointToSegmentDistance(
        x,
        y,
        ends[0][0],
        ends[0][1],
        ends[1][0],
        ends[1][1],
      ) <= OPENING_TOLERANCE
    ) {
      return opening;
    }
  }
  return null;
}

/** The walls the straight path from `from` to `to` crosses, and their total
 * loss. A wall is counted once per place the path meets it. */
export function pathLoss(
  from: [number, number],
  to: [number, number],
  walls: Wall[],
  openings: Opening[],
): PathLoss {
  const crossings: WallCrossing[] = [];
  for (const wall of walls) {
    if (wall.points.length < 2) continue;
    const wallDb = wallAttenuationDb(wall.material, wallThicknessCm(wall));
    const seen: { x: number; y: number }[] = [];
    for (let i = 0; i < wall.points.length - 1; i++) {
      const hit = segmentIntersection(
        from,
        to,
        wall.points[i]!,
        wall.points[i + 1]!,
      );
      if (!hit) continue;
      if (
        seen.some(
          (s) =>
            Math.abs(s.x - hit.x) <= SAME_POINT_TOLERANCE &&
            Math.abs(s.y - hit.y) <= SAME_POINT_TOLERANCE,
        )
      )
        continue;
      seen.push(hit);
      const opening = openingAt(wall, openings, hit.x, hit.y);
      crossings.push({
        wallId: wall.id,
        x: hit.x,
        y: hit.y,
        db: opening ? OPENING_LOSS_DB[opening.type] : wallDb,
        throughOpening: opening ? opening.type : null,
      });
    }
  }
  return {
    totalDb: crossings.reduce((sum, c) => sum + c.db, 0),
    crossings,
  };
}
