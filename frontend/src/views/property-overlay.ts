import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import type { PropertyMeshLink, PropertyPlacement } from "../types";
import { qualityColor } from "../canvas/mesh-colors";
import { selectStyles, sharedStyles, toolRowStyles } from "../styles";
import "./row-actions";
import { meshLegendStyles, renderMeshLegend } from "./mesh-legend";
import { localize } from "../i18n";

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
    selectStyles,
    toolRowStyles,
    meshLegendStyles,
    css`
      :host {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .mode-toolbar {
        pointer-events: auto;
      }
      .mode-toolbar button {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        border-radius: 10px;
      }
      .tool-divider {
        align-self: stretch;
        width: 1px;
        margin: 6px 4px;
        background: var(--sc-divider);
      }
      .mode-toolbar ha-icon,
      .selection-panel ha-icon {
        --mdc-icon-size: 20px;
      }
      .mode-toolbar button.active {
        background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
        color: var(--sc-accent);
      }
      .mode-toolbar button.active ha-icon {
        color: var(--sc-accent);
      }
      .place-picker {
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-family: inherit;
        font-size: var(--sc-fs-body);
        padding: 6px 14px;
      }
      .scale-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        max-width: 260px;
        border-radius: var(--sc-r-control);
        padding: 8px 14px;
        font-size: var(--sc-fs-small);
        color: var(--sc-fg-secondary);
        pointer-events: auto;
      }
      .scale-warning {
        --mdc-icon-size: 16px;
        vertical-align: text-bottom;
        color: var(--warning-color, #db8b00);
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
        font-size: var(--sc-fs-small);
        color: var(--sc-fg-secondary);
      }
    `,
  ];

  @property({ attribute: false }) mode:
    "select" | "place" | "place-pin" | "map" = "select";
  /** Whether a street map is on, which is what "Move map" adjusts. */
  @property({ attribute: false }) mapActive = false;
  @property({ attribute: false }) mapRotation = 0;
  /** Display name of the selected outdoor device pin, or null. */
  @property({ attribute: false }) selectedPinLabel: string | null = null;
  /** Show the weak → strong key along the bottom (a network layer is on). */
  @property({ type: Boolean }) dirty = false;
  @property({ type: Boolean }) saving = false;
  @property({ type: Boolean }) canUndo = false;
  @property({ type: Boolean }) canRedo = false;
  @property({ type: Boolean }) meshLegend = false;
  @property({ attribute: false }) selectedMeshLink: PropertyMeshLink | null =
    null;
  @property({ attribute: false }) buildings: PropertyBuilding[] = [];
  /** Derived from a placed, calibrated building (see panel.ts's
   * _propertyScale) — null when there isn't one. */
  @property({ attribute: false }) scaleReadout: string | null = null;
  @property({ attribute: false }) scaleWarning: string | null = null;
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
          title=${localize("property.rename")}
          @click=${() => this._fire("outdoor-pin-rename-click")}
        >
          <ha-icon icon="mdi:pencil"></ha-icon>
        </button>
        <button
          title=${localize("property.setIcon")}
          @click=${() => this._fire("outdoor-pin-icon-click")}
        >
          <ha-icon icon="mdi:shape"></ha-icon>
        </button>
        <button
          class="danger"
          title=${localize("property.removeFromProperty")}
          @click=${() => this._fire("outdoor-pin-delete-click")}
        >
          <ha-icon icon="mdi:delete"></ha-icon>
        </button>
      </div>
    `;
  }

  /** Controls for lining the map up with the buildings: the map itself is
   * dragged on the canvas (Ctrl+scroll or pinch to zoom). */
  private _renderMapPanel() {
    if (this.mode !== "map") return nothing;
    const rotation = Math.round(this.mapRotation * 10) / 10;
    const setRotation = (deg: number) =>
      this._fire("map-rotation-set", { deg });
    return html`
      <div class="selection-panel floating-panel">
        <span class="hint">${localize("mapBackground.adjustHint")}</span>
        <button
          title=${localize("mapBackground.zoomOut")}
          @click=${() => this._fire("map-zoom-step", { factor: 1 / 1.1 })}
        >
          <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
        </button>
        <button
          title=${localize("mapBackground.zoomIn")}
          @click=${() => this._fire("map-zoom-step", { factor: 1.1 })}
        >
          <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
        </button>
        <span class="hint">${localize("mapBackground.rotation")}</span>
        <input
          type="range"
          min="-180"
          max="180"
          step="0.5"
          .value=${String(rotation)}
          @input=${(e: Event) =>
            setRotation(Number((e.target as HTMLInputElement).value))}
        />
        <input
          type="number"
          style="width: 4.5em"
          min="-180"
          max="180"
          step="0.5"
          .value=${String(rotation)}
          @change=${(e: Event) => {
            const deg = Number((e.target as HTMLInputElement).value);
            if (Number.isFinite(deg)) setRotation(deg);
          }}
        />°
        <button
          title=${localize("mapBackground.resetRotation")}
          @click=${() => setRotation(0)}
        >
          <ha-icon icon="mdi:compass-outline"></ha-icon>
        </button>
        <button
          class="primary"
          @click=${() => this._fire("property-mode-change", { mode: "select" })}
        >
          ${localize("mapBackground.done")}
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
                title=${localize("property.goToFloorOf", { name: indoorEnd.label })}
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
      <div class="tool-row">
        <div class="mode-toolbar">
          <button
            class=${this.mode === "select" ? "active" : ""}
            title=${localize("property.select")}
            @click=${() => this._fire("property-mode-change", { mode: "select" })}
          >
            <ha-icon icon="mdi:cursor-default-click"></ha-icon>
          </button>
          <button
            class=${this.mode === "place-pin" ? "active" : ""}
            title=${localize("property.placeOutdoor")}
            @click=${() =>
              this._fire("property-mode-change", {
                mode: this.mode === "place-pin" ? "select" : "place-pin",
              })}
          >
            <ha-icon icon="mdi:map-marker-plus"></ha-icon>
          </button>
          ${
            this.mapActive
              ? html`<button
                  class=${this.mode === "map" ? "active" : ""}
                  title=${localize("mapBackground.adjust")}
                  @click=${() =>
                    this._fire("property-mode-change", {
                      mode: this.mode === "map" ? "select" : "map",
                    })}
                >
                  <ha-icon icon="mdi:map-search"></ha-icon>
                </button>`
              : nothing
          }
          <span class="tool-divider"></span>
          <span class="select-wrap"
            ><select
              class="place-picker"
              title=${localize("property.placeBuildingTip")}
              .value=${this.armedBuildingKey ?? ""}
              @change=${(e: Event) => {
                const key = (e.target as HTMLSelectElement).value;
                if (key) this._fire("placement-arm", { key });
              }}
            >
              <option value="">${localize("property.placeBuilding")}</option>
              ${this.buildings.map(
                (b) => html`<option value=${b.key}>${b.name}</option>`,
              )}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
        </div>

        <div
          class="scale-badge floating-panel"
          title=${
            this.scaleWarning ??
            (this.scaleReadout
              ? "Worked out from a placed building's floor scale"
              : "Set Scale on a floor, then place its building here")
          }
        >
          ${
            this.scaleWarning
              ? html`<ha-icon class="scale-warning" icon="mdi:alert"></ha-icon>`
              : nothing
          }
          ${this.scaleReadout ?? localize("property.notCalibrated")}
        </div>
        <slot name="row-end"></slot>
        <row-actions
          .dirty=${this.dirty}
          .saving=${this.saving}
          .canUndo=${this.canUndo}
          .canRedo=${this.canRedo}
        ></row-actions>
      </div>

      ${this.meshLegend && this.mode !== "map" ? renderMeshLegend() : nothing}
      ${this._renderMapPanel()} ${this._renderPinPanel()}
      ${this._renderMeshLinkPanel()}
      ${
        this.selectedPlacement
          ? html`
              <div class="selection-panel floating-panel">
                <span class="hint">${this._selectedLabel()}</span>
                <button
                  title=${localize("property.goToFloor")}
                  @click=${() => this._fire("placement-goto-floor-click")}
                >
                  <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
                </button>
                <button
                  title=${localize("property.rename")}
                  @click=${() => this._fire("placement-rename-click")}
                >
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button
                  class="danger"
                  title=${localize("property.deletePlacement")}
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
