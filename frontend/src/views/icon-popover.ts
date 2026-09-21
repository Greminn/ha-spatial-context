import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sharedStyles } from "../styles";

/** An icon button that toggles a floating dropdown of arbitrary slotted
 * content — shared by the header's background/mesh controls so each stays
 * out of the toolbar until opened. Open/closed state is owned by the
 * parent, matching every other component here. */
@customElement("icon-popover")
export class IconPopover extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        position: relative;
        display: inline-flex;
      }
      .icon-button {
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
      .popover {
        position: absolute;
        top: 100%;
        right: 0;
        z-index: 10;
        margin-top: 8px;
        min-width: 240px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    `,
  ];

  @property() icon = "";
  @property() label = "";
  @property({ type: Boolean }) open = false;

  override render() {
    return html`
      <button
        class="icon-button ${this.open ? "active" : ""}"
        title=${this.label}
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent("toggle", { bubbles: true, composed: true }),
          )}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${this.open ? html`<div class="popover floating-panel"><slot></slot></div>` : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "icon-popover": IconPopover;
  }
}
