import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type {
  AreaMeta,
  CanvasMode,
  FloorMeta,
  Opening,
  PlaceableEntity,
  Pin,
  ResolvedMeshLink,
  ResolvedMeshStub,
  Room,
  UnitSystem,
  Wall,
} from "../types";
import { WALL_MATERIALS, wallThicknessCm } from "../canvas/materials";
import { pinDisplayLabel } from "../canvas/device-display";
import { qualityColor } from "../canvas/mesh-colors";
import {
  canvasUnitsToDisplayAs,
  defaultSmallSubUnit,
  displayToCanvasUnitsAs,
  formatSmallAs,
  parseSmallAs,
  smallSubUnitsFor,
  type SmallSubUnit,
} from "../units";
import { sharedStyles } from "../styles";

/** Everything that floats over the canvas, Innerspace-style, instead of
 * pushing it down: the drawing-mode toolbar (top-left), the scale readout
 * (top-right), and the selection/context panel (bottom-left, only present
 * when something's selected). One host spanning the canvas area so each
 * piece can be positioned independently within it. */
@customElement("canvas-overlay")
export class CanvasOverlay extends LitElement {
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
        gap: 2px;
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
      .selection-panel ha-icon,
      .pin-stack ha-icon {
        --mdc-icon-size: 20px;
      }
      .mode-toolbar button.active {
        background: var(--sc-accent);
        color: white;
      }
      .hint-bar {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
      }
      .scale-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        padding: 6px 12px;
        font-size: 0.8125rem;
        color: var(--sc-fg-secondary);
        pointer-events: auto;
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
      .wall-thickness {
        width: 52px;
      }
      .small-unit-select {
        width: 52px;
        padding: 4px;
      }
      .pin-stack {
        position: absolute;
        bottom: 12px;
        left: 12px;
        display: flex;
        flex-direction: column;
        min-width: 220px;
        padding: 4px;
        pointer-events: auto;
      }
      .pin-stack .stack-title {
        padding: 6px 8px 4px;
        font-size: 0.75rem;
        color: var(--sc-fg-secondary);
      }
      .pin-stack button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 8px;
        width: 100%;
        text-align: left;
        padding: 8px;
        border-radius: 6px;
      }
      .pin-stack-row {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .pin-stack-row .pin-stack-choose {
        flex: 1;
        min-width: 0;
      }
      .pin-stack-row .pin-stack-remove {
        flex-shrink: 0;
        width: 32px;
        justify-content: center;
        color: var(--sc-danger);
      }
      .pin-stack-row .pin-stack-remove ha-icon {
        --mdc-icon-size: 18px;
      }
    `,
  ];

  @property({ attribute: false }) mode: CanvasMode = "select";
  @property({ attribute: false }) armedOpeningType: "door" | "window" | null =
    null;
  @property({ type: Boolean }) hasPendingTrace = false;
  @property({ type: Boolean }) hasPendingWall = false;
  @property({ type: Number }) pendingScaleCount = 0;
  @property({ attribute: false }) scaleReadout: string | null = null;

  @property({ attribute: false }) selectedRoom: Room | null = null;
  @property({ type: Boolean }) editingRoom = false;
  @property({ attribute: false }) areas: AreaMeta[] = [];
  @property({ attribute: false }) selectedPin: Pin | null = null;
  @property({ attribute: false }) selectedWall: Wall | null = null;
  @property({ type: Boolean }) editingWall = false;
  @property({ attribute: false }) unitSystem: UnitSystem = "metric";
  /** Canvas units per real metre, from the current floor's Scale
   * calibration — null when uncalibrated. Only needed for opening width
   * (see displayToCanvasUnitsAs), since thickness_cm/height_m are already
   * absolute real values. */
  @property({ type: Number }) unitsPerMeter: number | null = null;
  @property({ attribute: false }) pinStack: Pin[] | null = null;
  @property({ attribute: false }) entityLookup: Map<string, PlaceableEntity> =
    new Map();
  @property({ attribute: false }) selectedOpening: Opening | null = null;
  @property({ attribute: false }) selectedMeshLink: ResolvedMeshLink | null =
    null;
  @property({ attribute: false }) selectedMeshStub: ResolvedMeshStub | null =
    null;

  @property({ attribute: false }) otherFloors: FloorMeta[] = [];
  @property({ attribute: false }) alignTargetFloorId: string | null = null;
  @property({ type: Boolean }) alignTargetHasBackground = true;

  /** Which of the system's two sub-units (cm/m, or in/ft) the wall
   * thickness / opening width inputs currently display in — null means
   * "use the system default" (defaultSmallSubUnit). Reset to null
   * whenever a *different* wall/opening gets selected (see willUpdate)
   * so a fresh selection always starts from the default, but switching
   * units on the currently-selected one sticks until you select something
   * else. */
  @state() private _wallThicknessUnit: SmallSubUnit | null = null;
  @state() private _openingWidthUnit: SmallSubUnit | null = null;

  override willUpdate(changed: PropertyValues<this>) {
    if (
      changed.has("selectedWall") &&
      changed.get("selectedWall")?.id !== this.selectedWall?.id
    ) {
      this._wallThicknessUnit = null;
    }
    if (
      changed.has("selectedOpening") &&
      changed.get("selectedOpening")?.id !== this.selectedOpening?.id
    ) {
      this._openingWidthUnit = null;
    }
  }

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  /** cm/m or in/ft picker for a "small" quantity input (wall thickness,
   * opening width) — the value itself round-trips through units.ts's
   * formatSmallAs/parseSmallAs, this only ever changes which sub-unit is
   * displayed, never the underlying stored value. */
  private _unitSelect(
    current: SmallSubUnit,
    onSelect: (unit: SmallSubUnit) => void,
  ) {
    return html`
      <select
        class="small-unit-select"
        @change=${(e: Event) =>
          onSelect((e.target as HTMLSelectElement).value as SmallSubUnit)}
      >
        ${smallSubUnitsFor(this.unitSystem).map(
          (unit) =>
            html`<option value=${unit} ?selected=${unit === current}>
              ${unit}
            </option>`,
        )}
      </select>
    `;
  }

  /** Cosmetic number-input bounds per sub-unit — the underlying value is
   * validated for finite/>0 in the @change handlers regardless, these
   * just keep the spinner/step sane for each unit's typical range. */
  private _thicknessInputAttrs(unit: SmallSubUnit): {
    min: string;
    max: string;
    step: string;
  } {
    switch (unit) {
      case "cm":
        return { min: "1", max: "100", step: "0.5" };
      case "m":
        return { min: "0.01", max: "1", step: "0.01" };
      case "in":
        return { min: "0.5", max: "40", step: "0.1" };
      case "ft":
        return { min: "0.02", max: "1.5", step: "0.01" };
    }
  }

  private _modeButton(mode: CanvasMode, icon: string, label: string) {
    return html`<button
      class=${this.mode === mode ? "active" : ""}
      title=${label}
      @click=${() => this._fire("mode-change", { mode })}
    >
      <ha-icon icon=${icon}></ha-icon>
    </button>`;
  }

  private _openingModeButton(
    openingType: "door" | "window",
    icon: string,
    label: string,
  ) {
    const active =
      this.mode === "opening" && this.armedOpeningType === openingType;
    return html`<button
      class=${active ? "active" : ""}
      title=${label}
      @click=${() => this._fire("add-opening-click", { openingType })}
    >
      <ha-icon icon=${icon}></ha-icon>
    </button>`;
  }

  private _renderModeToolbar() {
    return html`
      <div class="mode-toolbar floating-panel">
        ${this._modeButton("select", "mdi:cursor-default-click", "Select")}
        ${this._modeButton("pan", "mdi:hand-back-right-outline", "Pan")}
        ${this._modeButton("trace", "mdi:vector-square", "Trace Room")}
        ${this._modeButton("wall", "mdi:wall", "Trace Wall")}
        ${this._openingModeButton("door", "mdi:door", "Add Door")}
        ${this._openingModeButton("window", "mdi:window-closed-variant", "Add Window")}
        ${this._modeButton("scale", "mdi:ruler", "Set Scale")}
        ${this._modeButton("place", "mdi:map-marker-plus", "Place Device")}
        ${this._modeButton("align", "mdi:compare", "Align Floors")}
      </div>
    `;
  }

  private _renderHintBar() {
    if (this.mode === "trace" && this.hasPendingTrace) {
      return html`<div class="hint-bar floating-panel">
        <span class="hint">Click near the start to close the room.</span>
        <button @click=${() => this._fire("cancel-pending-click")}>
          Cancel
        </button>
      </div>`;
    }
    if (this.mode === "wall") {
      return html`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click to add
          points${this.hasPendingWall ? ", then Finish." : "."}</span
        >
        ${
          this.hasPendingWall
            ? html`<button
                class="primary"
                @click=${() => this._fire("finish-wall-click")}
              >
                Finish Wall
              </button>`
            : nothing
        }
        ${
          this.hasPendingWall
            ? html`<button @click=${() => this._fire("cancel-pending-click")}>
                Cancel
              </button>`
            : nothing
        }
      </div>`;
    }
    if (this.mode === "scale") {
      return html`<div class="hint-bar floating-panel">
        <span class="hint"
          >${
            this.pendingScaleCount === 0
              ? "Click the first point of a known distance."
              : "Click the second point."
          }</span
        >
        ${
          this.pendingScaleCount > 0
            ? html`<button @click=${() => this._fire("cancel-pending-click")}>
                Cancel
              </button>`
            : nothing
        }
      </div>`;
    }
    if (this.mode === "opening") {
      return html`<div class="hint-bar floating-panel">
        <span class="hint"
          >Click on a wall to place a
          ${this.armedOpeningType ?? "opening"}.</span
        >
      </div>`;
    }
    if (this.mode === "align") {
      return this._renderAlignBar();
    }
    return nothing;
  }

  private _renderAlignBar() {
    if (!this.alignTargetFloorId) {
      return html`<div class="hint-bar floating-panel">
        <span class="hint">Align against:</span>
        <select
          @change=${(e: Event) =>
            this._fire("align-target-change", {
              floorId: (e.target as HTMLSelectElement).value,
            })}
        >
          <option value="" selected>— Choose a floor —</option>
          ${this.otherFloors.map(
            (f) => html`<option value=${f.floor_id}>${f.name}</option>`,
          )}
        </select>
        <button @click=${() => this._fire("align-cancel-click")}>Cancel</button>
      </div>`;
    }
    if (!this.alignTargetHasBackground) {
      return html`<div class="hint-bar floating-panel">
        <span class="hint"
          >That floor has no background image to align against.</span
        >
        <button
          @click=${() => this._fire("align-target-change", { floorId: null })}
        >
          Choose another
        </button>
        <button @click=${() => this._fire("align-cancel-click")}>Cancel</button>
      </div>`;
    }
    return html`<div class="hint-bar floating-panel">
      <span class="hint">Drag to move, use +/− to resize, then Apply.</span>
      <button
        title="Shrink overlay slightly"
        @click=${() => this._fire("align-scale-click", { factor: 0.995 })}
      >
        −
      </button>
      <button
        title="Grow overlay slightly"
        @click=${() => this._fire("align-scale-click", { factor: 1.0050251 })}
      >
        +
      </button>
      <button class="primary" @click=${() => this._fire("align-apply-click")}>
        Apply
      </button>
      <button @click=${() => this._fire("align-cancel-click")}>Cancel</button>
    </div>`;
  }

  private _renderSelectionPanel() {
    if (this.selectedRoom) {
      const room = this.selectedRoom;
      return html`
        <div class="selection-panel floating-panel">
          <span class="hint">${room.name}</span>
          <select
            @change=${(e: Event) =>
              this._fire("room-area-change", {
                areaId: (e.target as HTMLSelectElement).value,
              })}
          >
            <option value="" ?selected=${!room.area_id}>— Custom —</option>
            ${this.areas.map(
              (a) =>
                html`<option
                  value=${a.area_id}
                  ?selected=${a.area_id === room.area_id}
                >
                  ${a.name}
                </option>`,
            )}
          </select>
          <button
            title="Rename"
            @click=${() => this._fire("room-rename-click")}
          >
            <ha-icon icon="mdi:pencil"></ha-icon>
          </button>
          <button
            title=${this.editingRoom ? "Done editing" : "Edit vertices"}
            class=${this.editingRoom ? "active" : ""}
            @click=${() => this._fire("room-edit-vertices-click")}
          >
            <ha-icon icon="mdi:vector-polygon"></ha-icon>
          </button>
          <button
            class="danger"
            title="Delete room"
            @click=${() => this._fire("room-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `;
    }
    if (this.selectedPin) {
      const pin = this.selectedPin;
      return html`
        <div class="selection-panel floating-panel">
          <span class="hint">${this._pinLabel(pin)}</span>
          <button
            title="Set label"
            @click=${() => this._fire("pin-set-label-click")}
          >
            <ha-icon icon="mdi:tag-text"></ha-icon>
          </button>
          <button
            title="Set icon"
            @click=${() => this._fire("pin-set-icon-click")}
          >
            <ha-icon icon="mdi:shape"></ha-icon>
          </button>
          <button
            title="Set height"
            @click=${() => this._fire("pin-set-height-click")}
          >
            <ha-icon icon="mdi:human-male-height"></ha-icon>
          </button>
          <button
            class="danger"
            title="Delete pin"
            @click=${() => this._fire("pin-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `;
    }
    if (this.selectedWall) {
      const wall = this.selectedWall;
      const wallUnit =
        this._wallThicknessUnit ?? defaultSmallSubUnit(this.unitSystem);
      const wallAttrs = this._thicknessInputAttrs(wallUnit);
      return html`
        <div class="selection-panel floating-panel">
          <span class="hint">Wall material</span>
          <select
            @change=${(e: Event) =>
              this._fire("wall-material-change", {
                material: (e.target as HTMLSelectElement).value,
              })}
          >
            ${WALL_MATERIALS.map(
              (m) =>
                html`<option value=${m.id} ?selected=${m.id === wall.material}>
                  ${m.label}
                </option>`,
            )}
          </select>
          <input
            type="number"
            class="wall-thickness"
            title="Wall thickness (${wallUnit})"
            min=${wallAttrs.min}
            max=${wallAttrs.max}
            step=${wallAttrs.step}
            .value=${formatSmallAs(wallThicknessCm(wall), wallUnit)}
            @change=${(e: Event) => {
              const cm = parseSmallAs(
                (e.target as HTMLInputElement).value,
                wallUnit,
              );
              if (cm === null || !Number.isFinite(cm) || cm <= 0) return;
              this._fire("wall-thickness-change", { thicknessCm: cm });
            }}
          />
          ${this._unitSelect(
            wallUnit,
            (unit) => (this._wallThicknessUnit = unit),
          )}
          <button
            title=${this.editingWall ? "Done editing" : "Edit vertices"}
            class=${this.editingWall ? "active" : ""}
            @click=${() => this._fire("wall-edit-vertices-click")}
          >
            <ha-icon icon="mdi:vector-polygon"></ha-icon>
          </button>
          <button
            class="danger"
            title="Delete wall"
            @click=${() => this._fire("wall-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `;
    }
    if (this.selectedOpening) {
      const opening = this.selectedOpening;
      const openingUnit =
        this._openingWidthUnit ?? defaultSmallSubUnit(this.unitSystem);
      const openingAttrs = this._thicknessInputAttrs(openingUnit);
      const unitsPerMeter = this.unitsPerMeter;
      return html`
        <div class="selection-panel floating-panel">
          <span class="hint">${opening.type}</span>
          <input
            type="number"
            class="wall-thickness"
            title="Width (${unitsPerMeter !== null ? openingUnit : "stored units"})"
            min=${unitsPerMeter !== null ? openingAttrs.min : "1"}
            step=${unitsPerMeter !== null ? openingAttrs.step : "1"}
            .value=${
              unitsPerMeter !== null
                ? canvasUnitsToDisplayAs(
                    opening.width,
                    unitsPerMeter,
                    openingUnit,
                  )
                : String(opening.width)
            }
            @change=${(e: Event) => {
              const raw = (e.target as HTMLInputElement).value;
              const width =
                unitsPerMeter !== null
                  ? displayToCanvasUnitsAs(raw, unitsPerMeter, openingUnit)
                  : Number(raw);
              if (width === null || !Number.isFinite(width) || width <= 0)
                return;
              this._fire("opening-width-change", { width });
            }}
          />
          ${
            unitsPerMeter !== null
              ? this._unitSelect(
                  openingUnit,
                  (unit) => (this._openingWidthUnit = unit),
                )
              : html`<span class="hint">Calibrate Scale for real units</span>`
          }
          <button
            class="danger"
            title="Delete"
            @click=${() => this._fire("opening-delete-click")}
          >
            <ha-icon icon="mdi:delete"></ha-icon>
          </button>
        </div>
      `;
    }
    if (this.selectedMeshLink) {
      const link = this.selectedMeshLink;
      return html`
        <div class="selection-panel floating-panel">
          <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
          <span class="hint"
            >${this._pinLabel(link.fromPin)} →
            ${this._pinLabel(link.toPin)}</span
          >
          <span class="hint" style="color:${qualityColor(link.quality)}"
            >${link.detail ?? link.quality}</span
          >
        </div>
      `;
    }
    if (this.selectedMeshStub) {
      const stub = this.selectedMeshStub;
      return html`
        <div class="selection-panel floating-panel">
          <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
          <span class="hint"
            >${this._pinLabel(stub.fromPin)} → ${stub.targetLabel}
            (${stub.targetFloorName})</span
          >
          <span class="hint" style="color:${qualityColor(stub.quality)}"
            >${stub.detail ?? stub.quality}</span
          >
          <button
            title="Go to floor"
            @click=${() => this._fire("mesh-stub-goto-floor-click")}
          >
            <ha-icon icon="mdi:arrow-right-circle"></ha-icon>
          </button>
        </div>
      `;
    }
    return nothing;
  }

  private _pinLabel(pin: Pin): string {
    if (pin.label_override) return pin.label_override;
    return pinDisplayLabel(pin.device_id, this.entityLookup.values());
  }

  private _renderPinStack() {
    if (!this.pinStack) return nothing;
    return html`
      <div class="pin-stack floating-panel">
        <span class="stack-title"
          >${this.pinStack.length} devices at this spot</span
        >
        ${this.pinStack.map(
          (pin) => html`
            <div class="pin-stack-row">
              <button
                class="pin-stack-choose"
                @click=${() => this._fire("pin-stack-choose", { pinId: pin.id })}
              >
                ${this._pinLabel(pin)}
              </button>
              <button
                class="pin-stack-remove"
                title="Remove from this spot"
                @click=${() => this._fire("pin-stack-remove-click", { pinId: pin.id })}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `,
        )}
        <button @click=${() => this._fire("pin-stack-dismiss")}>Close</button>
      </div>
    `;
  }

  override render() {
    return html`
      ${this._renderModeToolbar()} ${this._renderHintBar()}
      <div class="scale-badge floating-panel">
        ${this.scaleReadout ?? "Not calibrated"}
      </div>
      ${this.pinStack ? this._renderPinStack() : this._renderSelectionPanel()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-overlay": CanvasOverlay;
  }
}
