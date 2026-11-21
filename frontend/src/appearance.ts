/** What sits behind a floor's background image (the "plan sheet").
 *
 * Per browser, like snap mode. "auto" is the long-standing behaviour: a
 * white sheet, inverted into light lines on dark when Home Assistant is in
 * a dark theme. "white" keeps a white paper sheet under an un-inverted plan
 * even on a dark panel. "none" leaves out the sheet, so a transparent plan
 * shows the canvas through it (still inverted on dark).
 *
 * Idea and first implementation by cb2206 (#74). */

export type PlanSheet = "auto" | "white" | "none";

export const PLAN_SHEET_STORAGE_KEY = "spatial-context-plan-sheet";

export const PLAN_SHEETS: readonly PlanSheet[] = ["auto", "white", "none"];

export const PLAN_SHEET_ICONS: Record<PlanSheet, string> = {
  auto: "mdi:brightness-auto",
  white: "mdi:file-outline",
  none: "mdi:checkerboard",
};

export function parsePlanSheet(raw: string | null): PlanSheet {
  return raw === "white" || raw === "none" ? raw : "auto";
}

/** Browser storage can throw (private mode, blocked site data) or come
 * back empty; either way the plan keeps its automatic look. */
export function readPlanSheet(
  storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage,
): PlanSheet {
  try {
    return parsePlanSheet(storage?.getItem(PLAN_SHEET_STORAGE_KEY) ?? null);
  } catch {
    return "auto";
  }
}

export function writePlanSheet(
  value: PlanSheet,
  storage: Pick<Storage, "setItem"> | undefined = globalThis.localStorage,
): void {
  try {
    storage?.setItem(PLAN_SHEET_STORAGE_KEY, value);
  } catch {
    // Not persisted; the choice still applies until the page reloads.
  }
}

/** How the background image is drawn: on a white sheet or none, and
 * inverted (light lines on dark) or not. */
export interface PlanSheetStyle {
  sheet: boolean;
  invert: boolean;
}

export function planSheetStyle(
  planSheet: PlanSheet,
  dark: boolean,
): PlanSheetStyle {
  switch (planSheet) {
    case "white":
      return { sheet: true, invert: false };
    case "none":
      // A transparent plan's dark lines would vanish on the dark canvas.
      return { sheet: false, invert: dark };
    default:
      return { sheet: true, invert: dark };
  }
}
