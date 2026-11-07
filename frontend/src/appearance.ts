/** The panel's own appearance, independent of Home Assistant's theme.
 *
 * Per browser (like snap mode): a viewer on a dark HA can still look at the
 * floor plans on a light panel, or the other way round. "system" follows
 * HA's current theme (`hass.themes.darkMode`) and overrides nothing.
 *
 * The plan sheet is what sits behind a floor's background image: "auto"
 * follows the appearance (a white sheet by day, the same sheet inverted by
 * night), "white" keeps a white paper sheet under an un-inverted plan even
 * on a dark panel, and "none" lets a transparent plan show the canvas. */

export type Appearance = "system" | "light" | "dark";
export type PlanSheet = "auto" | "white" | "none";

export interface AppearancePrefs {
  appearance: Appearance;
  planSheet: PlanSheet;
}

export const APPEARANCE_STORAGE_KEY = "spatial-context-appearance";

export const DEFAULT_APPEARANCE_PREFS: AppearancePrefs = {
  appearance: "system",
  planSheet: "auto",
};

export const APPEARANCES: readonly Appearance[] = ["system", "light", "dark"];
export const PLAN_SHEETS: readonly PlanSheet[] = ["auto", "white", "none"];

export const APPEARANCE_ICONS: Record<Appearance, string> = {
  system: "mdi:theme-light-dark",
  light: "mdi:white-balance-sunny",
  dark: "mdi:weather-night",
};

export const PLAN_SHEET_ICONS: Record<PlanSheet, string> = {
  auto: "mdi:brightness-auto",
  white: "mdi:file-outline",
  none: "mdi:checkerboard",
};

function isAppearance(value: unknown): value is Appearance {
  return value === "system" || value === "light" || value === "dark";
}

function isPlanSheet(value: unknown): value is PlanSheet {
  return value === "auto" || value === "white" || value === "none";
}

/** Reads the stored JSON; anything missing or unknown falls back to the
 * default, field by field. A bare appearance string is accepted too. */
export function parseAppearancePrefs(raw: string | null): AppearancePrefs {
  const prefs = { ...DEFAULT_APPEARANCE_PREFS };
  if (!raw) return prefs;
  if (isAppearance(raw)) return { ...prefs, appearance: raw };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const { appearance, planSheet } = parsed as Record<string, unknown>;
      if (isAppearance(appearance)) prefs.appearance = appearance;
      if (isPlanSheet(planSheet)) prefs.planSheet = planSheet;
    }
  } catch {
    // Not JSON: keep the defaults.
  }
  return prefs;
}

export function serializeAppearancePrefs(prefs: AppearancePrefs): string {
  return JSON.stringify({
    appearance: prefs.appearance,
    planSheet: prefs.planSheet,
  });
}

/** Browser storage can throw (private mode, blocked site data) or come
 * back empty; either way the panel just follows HA. */
export function readAppearancePrefs(
  storage: Pick<Storage, "getItem"> | undefined = globalThis.localStorage,
): AppearancePrefs {
  try {
    return parseAppearancePrefs(
      storage?.getItem(APPEARANCE_STORAGE_KEY) ?? null,
    );
  } catch {
    return { ...DEFAULT_APPEARANCE_PREFS };
  }
}

export function writeAppearancePrefs(
  prefs: AppearancePrefs,
  storage: Pick<Storage, "setItem"> | undefined = globalThis.localStorage,
): void {
  try {
    storage?.setItem(APPEARANCE_STORAGE_KEY, serializeAppearancePrefs(prefs));
  } catch {
    // Not persisted; the choice still applies until the page reloads.
  }
}

/** The header button's cycle: system → light → dark → system. */
export function nextAppearance(appearance: Appearance): Appearance {
  const i = APPEARANCES.indexOf(appearance);
  return APPEARANCES[(i + 1) % APPEARANCES.length] ?? "system";
}

/** Whether the panel draws dark, given HA's own theme. */
export function isDarkAppearance(
  appearance: Appearance,
  haDarkMode: boolean,
): boolean {
  return appearance === "system" ? haDarkMode : appearance === "dark";
}

/** HA's default light and dark theme values for exactly the theme
 * properties this panel reads (directly or through its --sc-* tokens).
 * Accent, error and warning colours are the same in both and stay
 * inherited from HA. */
const LIGHT_VARS: Record<string, string> = {
  "--primary-background-color": "#fafafa",
  "--secondary-background-color": "#e5e5e5",
  "--card-background-color": "#ffffff",
  "--ha-card-background": "#ffffff",
  "--ha-card-border-color": "#e0e0e0",
  "--app-header-background-color": "#ffffff",
  "--app-header-text-color": "#212121",
  "--primary-text-color": "#212121",
  "--secondary-text-color": "#727272",
  "--disabled-text-color": "#bdbdbd",
  "--text-primary-color": "#ffffff",
  "--divider-color": "rgba(0, 0, 0, 0.12)",
  "--ha-color-form-background": "#f3f3f3",
  "--ha-color-form-background-hover": "#e8e8e8",
};

const DARK_VARS: Record<string, string> = {
  "--primary-background-color": "#111111",
  "--secondary-background-color": "#282828",
  "--card-background-color": "#1c1c1c",
  "--ha-card-background": "#1c1c1c",
  "--ha-card-border-color": "rgba(225, 225, 225, 0.12)",
  "--app-header-background-color": "#1c1c1c",
  "--app-header-text-color": "#e1e1e1",
  "--primary-text-color": "#e1e1e1",
  "--secondary-text-color": "#9b9b9b",
  "--disabled-text-color": "#6f6f6f",
  "--text-primary-color": "#ffffff",
  "--divider-color": "rgba(225, 225, 225, 0.12)",
  "--ha-color-form-background": "#2a2a2a",
  "--ha-color-form-background-hover": "#333333",
};

/** Every property `themeVars` may set, so a switch back to "system" can
 * clear them all. */
export const THEME_VAR_NAMES: readonly string[] = Object.keys(LIGHT_VARS);

/** The custom properties to set on the panel host: none for "system"
 * (inherit HA's theme), otherwise HA's default light or dark palette. */
export function themeVars(appearance: Appearance): Record<string, string> {
  if (appearance === "light") return { ...LIGHT_VARS };
  if (appearance === "dark") return { ...DARK_VARS };
  return {};
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
