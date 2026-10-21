import type {
  ContentBounds,
  FloorMeta,
  PropertyLayout,
  PropertyPlacement,
} from "./types";
import {
  DEFAULT_PLACEMENT_HEIGHT,
  DEFAULT_PLACEMENT_WIDTH,
} from "./canvas/property-mapping";

/** Pure helpers for the Property tab's buildings, placements and scale,
 * taken out of panel.ts so they work on plain data and can be tested. */

/** Placements whose building still has a floor in HA (#37) — a
 * building whose floors were all deleted stays in storage, just not
 * drawn. One whose anchor floor alone was deleted is re-anchored (in
 * this display copy only) onto a surviving floor of its building, so
 * its name/icon still resolve. Mirrors storage.py's live_placements. */
export function livePlacements(
  floors: FloorMeta[],
  placements: PropertyPlacement[],
): PropertyPlacement[] {
  const live: PropertyPlacement[] = [];
  for (const p of placements) {
    if (floors.some((f) => f.floor_id === p.floor_id)) {
      live.push(p);
      continue;
    }
    const member =
      p.building_id !== null
        ? floors.find((f) => f.building_id === p.building_id)
        : undefined;
    if (member) live.push({ ...p, floor_id: member.floor_id });
  }
  return live;
}

/** Which placement a floor's *building* has on the Property tab, if any —
 * floors sharing a building_id (Align Floors) all resolve to the same
 * placement. */
export function placementForFloor(
  floors: FloorMeta[],
  propertyLayout: PropertyLayout,
  floorId: string,
): PropertyPlacement | null {
  const floor = floors.find((f) => f.floor_id === floorId);
  if (!floor) return null;
  return (
    propertyLayout.placements.find((p) =>
      floor.building_id !== null
        ? p.building_id === floor.building_id
        : p.floor_id === floorId,
    ) ?? null
  );
}

/** Union of a building's floors' traced footprints (see
 * buildingAspectRatio), or null when none has anything traced. */
export function buildingBounds(floors: FloorMeta[]): ContentBounds | null {
  const bounds = floors
    .map((f) => f.content_bounds)
    .filter((b): b is ContentBounds => b !== null);
  if (bounds.length === 0) return null;
  return {
    min_x: Math.min(...bounds.map((b) => b.min_x)),
    min_y: Math.min(...bounds.map((b) => b.min_y)),
    max_x: Math.max(...bounds.map((b) => b.max_x)),
    max_y: Math.max(...bounds.map((b) => b.max_y)),
  };
}

/** Union of every floor's traced footprint in the group (valid without
 * any further transform since floors sharing a building_id already
 * share one coordinate system — that's what Align Floors sets up), or a
 * neutral fallback ratio when nothing's been traced yet on any of them. */
export function buildingAspectRatio(floors: FloorMeta[]): number {
  const bounds = buildingBounds(floors);
  const width = bounds ? bounds.max_x - bounds.min_x : 0;
  const height = bounds ? bounds.max_y - bounds.min_y : 0;
  return width > 0 && height > 0
    ? width / height
    : DEFAULT_PLACEMENT_WIDTH / DEFAULT_PLACEMENT_HEIGHT;
}

/** A placement's building scale: its anchor floor's calibration, else
 * any other floor sharing its building_id (one coordinate system). */
export function buildingMetersPerUnit(
  floors: FloorMeta[],
  placement: Pick<PropertyPlacement, "floor_id" | "building_id">,
): number | null {
  const anchor = floors.find((f) => f.floor_id === placement.floor_id);
  if (anchor?.meters_per_unit) return anchor.meters_per_unit;
  if (placement.building_id === null) return null;
  const member = floors.find(
    (f) => f.building_id === placement.building_id && f.meters_per_unit,
  );
  return member?.meters_per_unit ?? null;
}

export interface PropertyScale {
  metersPerUnit: number;
  buildingName: string;
  disagree: boolean;
}

/** Metres per Property-tab unit, worked out from placed buildings whose
 * floors are calibrated (#6). Mirrors storage.py's
 * property_meters_per_unit — keep both in sync: a placement is its
 * building's traced footprint scaled to `width` (aspect locked), so the
 * floor's scale carries straight over; the largest placement wins, and
 * `disagree` flags buildings more than 10% apart (one is probably sized
 * wrong against the photo). */
export function propertyScale(
  floors: FloorMeta[],
  placements: PropertyPlacement[],
): PropertyScale | null {
  const floorNameById = new Map(floors.map((f) => [f.floor_id, f.name]));
  const candidates: { area: number; mpu: number; name: string }[] = [];
  for (const placement of livePlacements(floors, placements)) {
    const b = placement.source_bounds;
    if (!b || placement.width <= 0) continue;
    const sourceWidth = b.max_x - b.min_x;
    if (sourceWidth <= 0) continue;
    const floorMpu = buildingMetersPerUnit(floors, placement);
    if (floorMpu === null) continue;
    candidates.push({
      area: placement.width * placement.height,
      mpu: (floorMpu * sourceWidth) / placement.width,
      name:
        placement.label_override ??
        floorNameById.get(placement.floor_id) ??
        "a building",
    });
  }
  if (candidates.length === 0) return null;
  const best = candidates.reduce((a, c) => (c.area > a.area ? c : a));
  return {
    metersPerUnit: best.mpu,
    buildingName: best.name,
    disagree: candidates.some((c) => Math.abs(c.mpu / best.mpu - 1) > 0.1),
  };
}
