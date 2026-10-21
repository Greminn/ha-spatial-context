import { css } from "lit";
import { zoomControlsStyles } from "../styles";

export const propertyCanvasStyles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* Same backdrop as the floors, for when there's no photo or map. */
    background: color-mix(in srgb, var(--sc-bg) 94%, black);
    user-select: none;
    -webkit-user-select: none;
  }
  :host([dark]) {
    background: color-mix(in srgb, var(--sc-bg) 88%, white);
  }
  svg {
    position: relative;
    width: 100%;
    height: 100%;
    touch-action: none;
    display: block;
    cursor: grab;
  }
  svg.place-mode,
  svg.place-mode * {
    cursor: crosshair !important;
  }
  .map-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .map-attribution {
    position: absolute;
    right: 12px;
    bottom: 60px;
    padding: 1px 6px;
    border-radius: var(--ha-border-radius-sm, 4px);
    font-size: var(--sc-fs-caption);
    color: #333;
    background: rgba(255, 255, 255, 0.8);
  }
  .map-attribution a {
    color: inherit;
  }
  .map-error {
    position: absolute;
    left: 12px;
    top: 64px;
    max-width: calc(100% - 16px);
    padding: var(--ha-space-1, 4px) var(--ha-space-2, 8px);
    border-radius: 6px;
    font-size: var(--sc-fs-small);
    color: var(--sc-fg);
    background: var(--sc-bg);
    border: 1px solid var(--sc-divider);
    pointer-events: none;
  }
  .bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    pointer-events: none;
  }
  .bg-overlay img {
    display: block;
    background: white;
  }
  .placement-rect {
    fill: var(--sc-accent);
    fill-opacity: 0.25;
    stroke: var(--sc-accent);
    stroke-width: 2;
    cursor: pointer;
  }
  .placement-rect.selected {
    stroke: var(--sc-danger);
    stroke-width: 3;
    fill-opacity: 0.35;
  }
  .ghost-room {
    fill: none;
    stroke: var(--sc-accent);
    stroke-opacity: 0.7;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
  }
  .ghost-wall {
    fill: none;
    stroke: var(--sc-fg);
    stroke-opacity: 0.8;
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
  }
  .placement-label {
    fill: var(--sc-fg);
    font-size: 16px;
    text-anchor: middle;
    pointer-events: none;
    paint-order: stroke;
    stroke: var(--sc-bg);
    stroke-width: 3px;
  }
  .rotate-stick {
    stroke: var(--sc-danger);
    stroke-width: 1.5;
  }
  .rotate-handle {
    fill: white;
    stroke: var(--sc-danger);
    stroke-width: 2;
    cursor: alias;
  }
  .resize-handle {
    fill: white;
    stroke: var(--sc-accent);
    stroke-width: 2;
    cursor: nwse-resize;
  }
  .mesh-link {
    stroke-width: 2;
    opacity: 0.85;
    cursor: pointer;
  }
  .mesh-link.indoor {
    stroke-dasharray: 6 4;
  }
  .mesh-link.selected {
    stroke-width: 4;
    opacity: 1;
  }
  .mesh-link.dim {
    opacity: 0.2;
  }
  .indoor-end {
    fill: var(--sc-fg-secondary);
    stroke: white;
    stroke-width: 1.5;
    pointer-events: none;
  }
  ${zoomControlsStyles}
`;
