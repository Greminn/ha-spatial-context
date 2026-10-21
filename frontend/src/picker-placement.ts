import type { PlaceableEntity } from "./types";

/** Whether a device already has a pin somewhere: on the open plan, or on
 * another floor (or the Property tab). The backend reports where each
 * entity's device is placed (`placed_floor_id`); the open plan's own pins
 * come from the live layout instead, so removing a pin here shows at once
 * rather than waiting for that snapshot to refresh. */
export function isDevicePlaced(
  deviceId: string,
  entities: PlaceableEntity[],
  placedDeviceIds: ReadonlySet<string>,
  currentFloorId: string | null,
): boolean {
  if (placedDeviceIds.has(deviceId)) return true;
  return entities.some(
    (e) => e.placed_floor_id != null && e.placed_floor_id !== currentFloorId,
  );
}
