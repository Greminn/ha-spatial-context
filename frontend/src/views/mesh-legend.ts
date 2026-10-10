import { css, html } from "lit";
import { localize } from "../i18n";
import { qualityColor } from "../canvas/mesh-colors";

/** The weak → strong colour key for the Connectivity Map, drawn as a pill
 * along the bottom of the canvas (like the legend under HA's own network
 * visualisation) rather than inside the layer menu. Shared by the floor
 * and Property overlays. */
export const meshLegendStyles = css`
  .mesh-legend {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: var(--sc-fs-caption);
    color: var(--sc-fg-secondary);
    pointer-events: none;
    white-space: nowrap;
  }
  .mesh-legend .gradient {
    width: 96px;
    height: 6px;
    border-radius: 3px;
  }
`;

export function renderMeshLegend() {
  const gradient = `linear-gradient(to right, ${qualityColor("weak")}, ${qualityColor("medium")}, ${qualityColor("strong")})`;
  return html`<div class="mesh-legend floating-panel">
    <span>${localize("legend.weak")}</span>
    <span class="gradient" style="background:${gradient}"></span>
    <span>${localize("legend.strong")}</span>
  </div>`;
}
