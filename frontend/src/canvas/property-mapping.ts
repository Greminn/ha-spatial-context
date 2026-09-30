import type { PropertyPlacement } from "../types";

/** Floor-plan <-> Property-tab site-photo coordinates, through a building's
 * placement: its rectangle on the photo is the building's traced
 * footprint (`source_bounds`, floor-plan units) scaled to `width`×`height`,
 * rotated by `rotation_deg` about its center and centered at `x`/`y`. Every
 * floor in the building shares one coordinate system (Align Floors), so
 * this one mapping serves all of them. Null when the placement has no
 * footprint to map from (nothing was traced when it was placed). */

export function floorToProperty(
  placement: PropertyPlacement,
  x: number,
  y: number,
): { x: number; y: number } | null {
  const b = placement.source_bounds;
  if (!b || b.max_x <= b.min_x || b.max_y <= b.min_y) return null;
  const localX = ((x - b.min_x) / (b.max_x - b.min_x) - 0.5) * placement.width;
  const localY = ((y - b.min_y) / (b.max_y - b.min_y) - 0.5) * placement.height;
  const rad = (placement.rotation_deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: placement.x + cos * localX - sin * localY,
    y: placement.y + sin * localX + cos * localY,
  };
}

export function propertyToFloor(
  placement: PropertyPlacement,
  x: number,
  y: number,
): { x: number; y: number } | null {
  const b = placement.source_bounds;
  if (
    !b ||
    b.max_x <= b.min_x ||
    b.max_y <= b.min_y ||
    placement.width <= 0 ||
    placement.height <= 0
  ) {
    return null;
  }
  const rad = (placement.rotation_deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = x - placement.x;
  const dy = y - placement.y;
  const localX = cos * dx + sin * dy;
  const localY = -sin * dx + cos * dy;
  return {
    x: (localX / placement.width + 0.5) * (b.max_x - b.min_x) + b.min_x,
    y: (localY / placement.height + 0.5) * (b.max_y - b.min_y) + b.min_y,
  };
}
