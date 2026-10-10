import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import type { FloorMeta } from "../types";
import { localize } from "../i18n";
import { sharedStyles } from "../styles";
import "./floor-tabs";

/** Fixed page header: identity (icon/title/subtitle, WashData-style) —
 * floor tabs, dead-center in the row (their own second row on narrow
 * screens) (the standard HA hass-tabs-subpage
 * underline style) — icon actions. Sizing matches HA's own toolbar
 * exactly, measured directly off this instance's own sidebar toggle row:
 * 56px height, 48x48 icon buttons with 20px (not 24px) icons at normal
 * weight. A three-column grid (not flex) is what makes the tabs land in
 * the true center of the row regardless of how wide the identity block
 * or the action icons are — flex would only center them relative to the
 * leftover space after the identity block. Background/mesh controls live
 * behind their own icon here as small popovers rather than permanent
 * toolbar space. */
@safeCustomElement("app-header")
export class AppHeader extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        height: 56px;
        padding: 0 8px 0 4px;
        background: var(--sc-header-bg);
        border-bottom: 1px solid var(--sc-divider);
      }
      .identity {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        overflow: hidden;
      }
      .identity .menu-button {
        flex: none;
        width: 40px;
        height: var(--sc-h-control);
        margin-right: -4px;
      }
      .identity h1 {
        margin: 0;
        font-size: var(--sc-fs-header);
        font-weight: 400;
        line-height: 1.2;
        white-space: nowrap;
      }
      floor-tabs {
        align-self: stretch;
        justify-self: stretch;
        min-width: 0;
        width: 100%;
        overflow-x: auto;
        scrollbar-width: none;
      }
      floor-tabs::-webkit-scrollbar {
        display: none;
      }
      /* Narrow screens (HA's own mobile breakpoint): the identity block
       * and seven action icons leave the middle column no width at all,
       * so the floor tabs drop to a second, full-width row that scrolls
       * sideways when there are more floors than fit (#21). */
      @media (max-width: 870px) {
        :host {
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-rows: 56px 48px;
          grid-template-areas:
            "identity actions"
            "tabs tabs";
          height: auto;
          padding: 0;
        }
        .identity {
          grid-area: identity;
          padding-left: 4px;
        }
        .actions {
          grid-area: actions;
          padding-right: 8px;
        }
        floor-tabs {
          grid-area: tabs;
          border-top: 1px solid var(--sc-divider);
        }
      }
      @media (max-width: 600px) {
        /* Seven header actions (incl. undo/redo) need to fit a phone. */
        .icon-button {
          width: 40px;
          height: var(--sc-h-control);
        }
      }
      @media (max-width: 480px) {
        .identity h1 {
          font-size: var(--sc-fs-title);
        }
      }
      .actions {
        display: flex;
        align-items: center;
        justify-self: end;
        gap: 2px;
        position: relative;
      }
      .icon-button {
        position: relative;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      .icon-button ha-icon {
        --mdc-icon-size: 20px;
      }
      .icon-button.active {
        background: rgba(0, 0, 0, 0.06);
      }
    `,
  ];

  @property({ attribute: false }) floors: FloorMeta[] = [];
  @property({ attribute: false }) selectedFloorId: string | null = null;
  @property({ type: Boolean }) propertySelected = false;

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  override render() {
    return html`
      <div class="identity">
        <button
          class="icon-button menu-button"
          title=${localize("appHeader.menu")}
          @click=${() => this._fire("hass-toggle-menu")}
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>
        <h1>Spatial Context</h1>
      </div>
      <floor-tabs
        .floors=${this.floors}
        .selectedFloorId=${this.selectedFloorId}
        .propertySelected=${this.propertySelected}
      ></floor-tabs>
      <div class="actions">
        <slot></slot>
        <slot name="end"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-header": AppHeader;
  }
}
