import { describe, expect, it } from "vitest";
import { enclosedRegion } from "./enclosed-room";

const wall = (...points: [number, number][]) => ({ points });
const square = (x: number, y: number, s: number) =>
  wall([x, y], [x + s, y], [x + s, y + s], [x, y + s], [x, y]);

const sorted = (pts: [number, number][] | null) =>
  pts?.map((p) => p.join(",")).sort();

describe("enclosedRegion (#46)", () => {
  it("finds a closed square from one wall loop", () => {
    const r = enclosedRegion([50, 50], [square(0, 0, 100)], 2);
    expect(sorted(r)).toEqual(["0,0", "0,100", "100,0", "100,100"]);
  });

  it("works from four separate walls that meet at the corners", () => {
    const walls = [
      wall([0, 0], [100, 0]),
      wall([100, 0], [100, 100]),
      wall([100, 100], [0, 100]),
      wall([0, 100], [0, 0]),
    ];
    expect(enclosedRegion([10, 10], walls, 2)).toHaveLength(4);
  });

  it("returns null when a wall has a gap", () => {
    const walls = [
      wall([0, 0], [100, 0]),
      wall([100, 0], [100, 40]),
      wall([100, 60], [100, 100]),
      wall([100, 100], [0, 100]),
      wall([0, 100], [0, 0]),
    ];
    expect(enclosedRegion([50, 50], walls, 2)).toBeNull();
  });

  it("closes a tiny gap within the tolerance", () => {
    const walls = [
      wall([0, 0], [100, 0]),
      wall([101, 0], [100, 100]),
      wall([100, 100], [0, 100]),
      wall([0, 100], [0, 0]),
    ];
    expect(enclosedRegion([50, 50], walls, 2)).not.toBeNull();
  });

  it("returns null outside the walls", () => {
    expect(enclosedRegion([300, 300], [square(0, 0, 100)], 2)).toBeNull();
  });

  it("splits a room at a dividing wall that ends on both sides (T-junctions)", () => {
    const walls = [square(0, 0, 100), wall([50, 0], [50, 100])];
    const left = enclosedRegion([20, 50], walls, 2);
    const right = enclosedRegion([80, 50], walls, 2);
    expect(sorted(left)).toEqual(["0,0", "0,100", "50,0", "50,100"]);
    expect(sorted(right)).toEqual(["100,0", "100,100", "50,0", "50,100"]);
  });

  it("splits where two walls cross without sharing an end", () => {
    const walls = [square(0, 0, 100), wall([0, 50], [100, 50])];
    const top = enclosedRegion([50, 20], walls, 2);
    expect(sorted(top)).toEqual(["0,0", "0,50", "100,0", "100,50"]);
  });

  it("ignores a wall stub that dangles into the room", () => {
    const walls = [square(0, 0, 100), wall([50, 0], [50, 40])];
    expect(enclosedRegion([20, 20], walls, 2)).toHaveLength(4);
  });

  it("picks the inner room when one square sits inside another", () => {
    const walls = [square(0, 0, 200), square(50, 50, 50)];
    expect(sorted(enclosedRegion([75, 75], walls, 2))).toEqual([
      "100,100",
      "100,50",
      "50,100",
      "50,50",
    ]);
  });

  it("returns null with too few walls", () => {
    expect(enclosedRegion([1, 1], [wall([0, 0], [10, 0])], 2)).toBeNull();
  });
});
