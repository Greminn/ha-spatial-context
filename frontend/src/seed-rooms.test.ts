import { describe, expect, it } from "vitest";
import { areasWithoutRooms, seedRoomRects, seedSideMeters } from "./seed-rooms";
import type { AreaMeta, Room } from "./types";

const area = (area_id: string, floor_id: string | null, name = area_id) =>
  ({ area_id, name, floor_id, icon: null }) as AreaMeta;
const room = (area_id: string | null, points: [number, number][] = []) =>
  ({ id: `r-${area_id}`, name: "", area_id, points }) as Room;

const bounds = { x: 0, y: 0, w: 1000, h: 700 };
const boxOf = (pts: [number, number][]) => ({
  minX: Math.min(...pts.map((p) => p[0])),
  maxX: Math.max(...pts.map((p) => p[0])),
  minY: Math.min(...pts.map((p) => p[1])),
  maxY: Math.max(...pts.map((p) => p[1])),
});
const overlap = (a: ReturnType<typeof boxOf>, b: ReturnType<typeof boxOf>) =>
  a.minX < b.maxX && b.minX < a.maxX && a.minY < b.maxY && b.minY < a.maxY;

describe("areasWithoutRooms", () => {
  it("lists this floor's areas with no linked room, by name", () => {
    const areas = [
      area("kitchen", "ground", "Kitchen"),
      area("bath", "ground", "Bathroom"),
      area("den", "upper", "Den"),
      area("deck", null, "Deck"),
    ];
    const result = areasWithoutRooms(areas, [room("kitchen")], "ground");
    expect(result.map((a) => a.area_id)).toEqual(["bath"]);
  });
});

describe("seedRoomRects", () => {
  const areas = ["a", "b", "c", "d", "e"].map((id) => area(id, "f"));

  it("makes one square per area, inside the bounds, not overlapping", () => {
    const rects = seedRoomRects({
      areas,
      deviceCounts: new Map(),
      bounds,
      unitsPerMeter: null,
      existing: [],
    });
    expect(rects.map((r) => r.areaId)).toEqual(["a", "b", "c", "d", "e"]);
    const boxes = rects.map((r) => boxOf(r.points));
    for (const b of boxes) {
      expect(b.minX).toBeGreaterThanOrEqual(0);
      expect(b.maxX).toBeLessThanOrEqual(1000);
      expect(b.minY).toBeGreaterThanOrEqual(0);
      expect(b.maxY).toBeLessThanOrEqual(700);
      expect(b.maxX - b.minX).toBeCloseTo(b.maxY - b.minY);
    }
    for (let i = 0; i < boxes.length; i++)
      for (let j = i + 1; j < boxes.length; j++)
        expect(overlap(boxes[i]!, boxes[j]!)).toBe(false);
  });

  it("gives busier areas bigger rooms", () => {
    const rects = seedRoomRects({
      areas: [area("busy", "f"), area("quiet", "f")],
      deviceCounts: new Map([
        ["busy", 20],
        ["quiet", 0],
      ]),
      bounds,
      unitsPerMeter: null,
      existing: [],
    });
    const width = (i: number) => {
      const b = boxOf(rects[i]!.points);
      return b.maxX - b.minX;
    };
    expect(width(0)).toBeGreaterThan(width(1));
  });

  it("sizes in metres on a calibrated floor", () => {
    const rects = seedRoomRects({
      areas: [area("a", "f")],
      deviceCounts: new Map([["a", 2]]),
      bounds,
      unitsPerMeter: 40,
      existing: [],
    });
    const b = boxOf(rects[0]!.points);
    expect(b.maxX - b.minX).toBeCloseTo(seedSideMeters(2) * 40);
  });

  it("keeps clear of rooms already drawn", () => {
    const existing = [
      room("x", [
        [0, 0],
        [600, 0],
        [600, 700],
        [0, 700],
      ]),
    ];
    const rects = seedRoomRects({
      areas,
      deviceCounts: new Map(),
      bounds,
      unitsPerMeter: null,
      existing,
    });
    expect(rects).toHaveLength(5);
    const drawn = boxOf(existing[0]!.points);
    for (const r of rects) expect(overlap(boxOf(r.points), drawn)).toBe(false);
  });

  it("still places every area when the bounds are full", () => {
    const existing = [
      room("x", [
        [-10, -10],
        [1010, -10],
        [1010, 710],
        [-10, 710],
      ]),
    ];
    const rects = seedRoomRects({
      areas,
      deviceCounts: new Map(),
      bounds,
      unitsPerMeter: null,
      existing,
    });
    expect(rects).toHaveLength(5);
    for (const r of rects)
      expect(boxOf(r.points).minY).toBeGreaterThanOrEqual(710);
  });

  it("returns nothing for no areas", () => {
    expect(
      seedRoomRects({
        areas: [],
        deviceCounts: new Map(),
        bounds,
        unitsPerMeter: null,
        existing: [],
      }),
    ).toEqual([]);
  });
});

describe("seedSideMeters", () => {
  it("is clamped between 2.5 and 7 m", () => {
    expect(seedSideMeters(0)).toBe(2.5);
    expect(seedSideMeters(10)).toBeCloseTo(Math.sqrt(21));
    expect(seedSideMeters(-5)).toBe(2.5);
    expect(seedSideMeters(100)).toBe(7);
  });
});
