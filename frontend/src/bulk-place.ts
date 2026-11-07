import polylabel from "polylabel";
import { pickDisplayEntity } from "./canvas/device-display";
import { pointInPolygon } from "./canvas/geometry";
import { isDevicePlaced } from "./picker-placement";
import type { PlaceableEntity, Room } from "./types";

/** Bulk placement by area: every unplaced device whose HA area is linked
 * to a room on this floor gets a first, approximate spot inside that room.
 * Pure, so the panel only has to turn the result into pins (one layout
 * update, so one undo step). */

export interface AreaDevice {
  deviceId: string;
  /** The entity the picker arms for this device (its ranked display entity). */
  entityId: string;
  areaId: string | null;
}

export interface BulkSpot {
  deviceId: string;
  roomId: string;
  x: number;
  y: number;
}

/** Real spacing between bulk-placed pins on a calibrated floor. */
export const BULK_SPACING_M = 0.5;

/** One row per physical device, the same grouping and ranked display
 * entity the device picker uses, so "its area" means the area the picker
 * shows. Entities with no device are skipped: a pin is keyed on a device. */
export function devicesWithAreas(entities: PlaceableEntity[]): AreaDevice[] {
  const groups = new Map<string, PlaceableEntity[]>();
  for (const e of entities) {
    if (!e.device_id) continue;
    const list = groups.get(e.device_id);
    if (list) list.push(e);
    else groups.set(e.device_id, [e]);
  }
  const out: AreaDevice[] = [];
  for (const [deviceId, list] of groups) {
    const primary = pickDisplayEntity(deviceId, list) ?? list[0]!;
    out.push({
      deviceId,
      entityId: primary.entity_id,
      areaId: primary.area_id ?? list.find((e) => e.area_id)?.area_id ?? null,
    });
  }
  return out;
}

/** Devices not placed anywhere yet (this plan, another floor or the
 * Property tab) and not hidden from the picker. */
export function unplacedDevices(
  entities: PlaceableEntity[],
  placedDeviceIds: ReadonlySet<string>,
  hiddenDeviceIds: ReadonlySet<string>,
  currentFloorId: string | null,
): AreaDevice[] {
  const byDevice = new Map<string, PlaceableEntity[]>();
  for (const e of entities) {
    if (!e.device_id) continue;
    const list = byDevice.get(e.device_id);
    if (list) list.push(e);
    else byDevice.set(e.device_id, [e]);
  }
  return devicesWithAreas(entities).filter(
    (d) =>
      !hiddenDeviceIds.has(d.deviceId) &&
      !isDevicePlaced(
        d.deviceId,
        byDevice.get(d.deviceId) ?? [],
        placedDeviceIds,
        currentFloorId,
      ),
  );
}

/** Shoelace area (absolute), in squared plan units. */
export function polygonArea(points: [number, number][]): number {
  let sum = 0;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    sum += (points[j]![0] + points[i]![0]) * (points[j]![1] - points[i]![1]);
  }
  return Math.abs(sum) / 2;
}

/** The room each area's devices go into: the largest room linked to it,
 * when more than one is. */
export function roomForEachArea(rooms: Room[]): Map<string, Room> {
  const best = new Map<string, Room>();
  for (const room of rooms) {
    if (!room.area_id || room.points.length < 3) continue;
    const current = best.get(room.area_id);
    if (!current || polygonArea(room.points) > polygonArea(current.points)) {
      best.set(room.area_id, room);
    }
  }
  return best;
}

/** Grid cells around (0, 0) ordered ring by ring (Chebyshev distance), then
 * by real distance and angle inside a ring — a deterministic square
 * spiral. */
function spiralCells(maxRing: number): [number, number][] {
  const cells: [number, number][] = [];
  for (let ring = 0; ring <= maxRing; ring++) {
    const ringCells: [number, number][] = [];
    for (let i = -ring; i <= ring; i++) {
      for (let j = -ring; j <= ring; j++) {
        if (Math.max(Math.abs(i), Math.abs(j)) === ring) ringCells.push([i, j]);
      }
    }
    ringCells.sort((a, b) => {
      const da = a[0] * a[0] + a[1] * a[1];
      const db = b[0] * b[0] + b[1] * b[1];
      if (da !== db) return da - db;
      return Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]);
    });
    cells.push(...ringCells);
  }
  return cells;
}

function bbox(points: [number, number][]) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of points) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  return { minX, minY, maxX, maxY };
}

/** The pole of inaccessibility: the point inside the room farthest from
 * its edges (also where the room's name label goes by default). */
export function labelPoint(points: [number, number][]): [number, number] {
  const [x, y] = polylabel([points], 1);
  return [x, y];
}

/** `count` points inside the polygon: a grid spiral out from its pole of
 * inaccessibility, `spacing` apart, every point inside the polygon and at
 * least `spacing` from every `occupied` point. Shrinks the spacing (down
 * to an eighth) when the room is too small for that many; whatever still
 * doesn't fit stacks on the pole itself. Deterministic. */
