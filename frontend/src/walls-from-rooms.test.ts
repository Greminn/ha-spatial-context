import { describe, expect, it } from "vitest";
import {
  EXTERIOR_WALL_MATERIAL,
  INTERIOR_WALL_MATERIAL,
  classifyCoverage,
  subtractIntervals,
  wallTolerance,
  wallsFromRooms,
  type GeneratedWall,
} from "./walls-from-rooms";
import type { Room, Wall } from "./types";

const rect = (
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
): Room => ({
  id,
  name: id,
  area_id: null,
  points: [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ],
});
const wall = (points: [number, number][]): Wall => ({
  id: `w${points.join()}`,
  material: "glass",
  points,
});

const len = (w: GeneratedWall) =>
  Math.hypot(w.points[1][0] - w.points[0][0], w.points[1][1] - w.points[0][1]);
const total = (walls: GeneratedWall[]) => walls.reduce((s, w) => s + len(w), 0);
const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;

describe("subtractIntervals", () => {
  it("cuts the middle, the ends, or everything", () => {
    expect(subtractIntervals([[0, 10]], [[3, 4]])).toEqual([
      [0, 3],
      [4, 10],
    ]);
    expect(subtractIntervals([[0, 10]], [[-1, 2]])).toEqual([[2, 10]]);
    expect(subtractIntervals([[0, 10]], [[-1, 11]])).toEqual([]);
    expect(subtractIntervals([[0, 10]], [[20, 30]])).toEqual([[0, 10]]);
  });
});

describe("classifyCoverage", () => {
  it("splits one line into exterior and shared pieces", () => {
    const pieces = classifyCoverage([
      { start: 0, end: 10, roomId: "a" },
      { start: 5, end: 15, roomId: "b" },
    ]);
    expect(pieces).toEqual([
      { start: 0, end: 5, shared: false, offset: 0 },
      { start: 5, end: 10, shared: true, offset: 0 },
      { start: 10, end: 15, shared: false, offset: 0 },
    ]);
  });

  it("merges touching pieces of the same kind", () => {
    expect(
      classifyCoverage([
        { start: 0, end: 5, roomId: "a" },
        { start: 5, end: 10, roomId: "b" },
      ]),
    ).toEqual([{ start: 0, end: 10, shared: false, offset: 0 }]);
  });

  it("does not count one room twice", () => {
    expect(
      classifyCoverage([
        { start: 0, end: 10, roomId: "a" },
        { start: 2, end: 4, roomId: "a" },
      ]),
    ).toEqual([{ start: 0, end: 10, shared: false, offset: 0 }]);
  });
});

