import { describe, expect, it } from "vitest";
import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE_PREFS,
  THEME_VAR_NAMES,
  isDarkAppearance,
  nextAppearance,
  parseAppearancePrefs,
  planSheetStyle,
  readAppearancePrefs,
  serializeAppearancePrefs,
  themeVars,
  writeAppearancePrefs,
} from "./appearance";

describe("parseAppearancePrefs", () => {
  it("defaults to following HA with an automatic sheet", () => {
    expect(parseAppearancePrefs(null)).toEqual({
      appearance: "system",
      planSheet: "auto",
    });
    expect(parseAppearancePrefs("")).toEqual(DEFAULT_APPEARANCE_PREFS);
  });

  it("round-trips through serialize", () => {
    const prefs = { appearance: "dark", planSheet: "white" } as const;
    expect(parseAppearancePrefs(serializeAppearancePrefs(prefs))).toEqual(
      prefs,
    );
  });

  it("accepts a bare appearance string", () => {
    expect(parseAppearancePrefs("light")).toEqual({
      appearance: "light",
      planSheet: "auto",
    });
  });

  it("falls back field by field on unknown values", () => {
    expect(
      parseAppearancePrefs('{"appearance":"sepia","planSheet":"none"}'),
    ).toEqual({ appearance: "system", planSheet: "none" });
    expect(parseAppearancePrefs('{"appearance":"dark"}')).toEqual({
      appearance: "dark",
      planSheet: "auto",
    });
  });

  it("ignores garbage", () => {
    expect(parseAppearancePrefs("{not json")).toEqual(DEFAULT_APPEARANCE_PREFS);
    expect(parseAppearancePrefs("42")).toEqual(DEFAULT_APPEARANCE_PREFS);
    expect(parseAppearancePrefs("null")).toEqual(DEFAULT_APPEARANCE_PREFS);
  });
});

describe("read/write", () => {
  it("uses its own storage key", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    writeAppearancePrefs({ appearance: "light", planSheet: "none" }, storage);
    expect(store.has(APPEARANCE_STORAGE_KEY)).toBe(true);
    expect(readAppearancePrefs(storage)).toEqual({
      appearance: "light",
      planSheet: "none",
    });
  });

  it("survives storage that throws", () => {
    const throwing = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readAppearancePrefs(throwing)).toEqual(DEFAULT_APPEARANCE_PREFS);
    expect(() =>
      writeAppearancePrefs(DEFAULT_APPEARANCE_PREFS, throwing),
    ).not.toThrow();
    expect(readAppearancePrefs(undefined)).toEqual(DEFAULT_APPEARANCE_PREFS);
  });
});

describe("nextAppearance", () => {
  it("cycles system, light, dark", () => {
    expect(nextAppearance("system")).toBe("light");
    expect(nextAppearance("light")).toBe("dark");
    expect(nextAppearance("dark")).toBe("system");
  });
});

describe("isDarkAppearance", () => {
  it("follows HA only in system mode", () => {
    expect(isDarkAppearance("system", true)).toBe(true);
    expect(isDarkAppearance("system", false)).toBe(false);
    expect(isDarkAppearance("light", true)).toBe(false);
    expect(isDarkAppearance("dark", false)).toBe(true);
  });
});

describe("themeVars", () => {
  it("sets nothing in system mode", () => {
    expect(themeVars("system")).toEqual({});
  });

  it("covers the same properties in light and dark", () => {
    const light = Object.keys(themeVars("light")).sort();
    const dark = Object.keys(themeVars("dark")).sort();
    expect(light).toEqual(dark);
    expect([...THEME_VAR_NAMES].sort()).toEqual(light);
  });

  it("includes the properties the panel's tokens read", () => {
    for (const name of [
      "--card-background-color",
      "--primary-background-color",
      "--primary-text-color",
      "--secondary-text-color",
      "--divider-color",
      "--app-header-background-color",
      "--ha-card-background",
    ]) {
      expect(themeVars("light")[name]).toBeTruthy();
      expect(themeVars("dark")[name]).toBeTruthy();
    }
  });

  it("uses a light card on light and a dark card on dark", () => {
    expect(themeVars("light")["--card-background-color"]).toBe("#ffffff");
    expect(themeVars("dark")["--card-background-color"]).toBe("#1c1c1c");
  });

  it("returns a copy", () => {
    themeVars("light")["--card-background-color"] = "red";
    expect(themeVars("light")["--card-background-color"]).toBe("#ffffff");
  });
});

describe("planSheetStyle", () => {
  it("auto: white sheet by day, inverted by night", () => {
    expect(planSheetStyle("auto", false)).toEqual({
      sheet: true,
      invert: false,
    });
    expect(planSheetStyle("auto", true)).toEqual({ sheet: true, invert: true });
  });

  it("white: a paper sheet, never inverted", () => {
    expect(planSheetStyle("white", true)).toEqual({
      sheet: true,
      invert: false,
    });
    expect(planSheetStyle("white", false)).toEqual({
      sheet: true,
      invert: false,
    });
  });

  it("none: no sheet; dark lines turned light on a dark canvas", () => {
    expect(planSheetStyle("none", false)).toEqual({
      sheet: false,
      invert: false,
    });
    expect(planSheetStyle("none", true)).toEqual({
      sheet: false,
      invert: true,
    });
  });
});
