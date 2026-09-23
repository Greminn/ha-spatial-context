import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { PropertyPlacement } from "../types";
import { sharedStyles } from "../styles";

/** One "building" the Property tab can place a footprint for — floors
 * sharing a building_id collapse to one entry here (see panel.ts's
 * `_buildings`); a standalone floor (never aligned, e.g. a detached
 * Garage) is its own entry. */
export interface PropertyBuilding {
  key: string;
  name: string;
  icon: string;
  floorId: string;
  buildingId: string | null;
  /** width/height ratio of this building's traced footprint (union of
   * every floor sharing its building_id) — locked onto any placement
   * created for it, see ha-client.ts's newPlacement. */
  aspectRatio: number;
}

/** Everything that floats over the Property canvas: a small mode toolbar
 * (Select / pick-a-building-to-place) top-left, and a selection context
 * panel bottom-left when a placement is selected. Mirrors canvas-overlay.ts's
 * floating-panel pattern but scoped to the Property tab's much smaller
 * surface (no rooms/walls/openings/mesh — just placements). */
@customElement("property-overlay")
export class PropertyOverlay extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .mode-toolbar {
        position: absolute;
        top: 12px;
        left: 12px;
        display: flex;
        gap: 6px;
        align-items: center;
        pointer-events: auto;
      }
      .mode-toolbar button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
      }
      .mode-toolbar ha-icon,
      .selection-panel ha-icon {
        --mdc-icon-size: 20px;
      }
      .mode-toolbar button.active {
        background: var(--sc-accent);
        color: white;
      }
      .place-picker {
        border: 1px solid var(--sc-divider);
        border-radius: 4px;
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-family: inherit;
        font-size: 0.875rem;
        padding: 6px 8px;
      }
      .selection-panel {
        position: absolute;
        bottom: 12px;
        left: 12px;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        pointer-events: auto;
      }
      .hint {
        font-size: 0.8rem;
        color: var(--sc-fg-secondary);
      }
    `,
  ];

  @property({ attribute: false }) mode: "select" | "place" = "select";
  @property({ attribute: false }) buildings: PropertyBuilding[] = [];
  @property({ attribute: false }) armedBuildingKey: string | null = null;
  @property({ attribute: false }) selectedPlacement: PropertyPlacement | null =
    null;
  @property({ attribute: false }) floorNameById: Map<string, string> =
    new Map();

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  private _selectedLabel(): string {
    const p = this.selectedPlacement;
    if (!p) return "";
    return p.label_override || this.floorNameById.get(p.floor_id) || p.floor_id;
  }

  override render() {
    return html`
      <div class="mode-toolbar floating-panel">
        <button
          class=${this.mode === "select" ? "active" : ""}
          title="Select"
          @click=${() => this._fire("property-mode-change", { mode: "select" })}
        >
          <ha-icon icon="mdi:cursor-default-click"></ha-icon>
        </button>
        <select
          class="place-picker"
          title="Place a building's footprint"
          .value=${this.armedBuildingKey ?? ""}
          @change=${(e: Event) => {
            const key = (e.target as HTMLSelectElement).value;
            if (key) this._fire("placement-arm", { key });
          }}
        >
          <option value="">Place building…</option>
          ${this.buildings.map(
            (b) => html`<option value=${b.key}>${b.name}</option>`,
          )}
        </select>
      </div>

      ${
        this.selectedPlacement
          ? html`
              <div class="selection-panel floating-panel">
                <span class="hint">${this._selectedLabel()}</span>
                <button
                  title="Go to floor"
                  @click=${() => this._fire("placement-goto-floor-click")}
                >
                  <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
                </button>
                <button
                  title="Rename"
                  @click=${() => this._fire("placement-rename-click")}
                >
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button
                  class="danger"
                  title="Delete placement"
                  @click=${() => this._fire("placement-delete-click")}
                >
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>
              </div>
            `
          : nothing
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "property-overlay": PropertyOverlay;
  }
}
