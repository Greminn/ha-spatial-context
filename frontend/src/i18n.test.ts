import { afterEach, describe, expect, it } from "vitest";
import { localize, setLanguage } from "./i18n";
import { roomName } from "./room-name";
import type { Room } from "./types";

afterEach(() => setLanguage({ language: "en" }));

describe("setLanguage", () => {
  it("switches to German from Home Assistant's locale", () => {
    setLanguage({ locale: { language: "de" } });
    expect(localize("canvas.room.new")).toBe("Neuer Raum");
  });

  it("falls back to English for a language with no translation", () => {
    setLanguage({ locale: { language: "xx" } });
    expect(localize("canvas.room.new")).toBe("New Room");
  });

  it("localizes the fallback room name", () => {
    const room = { id: "r", name: "", area_id: null, points: [] } as Room;
    setLanguage({ language: "de" });
    expect(roomName(room, [])).toBe("Raum");
  });
});
