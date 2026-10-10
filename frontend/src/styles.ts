import { css } from "lit";

/** Common tokens/resets shared across every Spatial Context element. Relies on
 * HA's own theme custom properties, with sane fallbacks for standalone testing. */
export const sharedStyles = css`
  :host {
    --sc-bg: var(--card-background-color, #fff);
    --sc-fg: var(--primary-text-color, #212121);
    --sc-fg-secondary: var(--secondary-text-color, #727272);
    --sc-accent: var(--primary-color, #03a9f4);
    --sc-divider: var(--divider-color, #e0e0e0);
    --sc-danger: var(--error-color, #db4437);
    --sc-panel-bg: var(--card-background-color, #fff);
    --sc-panel-radius: var(--ha-card-border-radius, 12px);
    --sc-panel-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.3));
    --sc-header-bg: var(--app-header-background-color, var(--sc-bg));
    box-sizing: border-box;
    color: var(--sc-fg);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  button {
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    padding: 6px 12px;
    background: transparent;
    color: var(--sc-fg);
  }
  button:hover {
    background: rgba(0, 0, 0, 0.06);
  }
  button.primary {
    background: var(--sc-accent);
    color: white;
  }
  button.primary:hover {
    filter: brightness(1.05);
  }
  button.danger {
    color: var(--sc-danger);
  }
  button:disabled {
    opacity: 0.4;
    cursor: default;
    background: transparent;
  }
  button.active {
    background: var(--sc-accent);
    color: white;
  }
  input[type="text"],
  input[type="search"] {
    font-family: inherit;
    font-size: 0.875rem;
    padding: 6px 8px;
    border: 1px solid var(--sc-divider);
    border-radius: 4px;
    color: var(--sc-fg);
    background: var(--sc-bg);
  }
  .floating-panel {
    background: var(--sc-panel-bg);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-panel-radius);
    box-shadow: var(--sc-panel-shadow);
    padding: 6px;
  }
  /* HA's own overflow-menu row style (the ⋮ menu's Refresh/Download/Reset
   * list) — an icon + label per row, generous padding, no borders between
   * rows, disabled rows just dimmed. Shared by every icon-popover menu. */
  .menu-item {
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 1rem;
    text-align: left;
    justify-content: flex-start;
  }
  .menu-item ha-icon {
    --mdc-icon-size: 22px;
    color: var(--sc-fg-secondary);
    flex-shrink: 0;
  }
  /* Selected row: the primary colour at low strength (like HA's selected
   * list items) instead of a solid bar. */
  .menu-item.active {
    background: color-mix(in srgb, var(--sc-accent) 16%, transparent);
    color: var(--sc-accent);
  }
  .menu-item.active ha-icon {
    color: var(--sc-accent);
  }
  .menu-item.danger ha-icon {
    color: var(--sc-danger);
  }
`;

/** The floating zoom stack (+ / − / fit) shared by the floor-plan and
 * Property canvases: one rounded card with stacked icon buttons, like the
 * zoom control on HA's own Map page. */
export const zoomControlsStyles = css`
  .controls {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    flex-direction: column;
    background: var(--sc-panel-bg);
    border: 1px solid var(--sc-divider);
    box-shadow: var(--sc-panel-shadow);
    border-radius: 12px;
    overflow: hidden;
  }
  .controls button {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 0;
    color: var(--sc-fg);
  }
  .controls button + button {
    border-top: 1px solid var(--sc-divider);
  }
  .controls button:hover {
    background: color-mix(in srgb, var(--sc-fg) 8%, transparent);
  }
  .controls ha-icon {
    --mdc-icon-size: 22px;
  }
`;

/** A native <select> drawn with HA's dropdown chevron instead of the
 * browser's up/down arrows: wrap it in `.select-wrap` and add
 * `<ha-icon class="chev" icon="mdi:menu-down">` after it. */
export const selectStyles = css`
  .select-wrap {
    position: relative;
    display: inline-flex;
    min-width: 0;
  }
  .select-wrap select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding-right: 30px;
  }
  .select-wrap .chev {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    --mdc-icon-size: 20px;
    color: var(--sc-fg-secondary);
    pointer-events: none;
  }
`;

/** On/off switch — a styled checkbox, so it stays keyboard and
 * screen-reader accessible. */
export const switchStyles = css`
  .switch {
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    width: 36px;
    height: 20px;
    margin: 0;
    border-radius: 10px;
    background: var(--sc-divider);
    cursor: pointer;
    transition: background 0.15s;
    flex: none;
  }
  .switch::before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transition: transform 0.15s;
  }
  .switch:checked {
    background: var(--sc-accent);
  }
  .switch:checked::before {
    transform: translateX(16px);
  }
  .switch:focus-visible {
    outline: 2px solid var(--sc-accent);
    outline-offset: 2px;
  }
`;
