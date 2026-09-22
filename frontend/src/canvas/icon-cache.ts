/** Resolves an arbitrary `mdi:icon-name` (as set via a pin's icon override —
 * see canvas-overlay.ts's "Set icon" prompt) into raw SVG path `d` data, for
 * the same SVG-in-SVG pin rendering pin-icons.ts's bundled domain icons use
 * (see floorplan-canvas.ts's doc comment on why — Safari can't put
 * <foreignObject>/<ha-icon> inside an SVG correctly).
 *
 * @mdi/js only bundles the handful of icons pin-icons.ts imports by name —
 * bundling the *entire* MDI set (several MB of path data) just so an
 * override can be any arbitrary icon isn't a reasonable tradeoff. Instead
 * this fetches the one requested icon's path data from Iconify's public,
 * unauthenticated icon API on demand and caches it — a network dependency,
 * but a fully optional one: on failure (offline, blocked, icon doesn't
 * exist) the caller just keeps using the pin's domain-default icon, never
 * a broken/blank one.
 */

const _cache = new Map<string, string | null>();

/** Strips a leading "mdi:" if present and looks up/fetches that icon's path
 * data, or null if it's unresolvable (never throws). Always resolves from
 * the in-memory cache after the first call for a given name — including a
 * cached `null` for a name that failed to resolve, so a bad override never
 * triggers a fresh network request on every re-render. */
export async function fetchIconPathByName(
  name: string,
): Promise<string | null> {
  const cleaned = name.replace(/^mdi:/, "").trim();
  if (!cleaned) return null;
  if (_cache.has(cleaned)) return _cache.get(cleaned)!;

  try {
    const res = await fetch(`https://api.iconify.design/mdi/${cleaned}.svg`);
    if (!res.ok) {
      _cache.set(cleaned, null);
      return null;
    }
    const svg = await res.text();
    const match = svg.match(/\sd="([^"]+)"/);
    const path = match ? match[1]! : null;
    _cache.set(cleaned, path);
    return path;
  } catch {
    _cache.set(cleaned, null);
    return null;
  }
}
