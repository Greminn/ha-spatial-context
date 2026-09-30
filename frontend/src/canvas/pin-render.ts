import { css, svg } from "lit";
import type { ReactiveControllerHost } from "lit";
import type { PlaceableEntity, Pin } from "../types";
import { pinIntegrationDomain } from "./device-display";
import { fetchIconPathByName } from "./icon-cache";
import { GENERIC_DEVICE_ICON_PATH } from "./pin-icons";

/** Device-pin drawing shared by floorplan-canvas.ts and property-canvas.ts
 * (outdoor devices), so a device looks the same wherever it's placed. */

export type PinIcon =
  | { kind: "path"; d: string }
  | { kind: "image"; href: string; integrationDomain: string };

export const pinStyles = css`
  .pin-hit {
    fill: transparent;
    cursor: pointer;
  }
  .pin-dot {
    /* One uniform color for every device — a per-domain tint would
     * mean deriving something from an arbitrarily-chosen entity's
     * domain again, which this app deliberately never does anymore
     * (see canvas/device-display.ts). */
    fill: var(--sc-accent);
    stroke: white;
    stroke-width: 2;
    pointer-events: none;
  }
  .pin-dot.selected {
    fill: var(--sc-danger);
  }
  .pin-icon {
    pointer-events: none;
  }
  .pin-brand-icon {
    pointer-events: none;
  }
  .pin-icon path {
    fill: white;
  }
`;

/** Which icon to draw for a placed device, per host canvas — holds that
 * canvas's resolved-override and failed-brand-logo caches and re-renders
 * it once an async icon fetch lands. */
export class PinIconResolver {
  /** icon_override -> resolved path data (or null if unresolvable), filled
   * in lazily. icon-cache.ts's own module-level cache already dedupes the
   * fetch itself; this is just a synchronous read of whatever's resolved
   * so far, with requestUpdate() called once a fetch lands. */
  private _resolvedOverrides = new Map<string, string | null>();
  /** integration_domain -> its brands.home-assistant.io logo failed to
   * load (404, no brand icon submitted) — once known-failed, stop
   * requesting a URL known not to exist and use the generic icon. */
  private _failedBrandIcons = new Set<string>();

  constructor(private readonly _host: ReactiveControllerHost) {}

  private _iconForOverride(override: string): string | null {
    if (this._resolvedOverrides.has(override)) {
      return this._resolvedOverrides.get(override) ?? null;
    }
    this._resolvedOverrides.set(override, null);
    void fetchIconPathByName(override).then((path) => {
      if (path !== null) {
        this._resolvedOverrides.set(override, path);
        this._host.requestUpdate();
      }
    });
    return null;
  }

  /** icon_override first (a human's own explicit choice), then that
   * device's integration's own brand logo (a real device-level fact — see
   * device-display.ts), then a generic fallback. Never derived from any
   * entity's domain. */
  iconForPin(pin: Pin, entities: Iterable<PlaceableEntity>): PinIcon {
    if (pin.icon_override) {
      const overridePath = this._iconForOverride(pin.icon_override);
      if (overridePath) return { kind: "path", d: overridePath };
    }
    const integrationDomain = pinIntegrationDomain(pin.device_id, entities);
    if (integrationDomain && !this._failedBrandIcons.has(integrationDomain)) {
      return {
        kind: "image",
        href: `https://brands.home-assistant.io/_/${integrationDomain}/icon.png`,
        integrationDomain,
      };
    }
    return { kind: "path", d: GENERIC_DEVICE_ICON_PATH };
  }

  onBrandIconError(integrationDomain: string): void {
    if (this._failedBrandIcons.has(integrationDomain)) return;
    this._failedBrandIcons.add(integrationDomain);
    this._host.requestUpdate();
  }

  renderMarker(
    x: number,
    y: number,
    r: number,
    icon: PinIcon,
    color: string,
    selected: boolean,
    label: string,
  ) {
    const iconSize = r * 1.1; // native mdi viewBox is 24x24, scaled to fit the dot
    return svg`
      <g>
        <title>${label}</title>
        <circle
          class="pin-dot ${selected ? "selected" : ""}"
          cx=${x}
          cy=${y}
          r=${r}
          style="fill:${selected ? "" : color}"
        ></circle>
        ${
          icon.kind === "path"
            ? svg`
              <svg
                x=${x - iconSize / 2}
                y=${y - iconSize / 2}
                width=${iconSize}
                height=${iconSize}
                viewBox="0 0 24 24"
                class="pin-icon"
              >
                <path d=${icon.d}></path>
              </svg>
            `
            : svg`
              <image
                x=${x - iconSize / 2}
                y=${y - iconSize / 2}
                width=${iconSize}
                height=${iconSize}
                href=${icon.href}
                class="pin-brand-icon"
                @error=${() => this.onBrandIconError(icon.integrationDomain)}
              ></image>
            `
        }
        <circle class="pin-hit" cx=${x} cy=${y} r=${r * 1.4}></circle>
      </g>
    `;
  }
}
