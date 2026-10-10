import { css, html, nothing } from "lit";
import { qualityColor } from "../canvas/mesh-colors";
import { localize } from "../i18n";

/** HA map-panel style info card shared by the floor and Property overlays:
 * a floating card with a close button, a title and subtitle, inner rounded
 * groups of rows, and a footer of actions. */
export const infoCardStyles = css`
  /* HA map-panel style info card. */
  .info-card {
    position: absolute;
    top: 68px;
    left: 12px;
    width: min(340px, calc(100% - 24px));
    max-height: calc(100% - 80px);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    border-radius: 28px;
    pointer-events: auto;
  }
  .info-head {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 4px 0;
  }
  .info-close {
    display: grid;
    place-items: center;
    flex: none;
    width: 40px;
    height: var(--sc-h-control);
    padding: 0;
    border-radius: 50%;
  }
  .info-titles {
    min-width: 0;
    flex: 1;
  }
  .info-toggle {
    display: grid;
    place-items: center;
    flex: none;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 50%;
  }
  /* Phones: the card spans the width under the controls row, and its
   * chevron folds it to just the header so the map stays workable with the
   * thing still selected. */
  @media (max-width: 700px) {
    .info-card {
      top: 56px;
      left: 0;
      right: 0;
      width: auto;
      max-height: 60%;
      border-radius: 0 0 28px 28px;
    }
  }
  .info-title {
    font-size: var(--sc-fs-title);
    line-height: 1.25;
    overflow-wrap: anywhere;
  }
  .info-sub {
    font-size: var(--sc-fs-small);
    color: var(--sc-fg-secondary);
  }
  .info-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
    overflow-y: auto;
  }
  .info-group {
    /* Don't shrink to fit the card: the body scrolls instead. */
    flex: none;
    padding: 4px 0;
    border-radius: 24px;
    overflow: hidden;
    background: var(--primary-background-color, var(--sc-bg));
  }
  .info-group-title {
    padding: 8px 16px 0;
    font-size: var(--sc-fs-caption);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sc-fg-secondary);
  }
  .info-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    padding: 6px 16px;
    font-size: var(--sc-fs-row);
    text-align: left;
  }
  .info-row.action {
    justify-content: flex-start;
    border-radius: 0;
  }
  .info-row.action:hover {
    background: var(--sc-hover);
  }
  /* A device row in the stack: the whole row is the hover target (the
   * name and the remove button sit inside it), not each button. */
  .info-row.stack-row:hover {
    background: var(--sc-hover);
  }
  .info-row.stack-row button:hover:not(:disabled):not(.primary) {
    background-image: none;
  }
  .info-row.stack-row .stack-remove:hover:not(:disabled):not(.primary) {
    background-image: linear-gradient(
      color-mix(in srgb, var(--sc-danger) 16%, transparent),
      color-mix(in srgb, var(--sc-danger) 16%, transparent)
    );
  }
  .info-row.action.active {
    color: var(--sc-accent);
  }
  .info-row ha-icon {
    --mdc-icon-size: 22px;
    color: var(--sc-fg-secondary);
  }
  .info-row.action.active ha-icon {
    color: var(--sc-accent);
  }
  .info-row .grow {
    flex: 1;
    min-width: 0;
  }
  .info-row select {
    max-width: 180px;
    border-radius: var(--sc-r-control);
  }
  .inline-pair {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  /* Two lines per link: "Device - Floor", then its signal detail. */
  .link-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }
  .link-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .link-detail {
    font-size: var(--sc-fs-small);
  }
  .quality-dot {
    flex: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .info-row.stack-row {
    padding: 0 4px 0 0;
  }
  .stack-choose {
    flex: 1;
    min-width: 0;
    padding: 12px 16px;
    border-radius: 0;
    text-align: left;
    justify-content: flex-start;
  }
  .stack-remove {
    display: grid;
    place-items: center;
    width: 36px;
    height: var(--sc-h-field);
    padding: 0;
    border-radius: 50%;
    color: var(--sc-danger);
  }
  .info-foot {
    display: flex;
    gap: 8px;
    padding: 0 4px 4px;
  }
  .info-foot button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
    padding: 10px 16px;
    border-radius: 22px;
    font-size: var(--sc-fs-row);
  }
  .info-foot button.danger {
    background: color-mix(in srgb, var(--sc-danger) 14%, transparent);
  }
  /* Controls inside the info card: HA-style rounded fields. */
  .info-row select,
  .info-row input[type="text"],
  .info-row input[type="number"] {
    height: var(--sc-h-field);
    padding: 0 12px;
    border: 1px solid var(--sc-divider);
    border-radius: var(--sc-r-control);
    background: var(--sc-panel-bg);
    color: var(--sc-fg);
    font: inherit;
    font-size: var(--sc-fs-body);
  }
  .info-row select:focus,
  .info-row input[type="text"]:focus,
  .info-row input[type="number"]:focus {
    outline: none;
    border-color: var(--sc-accent);
  }
  .info-row .select-wrap select {
    padding-right: 32px;
  }
  .wall-thickness {
    width: 72px;
  }
  .text-field {
    width: 170px;
    min-width: 0;
  }
  .text-field.short {
    width: 90px;
  }
`;

