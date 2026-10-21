import { describe, expect, it } from "vitest";
import {
  findRoomForPoint,
  pointInPolygon,
  rayBoxExit,
  reassignPinRooms,
} from "./geometry";
import type { Pin, Room } from "../types";

const square: [number, number][] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];
const room = (id: string, points: [number, number][]) =>
  ({ id, name: id, points }) as unknown as Room;
const pin = (id: string, x: number, y: number, room_id: string | null) =>
  ({ id, x, y, room_id }) as unknown as Pin;

describe("pointInPolygon", () => {
  it("tells inside from outside, including a concave shape", () => {
    expect(pointInPolygon(5, 5, square)).toBe(true);
    expect(pointInPolygon(15, 5, square)).toBe(false);
    const ell: [number, number][] = [
      [0, 0],
      [10, 0],
      [10, 4],
      [4, 4],
      [4, 10],
      [0, 10],
    ];
    expect(pointInPolygon(2, 8, ell)).toBe(true);
    expect(pointInPolygon(8, 8, ell)).toBe(false);
  });
});

describe("room assignment", () => {
  const rooms = [
    room("a", square),
    room("b", [
      [20, 0],
      [30, 0],
      [30, 10],
    ]),
  ];

  it("finds the room a point sits in, ignoring shapes with fewer than three corners", () => {
    expect(findRoomForPoint(5, 5, rooms)).toBe("a");
    expect(findRoomForPoint(28, 2, rooms)).toBe("b");
    expect(findRoomForPoint(50, 50, rooms)).toBeNull();
    expect(
      findRoomForPoint(1, 1, [
        room("line", [
          [0, 0],
          [5, 5],
        ]),
      ]),
    ).toBeNull();
  });

  it("re-reads every pin's room, keeping the same array when nothing changed", () => {
    const pins = [pin("p1", 5, 5, "a"), pin("p2", 50, 50, null)];
    expect(reassignPinRooms(rooms, pins)).toBe(pins);
    const moved = reassignPinRooms(rooms, [pin("p1", 5, 5, null)]);
    expect(moved[0]?.room_id).toBe("a");
  });
});

describe("rayBoxExit", () => {
  const box = { minX: 0, minY: 0, maxX: 100, maxY: 50 };

  it("finds where a ray from inside leaves the box", () => {
    expect(rayBoxExit(10, 10, 1, 0, box)).toEqual({ x: 100, y: 10 });
    expect(rayBoxExit(10, 10, 0, -1, box)).toEqual({ x: 10, y: 0 });
    const diagonal = rayBoxExit(0, 0, 1, 1, box);
    expect(diagonal?.x).toBeCloseTo(50);
    expect(diagonal?.y).toBeCloseTo(50);
  });

  it("has no exit for a stationary ray or one pointing away from the edge it is on", () => {
    expect(rayBoxExit(10, 10, 0, 0, box)).toBeNull();
    expect(rayBoxExit(100, 10, 1, 0, box)).toBeNull();
  });
});
