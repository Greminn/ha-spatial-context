import { describe, expect, it } from "vitest";
import { OPENING_LOSS_DB, pathLoss, segmentIntersection } from "./rf-path";
import { wallAttenuationDb, wallThicknessCm } from "./materials";
import type { Opening, Wall } from "../types";

const wall = (
  id: string,
  points: [number, number][],
  material = "concrete_block",
  thickness_cm?: number,
) =>
  ({
    id,
    material,
    points,
    ...(thickness_cm !== undefined ? { thickness_cm } : {}),
  }) as Wall;
const opening = (
  id: string,
  wallId: string,
  type: "door" | "window",
  x: number,
  y: number,
  width: number,
) => ({ id, wallId, type, x, y, width }) as Opening;

describe("segmentIntersection", () => {
  it("finds where two segments cross", () => {
    expect(segmentIntersection([0, 0], [10, 10], [0, 10], [10, 0])).toEqual({
      x: 5,
      y: 5,
    });
  });

  it("returns null when they miss, are parallel, or lie along each other", () => {
    expect(segmentIntersection([0, 0], [1, 1], [5, 0], [5, 10])).toBeNull();
    expect(segmentIntersection([0, 0], [10, 0], [0, 1], [10, 1])).toBeNull();
    expect(segmentIntersection([0, 0], [10, 0], [2, 0], [8, 0])).toBeNull();
  });
});

describe("pathLoss", () => {
  const vertical = wall("w1", [
    [5, -10],
    [5, 10],
  ]);
  const db = wallAttenuationDb(vertical.material, wallThicknessCm(vertical));

  it("costs nothing when no wall is in the way", () => {
    const loss = pathLoss([0, 0], [4, 0], [vertical], []);
    expect(loss.totalDb).toBe(0);
    expect(loss.crossings).toEqual([]);
  });

  it("charges a wall its material's loss for its thickness", () => {
    const loss = pathLoss([0, 0], [10, 0], [vertical], []);
    expect(loss.crossings).toHaveLength(1);
    expect(loss.totalDb).toBeCloseTo(db);
    expect(db).toBeGreaterThan(0);
  });

  it("adds up several walls", () => {
    const second = wall("w2", [
      [8, -10],
      [8, 10],
    ]);
    const loss = pathLoss([0, 0], [10, 0], [vertical, second], []);
    expect(loss.crossings.map((c) => c.wallId)).toEqual(["w1", "w2"]);
    expect(loss.totalDb).toBeCloseTo(db * 2);
  });

  it("counts a wall corner once, not once per segment", () => {
    // The path meets this polyline exactly at its corner (5, 0).
    const corner = wall("c", [
      [5, -5],
      [5, 0],
      [10, 5],
    ]);
    const loss = pathLoss([0, 0], [8, 0], [corner], []);
    expect(loss.crossings).toHaveLength(1);
  });

  it("charges the opening's loss when the path goes through a door", () => {
    const door = opening("d", "w1", "door", 5, 0, 2);
    const loss = pathLoss([0, 0], [10, 0], [vertical], [door]);
    expect(loss.crossings[0]!.throughOpening).toBe("door");
    expect(loss.totalDb).toBe(OPENING_LOSS_DB.door);
  });

  it("charges the wall when the path misses the opening", () => {
    const door = opening("d", "w1", "door", 5, 8, 2);
    const loss = pathLoss([0, 0], [10, 0], [vertical], [door]);
    expect(loss.crossings[0]!.throughOpening).toBeNull();
    expect(loss.totalDb).toBeCloseTo(db);
  });

  it("ignores an opening that belongs to a different wall", () => {
    const door = opening("d", "other", "door", 5, 0, 2);
    const loss = pathLoss([0, 0], [10, 0], [vertical], [door]);
    expect(loss.totalDb).toBeCloseTo(db);
  });

  it("skips walls with fewer than two points", () => {
    const stub = wall("s", [[5, 0]]);
    expect(pathLoss([0, 0], [10, 0], [stub], []).totalDb).toBe(0);
  });
});