/** The card frame: header (close, title, subtitle), scrolling body, footer. */
export function renderCard(opts: {
  title: string;
  subtitle?: string | undefined;
  onClose: () => void;
  body: unknown;
  footer?: unknown;
  /** Folded to just the header, with a chevron to toggle it. */
  collapsed?: boolean;
  onToggle?: () => void;
}) {
  return html`
    <div class="info-card floating-panel">
      <div class="info-head">
        <button
          class="info-close"
          title=${localize("canvas.button.close")}
          @click=${opts.onClose}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
        <div class="info-titles">
          <div class="info-title">${opts.title}</div>
          ${
            opts.subtitle
              ? html`<div class="info-sub">${opts.subtitle}</div>`
              : nothing
          }
        </div>
        ${
          opts.onToggle
            ? html`<button
                class="info-toggle"
                title=${localize(
                  opts.collapsed ? "canvas.card.show" : "canvas.card.hide",
                )}
                aria-expanded=${opts.collapsed ? "false" : "true"}
                @click=${opts.onToggle}
              >
                <ha-icon
                  icon=${opts.collapsed ? "mdi:chevron-down" : "mdi:chevron-up"}
                ></ha-icon>
              </button>`
            : nothing
        }
      </div>
      ${
        opts.collapsed
          ? nothing
          : html`<div class="info-body">${opts.body}</div>
              ${opts.footer ? html`<div class="info-foot">${opts.footer}</div>` : nothing}`
      }
    </div>
  `;
}

/** A clickable row: icon and label. */
export function actionRow(
  icon: string,
  label: string,
  onClick: () => void,
  active = false,
) {
  return html`<button
    class="info-row action ${active ? "active" : ""}"
    @click=${onClick}
  >
    <ha-icon icon=${icon}></ha-icon>
    <span class="grow">${label}</span>
  </button>`;
}

/** A label on the left and its control on the right. */
export function fieldRow(icon: string, label: string, control: unknown) {
  return html`<div class="info-row">
    <ha-icon icon=${icon}></ha-icon>
    <span class="grow">${label}</span>
    ${control}
  </div>`;
}

export function selectWrap(select: unknown) {
  return html`<span class="select-wrap"
    >${select}<ha-icon class="chev" icon="mdi:menu-down"></ha-icon
  ></span>`;
}

export function deleteButton(label: string, onClick: () => void) {
  return html`<button class="danger" @click=${onClick}>
    <ha-icon icon="mdi:delete"></ha-icon> ${label}
  </button>`;
}

export interface NetworkRow {
  name: string;
  where: string;
  quality: "strong" | "medium" | "weak" | "unknown";
  detail: string;
}

/** A device's connections in the active network layer: one two-line row per
 * link ("Device - Floor", then its signal detail), strongest first. */
export function networkGroup(networkLabel: string, rows: NetworkRow[]) {
  const order = { strong: 0, medium: 1, weak: 2, unknown: 3 };
  const sorted = [...rows].sort((a, b) => order[a.quality] - order[b.quality]);
  return html`<div class="info-group">
    <div class="info-group-title">
      ${networkLabel} ·
      ${localize("canvas.card.links", { count: sorted.length })}
    </div>
    ${
      sorted.length === 0
        ? html`<div class="info-row">
            <span class="grow info-sub"
              >${localize("canvas.card.noLinks")}</span
            >
          </div>`
        : sorted.map((r) => {
            const text = r.where ? `${r.name} - ${r.where}` : r.name;
            return html`<div class="info-row link-row">
              <span
                class="quality-dot"
                style="background:${qualityColor(r.quality)}"
              ></span>
              <span class="link-text">
                <span class="link-name" title=${text}>${text}</span>
                <span
                  class="link-detail"
                  style="color:${qualityColor(r.quality)}"
                  >${r.detail}</span
                >
              </span>
            </div>`;
          })
    }
  </div>`;
}
