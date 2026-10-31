import { describe, expect, it } from "vitest";
import {
  RESET_PARTS,
  pinsToClear,
  resetFloorParts,
  withoutPins,
} from "./clear-scope";
import { emptyFloorLayout } from "./ha-client";
import type { FloorLayout, Pin, Room } from "./types";

const square: [number, number][] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];
const room = (id: string, area_id: string | null): Room =>
  ({ id, name: id, area_id, points: square }) as Room;
const pin = (id: string, x: number, room_id: string | null): Pin =>
  ({ id, device_id: id, x, y: 5, room_id }) as Pin;

const layout = (): FloorLayout => ({
  ...emptyFloorLayout(),
  background_image_id: "img",
  building_id: "b1",
  rooms: [room("lounge", "a-lounge"), room("hall", null)],
  walls: [
    {
      id: "w1",
      points: [
        [0, 0],
        [10, 0],
      ],
    },
  ] as FloorLayout["walls"],
  openings: [{ id: "o1", wallId: "w1" }] as FloorLayout["openings"],
  pins: [pin("p1", 2, "lounge"), pin("p2", 3, "hall"), pin("p3", 4, null)],
});

describe("resetFloorParts", () => {
  it("choosing everything is the full reset", () => {
    expect(resetFloorParts(layout(), new Set(RESET_PARTS))).toEqual(
      emptyFloorLayout(),
    );
  });

  it("clears only the chosen parts and keeps the calibration and building", () => {
    const out = resetFloorParts(layout(), new Set(["pins"]));
    expect(out.pins).toEqual([]);
    expect(out.rooms).toHaveLength(2);
    expect(out.walls).toHaveLength(1);
    expect(out.background_image_id).toBe("img");
    expect(out.building_id).toBe("b1");
  });

  it("takes doors and windows with the walls", () => {
    const out = resetFloorParts(layout(), new Set(["walls"]));
    expect(out.walls).toEqual([]);
    expect(out.openings).toEqual([]);
  });

  it("can clear doors and windows alone", () => {
    const out = resetFloorParts(layout(), new Set(["openings"]));
    expect(out.walls).toHaveLength(1);
    expect(out.openings).toEqual([]);
  });

  it("leaves devices placed, but unassigned, when rooms go", () => {
    const out = resetFloorParts(layout(), new Set(["rooms"]));
    expect(out.rooms).toEqual([]);
    expect(out.pins).toHaveLength(3);
    expect(out.pins.every((p) => p.room_id === null)).toBe(true);
  });

  it("can remove just the background image", () => {
    const out = resetFloorParts(layout(), new Set(["background"]));
    expect(out.background_image_id).toBeNull();
    expect(out.pins).toHaveLength(3);
  });
});

describe("pinsToClear", () => {
  it("is every pin with no area", () => {
    expect(pinsToClear(layout(), null)).toHaveLength(3);
  });

  it("is only the pins in rooms linked to the area", () => {
    expect(pinsToClear(layout(), "a-lounge").map((p) => p.id)).toEqual(["p1"]);
  });

  it("is nothing when no room uses the area", () => {
    expect(pinsToClear(layout(), "a-other")).toEqual([]);
  });
});

describe("withoutPins", () => {
  it("drops just the given pins", () => {
    const l = layout();
    const out = withoutPins(l, [l.pins[0]!, l.pins[2]!]);
    expect(out.pins.map((p) => p.id)).toEqual(["p2"]);
  });
});