export function distributeInPolygon(
  points: [number, number][],
  count: number,
  spacing: number,
  occupied: [number, number][] = [],
): [number, number][] {
  if (count <= 0 || points.length < 3) return [];
  const pole = labelPoint(points);
  const box = bbox(points);
  const span = Math.max(box.maxX - box.minX, box.maxY - box.minY);
  for (let s = spacing; s >= spacing / 8; s *= 0.7) {
    if (!(s > 0)) break;
    const maxRing = Math.ceil(span / s) + 1;
    // A huge ring count only happens with a tiny spacing on a big room;
    // cap the work (a 400x400 grid is plenty for any real room).
    if (maxRing > 200) continue;
    const found: [number, number][] = [];
    const taken = [...occupied];
    for (const [i, j] of spiralCells(maxRing)) {
      const x = pole[0] + i * s;
      const y = pole[1] + j * s;
      if (!pointInPolygon(x, y, points)) continue;
      if (taken.some(([ox, oy]) => Math.hypot(ox - x, oy - y) < s * 0.999))
        continue;
      found.push([x, y]);
      taken.push([x, y]);
      if (found.length === count) return found;
    }
  }
  // Too small even at the tightest spacing: everything on the pole (the
  // pin stack UI then lets the user pull them apart).
  return Array.from({ length: count }, () => [pole[0], pole[1]]);
}

/** Starting spacing in plan units: 0.5 m on a calibrated floor; otherwise
 * proportional to the room, so N pins spread over it rather than clump. */
export function bulkSpacing(
  points: [number, number][],
  count: number,
  unitsPerMeter: number | null,
): number {
  if (unitsPerMeter && unitsPerMeter > 0) return BULK_SPACING_M * unitsPerMeter;
  const box = bbox(points);
  const shortSide = Math.min(box.maxX - box.minX, box.maxY - box.minY);
  const even = Math.sqrt(polygonArea(points) / Math.max(1, count)) * 0.8;
  return Math.max(1, Math.min(even, shortSide / 3));
}

export interface BulkPlanInput {
  rooms: Room[];
  /** Candidate devices: already filtered to unplaced and not hidden. */
  devices: AreaDevice[];
  unitsPerMeter: number | null;
  /** Pins already on this floor, kept clear of. */
  occupied: [number, number][];
  /** Only this area's devices; null = every area linked to a room here. */
  areaId?: string | null;
}

/** Where every device goes. Rooms in list order, devices by id within a
 * room, so the same input always gives the same layout. */
export function planBulkPlacement(input: BulkPlanInput): BulkSpot[] {
  const rooms = roomForEachArea(input.rooms);
  const byArea = new Map<string, AreaDevice[]>();
  for (const d of input.devices) {
    if (!d.areaId || !rooms.has(d.areaId)) continue;
    if (input.areaId && d.areaId !== input.areaId) continue;
    const list = byArea.get(d.areaId);
    if (list) list.push(d);
    else byArea.set(d.areaId, [d]);
  }
  const spots: BulkSpot[] = [];
  const occupied = [...input.occupied];
  for (const room of input.rooms) {
    if (!room.area_id || rooms.get(room.area_id) !== room) continue;
    const devices = byArea.get(room.area_id);
    if (!devices?.length) continue;
    devices.sort((a, b) => a.deviceId.localeCompare(b.deviceId));
    const spacing = bulkSpacing(
      room.points,
      devices.length,
      input.unitsPerMeter,
    );
    const inRoom = occupied.filter(([x, y]) =>
      pointInPolygon(x, y, room.points),
    );
    const points = distributeInPolygon(
      room.points,
      devices.length,
      spacing,
      inRoom,
    );
    devices.forEach((d, i) => {
      const [x, y] = points[i]!;
      spots.push({ deviceId: d.deviceId, roomId: room.id, x, y });
      occupied.push([x, y]);
    });
  }
  return spots;
}

/** How many unplaced devices each linked area would get — for the picker's
 * labels ("Place 7 devices"). */
export function bulkCounts(
  rooms: Room[],
  devices: AreaDevice[],
): Map<string, number> {
  const linked = roomForEachArea(rooms);
  const counts = new Map<string, number>();
  for (const d of devices) {
    if (!d.areaId || !linked.has(d.areaId)) continue;
    counts.set(d.areaId, (counts.get(d.areaId) ?? 0) + 1);
  }
  return counts;
}

/** Keep-armed placement: the next device to arm after `justPlacedEntityId`
 * was placed — the first still-unplaced row after it in the picker's
 * current (filtered, sorted) list, wrapping around; null when none is left. */
export function nextToArm(
  rows: { entityId: string; placed: boolean }[],
  justPlacedEntityId: string,
): string | null {
  const start = rows.findIndex((r) => r.entityId === justPlacedEntityId);
  for (let k = 1; k <= rows.length; k++) {
    const row = rows[(start + k + rows.length) % rows.length]!;
    if (!row.placed && row.entityId !== justPlacedEntityId) return row.entityId;
  }
  return null;
}

/** The pin without its "approximate" flag (dragged or confirmed). The key
 * is dropped, not set to false, so a confirmed pin saves exactly like one
 * that was never bulk-placed. */
export function confirmPin<T extends { approximate?: boolean }>(pin: T): T {
  if (!("approximate" in pin)) return pin;
  const next = { ...pin };
  delete next.approximate;
  return next;
}
