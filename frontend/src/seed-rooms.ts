import type { AreaMeta, Room, ViewBox } from "./types";

/** "Create rooms for this floor's areas": one named, area-linked
 * placeholder rectangle per HA area on the floor that has no room yet,
 * laid out in a grid the user then reshapes over the background. Pure, so
 * the panel only wraps the result in rooms (one undo step). */

export interface SeedRect {
  areaId: string;
  points: [number, number][];
}

interface Box {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Areas on this HA floor with no room on this plan linked to them, by
 * name. Floor-less areas are left out: they can belong to any floor, so
 * only the user knows which plan they go on. */
export function areasWithoutRooms(
  areas: AreaMeta[],
  rooms: Room[],
  floorId: string,
): AreaMeta[] {
  const linked = new Set(rooms.map((r) => r.area_id).filter(Boolean));
  return areas
    .filter((a) => a.floor_id === floorId && !linked.has(a.area_id))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function boxOf(points: [number, number][]): Box {
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

function overlaps(a: Box, b: Box): boolean {
  return (
    a.minX < b.maxX && b.minX < a.maxX && a.minY < b.maxY && b.minY < a.maxY
  );
}

/** Side of a placeholder in metres: a small room plus room for its
 * devices, between 2.5 m and 7 m. */
export function seedSideMeters(deviceCount: number): number {
  return Math.min(
    7,
    Math.max(2.5, Math.sqrt(6 + 1.5 * Math.max(0, deviceCount))),
  );
}

export interface SeedInput {
  areas: AreaMeta[];
  /** Devices per area_id — bigger areas get bigger placeholders. */
  deviceCounts: ReadonlyMap<string, number>;
  /** Where to lay them out: the background image's extent, else the
   * visible part of the plan. */
  bounds: ViewBox;
  unitsPerMeter: number | null;
  /** Existing rooms: grid cells that would overlap one are skipped. */
  existing: Room[];
}

/** One rectangle per area, in a grid filling `bounds` (5% margin) row by
 * row. A cell overlapping an existing room is skipped, and the grid grows
 * downwards past `bounds` when it runs out of free cells. Squares sized by
 * device count: in metres on a calibrated floor (never wider than a
 * cell), relative to the busiest area otherwise. */
export function seedRoomRects(input: SeedInput): SeedRect[] {
  const n = input.areas.length;
  if (n === 0) return [];
  const { bounds } = input;
  const margin = Math.min(bounds.w, bounds.h) * 0.05;
  const x0 = bounds.x + margin;
  const y0 = bounds.y + margin;
  const w = Math.max(1, bounds.w - margin * 2);
  const h = Math.max(1, bounds.h - margin * 2);
  const avoid = input.existing
    .filter((r) => r.points.length >= 3)
    .map((r) => boxOf(r.points));
  // Enough cells for every area plus the ones existing rooms block.
  const blocked = Math.min(avoid.length, n * 4);
  const cellsWanted = n + blocked;
  const cols = Math.max(1, Math.ceil(Math.sqrt((cellsWanted * w) / h)));
  const rows = Math.max(1, Math.ceil(cellsWanted / cols));
  const cell = Math.min(w / cols, h / rows);
  const maxCount = Math.max(
    1,
    ...input.areas.map((a) => input.deviceCounts.get(a.area_id) ?? 0),
  );

  const side = (areaId: string): number => {
    const count = input.deviceCounts.get(areaId) ?? 0;
    const fitted = cell * 0.85;
    if (input.unitsPerMeter && input.unitsPerMeter > 0) {
      return Math.min(fitted, seedSideMeters(count) * input.unitsPerMeter);
    }
    return fitted * (0.55 + 0.45 * Math.sqrt(count / maxCount));
  };

  const out: SeedRect[] = [];
  let index = 0;
  // Rows below every existing room are always free, so this many cells
  // always hold every area.
  const lowest = Math.max(y0, ...avoid.map((b) => b.maxY));
  const limit = cols * (Math.ceil((lowest - y0) / cell) + n + 1);
  for (let k = 0; out.length < n && k < limit; k++) {
    const col = k % cols;
    const row = Math.floor(k / cols);
    const cx = x0 + (col + 0.5) * cell;
    const cy = y0 + (row + 0.5) * cell;
    const cellBox: Box = {
      minX: cx - cell / 2,
      minY: cy - cell / 2,
      maxX: cx + cell / 2,
      maxY: cy + cell / 2,
    };
    if (avoid.some((b) => overlaps(b, cellBox))) continue;
    const area = input.areas[index++]!;
    const s = side(area.area_id) / 2;
    out.push({
      areaId: area.area_id,
      points: [
        [cx - s, cy - s],
        [cx + s, cy - s],
        [cx + s, cy + s],
        [cx - s, cy + s],
      ],
    });
  }
  return out;
}
