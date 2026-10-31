import { reassignPinRooms } from "./canvas/geometry";
import { emptyFloorLayout } from "./ha-client";
import type { FloorLayout, Pin } from "./types";

/** What "Reset floor" can clear, one per checkbox (#45). */
export type ResetPart = "rooms" | "walls" | "openings" | "pins" | "background";

export const RESET_PARTS: ResetPart[] = [
  "rooms",
  "walls",
  "openings",
  "pins",
  "background",
];

/** The floor with only the chosen parts cleared. Choosing everything is the
 * old full reset (it also drops the scale, saved view and building link);
 * anything less keeps those, so a partial reset never un-calibrates a floor.
 * Walls take their doors and windows with them, and removing rooms leaves
 * the placed devices in place but unassigned. */
export function resetFloorParts(
  layout: FloorLayout,
  parts: ReadonlySet<ResetPart>,
): FloorLayout {
  if (RESET_PARTS.every((p) => parts.has(p))) return emptyFloorLayout();
  const rooms = parts.has("rooms") ? [] : layout.rooms;
  return {
    ...layout,
    rooms,
    walls: parts.has("walls") ? [] : layout.walls,
    openings:
      parts.has("walls") || parts.has("openings") ? [] : layout.openings,
    pins: parts.has("pins")
      ? []
      : parts.has("rooms")
        ? reassignPinRooms(rooms, layout.pins)
        : layout.pins,
    background_image_id: parts.has("background")
      ? null
      : layout.background_image_id,
  };
}

/** The pins that "Clear placed devices" removes from a floor: all of them,
 * or only those inside rooms linked to `areaId` (#44). */
export function pinsToClear(layout: FloorLayout, areaId: string | null): Pin[] {
  if (!areaId) return layout.pins;
  const roomIds = new Set(
    layout.rooms.filter((r) => r.area_id === areaId).map((r) => r.id),
  );
  return layout.pins.filter(
    (p) => p.room_id !== null && roomIds.has(p.room_id),
  );
}

export function withoutPins(
  layout: FloorLayout,
  removed: readonly Pin[],
): FloorLayout {
  const gone = new Set(removed.map((p) => p.id));
  return { ...layout, pins: layout.pins.filter((p) => !gone.has(p.id)) };
}
