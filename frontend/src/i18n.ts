import en from "./translations/en.json";
import de from "./translations/de.json";

/** de.json is machine-drafted — flagged here and in the release notes as
 * needing a native-speaker review pass before being treated as
 * production-quality German, not just "the infrastructure works." */
const TRANSLATIONS: Record<string, unknown> = { en, de };

/** Module-level singleton, not a constructor/call-site argument — panel.ts
 * is the only component that actually holds `hass` (see its set hass()),
 * but most of the ~130 strings needing localization live in child
 * components (canvas-overlay.ts, entity-picker-sidebar.ts, ...) that don't
 * receive `hass` as a prop today. Prop-drilling it (or just the resolved
 * language) through every one of those components' existing prop lists
 * would be a lot of churn for no real benefit in a single-instance panel
 * like this — so `setLanguage` is called once from panel.ts's `hass`
 * setter, and `localize()` is then callable from anywhere with a plain
 * import, no argument needed. */
let currentLanguage = "en";

export function setLanguage(hass: {
  locale?: { language?: string };
  language?: string;
}): void {
  const lang = hass.locale?.language ?? hass.language ?? "en";
  currentLanguage = TRANSLATIONS[lang] ? lang : "en";
}

function lookup(dict: unknown, key: string): string | undefined {
  let node: unknown = dict;
  for (const part of key.split(".")) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

/** Falls back current language -> English -> the raw key itself, so a
 * missing/mistyped key never surfaces as a blank string. `params` values
 * are interpolated into `{name}`-style placeholders in the resolved
 * string. */
export function localize(
  key: string,
  params?: Record<string, string | number>,
): string {
  let raw =
    lookup(TRANSLATIONS[currentLanguage], key) ??
    lookup(TRANSLATIONS["en"], key) ??
    key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      // split/join, not String.prototype.replaceAll — this project's
      // tsconfig targets ES2020, one version short of replaceAll.
      raw = raw.split(`{${k}}`).join(String(v));
    }
  }
  return raw;
}
