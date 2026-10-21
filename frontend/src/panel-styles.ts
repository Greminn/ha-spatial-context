import { css } from "lit";

export const panelStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    height: 100vh;
    /* iOS Safari: 100vh is taller than the visible area. */
    height: 100dvh;
    background: var(--sc-bg);
  }
  .main {
    flex: 1;
    display: flex;
    min-height: 0;
    position: relative;
  }
  .save-error {
    position: absolute;
    top: 68px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 5;
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    max-width: min(640px, calc(100% - 32px));
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    border-inline-start: 4px solid var(--sc-danger);
    font-size: var(--sc-fs-body);
  }
  .save-error ha-icon {
    color: var(--sc-danger);
    flex: none;
  }
  /* Phones: the device picker becomes a sheet under the canvas. */
  @media (max-width: 700px) {
    .main {
      flex-direction: column;
    }
    .canvas-area {
      min-height: 0;
    }
  }
  .canvas-area {
    flex: 1;
    min-width: 0;
    position: relative;
    /* Room for the controls row the overlay draws across the top. */
    padding-top: var(--ha-space-14, 56px);
  }
  .canvas-area.drag-over {
    outline: 2px dashed var(--sc-accent);
    outline-offset: -2px;
  }
  .loading,
  .no-floors {
    padding: var(--ha-space-8, 32px);
    color: var(--sc-fg-secondary);
  }
  .popover-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ha-space-4, 16px);
    min-height: 44px;
    padding: 6px var(--ha-space-4, 16px);
    font-size: var(--sc-fs-row);
  }
  .menu-divider {
    height: 1px;
    margin: 6px 0;
    background: var(--sc-divider);
  }
  .menu-item .trail {
    margin-inline-start: auto;
    color: var(--sc-accent);
  }
  /* Innerspace-style layer menu: "Connectivity Map" opens a list of
   * mutually-exclusive layers (only one network is ever drawn at once)
   * instead of a plain <select>, plus a quality legend echoing the
   * same weak/medium/strong colors the mesh lines themselves use. */
  .layer-list {
    display: flex;
    flex-direction: column;
    min-width: 220px;
  }
  .hidden-file-input {
    display: none;
  }
  input[type="range"] {
    width: 130px;
  }
  .popover-row select {
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    color: var(--sc-fg);
    font: inherit;
    font-size: var(--sc-fs-body);
  }
  .popover-row select:focus {
    outline: none;
    border-color: var(--sc-accent);
  }
  .hint {
    font-size: var(--sc-fs-small);
    color: var(--sc-fg-secondary);
  }
`;
