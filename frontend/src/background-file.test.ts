import { describe, expect, it } from "vitest";
import {
  MAX_RASTER_EDGE,
  MIN_RASTER_EDGE,
  classifyBackgroundFile,
  normalizeRotation,
  pngName,
  rasterSize,
  svgIntrinsicSize,
  withSvgSize,
} from "./background-file";

describe("classifyBackgroundFile", () => {
  it("goes by MIME type", () => {
    expect(classifyBackgroundFile({ type: "image/png", name: "x" })).toBe(
      "raster",
    );
    expect(classifyBackgroundFile({ type: "image/jpeg", name: "x" })).toBe(
      "raster",
    );
    expect(classifyBackgroundFile({ type: "image/svg+xml", name: "x" })).toBe(
      "svg",
    );
    expect(classifyBackgroundFile({ type: "application/pdf", name: "x" })).toBe(
      "pdf",
    );
    expect(
      classifyBackgroundFile({ type: "image/heic", name: "x.heic" }),
    ).toBeNull();
  });

  it("falls back to the extension when the type is empty", () => {
    expect(classifyBackgroundFile({ type: "", name: "Plan.PDF" })).toBe("pdf");
    expect(classifyBackgroundFile({ type: "", name: "plan.svg" })).toBe("svg");
    expect(
      classifyBackgroundFile({
        type: "application/octet-stream",
        name: "a.jpeg",
      }),
    ).toBe("raster");
    expect(classifyBackgroundFile({ type: "", name: "plan.dxf" })).toBeNull();
  });

  it("does not trust the extension over a real type", () => {
    expect(
      classifyBackgroundFile({ type: "text/plain", name: "plan.pdf" }),
    ).toBeNull();
  });
});

describe("rasterSize", () => {
  it("scales a small drawing up to the minimum, keeping the aspect", () => {
    expect(rasterSize(612, 792)).toEqual({
      width: Math.round(612 * (MIN_RASTER_EDGE / 792)),
      height: MIN_RASTER_EDGE,
    });
  });
  it("scales a huge drawing down to the maximum", () => {
    expect(rasterSize(20000, 10000)).toEqual({
      width: MAX_RASTER_EDGE,
      height: MAX_RASTER_EDGE / 2,
    });
  });
  it("keeps an in-between size", () => {
    expect(rasterSize(3000, 1500)).toEqual({ width: 3000, height: 1500 });
  });
  it("survives a zero size", () => {
    expect(rasterSize(0, 0).width).toBeGreaterThan(0);
  });
});

describe("svgIntrinsicSize", () => {
  it("reads width and height, with units", () => {
    expect(svgIntrinsicSize('<svg width="200" height="100"></svg>')).toEqual({
      width: 200,
      height: 100,
    });
    const mm = svgIntrinsicSize("<svg width='254mm' height='127mm'>");
    expect(mm!.width).toBeCloseTo(960);
    expect(mm!.height).toBeCloseTo(480);
  });

  it("uses the viewBox when a size is missing", () => {
    expect(svgIntrinsicSize('<svg viewBox="0 0 400 300">')).toEqual({
      width: 400,
      height: 300,
    });
    expect(svgIntrinsicSize('<svg width="800" viewBox="0,0,400,300">')).toEqual(
      {
        width: 800,
        height: 600,
      },
    );
  });

  it("ignores a percentage size and skips an XML prolog", () => {
    const text =
      '<?xml version="1.0"?>\n<!-- <svg width="1"> -->\n<svg width="100%" height="100%" viewBox="0 0 50 20">';
    expect(svgIntrinsicSize(text)).toEqual({ width: 50, height: 20 });
  });

  it("is null with nothing to go on", () => {
    expect(svgIntrinsicSize("<svg>")).toBeNull();
    expect(svgIntrinsicSize("not svg")).toBeNull();
  });
});

describe("withSvgSize", () => {
  it("replaces the root size and keeps the rest", () => {
    const out = withSvgSize(
      '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5"><rect width="3" height="2"/></svg>',
      2000,
      1000,
    );
    expect(out).toContain('<svg width="2000" height="1000" xmlns=');
    expect(out).toContain('viewBox="0 0 10 5"');
    expect(out).toContain('<rect width="3" height="2"/>');
    expect(svgIntrinsicSize(out)).toEqual({ width: 2000, height: 1000 });
  });

  it("adds a viewBox from the old size so it scales instead of cropping", () => {
    const out = withSvgSize('<svg width="10" height="5"></svg>', 100, 50);
    expect(out).toContain('viewBox="0 0 10 5"');
    expect(out).toContain('width="100"');
  });

  it("leaves non-SVG text alone", () => {
    expect(withSvgSize("hello", 1, 1)).toBe("hello");
  });
});

describe("pngName / normalizeRotation", () => {
  it("swaps the extension", () => {
    expect(pngName("Ground floor.pdf")).toBe("Ground floor.png");
    expect(pngName("plan")).toBe("plan.png");
    expect(pngName(".pdf")).toBe("background.png");
  });

  it("folds angles into (-180, 180]", () => {
    expect(normalizeRotation(90)).toBe(90);
    expect(normalizeRotation(270)).toBe(-90);
    expect(normalizeRotation(-270)).toBe(90);
    expect(normalizeRotation(180)).toBe(180);
    expect(normalizeRotation(-180)).toBe(180);
    expect(normalizeRotation(360)).toBe(0);
    expect(normalizeRotation(12.345)).toBe(12.3);
    expect(normalizeRotation(Number.NaN)).toBe(0);
  });
});
