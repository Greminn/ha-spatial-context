import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { FloorMeta } from "../types";
import { localize } from "../i18n";
import { sharedStyles } from "../styles";

/** Mirrors HA frontend's own `floorDefaultIcon` (components/ha-floor-icon.ts)
 * exactly — a floor's `icon` in the registry is very commonly null (most
 * users never set one explicitly), in which case HA's own Settings UI
 * doesn't fall back to anything generic, it derives a numbered
 * "home-floor-N" icon from the floor's `level`. Falling back to our own
 * generic mdi:floor-plan instead meant a floor showing a level-derived icon
 * everywhere else in HA (Settings, area cards, voice/dashboard floor
 * pickers) looked unset here even though nothing about it actually is. */
function floorIcon(floor: FloorMeta): string {
  if (floor.icon) return floor.icon;
  switch (floor.level) {
    case 0:
      return "mdi:home-floor-0";
    case 1:
      return "mdi:home-floor-1";
    case 2:
      return "mdi:home-floor-2";
    case 3:
      return "mdi:home-floor-3";
    case -1:
      return "mdi:home-floor-negative-1";
    default:
      return "mdi:home";
  }
}

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
        padding: 0 24px;
        font-size: 14px;
        font-weight: 400;
        letter-spacing: normal;
        text-transform: none;
        color: var(--sc-fg);
        border-bottom: 2px solid transparent;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      button ha-icon {
        --mdc-icon-size: 18px;
      }
      .divider {
        width: 1px;
        height: 24px;
        align-self: center;
        background: var(--sc-divider);
        margin: 0 4px;
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
  @property({ type: Boolean }) propertySelected = false;

  override render() {
    return html`
      ${this.floors.map(
        (floor) => html`
          <button
            class=${
              !this.propertySelected && floor.floor_id === this.selectedFloorId
                ? "active"
                : ""
            }
            @click=${() =>
              this.dispatchEvent(
                new CustomEvent("floor-selected", {
                  detail: { floorId: floor.floor_id },
                  bubbles: true,
                  composed: true,
                }),
              )}
          >
            <ha-icon icon=${floorIcon(floor)}></ha-icon>
            <span class=${floor.has_layout ? "" : "unset"}>${floor.name}</span>
          </button>
        `,
      )}
      <span class="divider"></span>
      <button
        class=${this.propertySelected ? "active" : ""}
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent("property-selected", {
              bubbles: true,
              composed: true,
            }),
          )}
      >
        <ha-icon icon="mdi:map"></ha-icon>
        <span>${localize("floorTabs.property")}</span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "floor-tabs": FloorTabs;
  }
}
