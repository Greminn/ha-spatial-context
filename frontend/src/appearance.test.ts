import { describe, expect, it } from "vitest";
import {
  PLAN_SHEET_STORAGE_KEY,
  parsePlanSheet,
  planSheetStyle,
  readPlanSheet,
  writePlanSheet,
} from "./appearance";

describe("parsePlanSheet", () => {
  it("defaults to auto and ignores unknown values", () => {
    expect(parsePlanSheet(null)).toBe("auto");
    expect(parsePlanSheet("")).toBe("auto");
    expect(parsePlanSheet("sepia")).toBe("auto");
    expect(parsePlanSheet("white")).toBe("white");
    expect(parsePlanSheet("none")).toBe("none");
  });
});

describe("read/write", () => {
  it("uses its own storage key", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    };
    writePlanSheet("none", storage);
    expect(store.get(PLAN_SHEET_STORAGE_KEY)).toBe("none");
    expect(readPlanSheet(storage)).toBe("none");
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
    expect(readPlanSheet(throwing)).toBe("auto");
    expect(() => writePlanSheet("white", throwing)).not.toThrow();
    expect(readPlanSheet(undefined)).toBe("auto");
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

  it("white: a sheet that is never inverted", () => {
    expect(planSheetStyle("white", true)).toEqual({
      sheet: true,
      invert: false,
    });
  });

  it("none: no sheet, still inverted on dark", () => {
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
