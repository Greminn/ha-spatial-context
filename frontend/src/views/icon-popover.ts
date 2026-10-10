import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import { sharedStyles } from "../styles";

/** An icon button that toggles a floating dropdown of arbitrary slotted
 * content — shared by the header's background/mesh controls so each stays
 * out of the toolbar until opened. Open/closed state is owned by the
 * parent, matching every other component here. */
@safeCustomElement("icon-popover")
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
      /* The popover's feature is switched on (e.g. a network layer is
       * showing) even while the menu is closed. */
      .icon-button.highlight {
        color: var(--sc-accent);
      }
      /* Settings: a centred modal like HA's own dialogs — dimmed backdrop,
       * large radius; the content brings its own header, body and footer. */
      .scrim {
        position: fixed;
        inset: 0;
        z-index: 99;
        background: rgba(0, 0, 0, 0.32);
      }
      .modal {
        position: fixed;
        z-index: 100;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: min(560px, calc(100vw - 32px));
        max-height: calc(100vh - 32px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 28px;
        background: var(--sc-panel-bg);
        color: var(--sc-fg);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      }
      /* Compact: the row's own button style (40px rounded square). */
      :host([compact]) .icon-button {
        width: 40px;
        height: 40px;
        border: 1px solid var(--sc-divider);
        border-radius: 12px;
        background: var(--sc-panel-bg);
      }
      .modal ::slotted(*) {
        flex: 1 1 auto;
        min-height: 0;
      }
      .popover {
        /* Fixed, placed from the button's rect, so it isn't clipped by a
         * scrolling row it sits in. */
        position: fixed;
        z-index: 10;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
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
  @property({ type: Boolean }) dialog = false;
  @property({ type: Boolean }) highlight = false;
  @property({ type: Boolean, reflect: true }) compact = false;
  @state() private _top = 0;
  @state() private _right = 0;

  private _onKeyDown = (e: KeyboardEvent) => {
    if (this.open && this.dialog && e.key === "Escape") {
      e.stopPropagation();
      this.dispatchEvent(
        new CustomEvent("toggle", { bubbles: true, composed: true }),
      );
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._onKeyDown, true);
  }

  override disconnectedCallback() {
    window.removeEventListener("keydown", this._onKeyDown, true);
    super.disconnectedCallback();
  }

  override willUpdate(changed: PropertyValues) {
    if (changed.has("open") && this.open) {
      const button = this.renderRoot.querySelector(".icon-button");
      if (button) {
        const rect = button.getBoundingClientRect();
        this._top = rect.bottom + 8;
        this._right = Math.max(8, window.innerWidth - rect.right);
      }
    }
  }

  override render() {
    return html`
      <button
        class="icon-button ${this.open ? "active" : ""} ${this.highlight ? "highlight" : ""}"
        title=${this.label}
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent("toggle", { bubbles: true, composed: true }),
          )}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${
        this.open && this.dialog
          ? html`<div
                class="scrim"
                @click=${() =>
                  this.dispatchEvent(
                    new CustomEvent("toggle", {
                      bubbles: true,
                      composed: true,
                    }),
                  )}
              ></div>
              <div class="modal" role="dialog" aria-label=${this.label}>
                <slot></slot>
              </div>`
          : this.open
            ? html`<div
                class="popover floating-panel"
                style="top:${this._top}px; right:${this._right}px"
              >
                <slot></slot>
              </div>`
            : nothing
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "icon-popover": IconPopover;
  }
}
