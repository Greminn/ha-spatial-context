import { describe, expect, it } from "vitest";
import { adoptAreaNames, roomName, withShownNames } from "./room-name";
import type { AreaMeta, Room } from "./types";

const area = (area_id: string, name: string) =>
  ({ area_id, name, floor_id: null, icon: null }) as AreaMeta;
const room = (name: string, area_id: string | null) =>
  ({ id: "r", name, area_id, points: [] }) as unknown as Room;

const areas = [area("lounge", "Lounge")];

describe("roomName", () => {
  it("shows a typed name", () => {
    expect(roomName(room("Den", "lounge"), areas)).toBe("Den");
  });

  it("follows the area when the name is empty", () => {
    expect(roomName(room("", "lounge"), areas)).toBe("Lounge");
    expect(roomName(room("  ", "lounge"), areas)).toBe("Lounge");
  });

  it("follows an area rename", () => {
    expect(roomName(room("", "lounge"), [area("lounge", "Living Room")])).toBe(
      "Living Room",
    );
  });

  it("falls back to a plain label with no area", () => {
    expect(roomName(room("", null), areas)).toBe("Room");
    expect(roomName(room("", "gone"), areas)).toBe("Room");
  });
});

describe("withShownNames", () => {
  it("keeps the same array when every room is named", () => {
    const rooms = [room("Den", "lounge")];
    expect(withShownNames(rooms, areas)).toBe(rooms);
  });

  it("fills in the shown name of a following room", () => {
    const [shown] = withShownNames([room("", "lounge")], areas);
    expect(shown?.name).toBe("Lounge");
  });
});

describe("adoptAreaNames", () => {
  it("makes a room named like its area follow it", () => {
    const [adopted] = adoptAreaNames([room("Lounge", "lounge")], areas);
    expect(adopted?.name).toBe("");
  });

  it("leaves a typed name alone", () => {
    const rooms = [room("Den", "lounge"), room("Lounge", null)];
    expect(adoptAreaNames(rooms, areas)).toBe(rooms);
  });
});
