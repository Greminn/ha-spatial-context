import { describe, expect, it } from "vitest";
import { isDevicePlaced } from "./picker-placement";
import type { PlaceableEntity } from "./types";

const entity = (placed_floor_id: string | null) =>
  ({ placed_floor_id }) as unknown as PlaceableEntity;

describe("isDevicePlaced", () => {
  it("counts a device with a pin on the open plan", () => {
    expect(isDevicePlaced("d", [entity(null)], new Set(["d"]), "up")).toBe(
      true,
    );
  });

  it("counts a device placed on another floor", () => {
    expect(isDevicePlaced("d", [entity("down")], new Set(), "up")).toBe(true);
  });

  it("does not count a device nowhere", () => {
    expect(isDevicePlaced("d", [entity(null)], new Set(), "up")).toBe(false);
  });

  it("trusts the live layout over a stale snapshot for the open plan", () => {
    expect(isDevicePlaced("d", [entity("up")], new Set(), "up")).toBe(false);
  });
});
