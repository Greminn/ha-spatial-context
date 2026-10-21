import { describe, expect, it } from "vitest";
import {
  canvasUnitsToDisplay,
  displayToCanvasUnits,
  formatLarge,
  formatSmall,
  formatSmallAs,
  parseLarge,
  parseSmall,
  parseSmallAs,
  unitsPerDisplayUnit,
} from "./units";

describe("large units (scale, device height)", () => {
  it("shows metres as they are and feet converted, to two decimals", () => {
    expect(formatLarge(2.4, "metric")).toBe("2.4");
    expect(formatLarge(3.048, "imperial")).toBe("10");
    expect(formatLarge(1, "imperial")).toBe("3.28");
  });

  it("reads input back into metres", () => {
    expect(parseLarge("2.4", "metric")).toBe(2.4);
    expect(parseLarge("10", "imperial")).toBeCloseTo(3.048);
  });

  it("refuses input that is not a number", () => {
    expect(parseLarge("abc", "metric")).toBeNull();
    expect(parseLarge("Infinity", "imperial")).toBeNull();
  });
});

describe("small units (wall thickness, opening width)", () => {
  it("defaults to centimetres or inches", () => {
    expect(formatSmall(20, "metric")).toBe("20");
    expect(formatSmall(25.4, "imperial")).toBe("10");
    expect(parseSmall("20", "metric")).toBe(20);
    expect(parseSmall("10", "imperial")).toBeCloseTo(25.4);
  });

  it("can be shown in the larger sub-unit instead", () => {
    expect(formatSmallAs(90, "m")).toBe("0.9");
    expect(parseSmallAs("0.9", "m")).toBeCloseTo(90);
    expect(parseSmallAs("3", "ft")).toBeCloseTo(91.44);
  });
});

describe("canvas units", () => {
  // 1000 canvas units are 20 m, so 50 units per metre.
  it("converts an opening width both ways through the floor's scale", () => {
    expect(canvasUnitsToDisplay(45, 50, "metric")).toBe("90");
    expect(displayToCanvasUnits("90", 50, "metric")).toBeCloseTo(45);
    expect(displayToCanvasUnits("x", 50, "metric")).toBeNull();
  });

  it("counts units per foot, not per metre, for imperial readouts", () => {
    expect(unitsPerDisplayUnit(50, "metric")).toBe(50);
    expect(unitsPerDisplayUnit(50, "imperial")).toBeCloseTo(15.24);
  });
});
