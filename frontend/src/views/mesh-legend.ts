import { css, html, nothing } from "lit";
import { localize } from "../i18n";
import {
  bleRssiToQuality,
  dbmToQuality,
  lqiToQuality,
  qualityColor,
} from "../canvas/mesh-colors";
import type { LinkQuality } from "../canvas/mesh-colors";
import type { MeshLegendInfo } from "../types";

/** The Connectivity Map key, drawn as a pill along the bottom of the canvas
 * (like the legend under HA's own network visualisation) rather than inside
 * the layer menu. Shared by the floor and Property overlays. It always shows
 * the weak → strong colours, with the weakest and strongest readings actually
 * drawn at either end. Hovering the key (or focusing or tapping it) opens a
 * popover with the picked network's thresholds, and moving along the bar
 * reads off the value under the pointer. It adds a key for dashed lines and
 * for grey "no signal data" links only when the view is drawing them. */
export const meshLegendStyles = css`
  .mesh-legend {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px 16px;
    max-width: calc(100% - 24px);
    padding: 6px var(--ha-space-4, 16px);
    border-radius: var(--ha-border-radius-2xl, 20px);
    font-size: var(--sc-fs-caption);
    color: var(--sc-fg-secondary);
    pointer-events: none;
  }
  .mesh-legend .key {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  .mesh-legend .scale {
    position: relative;
    pointer-events: auto;
    outline: none;
  }
  .mesh-legend .scale ha-icon {
    --mdc-icon-size: 16px;
  }
  /* A popover rather than a title attribute: native tooltips wait a second
   * or more before showing, and never show on touch. Focus covers a tap on
   * a phone and keyboard users. */
  .mesh-legend .hint {
    display: none;
    position: absolute;
    bottom: calc(100% + 14px);
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    max-width: min(300px, 80vw);
    padding: 8px 12px;
    color: var(--sc-fg);
    white-space: normal;
    text-align: center;
  }
  .mesh-legend .scale:hover .hint,
  .mesh-legend .scale:focus .hint,
  .mesh-legend .scale:focus-within .hint {
    display: block;
  }
  /* Moving along the bar reads off the value under the pointer. */
  .mesh-legend .bar {
    position: relative;
    display: flex;
    align-items: center;
    width: 96px;
    height: 16px;
  }
  .mesh-legend .gradient {
    width: 100%;
    height: 6px;
    border-radius: 3px;
  }
  .mesh-legend .marker {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    margin-left: -1px;
    border-radius: 1px;
    background: var(--sc-fg);
  }
  .mesh-legend .live {
    display: none;
    margin-top: 4px;
    font-weight: 500;
  }
  .mesh-legend .swatch {
    width: 18px;
    height: 4px;
    border-radius: 2px;
  }
  .mesh-legend .dash {
    width: 22px;
    border-top: 2px dashed var(--sc-fg-secondary);
  }
`;

/** A reading as shown on the scale: "LQI 55" or "−80 dBm". */
function reading(value: number, unit: "lqi" | "dbm"): string {
  return localize(unit === "lqi" ? "legend.lqi" : "legend.dbm", {
    value: String(value).replace("-", "−"),
  });
}

/** How a reading is graded on the picked network (see mesh-colors.ts). */
function gradeOf(info: MeshLegendInfo, value: number): LinkQuality {
  if (info.network === "zigbee") return lqiToQuality(value);
  return info.network === "bluetooth"
    ? bleRssiToQuality(value)
    : dbmToQuality(value);
}

/** Pointer over the bar: put the marker under it and name the reading and its
 * grade in the popover. The bar spans the weakest to the strongest reading
 * drawn, so the value is a straight interpolation. Written straight to the
 * DOM, not through render state: it changes with every pointer move and
 * nothing else depends on it. */
function scrub(event: PointerEvent, info: MeshLegendInfo): void {
  const { range } = info;
  const bar = event.currentTarget as HTMLElement;
  const live = bar.closest(".scale")?.querySelector<HTMLElement>(".live");
  const marker = bar.querySelector<HTMLElement>(".marker");
  if (!range || !live || !marker) return;
  const box = bar.getBoundingClientRect();
  const t = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
  const value = Math.round(range.min + t * (range.max - range.min));
  marker.style.left = `${t * 100}%`;
  marker.style.display = "block";
  live.textContent = `${reading(value, range.unit)} · ${localize(`legend.${gradeOf(info, value)}`)}`;
  live.style.display = "block";
}

function endScrub(event: PointerEvent): void {
  const bar = event.currentTarget as HTMLElement;
  const live = bar.closest(".scale")?.querySelector<HTMLElement>(".live");
  const marker = bar.querySelector<HTMLElement>(".marker");
  if (live) live.style.display = "none";
  if (marker) marker.style.display = "none";
}

export function renderMeshLegend(info: MeshLegendInfo) {
  const gradient = `linear-gradient(to right, ${qualityColor("weak")}, ${qualityColor("medium")}, ${qualityColor("strong")})`;
  const { range } = info;
  return html`<div class="mesh-legend floating-panel">
    <span class="key scale" tabindex="0">
      <span
        >${localize("legend.weak")}${
          range ? ` (${reading(range.min, range.unit)})` : nothing
        }</span
      >
      <span
        class="bar"
        @pointermove=${(e: PointerEvent) => scrub(e, info)}
        @pointerdown=${(e: PointerEvent) => scrub(e, info)}
        @pointerleave=${endScrub}
      >
        <span class="gradient" style="background:${gradient}"></span>
        <span class="marker"></span>
      </span>
      <span
        >${localize("legend.strong")}${
          range ? ` (${reading(range.max, range.unit)})` : nothing
        }</span
      >
      <ha-icon icon="mdi:information-outline"></ha-icon>
      <span class="hint floating-panel" role="tooltip">
        <span>${localize(`legend.hint.${info.network}`)}</span>
        <span class="live"></span>
      </span>
    </span>
    ${
      info.unknown
        ? html`<span class="key">
            <span
              class="swatch"
              style="background:${qualityColor("unknown")}"
            ></span>
            ${localize("legend.unknown")}
          </span>`
        : nothing
    }
    ${
      info.dashed
        ? html`<span class="key">
            <span class="dash"></span>
            ${localize(
              info.dashed === "floor"
                ? "legend.dashedFloor"
                : "legend.dashedProperty",
            )}
          </span>`
        : nothing
    }
  </div>`;
}
