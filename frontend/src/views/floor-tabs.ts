import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { FloorMeta } from "../types";
import { sharedStyles } from "../styles";

@customElement("floor-tabs")
export class FloorTabs extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        height: 100%;
      }
      button {
        height: 100%;
        border-radius: 0;
        padding: 0 32px;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: normal;
        text-transform: none;
        color: var(--sc-fg);
        border-bottom: 2px solid transparent;
      }
      button:hover {
        background: transparent;
        color: var(--sc-fg);
      }
      button.active {
        background: transparent;
        color: var(--sc-accent);
        border-bottom-color: var(--sc-accent);
      }
      button.active:hover {
        background: transparent;
        color: var(--sc-accent);
      }
      .unset {
        opacity: 0.6;
        font-style: italic;
      }
    `,
  ];

  @property({ attribute: false }) floors: FloorMeta[] = [];
  @property({ attribute: false }) selectedFloorId: string | null = null;

  override render() {
    return html`
      ${this.floors.map(
        (floor) => html`
          <button
            class=${floor.floor_id === this.selectedFloorId ? "active" : ""}
            @click=${() =>
              this.dispatchEvent(
                new CustomEvent("floor-selected", {
                  detail: { floorId: floor.floor_id },
                  bubbles: true,
                  composed: true,
                }),
              )}
          >
            <span class=${floor.has_layout ? "" : "unset"}>${floor.name}</span>
          </button>
        `,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "floor-tabs": FloorTabs;
  }
}
