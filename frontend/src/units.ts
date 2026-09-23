/** Metric/Imperial display conversion. Storage everywhere else in this app
 * stays real metric SI (metres for scale/height, centimetres for wall
 * thickness) regardless of this setting — only what a prompt/input shows
 * and accepts changes. "Large" quantities (scale, device height) map
 * metres <-> feet; "small" quantities (wall thickness, opening width)
 * map centimetres <-> inches — the same big/small split the app already
 * used before Imperial existed (m for the former, cm for the latter). */
export type UnitSystem = "metric" | "imperial";

const M_PER_FT = 0.3048;
const CM_PER_IN = 2.54;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function largeUnitLabel(system: UnitSystem): string {
  return system === "imperial" ? "ft" : "m";
}

export function smallUnitLabel(system: UnitSystem): string {
  return system === "imperial" ? "in" : "cm";
}

export function formatLarge(valueMeters: number, system: UnitSystem): string {
  const value = system === "imperial" ? valueMeters / M_PER_FT : valueMeters;
  return String(round2(value));
}

export function parseLarge(input: string, system: UnitSystem): number | null {
  const value = Number(input);
  if (!Number.isFinite(value)) return null;
  return system === "imperial" ? value * M_PER_FT : value;
}

/** A "small" quantity (wall thickness, opening width) can be shown as
 * either of its system's two sub-units — cm or m for metric, in or ft for
 * imperial — independently of the app-wide default, e.g. so a wall
 * thickness input can offer a cm/m picker next to it. The default
 * (smallUnitLabel/formatSmall/parseSmall below) is just the smaller of
 * the pair, used wherever there's no per-field picker. */
export type SmallSubUnit = "cm" | "m" | "in" | "ft";

const CM_PER_SUB_UNIT: Record<SmallSubUnit, number> = {
  cm: 1,
  m: 100,
  in: CM_PER_IN,
  ft: CM_PER_IN * 12,
};

export function smallSubUnitsFor(system: UnitSystem): SmallSubUnit[] {
  return system === "imperial" ? ["in", "ft"] : ["cm", "m"];
}

export function defaultSmallSubUnit(system: UnitSystem): SmallSubUnit {
  return system === "imperial" ? "in" : "cm";
}

export function formatSmallAs(valueCm: number, unit: SmallSubUnit): string {
  return String(round2(valueCm / CM_PER_SUB_UNIT[unit]));
}

export function parseSmallAs(input: string, unit: SmallSubUnit): number | null {
  const value = Number(input);
  if (!Number.isFinite(value)) return null;
  return value * CM_PER_SUB_UNIT[unit];
}

export function formatSmall(valueCm: number, system: UnitSystem): string {
  return formatSmallAs(valueCm, defaultSmallSubUnit(system));
}

export function parseSmall(input: string, system: UnitSystem): number | null {
  return parseSmallAs(input, defaultSmallSubUnit(system));
}

/** How many canvas/stored units correspond to one *display* unit (metre or
 * foot) — `unitsPerMeter` scaled down by the metre-to-foot factor when
 * Imperial, so a readout like "1 ft ≈ N units" stays correct. */
export function unitsPerDisplayUnit(
  unitsPerMeter: number,
  system: UnitSystem,
): number {
  return system === "imperial" ? unitsPerMeter * M_PER_FT : unitsPerMeter;
}

/** Opening.width lives in canvas/stored units, not real-world units — it
 * needs the floor's own scale ratio (unitsPerMeter == unitDistance /
 * scale.meters, the same ratio panel.ts's _unitsPerMeter/_scaleReadout and
 * floorplan-canvas.ts's _wallStrokeWidth already compute) composed on top
 * of the metric/imperial conversion above. */
export function canvasUnitsToDisplay(
  widthUnits: number,
  unitsPerMeter: number,
  system: UnitSystem,
): string {
  const cm = (widthUnits / unitsPerMeter) * 100;
  return formatSmall(cm, system);
}

export function displayToCanvasUnits(
  input: string,
  unitsPerMeter: number,
  system: UnitSystem,
): number | null {
  const cm = parseSmall(input, system);
  if (cm === null) return null;
  return (cm / 100) * unitsPerMeter;
}

export function canvasUnitsToDisplayAs(
  widthUnits: number,
  unitsPerMeter: number,
  unit: SmallSubUnit,
): string {
  const cm = (widthUnits / unitsPerMeter) * 100;
  return formatSmallAs(cm, unit);
}

export function displayToCanvasUnitsAs(
  input: string,
  unitsPerMeter: number,
  unit: SmallSubUnit,
): number | null {
  const cm = parseSmallAs(input, unit);
  if (cm === null) return null;
  return (cm / 100) * unitsPerMeter;
}
