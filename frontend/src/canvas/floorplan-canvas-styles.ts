import { css } from "lit";
import { scaleStyles, zoomControlsStyles } from "../styles";

export const floorplanCanvasStyles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* A step off the cards' colour, so the floating panels stand out:
     * light grey by day (the plan image stays white, like paper on a
     * desk), a lighter grey than the cards by night (see [dark]). */
    background: color-mix(in srgb, var(--sc-bg) 94%, black);
    user-select: none;
    -webkit-user-select: none;
  }
  svg {
    position: relative;
    width: 100%;
    height: 100%;
    touch-action: none;
    display: block;
    cursor: grab;
  }
  /* Dedicated Pan tool (Innerspace-style, separate from Select) — every
   * drag pans unconditionally (see _hitTest's mode !== "select" early
   * return), so every element shows the pan cursor too, not its own
   * pointer/ew-resize/copy hint. */
  svg.pan-mode * {
    cursor: grab !important;
  }
  /* Every non-select, non-pan mode (trace room/wall, add door/window,
   * set scale, place device) is a pure "click here to do the thing"
   * mode — _hitTest's mode !== select early return means none of
   * these ever select/drag an existing element, so none of them should
   * show the select-mode pointer/hand either. Both the svg root itself
   * (blank canvas) and its children need the override — the base
   * svg cursor:grab rule above only applies to the root element, so a
   * bare descendant selector would miss it. */
  svg.draw-mode,
  svg.draw-mode * {
    cursor: crosshair !important;
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
  /* Dark HA theme: the canvas takes the theme's own background and the
   * (usually white) plan image is inverted into light lines on dark —
   * hue-rotate(180deg) keeps any colour in the plan close to its
   * original hue. The Background menu's opacity still applies. */
  :host([dark]) {
    /* A step lighter than the cards, so the floating toolbar and panels
     * (card colour) stand out from the canvas. */
    background: color-mix(in srgb, var(--sc-bg) 88%, white);
  }
  :host([dark]) .bg-overlay img {
    filter: invert(1) hue-rotate(180deg);
  }
  /* Door/window jambs were drawn dark-on-white. */
  :host([dark]) .opening-jamb-case {
    stroke: color-mix(in srgb, var(--sc-bg) 88%, white);
  }
  :host([dark]) .opening-jamb {
    stroke: var(--sc-fg);
  }
  .mesh-link {
    stroke-width: 2;
    opacity: 0.85;
    cursor: pointer;
  }
  .mesh-link.selected {
    stroke-width: 4;
    opacity: 1;
  }
  /* With one link selected, the rest recede, like hovering a node in
   * HA's own network visualisation. */
  .mesh-link.dim {
    opacity: 0.2;
  }
  .mesh-stub-line {
    stroke-width: 2;
    stroke-dasharray: 6 4;
    opacity: 0.85;
    cursor: pointer;
  }
  .mesh-stub-line.selected {
    stroke-width: 4;
    opacity: 1;
  }
  .mesh-stub-label {
    fill: var(--sc-fg-secondary);
    font-size: 12px;
    text-anchor: middle;
    pointer-events: none;
    paint-order: stroke;
    stroke: var(--sc-bg);
    stroke-width: 3px;
  }
  .room-ghost {
    fill: none;
    stroke: var(--sc-fg-secondary);
    stroke-width: 2;
    stroke-dasharray: 6 4;
    opacity: 0.7;
    pointer-events: none;
  }
  /* A selected room can be dragged whole (see the "roomMove" gesture). */
  svg:not(.pan-mode):not(.draw-mode) .room-poly.selected {
    cursor: move;
  }
  .room-poly {
    /* fill/fill-opacity/stroke/stroke-opacity/stroke-width are set
     * inline per-render from the room's own style fields (see
     * _renderRoom), each falling back to DEFAULT_ROOM_* when unset —
     * not fixed here, since a plain class can't vary per room. */
    cursor: pointer;
  }
  .room-label {
    fill: var(--sc-fg);
    font-size: 16px;
    text-anchor: middle;
    pointer-events: none;
    paint-order: stroke;
    stroke: var(--sc-bg);
    stroke-width: 3px;
  }
  .pending-trace {
    fill: none;
    stroke: var(--sc-accent);
    stroke-width: 2;
    stroke-dasharray: 6 4;
  }
  .wall-line {
    fill: none;
    cursor: pointer;
  }
  .wall-line.selected {
    stroke: var(--sc-danger) !important;
  }
  .opening-line {
    /* Width is set inline per-opening from its own wall's real
     * thickness (see _renderOpening/_wallStrokeWidth) — matches the
     * wall it's drawn on instead of one fixed width for every door
     * and window regardless of what wall they're set into. */
    cursor: pointer;
  }
  .opening-line.door {
    stroke: #d7ccc8;
  }
  .opening-line.window {
    stroke: #81d4fa;
  }
  .opening-line.selected {
    stroke: var(--sc-danger);
  }
  .opening-handle {
    fill: white;
    stroke: var(--sc-danger);
    stroke-width: 2;
    cursor: ew-resize;
  }
  .opening-jamb-case {
    stroke: #ffffff;
    stroke-width: 3.4;
    pointer-events: none;
  }
  .opening-jamb {
    stroke: #212121;
    stroke-width: 1.6;
    pointer-events: none;
  }
  .pending-scale,
  .scale-line {
    stroke: #43a047;
    stroke-width: 2;
    stroke-dasharray: 4 3;
  }
  .scale-label {
    fill: #43a047;
    font-size: 14px;
    text-anchor: middle;
    paint-order: stroke;
    stroke: var(--sc-bg);
    stroke-width: 3px;
  }
  .vertex-handle {
    fill: white;
    stroke: var(--sc-accent);
    stroke-width: 2;
    cursor: pointer;
  }
  .vertex-handle.selected {
    fill: var(--sc-danger);
  }
  .hover-snap-line {
    fill: none;
    stroke: var(--sc-accent);
    stroke-width: 2;
    stroke-dasharray: 6 4;
    opacity: 0.6;
    pointer-events: none;
  }
  .hover-snap-line.closing {
    stroke: #2e7d32;
    stroke-dasharray: none;
    opacity: 1;
  }
  .hover-snap-marker {
    fill: white;
    stroke: var(--sc-accent);
    stroke-width: 2;
    opacity: 0.6;
    pointer-events: none;
  }
  .hover-snap-marker.on-geometry {
    fill: var(--sc-accent);
    opacity: 1;
  }
  /* A distinct hue from the app's own accent blue — a dedicated
   * "alignment guide" color (the same convention design tools like
   * Figma use) so it never gets confused with a geometry snap. */
  .hover-snap-marker.on-axis {
    fill: #e91e63;
    stroke: #e91e63;
    opacity: 1;
  }
  .marquee {
    fill: var(--sc-accent);
    fill-opacity: 0.12;
    stroke: var(--sc-accent);
    stroke-width: 1.5;
    stroke-dasharray: 6 4;
    vector-effect: non-scaling-stroke;
    pointer-events: none;
  }
  .axis-guide {
    stroke: #e91e63;
    stroke-width: 1;
    opacity: 0.8;
    pointer-events: none;
  }
  .vertex-handle.closing {
    fill: #2e7d32;
    stroke: #2e7d32;
  }
  .vertex-delete {
    fill: var(--sc-danger);
    cursor: pointer;
  }
  .vertex-delete-x {
    stroke: white;
    stroke-width: 1.5;
    pointer-events: none;
  }
  .midpoint-handle {
    fill: var(--sc-accent);
    opacity: 0.5;
    cursor: copy;
  }
  ${zoomControlsStyles}
  ${scaleStyles}
`;
