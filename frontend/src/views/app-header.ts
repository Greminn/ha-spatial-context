import { LitElement, html, css, nothing } from "lit";
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
        /* The brand mark's blue: a touch brighter on a dark theme. */
        --sc-brand: #03a9f4;
      }
      :host([light]) {
        --sc-brand: #039be5;
      }
      :host {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        height: 56px;
        padding: 0 var(--ha-space-2, 8px) 0 var(--ha-space-1, 4px);
        background: var(--sc-header-bg);
        border-bottom: 1px solid var(--sc-divider);
      }
      .identity {
        display: flex;
        align-items: center;
        gap: var(--ha-space-3, 12px);
        min-width: 0;
        overflow: hidden;
      }
      .identity .menu-button {
        flex: none;
        width: 40px;
        height: var(--sc-h-control);
        margin-inline-end: -4px;
      }
      .identity .brand-mark {
        flex: none;
        width: 24px;
        height: 24px;
        margin-inline-start: var(--ha-space-4, 16px);
        background: var(--sc-brand, #03a9f4);
        -webkit-mask: url(/spatial_context/spatial-context-mark.svg) center /
          contain no-repeat;
        mask: url(/spatial_context/spatial-context-mark.svg) center / contain
          no-repeat;
      }
      .identity .menu-button + .brand-mark {
        margin-inline-start: 0;
      }
      .identity h1.crumb {
        font-size: var(--sc-fs-title);
        font-weight: 500;
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
          padding-inline-start: var(--ha-space-1, 4px);
        }
        .actions {
          grid-area: actions;
          padding-inline-end: var(--ha-space-2, 8px);
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
      @media (max-width: 600px) {
        /* On a phone only the mark shows (the name would crowd the icons). */
        .identity h1:not(.crumb) {
          display: none;
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
        background: var(--sc-hover);
      }
    `,
  ];

  @property({ attribute: false }) floors: FloorMeta[] = [];
  @property({ attribute: false }) selectedFloorId: string | null = null;
  @property({ type: Boolean }) propertySelected = false;
  @property({ type: Boolean }) narrow = false;
  /** A page other than the map ("settings"): the header shows a back
   * arrow and the page's name instead of the menu, brand and floor tabs. */
  @property() page = "";
  @property({ type: Boolean, reflect: true }) light = false;

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  override render() {
    if (this.page) {
      return html`
        <div class="identity">
          <button
            class="icon-button"
            title=${localize("appHeader.back")}
            aria-label=${localize("appHeader.back")}
            @click=${() => this._fire("page-back")}
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
          <h1 class="crumb">${localize(`appHeader.${this.page}`)}</h1>
        </div>
      `;
    }
    return html`
      <div class="identity">
        ${
          this.narrow
            ? html` <button
                class="icon-button menu-button"
                title=${localize("appHeader.menu")}
                aria-label=${localize("appHeader.menu")}
                @click=${() => this._fire("hass-toggle-menu")}
              >
                <ha-icon icon="mdi:menu"></ha-icon>
              </button>`
            : nothing
        }
        <span class="brand-mark" aria-hidden="true"></span>
        <h1>Spatial Context</h1>
      </div>
      <floor-tabs
        .floors=${this.floors}
        .selectedFloorId=${this.selectedFloorId}
        .propertySelected=${this.propertySelected}
      ></floor-tabs>
      <div class="actions">
        <slot></slot>
        <button
          class="icon-button"
          title=${localize("menu.settings")}
          aria-label=${localize("menu.settings")}
          @click=${() => this._fire("open-settings")}
        >
          <ha-icon icon="mdi:cog"></ha-icon>
        </button>
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