describe("wallsFromRooms", () => {
  it("gives a lone room four exterior walls", () => {
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 100, 50)],
      existingWalls: [],
      tolerance: 2,
    });
    expect(walls).toHaveLength(4);
    expect(walls.every((w) => w.exterior)).toBe(true);
    expect(walls.every((w) => w.material === EXTERIOR_WALL_MATERIAL)).toBe(
      true,
    );
    expect(total(walls)).toBeCloseTo(300);
  });

  it("turns a shared edge into one interior wall", () => {
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 100, 50), rect("b", 100, 0, 100, 50)],
      existingWalls: [],
      tolerance: 2,
    });
    const interior = walls.filter((w) => !w.exterior);
    expect(interior).toHaveLength(1);
    expect(interior[0]!.material).toBe(INTERIOR_WALL_MATERIAL);
    expect(interior[0]!.points.every(([x]) => near(x, 100))).toBe(true);
    expect(len(interior[0]!)).toBeCloseTo(50);
    // Top and bottom run straight across both rooms as one wall each.
    const exterior = walls.filter((w) => w.exterior);
    expect(exterior).toHaveLength(4);
    expect(total(exterior)).toBeCloseTo(200 + 200 + 50 + 50);
  });

  it("shares only the overlapping part of an edge", () => {
    // b is shorter and sits against the middle of a's right edge.
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 100, 100), rect("b", 100, 25, 50, 50)],
      existingWalls: [],
      tolerance: 2,
    });
    const onX100 = walls.filter((w) => w.points.every(([x]) => near(x, 100)));
    const shared = onX100.filter((w) => !w.exterior);
    expect(shared).toHaveLength(1);
    expect(len(shared[0]!)).toBeCloseTo(50);
    expect(total(onX100.filter((w) => w.exterior))).toBeCloseTo(50);
  });

  it("treats rooms traced a wall's thickness apart as sharing a wall", () => {
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 100, 50), rect("b", 104, 0, 100, 50)],
      existingWalls: [],
      tolerance: 6,
    });
    const interior = walls.filter((w) => !w.exterior);
    expect(interior).toHaveLength(1);
    // Down the middle of the gap.
    expect(interior[0]!.points.every(([x]) => near(x, 102))).toBe(true);
  });

  it("keeps rooms further apart than the tolerance separate", () => {
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 100, 50), rect("b", 120, 0, 100, 50)],
      existingWalls: [],
      tolerance: 6,
    });
    expect(walls.every((w) => w.exterior)).toBe(true);
  });

  it("works for a non-axis-aligned shared edge", () => {
    const a: Room = {
      id: "a",
      name: "a",
      area_id: null,
      points: [
        [0, 0],
        [100, 100],
        [0, 100],
      ],
    };
    const b: Room = {
      id: "b",
      name: "b",
      area_id: null,
      points: [
        [0, 0],
        [100, 0],
        [100, 100],
      ],
    };
    const walls = wallsFromRooms({
      rooms: [a, b],
      existingWalls: [],
      tolerance: 2,
    });
    const interior = walls.filter((w) => !w.exterior);
    expect(interior).toHaveLength(1);
    expect(len(interior[0]!)).toBeCloseTo(Math.SQRT2 * 100);
    expect(walls).toHaveLength(5);
  });

  it("skips what an existing wall already covers", () => {
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 100, 50)],
      existingWalls: [
        wall([
          [0, 0],
          [100, 0],
        ]),
        // Half of the left edge, drawn the other way round.
        wall([
          [0, 50],
          [0, 25],
        ]),
      ],
      tolerance: 2,
    });
    expect(walls.some((w) => w.points.every(([, y]) => near(y, 0)))).toBe(
      false,
    );
    const left = walls.filter((w) => w.points.every(([x]) => near(x, 0)));
    expect(left).toHaveLength(1);
    expect(len(left[0]!)).toBeCloseTo(23); // 25 minus the 2-unit tolerance
    expect(walls).toHaveLength(3);
  });

  it("adds nothing when every edge already has a wall", () => {
    const room = rect("a", 0, 0, 100, 50);
    const existing = [
      wall([
        [0, 0],
        [100, 0],
        [100, 50],
        [0, 50],
        [0, 0],
      ]),
    ];
    expect(
      wallsFromRooms({ rooms: [room], existingWalls: existing, tolerance: 2 }),
    ).toEqual([]);
  });

  it("keeps a distant room on the same line at its own offset", () => {
    // b's top edge is 10 units lower than a's, within the tolerance, but
    // far away along the line: it must not be pulled up to a's line.
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 100, 50), rect("b", 300, 10, 100, 50)],
      existingWalls: [],
      tolerance: 17,
    });
    const bTop = walls.find(
      (w) =>
        w.points.every(([x]) => x >= 300) &&
        w.points.every(([, y]) => near(y, 10)),
    );
    expect(bTop).toBeDefined();
    const aTop = walls.find(
      (w) =>
        w.points.every(([x]) => x <= 100) &&
        w.points.every(([, y]) => near(y, 0)),
    );
    expect(aTop).toBeDefined();
  });

  it("puts the exterior part of a partly shared edge on its own room's edge", () => {
    // b sits 4 units below a, against the left half of a's bottom edge.
    const walls = wallsFromRooms({
      rooms: [rect("a", 0, 0, 200, 50), rect("b", 0, 54, 100, 50)],
      existingWalls: [],
      tolerance: 6,
    });
    const shared = walls.filter((w) => !w.exterior);
    expect(shared).toHaveLength(1);
    expect(shared[0]!.points.every(([, y]) => near(y, 52))).toBe(true);
    const aBottomRight = walls.find(
      (w) => w.exterior && w.points.every(([x, y]) => x >= 100 && near(y, 50)),
    );
    expect(aBottomRight).toBeDefined();
  });

  it("ignores degenerate rooms", () => {
    const bad: Room = {
      id: "x",
      name: "x",
      area_id: null,
      points: [
        [0, 0],
        [5, 5],
      ],
    };
    expect(
      wallsFromRooms({ rooms: [bad], existingWalls: [], tolerance: 2 }),
    ).toEqual([]);
  });
});

describe("wallTolerance", () => {
  it("is 35 cm when calibrated, a fixed few units otherwise", () => {
    expect(wallTolerance(20)).toBeCloseTo(7);
    expect(wallTolerance(null)).toBe(6);
  });
});
