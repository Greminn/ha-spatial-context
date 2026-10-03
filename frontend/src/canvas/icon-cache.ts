/** Resolves a pin's icon override (`mdi:motion-sensor`, or any other icon
 * set HA knows — including this integration's own `spatial-context:` set)
 * into raw SVG path `d` data, for the same SVG-in-SVG pin rendering
 * pin-icons.ts's bundled icons use (see floorplan-canvas.ts's doc comment
 * on why — Safari can't put <foreignObject>/<ha-icon> inside an SVG
 * correctly).
 *
 * Resolved through Home Assistant's own icon loading: a hidden <ha-icon>
 * is given the name, and the path it resolves (HA's local icon database —
 * no network, works offline) is read back from its inner <ha-svg-icon>.
 * This used to fetch from Iconify's public API instead, a third-party
 * request per icon at odds with HA keeping map tiles and the like local.
 * Unresolvable (unknown name, HA's element missing) → null, and the caller
 * keeps the pin's default icon rather than drawing a blank one.
 */

const _cache = new Map<string, Promise<string | null>>();

const RESOLVE_TIMEOUT_MS = 4000;
const POLL_MS = 50;

/** Path data for an icon name (a bare name is taken as `mdi:`), or null.
 * Never throws; each name is resolved once and cached, a failure included,
 * so a bad override never retries on every render. */
export function fetchIconPathByName(name: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return Promise.resolve(null);
  const full = trimmed.includes(":") ? trimmed : `mdi:${trimmed}`;
  let pending = _cache.get(full);
  if (!pending) {
    pending = _resolveViaHaIcon(full);
    _cache.set(full, pending);
  }
  return pending;
}

async function _resolveViaHaIcon(icon: string): Promise<string | null> {
  if (!customElements.get("ha-icon")) return null;
  // Must be in the document for <ha-icon> to load anything; kept off-screen.
  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;left:-10000px;top:0;width:24px;height:24px;overflow:hidden;";
  const el = document.createElement("ha-icon");
  el.setAttribute("icon", icon);
  host.appendChild(el);
  document.body.appendChild(host);
  try {
    const deadline = Date.now() + RESOLVE_TIMEOUT_MS;
    while (Date.now() < deadline) {
      const svgIcon = el.shadowRoot?.querySelector("ha-svg-icon") as
        (Element & { path?: unknown }) | null;
      if (typeof svgIcon?.path === "string" && svgIcon.path) {
        return svgIcon.path;
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    }
    return null;
  } finally {
    host.remove();
  }
}
