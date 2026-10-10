import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import { localize } from "../i18n";
import { sharedStyles } from "../styles";

/** Undo, redo and save — the right-hand end of the controls row (see
 * styles.ts's toolRowStyles). Events bubble up to the panel, which owns the
 * history and the save. */
@safeCustomElement("row-actions")
export class RowActions extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      button {
        position: relative;
        display: grid;
        place-items: center;
        width: 40px;
        height: var(--sc-h-control);
        padding: 0;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-panel-bg);
      }
      button:disabled {
        background: var(--sc-panel-bg);
      }
      ha-icon {
        --mdc-icon-size: 20px;
      }
      .dirty-dot {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--sc-danger);
      }
    `,
  ];

  @property({ type: Boolean }) dirty = false;
  @property({ type: Boolean }) saving = false;
  @property({ type: Boolean }) canUndo = false;
  @property({ type: Boolean }) canRedo = false;

  private _fire(name: string) {
    this.dispatchEvent(
      new CustomEvent(name, { bubbles: true, composed: true }),
    );
  }

  override render() {
    return html`
      <button
        title=${localize("rowActions.undo")}
        ?disabled=${!this.canUndo}
        @click=${() => this._fire("undo-click")}
      >
        <ha-icon icon="mdi:undo"></ha-icon>
      </button>
      <button
        title=${localize("rowActions.redo")}
        ?disabled=${!this.canRedo}
        @click=${() => this._fire("redo-click")}
      >
        <ha-icon icon="mdi:redo"></ha-icon>
      </button>
      <button
        title=${
          this.saving
            ? localize("appHeader.saving")
            : localize("appHeader.save")
        }
        ?disabled=${this.saving}
        @click=${() => this._fire("save-click")}
      >
        <ha-icon icon="mdi:content-save"></ha-icon>
        ${this.dirty ? html`<span class="dirty-dot"></span>` : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "row-actions": RowActions;
  }
}
