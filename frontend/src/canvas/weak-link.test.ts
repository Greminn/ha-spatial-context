import { describe, expect, it } from "vitest";
import {
  checkWeakLink,
  lqiToDbm,
  unitsPerMetre,
  weakLinkToFlag,
} from "./weak-link";
import type { Scale, Wall } from "../types";

// 100 units = 10 m, so 10 units per metre.
const scale: Scale = {
  points: [
    [0, 0],
    [100, 0],
  ],
  meters: 10,
};
const wall = (x: number): Wall =>
  ({
    id: `w${x}`,
    material: "concrete_block",
    points: [
      [x, -50],
      [x, 50],
    ],
  }) as Wall;

describe("lqiToDbm", () => {
  it("stretches 0..255 over the dBm range and clamps outside it", () => {
    expect(lqiToDbm(0)).toBe(-100);
    expect(lqiToDbm(255)).toBe(-30);
    expect(lqiToDbm(-10)).toBe(-100);
    expect(lqiToDbm(999)).toBe(-30);
  });
});

describe("unitsPerMetre", () => {
  it("reads the calibration, and is null without a usable one", () => {
    expect(unitsPerMetre(scale)).toBe(10);
    expect(unitsPerMetre(null)).toBeNull();
    expect(unitsPerMetre({ ...scale, meters: 0 })).toBeNull();
    expect(
      unitsPerMetre({
        points: [
          [5, 5],
          [5, 5],
        ],
        meters: 3,
      }),
    ).toBeNull();
  });
});

describe("checkWeakLink", () => {
  const open = {
    from: [0, 0] as [number, number],
    to: [50, 0] as [number, number],
    openings: [],
    scale,
  };

  it("cannot judge a floor with no scale", () => {
    expect(
      checkWeakLink({ ...open, walls: [], scale: null, lqi: 100 }),
    ).toBeNull();
  });

  it("measures the real distance and the walls in the way", () => {
    const clear = checkWeakLink({ ...open, walls: [], lqi: 100 })!;
    expect(clear.distanceM).toBeCloseTo(5);
    expect(clear.wallDb).toBe(0);
    const walled = checkWeakLink({ ...open, walls: [wall(25)], lqi: 100 })!;
    expect(walled.wallDb).toBeGreaterThan(0);
    // A wall lowers the prediction, so the same reading is a smaller gap.
    expect(walled.predictedDbm).toBeLessThan(clear.predictedDbm);
    expect(walled.gapDb).toBeLessThan(clear.gapDb);
  });

  it("treats anything under a metre as a metre", () => {
    const near = checkWeakLink({
      ...open,
      to: [1, 0],
      walls: [],
      lqi: 100,
    })!;
    expect(near.predictedDbm).toBeCloseTo(-35);
  });
});

describe("weakLinkToFlag", () => {
  const check = {
    gapDb: 20,
    predictedDbm: -50,
    measuredDbm: -70,
    wallDb: 0,
    distanceM: 5,
  };

  it("flags only a gap above the threshold", () => {
    expect(weakLinkToFlag(check, 15)).toBe(check);
    expect(weakLinkToFlag(check, 20)).toBeNull();
    expect(weakLinkToFlag(check, 30)).toBeNull();
  });

  it("is off at 0 and for no check", () => {
    expect(weakLinkToFlag(check, 0)).toBeNull();
    expect(weakLinkToFlag(null, 15)).toBeNull();
  });
});
