import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type {
  AreaMeta,
  CanvasMode,
  FloorMeta,
  Opening,
  PlaceableEntity,
  Pin,
  Room,
  Wall,
} from "../types";
import { WALL_MATERIALS, wallThicknessCm } from "../canvas/materials";
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
  @property({ attribute: false }) pinStack: Pin[] | null = null;
  @property({ attribute: false }) entityLookup: Map<string, PlaceableEntity> =
    new Map();
  @property({ attribute: false }) selectedOpening: Opening | null = null;

  @property({ attribute: false }) otherFloors: FloorMeta[] = [];
  @property({ attribute: false }) alignTargetFloorId: string | null = null;
  @property({ type: Boolean }) alignTargetHasBackground = true;

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
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
      return html`
        <div class="selection-panel floating-panel">
          <span class="hint">${this._pinLabel(this.selectedPin)}</span>
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
            <ha-icon icon="mdi:arrow-up-down"></ha-icon>
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
            title="Wall thickness (cm)"
            min="1"
            max="100"
            step="0.5"
            .value=${String(wallThicknessCm(wall))}
            @change=${(e: Event) =>
              this._fire("wall-thickness-change", {
                thicknessCm: Number((e.target as HTMLInputElement).value),
              })}
          />
          <span class="hint">cm</span>
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
      return html`
        <div class="selection-panel floating-panel">
          <span class="hint">${this.selectedOpening.type}</span>
          <button
            title="Set width"
            @click=${() => this._fire("opening-set-width-click")}
          >
            <ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>
          </button>
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
    return nothing;
  }

  private _pinLabel(pin: Pin): string {
    if (pin.label_override) return pin.label_override;
    return this.entityLookup.get(pin.entity_id)?.name ?? pin.entity_id;
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
