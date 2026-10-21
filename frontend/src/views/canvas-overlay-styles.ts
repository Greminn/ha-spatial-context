import { css } from "lit";

export const canvasOverlayStyles = css`
  :host {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .mode-toolbar {
    pointer-events: auto;
  }
  .mode-toolbar button {
    display: flex;
    align-items: center;
    gap: var(--ha-space-1, 4px);
    padding: 6px 10px;
    border-radius: 10px;
  }
  /* A thin divider between tool groups: view, draw, place/align. */
  .tool-divider {
    align-self: stretch;
    width: 1px;
    margin: 6px var(--ha-space-1, 4px);
    background: var(--sc-divider);
  }
  .mode-toolbar ha-icon {
    --mdc-icon-size: 20px;
  }
  /* Tonal active state, like HA's selected chips and tabs: the primary
   * colour at low strength behind a primary icon. */
  .mode-toolbar button.active {
    background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
    color: var(--sc-accent);
  }
  .mode-toolbar button.active ha-icon {
    color: var(--sc-accent);
  }
  .hint-bar {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    pointer-events: auto;
  }
  .snap-select {
    padding: var(--ha-space-1, 4px);
  }
  .hint {
    font-size: var(--sc-fs-small);
    color: var(--sc-fg-secondary);
  }
  .color-field {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-2, 8px) 0 10px;
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    font-size: var(--sc-fs-body);
  }
  .swatch {
    flex: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--sc-fg) 25%, transparent);
  }
  .custom-swatch {
    background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
  }
  .color-list {
    max-height: 260px;
    overflow-y: auto;
    margin: 0 var(--ha-space-2, 8px) var(--ha-space-1, 4px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--ha-border-radius-xl, 16px);
    background: var(--sc-panel-bg);
  }
  .color-item {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    width: 100%;
    min-height: 44px;
    padding: 6px 14px;
    border-radius: 0;
    font-size: var(--sc-fs-row);
    text-align: start;
    justify-content: flex-start;
    cursor: pointer;
  }
  .color-item:hover {
    background: var(--sc-hover);
  }
  .color-item.selected {
    color: var(--sc-accent);
  }
  .color-item .grow {
    flex: 1;
    min-width: 0;
  }
  .color-item ha-icon {
    --mdc-icon-size: 20px;
    color: var(--sc-accent);
  }
  .color-item .room-fill-color {
    width: 36px;
    height: 24px;
  }
  .small-unit-select {
    width: auto;
  }
  .room-fill-color {
    -webkit-appearance: none;
    appearance: none;
    width: 44px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--sc-divider);
    border-radius: 10px;
    background: none;
    cursor: pointer;
    overflow: hidden;
  }
  .room-fill-color::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  .room-fill-color::-webkit-color-swatch {
    border: none;
  }
  .room-fill-color::-moz-color-swatch {
    border: none;
  }
  .room-opacity {
    width: 140px;
  }
`;
