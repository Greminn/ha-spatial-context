import type { VersionInfo } from "./types";

/**
 * Reload the page so the browser really fetches the current panel bundle.
 *
 * A plain reload can keep serving a cached copy of the bundle, and the
 * keyboard shortcuts for a cache-bypassing reload differ between browsers.
 * They don't exist at all in the Home Assistant app. So before reloading,
 * this refetches every URL the bundle may be cached under with
 * `cache: "reload"`, which overwrites the browser's HTTP cache entry for it.
 */

/** Served path of the panel bundle (see frontend.py, PANEL_URL). */
export const PANEL_BUNDLE_PATH = "/spatial_context_panel.js";

/** The bundle's URLs: each <script> HA loaded it from (with its ?v= token)
 *  plus the bare path. */
export function panelBundleUrls(
  doc: Pick<Document, "querySelectorAll">,
): string[] {
  const urls = new Set<string>([PANEL_BUNDLE_PATH]);
  doc.querySelectorAll<HTMLScriptElement>("script[src]").forEach((script) => {
    if (script.src.includes(PANEL_BUNDLE_PATH)) urls.add(script.src);
  });
  return [...urls];
}

/** Refetch `urls`, bypassing the cache, then reload. A failed fetch doesn't
 *  block the reload. */
export async function reloadFresh(
  urls: string[],
  fetchFn: (url: string, init: RequestInit) => Promise<unknown> = (u, i) =>
    fetch(u, i),
  reload: () => void = () => window.location.reload(),
): Promise<void> {
  await Promise.allSettled(
    urls.map((url) =>
      fetchFn(url, { cache: "reload", credentials: "same-origin" }),
    ),
  );
  reload();
}

/** Whether the backend needs a Home Assistant restart. Newer backends say
 *  so directly (code fingerprints); older ones only report versions. */
export function restartRequired(info: VersionInfo): boolean {
  if (typeof info.restart_required === "boolean") return info.restart_required;
  return Boolean(
    info.loaded_version &&
    info.installed_version &&
    info.loaded_version !== info.installed_version,
  );
}
