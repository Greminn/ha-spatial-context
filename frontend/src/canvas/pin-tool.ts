import type { Opening, Pin, Wall } from "../types";
import { distance, pointToPolylineDistance } from "./geometry";

/** Every pin within `radius` (image-space units), nearest first — several
 * devices mounted at (near enough) the same physical spot land within a
 * click's hit radius of each other, which is exactly the case the
 * multi-pin picker (see canvas-overlay.ts) needs to disambiguate. */
export function findPinsAt(
  pins: Pin[],
  x: number,
  y: number,
  radius: number,
): Pin[] {
  return pins
    .map((pin) => ({ pin, d: distance(pin.x, pin.y, x, y) }))
    .filter(({ d }) => d <= radius)
    .sort((a, b) => a.d - b.d)
    .map(({ pin }) => pin);
}

/** Nearest pin within `radius` (image-space units), else null. */
export function findPinAt(
  pins: Pin[],
  x: number,
  y: number,
  radius: number,
): Pin | null {
  return findPinsAt(pins, x, y, radius)[0] ?? null;
}

/** Index of the nearest room vertex within `radius`, else null. */
export function findVertexAt(
  points: [number, number][],
  x: number,
  y: number,
  radius: number,
): number | null {
  let closestIndex: number | null = null;
  let closestDist = radius;
  points.forEach(([px, py], index) => {
    const d = distance(px, py, x, y);
    if (d <= closestDist) {
      closestIndex = index;
      closestDist = d;
    }
  });
  return closestIndex;
}

/** Index of the nearest edge-midpoint marker within `radius`, else null. */
export function findEdgeMidpointAt(
  midpoints: [number, number][],
  x: number,
  y: number,
  radius: number,
): number | null {
  return findVertexAt(midpoints, x, y, radius);
}

/** Nearest wall whose polyline passes within `radius` of the point, else null. */
export function findWallAt(
  walls: Wall[],
  x: number,
  y: number,
  radius: number,
): Wall | null {
  let closest: Wall | null = null;
  let closestDist = radius;
  for (const wall of walls) {
    const d = pointToPolylineDistance(x, y, wall.points);
    if (d <= closestDist) {
      closest = wall;
      closestDist = d;
    }
  }
  return closest;
}

/** Nearest door/window opening within `radius` of the point, else null. */
export function findOpeningAt(
  openings: Opening[],
  x: number,
  y: number,
  radius: number,
): Opening | null {
  let closest: Opening | null = null;
  let closestDist = radius;
  for (const opening of openings) {
    const d = distance(opening.x, opening.y, x, y);
    if (d <= closestDist) {
      closest = opening;
      closestDist = d;
    }
  }
  return closest;
}
