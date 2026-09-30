import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import type { PropertyMeshLink, PropertyPlacement } from "../types";
import { qualityColor } from "../canvas/mesh-colors";
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
 * surface — placements, outdoor device pins and their mesh lines. */
@safeCustomElement("property-overlay")
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

  @property({ attribute: false }) mode: "select" | "place" | "place-pin" =
    "select";
  /** Display name of the selected outdoor device pin, or null. */
  @property({ attribute: false }) selectedPinLabel: string | null = null;
  @property({ attribute: false }) selectedMeshLink: PropertyMeshLink | null =
    null;
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

  private _renderPinPanel() {
    if (this.selectedPinLabel === null) return nothing;
    return html`
      <div class="selection-panel floating-panel">
        <ha-icon icon="mdi:map-marker"></ha-icon>
        <span class="hint">${this.selectedPinLabel}</span>
        <button
          title="Rename"
          @click=${() => this._fire("outdoor-pin-rename-click")}
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </button>
        <button
          title="Set icon"
          @click=${() => this._fire("outdoor-pin-icon-click")}
        >
          <ha-icon icon="mdi:shape"></ha-icon>
        </button>
        <button
          class="danger"
          title="Remove from the property"
          @click=${() => this._fire("outdoor-pin-delete-click")}
        >
          <ha-icon icon="mdi:delete"></ha-icon>
        </button>
      </div>
    `;
  }

  private _renderMeshLinkPanel() {
    const link = this.selectedMeshLink;
    if (!link) return nothing;
    const indoorEnd = [link.from, link.to].find((end) => end.floorId !== null);
    return html`
      <div class="selection-panel floating-panel">
        <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
        <span class="hint">${link.from.label} → ${link.to.label}</span>
        <span class="hint" style="color:${qualityColor(link.quality)}"
          >${link.detail ?? link.quality}</span
        >
        ${
          indoorEnd
            ? html`<button
                title="Go to ${indoorEnd.label}'s floor"
                @click=${() =>
                  this._fire("property-mesh-goto-floor-click", {
                    floorId: indoorEnd.floorId,
                  })}
              >
                <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
              </button>`
            : nothing
        }
      </div>
    `;
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
        <button
          class=${this.mode === "place-pin" ? "active" : ""}
          title="Place an outdoor device"
          @click=${() =>
            this._fire("property-mode-change", {
              mode: this.mode === "place-pin" ? "select" : "place-pin",
            })}
        >
          <ha-icon icon="mdi:map-marker-plus"></ha-icon>
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

      ${this._renderPinPanel()} ${this._renderMeshLinkPanel()}
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
