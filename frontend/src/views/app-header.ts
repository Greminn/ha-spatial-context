import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { FloorMeta } from "../types";
import { sharedStyles } from "../styles";
import "./floor-tabs";

/** Fixed page header: identity (icon/title/subtitle, WashData-style) —
 * floor tabs, dead-center in the row (the standard HA hass-tabs-subpage
 * underline style) — icon actions. Sizing matches HA's own toolbar
 * exactly, measured directly off this instance's own sidebar toggle row:
 * 56px height, 48x48 icon buttons with 20px (not 24px) icons at normal
 * weight. A three-column grid (not flex) is what makes the tabs land in
 * the true center of the row regardless of how wide the identity block
 * or the action icons are — flex would only center them relative to the
 * leftover space after the identity block. Background/mesh controls live
 * behind their own icon here as small popovers rather than permanent
 * toolbar space. */
@customElement("app-header")
export class AppHeader extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        height: 56px;
        padding: 0 8px 0 16px;
        background: var(--sc-header-bg);
        border-bottom: 1px solid var(--sc-divider);
      }
      .identity {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
      }
      .identity ha-icon {
        --mdc-icon-size: 24px;
        color: var(--sc-accent);
      }
      .identity h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
        line-height: 1.2;
        white-space: nowrap;
      }
      .identity .subtitle {
        font-size: 12px;
        color: var(--sc-fg-secondary);
        line-height: 1.2;
      }
      floor-tabs {
        align-self: stretch;
        justify-self: center;
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
      .dirty-dot {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--sc-danger);
      }
      .icon-button.danger ha-icon {
        color: var(--sc-danger);
      }
    `,
  ];

  @property({ attribute: false }) floors: FloorMeta[] = [];
  @property({ attribute: false }) selectedFloorId: string | null = null;
  @property({ type: Boolean }) propertySelected = false;
  @property({ type: Boolean }) dirty = false;
  @property({ type: Boolean }) saving = false;
  @property({ type: String }) resetTitle = "Reset floor";

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  override render() {
    return html`
      <div class="identity">
        <ha-icon icon="mdi:floor-plan"></ha-icon>
        <div>
          <h1>Spatial Context</h1>
          <div class="subtitle">
            v0.3.0-beta.1 · Floor plan &amp; device mapping
          </div>
        </div>
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
          title=${this.saving ? "Saving…" : "Save"}
          ?disabled=${this.saving}
          @click=${() => this._fire("save-click")}
        >
          <ha-icon icon="mdi:content-save"></ha-icon>
          ${this.dirty ? html`<span class="dirty-dot"></span>` : nothing}
        </button>
        <button
          class="icon-button"
          title="Export"
          @click=${() => this._fire("export-click")}
        >
          <ha-icon icon="mdi:download"></ha-icon>
        </button>
        <button
          class="icon-button danger"
          title=${this.resetTitle}
          @click=${() => this._fire("reset-click")}
        >
          <ha-icon icon="mdi:delete-sweep"></ha-icon>
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "app-header": AppHeader;
  }
}
