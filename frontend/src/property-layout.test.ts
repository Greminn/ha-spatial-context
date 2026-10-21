import { describe, expect, it } from "vitest";
import {
  buildingAspectRatio,
  buildingBounds,
  buildingMetersPerUnit,
  livePlacements,
  placementForFloor,
  propertyScale,
} from "./property-layout";
import { emptyPropertyLayout } from "./ha-client";
import type { FloorMeta, PropertyPlacement } from "./types";

const floor = (floor_id: string, over: Partial<FloorMeta> = {}): FloorMeta => ({
  floor_id,
  name: floor_id,
  level: 0,
  icon: null,
  has_layout: true,
  building_id: null,
  content_bounds: null,
  ...over,
});

const placement = (
  floor_id: string,
  over: Partial<PropertyPlacement> = {},
): PropertyPlacement => ({
  id: `p-${floor_id}`,
  building_id: null,
  floor_id,
  label_override: null,
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  rotation_deg: 0,
  aspect_ratio: 2,
  source_bounds: { min_x: 0, min_y: 0, max_x: 1000, max_y: 500 },
  ...over,
});

describe("livePlacements", () => {
  it("keeps a placement whose floor exists and drops one whose building is gone", () => {
    const floors = [floor("up")];
    const kept = placement("up");
    const gone = placement("old", { building_id: null });
    expect(livePlacements(floors, [kept, gone])).toEqual([kept]);
  });

  it("re-anchors a placement onto a surviving floor of its building", () => {
    const floors = [floor("down", { building_id: "house" })];
    const stored = placement("up", { building_id: "house" });
    const [live] = livePlacements(floors, [stored]);
    expect(live?.floor_id).toBe("down");
    expect(stored.floor_id).toBe("up");
  });
});

describe("placementForFloor", () => {
  it("resolves every floor of a building to the building's one placement", () => {
    const floors = [
      floor("up", { building_id: "house" }),
      floor("down", { building_id: "house" }),
      floor("garage"),
    ];
    const house = placement("up", { building_id: "house" });
    const garage = placement("garage");
    const layout = { ...emptyPropertyLayout(), placements: [house, garage] };
    expect(placementForFloor(floors, layout, "down")).toBe(house);
    expect(placementForFloor(floors, layout, "garage")).toBe(garage);
    expect(placementForFloor(floors, layout, "nowhere")).toBeNull();
  });
});

describe("building shape", () => {
  const box = (min_x: number, min_y: number, max_x: number, max_y: number) => ({
    min_x,
    min_y,
    max_x,
    max_y,
  });

  it("unions the footprints of a building's floors", () => {
    const floors = [
      floor("up", { content_bounds: box(0, 0, 100, 50) }),
      floor("down", { content_bounds: box(-20, 10, 80, 120) }),
      floor("attic"),
    ];
    expect(buildingBounds(floors)).toEqual(box(-20, 0, 100, 120));
    expect(buildingBounds([floor("attic")])).toBeNull();
  });

  it("takes its aspect ratio from the footprint, else a neutral default", () => {
    expect(
      buildingAspectRatio([
        floor("up", { content_bounds: box(0, 0, 300, 100) }),
      ]),
    ).toBe(3);
    expect(buildingAspectRatio([floor("up")])).toBeCloseTo(220 / 160);
  });
});

describe("scale", () => {
  it("uses the anchor floor's calibration, else any floor in the building", () => {
    const floors = [
      floor("up", { building_id: "house" }),
      floor("down", { building_id: "house", meters_per_unit: 0.02 }),
      floor("garage"),
    ];
    expect(
      buildingMetersPerUnit(floors, { floor_id: "up", building_id: "house" }),
    ).toBe(0.02);
    expect(
      buildingMetersPerUnit(floors, { floor_id: "garage", building_id: null }),
    ).toBeNull();
  });

  it("works out metres per property unit from the largest calibrated building", () => {
    // 1000 floor units at 0.02 m each is 20 m, drawn 200 units wide: 0.1 m per unit.
    const floors = [floor("up", { meters_per_unit: 0.02 })];
    const scale = propertyScale(floors, [placement("up")]);
    expect(scale?.metersPerUnit).toBeCloseTo(0.1);
    expect(scale?.buildingName).toBe("up");
    expect(scale?.disagree).toBe(false);
  });

  it("flags buildings whose sizes disagree by more than 10%", () => {
    const floors = [
      floor("house", { meters_per_unit: 0.02 }),
      floor("shed", { meters_per_unit: 0.02 }),
    ];
    const house = placement("house");
    const shed = placement("shed", { width: 40, height: 20 });
    expect(propertyScale(floors, [house, shed])?.disagree).toBe(true);
  });

  it("has no scale until a placed building has a calibrated floor", () => {
    expect(propertyScale([floor("up")], [placement("up")])).toBeNull();
    expect(propertyScale([], [])).toBeNull();
  });
});
