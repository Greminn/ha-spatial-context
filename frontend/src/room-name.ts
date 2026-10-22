import type { AreaMeta, Room } from "./types";

/** A room saved with an empty name follows the Home Assistant area it is
 * linked to (#52): rename the area and the room follows. A typed name
 * overrides that. Mirrors custom_components/spatial_context/room_names.py,
 * which resolves the same name for the export. */
export function roomName(room: Room, areas: AreaMeta[]): string {
  const typed = room.name.trim();
  if (typed) return typed;
  return areas.find((a) => a.area_id === room.area_id)?.name ?? "Room";
}

/** Rooms with their shown name filled in, for drawing on the plan. Returns
 * the same array when no room needs it, so a render doesn't redraw the plan. */
export function withShownNames(rooms: Room[], areas: AreaMeta[]): Room[] {
  if (!rooms.some((r) => !r.name.trim())) return rooms;
  return rooms.map((r) =>
    r.name.trim() ? r : { ...r, name: roomName(r, areas) },
  );
}

/** A room saved before #52 whose name is just its area's name starts
 * following the area. Done in memory on load; it is written on the next save,
 * so opening a floor never marks it changed. */
export function adoptAreaNames(rooms: Room[], areas: AreaMeta[]): Room[] {
  let changed = false;
  const next = rooms.map((r) => {
    const area = areas.find((a) => a.area_id === r.area_id);
    if (!area || r.name !== area.name) return r;
    changed = true;
    return { ...r, name: "" };
  });
  return changed ? next : rooms;
}
