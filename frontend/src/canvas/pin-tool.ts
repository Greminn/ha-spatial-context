import type {
  Opening,
  Pin,
  ResolvedMeshLink,
  ResolvedMeshStub,
  Room,
  Wall,
} from "../types";
import {
  distance,
  nearestPointOnClosedPolygon,
  openingEndpoints,
  pointToPolylineDistance,
} from "./geometry";

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

/** Nearest room whose boundary (including its closing edge back to the
 * first vertex) passes within `radius` of the point, else null. `rooms`
 * only ever holds already-saved rooms — an in-progress trace isn't in
 * this array yet — so a room being traced is never a candidate for its
 * own snap search without needing an explicit exclusion. */
export function findRoomAt(
  rooms: Room[],
  x: number,
  y: number,
  radius: number,
): Room | null {
  let closest: Room | null = null;
  let closestDist = radius;
  for (const room of rooms) {
    if (room.points.length < 2) continue;
    const { point } = nearestPointOnClosedPolygon(room.points, x, y);
    const d = distance(x, y, point[0], point[1]);
    if (d <= closestDist) {
      closest = room;
      closestDist = d;
    }
  }
  return closest;
}

/** Nearest mesh-overlay line whose two-point segment passes within
 * `radius` of the point, else null. */
export function findMeshLinkAt(
  links: ResolvedMeshLink[],
  x: number,
  y: number,
  radius: number,
): ResolvedMeshLink | null {
  let closest: ResolvedMeshLink | null = null;
  let closestDist = radius;
  for (const link of links) {
    const d = pointToPolylineDistance(x, y, [
      [link.fromPin.x, link.fromPin.y],
      [link.toPin.x, link.toPin.y],
    ]);
    if (d <= closestDist) {
      closest = link;
      closestDist = d;
    }
  }
  return closest;
}

/** Nearest cross-floor mesh stub — checking both its marker point and its
 * line back to the local pin, whichever is closer — within `radius`, else
 * null. */
export function findMeshStubAt(
  stubs: ResolvedMeshStub[],
  x: number,
  y: number,
  radius: number,
): ResolvedMeshStub | null {
  let closest: ResolvedMeshStub | null = null;
  let closestDist = radius;
  for (const stub of stubs) {
    const d = Math.min(
      distance(stub.x, stub.y, x, y),
      pointToPolylineDistance(x, y, [
        [stub.fromPin.x, stub.fromPin.y],
        [stub.x, stub.y],
      ]),
    );
    if (d <= closestDist) {
      closest = stub;
      closestDist = d;
    }
  }
  return closest;
}

/** Nearest door/window opening within `radius` of the point, else null.
 * Tests against the opening's whole rendered crossing-line (its real
 * on-screen extent, same as findWallAt's own line-based test), not just
 * its center point — a wide door clicked near either end used to miss
 * this test entirely and fall through to the wall underneath it. */
export function findOpeningAt(
  openings: Opening[],
  walls: Wall[],
  x: number,
  y: number,
  radius: number,
): Opening | null {
  let closest: Opening | null = null;
  let closestDist = radius;
  for (const opening of openings) {
    const wall = walls.find((w) => w.id === opening.wallId);
    if (!wall) continue;
    const ends = openingEndpoints(
      opening.x,
      opening.y,
      opening.width,
      wall.points,
    );
    if (!ends) continue;
    const d = pointToPolylineDistance(x, y, ends);
    if (d <= closestDist) {
      closest = opening;
      closestDist = d;
    }
  }
  return closest;
}
