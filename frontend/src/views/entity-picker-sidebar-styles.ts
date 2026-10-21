import { css } from "lit";

export const entityPickerSidebarStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    position: relative;
    width: var(--sc-picker-width, 300px);
    min-width: 240px;
    max-width: 600px;
    border-inline-start: 1px solid var(--sc-divider);
    background: var(--sc-panel-bg);
    height: 100%;
    overflow: hidden;
  }
  .picker-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--ha-space-2, 8px) var(--ha-space-2, 8px) 0
      var(--ha-space-4, 16px);
  }
  .picker-title {
    font-size: var(--sc-fs-title);
  }
  .picker-close {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
  }
  /* Phones: a sheet under the canvas, not a column beside it. */
  @media (max-width: 700px) {
    :host {
      flex: 0 0 45%;
      width: 100%;
      min-width: 0;
      max-width: none;
      height: auto;
      border-inline-start: none;
      border-top: 1px solid var(--sc-divider);
    }
    .resize-handle {
      display: none;
    }
  }
  .resize-handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
    z-index: 1;
  }
  .search {
    padding: var(--ha-space-3, 12px);
  }
  .more-button {
    flex: none;
    display: grid;
    place-items: center;
    width: 36px;
    height: var(--sc-h-field);
    padding: 0;
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    color: var(--sc-fg-secondary);
  }
  .more-menu {
    position: absolute;
    right: 12px;
    z-index: 5;
    margin-top: var(--ha-space-1, 4px);
    min-width: 220px;
    padding: 6px;
  }
  .search-box {
    display: flex;
    align-items: center;
    gap: var(--ha-space-2, 8px);
    height: var(--sc-h-control);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-bg);
  }
  .search-box:focus-within {
    border-color: var(--sc-accent);
  }
  .search-box .clear {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 50%;
    color: var(--sc-fg-secondary);
  }
  .search-box ha-icon {
    --mdc-icon-size: 18px;
    color: var(--sc-fg-secondary);
    flex-shrink: 0;
  }
  .search-box input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: var(--sc-fs-body);
    color: var(--sc-fg);
  }
  .filters {
    display: flex;
    gap: var(--ha-space-2, 8px);
    margin-top: var(--ha-space-2, 8px);
  }
  .filters .select-wrap {
    flex: 1;
  }
  .filters select {
    flex: 1;
    min-width: 0;
    height: var(--sc-h-field);
    padding: 0 var(--ha-space-3, 12px);
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-bg);
    color: var(--sc-fg);
    font-size: var(--sc-fs-small);
  }
  .list {
    overflow-y: auto;
    flex: 1;
    border-top: 1px solid var(--sc-divider);
  }
  .item {
    display: flex;
    align-items: center;
    gap: var(--ha-space-3, 12px);
    min-height: 60px;
    padding: var(--ha-space-2, 8px) var(--ha-space-3, 12px);
    cursor: pointer;
    border-bottom: 1px solid var(--sc-divider);
  }
  .item:hover {
    background: var(--sc-hover);
  }
  .item.armed {
    background: color-mix(in srgb, var(--sc-accent) 18%, transparent);
    color: var(--sc-accent);
  }
  .item.armed .meta {
    color: var(--sc-fg-secondary);
  }
  .item.placed {
    opacity: 0.55;
  }
  .item .row-actions {
    display: flex;
    flex: none;
    gap: 2px;
  }
  .item .row-actions button {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 50%;
    color: var(--sc-fg-secondary);
  }
  .item .row-actions button:hover {
    background: var(--sc-hover);
    color: var(--sc-fg);
  }
  .item .row-actions ha-icon {
    --mdc-icon-size: 18px;
  }
  .item.blocked {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .item.blocked:hover {
    background: transparent;
  }
  .item .avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: var(--sc-h-field);
    border-radius: 50%;
    background: rgba(127, 127, 127, 0.2);
    flex-shrink: 0;
  }
  .item .avatar ha-icon {
    --mdc-icon-size: 20px;
    color: var(--sc-fg-secondary);
  }
  .item .avatar img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  .item .avatar ha-icon.hidden {
    display: none;
  }
  .item .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .item .name {
    font-size: var(--sc-fs-body);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item .meta {
    font-size: var(--sc-fs-caption);
    color: var(--sc-fg-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .empty {
    padding: var(--ha-space-4, 16px);
    color: var(--sc-fg-secondary);
    font-size: var(--sc-fs-body);
  }
`;
