import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import { sharedStyles } from "../styles";

/** An icon button that toggles a floating dropdown of arbitrary slotted
 * content — shared by the header's background/mesh controls so each stays
 * out of the toolbar until opened. Open/closed state is owned by the
 * parent, matching every other component here: a press anywhere outside
 * asks the parent to close it by firing the same `toggle` as the button. */
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
        background: var(--sc-hover);
      }
      /* The popover's feature is switched on (e.g. a network layer is
       * showing) even while the menu is closed. */
      .icon-button.highlight {
        color: var(--sc-accent);
      }
      /* Compact: the row's own button style (40px rounded square). */
      :host([compact]) .icon-button {
        width: 40px;
        height: var(--sc-h-control);
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-panel-bg);
      }
      .popover {
        /* Fixed, placed from the button's rect, so it isn't clipped by a
         * scrolling row it sits in. */
        position: fixed;
        z-index: 10;
        max-height: calc(100vh - 80px);
        overflow-y: auto;
        min-width: 240px;
        padding: var(--ha-space-2, 8px);
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    `,
  ];

  @property() icon = "";
  @property() label = "";
  @property({ type: Boolean }) open = false;
  @property({ type: Boolean }) highlight = false;
  @property({ type: Boolean, reflect: true }) compact = false;
  @state() private _top = 0;
  @state() private _right = 0;

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

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this._onOutsidePress, true);
  }

  override updated(changed: PropertyValues) {
    if (!changed.has("open")) return;
    document.removeEventListener("pointerdown", this._onOutsidePress, true);
    if (this.open) {
      document.addEventListener("pointerdown", this._onOutsidePress, true);
    }
  }

  private _onOutsidePress = (event: PointerEvent) => {
    if (event.composedPath().includes(this)) return;
    this.dispatchEvent(
      new CustomEvent("toggle", { bubbles: true, composed: true }),
    );
  };

  override render() {
    return html`
      <button
        class="icon-button ${this.open ? "active" : ""} ${this.highlight ? "highlight" : ""}"
        title=${this.label}
        aria-label=${this.label}
        aria-expanded=${this.open ? "true" : "false"}
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent("toggle", { bubbles: true, composed: true }),
          )}
      >
        <ha-icon icon=${this.icon}></ha-icon>
      </button>
      ${
        this.open
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
