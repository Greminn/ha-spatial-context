import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
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
  SnapMode,
  UnitSystem,
  Wall,
} from "../types";
import {
  DEFAULT_ROOM_BORDER_OPACITY,
  DEFAULT_ROOM_FILL_COLOR,
  DEFAULT_ROOM_FILL_OPACITY,
} from "../canvas/floorplan-canvas";
import {
  WALL_MATERIALS,
  materialLabel,
  wallThicknessCm,
} from "../canvas/materials";
import { pinDisplayLabel } from "../canvas/device-display";
import { qualityColor } from "../canvas/mesh-colors";
import "./row-actions";
import {
  actionRow,
  deleteButton,
  fieldRow,
  infoCardStyles,
  networkGroup,
  renderCard,
  selectWrap,
} from "./info-card";
import { HA_COLORS, resolveColorHex } from "./color-palette";
import { meshLegendStyles, renderMeshLegend } from "./mesh-legend";
import {
  canvasUnitsToDisplayAs,
  defaultSmallSubUnit,
  displayToCanvasUnitsAs,
  formatLarge,
  formatSmallAs,
  parseSmallAs,
  smallSubUnitsFor,
  type SmallSubUnit,
} from "../units";
import {
  selectStyles,
  sharedStyles,
  sliderStyles,
  switchStyles,
  toolRowStyles,
} from "../styles";
import { localize } from "../i18n";

/** Everything that floats over the canvas, Innerspace-style, instead of
 * pushing it down: the drawing-mode toolbar (top-left), the scale readout
 * (top-right), and the selection/context panel (bottom-left, only present
 * when something's selected). One host spanning the canvas area so each
 * piece can be positioned independently within it. */
@safeCustomElement("canvas-overlay")
export class CanvasOverlay extends LitElement {
  static override styles = [
    sharedStyles,
    selectStyles,
    infoCardStyles,
    sliderStyles,
    switchStyles,
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
      /* A thin divider between tool groups: view, draw, place/align. */
      .tool-divider {
        align-self: stretch;
        width: 1px;
        margin: 6px 4px;
        background: var(--sc-divider);
      }
      .mode-toolbar ha-icon {
        --mdc-icon-size: 20px;
      }
      /* Tonal active state, like HA's selected chips and tabs: the primary
       * colour at low strength behind a primary icon. */
      .mode-toolbar button.active {
        background: color-mix(in srgb, var(--sc-accent) 22%, transparent);
        color: var(--sc-accent);
      }
      .mode-toolbar button.active ha-icon {
        color: var(--sc-accent);
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
        border-radius: var(--sc-r-control);
        padding: 8px 14px;
        font-size: var(--sc-fs-small);
        color: var(--sc-fg-secondary);
        pointer-events: auto;
      }
      .snap-select {
        padding: 4px;
      }
      .hint {
        font-size: var(--sc-fs-small);
        color: var(--sc-fg-secondary);
      }
      .color-field {
        display: flex;
        align-items: center;
        gap: 8px;
        height: var(--sc-h-field);
        padding: 0 8px 0 10px;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-panel-bg);
        font-size: var(--sc-fs-body);
      }
      .swatch {
        flex: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid color-mix(in srgb, var(--sc-fg) 25%, transparent);
      }
      .custom-swatch {
        background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
      }
      .color-list {
        max-height: 260px;
        overflow-y: auto;
        margin: 0 8px 4px;
        border: 1px solid var(--sc-divider);
        border-radius: 16px;
        background: var(--sc-panel-bg);
      }
      .color-item {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-height: 44px;
        padding: 6px 14px;
        border-radius: 0;
        font-size: var(--sc-fs-row);
        text-align: left;
        justify-content: flex-start;
        cursor: pointer;
      }
      .color-item:hover {
        background: var(--sc-hover);
      }
      .color-item.selected {
        color: var(--sc-accent);
      }
      .color-item .grow {
        flex: 1;
        min-width: 0;
      }
      .color-item ha-icon {
        --mdc-icon-size: 20px;
        color: var(--sc-accent);
      }
      .color-item .room-fill-color {
        width: 36px;
        height: 24px;
      }
      .small-unit-select {
        width: auto;
      }
      .room-fill-color {
        -webkit-appearance: none;
        appearance: none;
        width: 44px;
        height: 32px;
        padding: 0;
        border: 1px solid var(--sc-divider);
        border-radius: 10px;
        background: none;
        cursor: pointer;
        overflow: hidden;
      }
      .room-fill-color::-webkit-color-swatch-wrapper {
        padding: 0;
      }
      .room-fill-color::-webkit-color-swatch {
        border: none;
      }
      .room-fill-color::-moz-color-swatch {
        border: none;
      }
      .room-opacity {
        width: 140px;
      }
    `,
  ];

  @property({ attribute: false }) mode: CanvasMode = "select";
  @property({ attribute: false }) armedOpeningType: "door" | "window" | null =
    null;
  @property({ type: Boolean }) hasPendingTrace = false;
  @property({ type: Boolean }) hasPendingWall = false;
  @property({ attribute: false }) snapMode: SnapMode = "all";
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
  /** Show the weak → strong key along the bottom (a network layer is on). */
  @state() private _colorOpen = false;
  @property({ type: Boolean }) dirty = false;
  @property({ type: Boolean }) saving = false;
  @property({ type: Boolean }) canUndo = false;
  @property({ type: Boolean }) canRedo = false;
  @property({ type: Boolean }) meshLegend = false;
  /** The links drawn on this floor, and the active network layer's name
   * (null when none is on) — the device card lists the selected device's. */
  @property({ attribute: false }) meshLinks: ResolvedMeshLink[] = [];
  @property({ attribute: false }) meshStubs: ResolvedMeshStub[] = [];
  @property({ attribute: false }) networkLabel: string | null = null;
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
      changed.has("selectedRoom") &&
      changed.get("selectedRoom")?.id !== this.selectedRoom?.id
    ) {
      this._colorOpen = false;
    }
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
      <div class="mode-toolbar">
        ${this._modeButton("select", "mdi:cursor-default-click", localize("canvas.mode.select"))}
        ${this._modeButton("pan", "mdi:hand-back-right-outline", localize("canvas.mode.pan"))}
        <span class="tool-divider"></span>
        ${this._modeButton("trace", "mdi:vector-square", localize("canvas.mode.trace"))}
        ${this._modeButton("wall", "mdi:wall", localize("canvas.mode.wall"))}
        ${this._openingModeButton("door", "mdi:door", localize("canvas.mode.door"))}
        ${this._openingModeButton("window", "mdi:window-closed-variant", localize("canvas.mode.window"))}
        ${this._modeButton("scale", "mdi:ruler", localize("canvas.mode.scale"))}
        <span class="tool-divider"></span>
        ${this._modeButton("place", "mdi:map-marker-plus", localize("canvas.mode.place"))}
        ${this._modeButton("align", "mdi:compare", localize("canvas.mode.align"))}
      </div>
    `;
  }

  /** Snap picker shown while tracing a room or wall (#36). Shift still
   * frees a single point whatever this is set to. */
  private _renderSnapSelect() {
    return html`<select
      class="snap-select"
      title=${localize("canvas.snap.tooltip")}
      @change=${(e: Event) =>
        this._fire("snap-mode-change", {
          snapMode: (e.target as HTMLSelectElement).value as SnapMode,
        })}
    >
      <option value="all" ?selected=${this.snapMode === "all"}>
        ${localize("canvas.snap.all")}
      </option>
      <option value="same" ?selected=${this.snapMode === "same"}>
        ${this.mode === "wall" ? localize("canvas.snap.walls") : localize("canvas.snap.rooms")}
      </option>
      <option value="off" ?selected=${this.snapMode === "off"}>
        ${localize("canvas.snap.off")}
      </option>
    </select>`;
  }

  private _renderHintBar() {
    if (this.mode === "trace") {
      return html`<div class="hint-bar floating-panel">
        <span class="hint"
          >${
            this.hasPendingTrace
              ? localize("canvas.hint.closeRoom")
              : localize("canvas.hint.addPoints")
          }</span
        >
        ${this._renderSnapSelect()}
        ${
          this.hasPendingTrace
            ? html`<button @click=${() => this._fire("cancel-pending-click")}>
                ${localize("canvas.button.cancel")}
              </button>`
            : nothing
        }
      </div>`;
    }
    if (this.mode === "wall") {
      return html`<div class="hint-bar floating-panel">
        <span class="hint"
          >${
            this.hasPendingWall
              ? localize("canvas.hint.addWallPointsFinish")
              : localize("canvas.hint.addWallPoints")
          }</span
        >
        ${this._renderSnapSelect()}
        ${
          this.hasPendingWall
            ? html`<button
                class="primary"
                @click=${() => this._fire("finish-wall-click")}
              >
                ${localize("canvas.button.finishWall")}
              </button>`
            : nothing
        }
        ${
          this.hasPendingWall
            ? html`<button @click=${() => this._fire("cancel-pending-click")}>
                ${localize("canvas.button.cancel")}
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
              ? localize("canvas.hint.scaleFirst")
              : localize("canvas.hint.scaleSecond")
          }</span
        >
        ${
          this.pendingScaleCount > 0
            ? html`<button @click=${() => this._fire("cancel-pending-click")}>
                ${localize("canvas.button.cancel")}
              </button>`
            : nothing
        }
      </div>`;
    }
    if (this.mode === "opening") {
      return html`<div class="hint-bar floating-panel">
        <span class="hint"
          >${localize("canvas.hint.placeOpening", {
            type: localize(
              `canvas.openingType.${this.armedOpeningType ?? "opening"}`,
            ),
          })}</span
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
        <span class="hint">${localize("canvas.hint.alignAgainst")}</span>
        <select
          @change=${(e: Event) =>
            this._fire("align-target-change", {
              floorId: (e.target as HTMLSelectElement).value,
            })}
        >
          <option value="" selected>${localize("canvas.align.choose")}</option>
          ${this.otherFloors.map(
            (f) => html`<option value=${f.floor_id}>${f.name}</option>`,
          )}
        </select>
        <button @click=${() => this._fire("align-cancel-click")}>
          ${localize("canvas.button.cancel")}
        </button>
      </div>`;
    }
    if (!this.alignTargetHasBackground) {
      return html`<div class="hint-bar floating-panel">
        <span class="hint">${localize("canvas.hint.noBackground")}</span>
        <button
          @click=${() => this._fire("align-target-change", { floorId: null })}
        >
          ${localize("canvas.button.chooseAnother")}
        </button>
        <button @click=${() => this._fire("align-cancel-click")}>
          ${localize("canvas.button.cancel")}
        </button>
      </div>`;
    }
    return html`<div class="hint-bar floating-panel">
      <span class="hint">${localize("canvas.hint.alignDrag")}</span>
      <button
        title=${localize("canvas.align.shrink")}
        @click=${() => this._fire("align-scale-click", { factor: 0.995 })}
      >
        −
      </button>
      <button
        title=${localize("canvas.align.grow")}
        @click=${() => this._fire("align-scale-click", { factor: 1.0050251 })}
      >
        +
      </button>
      <button class="primary" @click=${() => this._fire("align-apply-click")}>
        ${localize("canvas.button.apply")}
      </button>
      <button @click=${() => this._fire("align-cancel-click")}>
        ${localize("canvas.button.cancel")}
      </button>
    </div>`;
  }

  private _areaOptions(areas: AreaMeta[], selectedAreaId: string | null) {
    return areas.map(
      (a) =>
        html`<option
          value=${a.area_id}
          ?selected=${a.area_id === selectedAreaId}
        >
          ${a.name}
        </option>`,
    );
  }

  @state() private _cardCollapsed = false;
  private _card = (opts: Parameters<typeof renderCard>[0]) =>
    renderCard({
      ...opts,
      collapsed: this._cardCollapsed,
      onToggle: () => (this._cardCollapsed = !this._cardCollapsed),
    });
  private _actionRow = actionRow;
  private _fieldRow = fieldRow;
  private _selectWrap = selectWrap;
  private _deleteButton(label: string, event: string) {
    return deleteButton(label, () => this._fire(event));
  }

  private _clearSelection = () => this._fire("selection-clear");

  /** Colour choice from HA's standard palette (see color-palette.ts), as a
   * dropdown that expands inline; "Custom" keeps the native picker for any
   * other colour. Stores the resolved #rrggbb. */
  private _renderColourPicker(room: Room) {
    const palette = HA_COLORS.map((c) => ({
      ...c,
      label: localize(`colors.${c.key.replace(/-/g, "_")}`),
      hex: resolveColorHex(this, c),
    }));
    const current = (room.fill_color ?? "").toLowerCase();
    const match = palette.find((c) => c.hex.toLowerCase() === current);
    const swatchHex = room.fill_color ?? DEFAULT_ROOM_FILL_COLOR;
    const name = !room.fill_color
      ? localize("canvas.card.colourDefault")
      : (match?.label ?? localize("canvas.card.colourCustom"));
    const pick = (color: string) => {
      this._colorOpen = false;
      this._fire("room-fill-color-change", { color });
    };
    return html`
      <div class="info-row">
        <ha-icon icon="mdi:palette"></ha-icon>
        <span class="grow">${localize("canvas.card.colour")}</span>
        <button
          class="color-field"
          aria-expanded=${this._colorOpen ? "true" : "false"}
          @click=${() => (this._colorOpen = !this._colorOpen)}
        >
          <span class="swatch" style="background:${swatchHex}"></span>
          <span class="color-name">${name}</span>
          <ha-icon
            icon=${this._colorOpen ? "mdi:menu-up" : "mdi:menu-down"}
          ></ha-icon>
        </button>
      </div>
      ${
        this._colorOpen
          ? html`<div class="color-list">
              ${palette.map(
                (c) =>
                  html`<button
                    class="color-item ${c.hex.toLowerCase() === current ? "selected" : ""}"
                    @click=${() => pick(c.hex)}
                  >
                    <span class="swatch" style="background:${c.hex}"></span>
                    <span class="grow">${c.label}</span>
                    ${
                      c.hex.toLowerCase() === current
                        ? html`<ha-icon icon="mdi:check"></ha-icon>`
                        : nothing
                    }
                  </button>`,
              )}
              <label class="color-item custom">
                <span class="swatch custom-swatch"></span>
                <span class="grow"
                  >${localize("canvas.card.colourCustom")}</span
                >
                <input
                  type="color"
                  class="room-fill-color"
                  .value=${swatchHex}
                  @input=${(e: Event) =>
                    this._fire("room-fill-color-change", {
                      color: (e.target as HTMLInputElement).value,
                    })}
                />
              </label>
            </div>`
          : nothing
      }
    `;
  }

  /** The selected device's connections in the active network layer. Null
   * with no layer on. */
  private _renderDeviceNetwork(pin: Pin) {
    if (!this.networkLabel) return nothing;
    return networkGroup(this.networkLabel, [
      ...this.meshLinks
        .filter((l) => l.fromPin.id === pin.id || l.toPin.id === pin.id)
        .map((l) => ({
          name: this._pinLabel(l.fromPin.id === pin.id ? l.toPin : l.fromPin),
          where: "",
          quality: l.quality,
          detail: l.detail ?? l.quality,
        })),
      ...this.meshStubs
        .filter((st) => st.fromPin.id === pin.id)
        .map((st) => ({
          name: st.targetLabel,
          where: st.targetFloorName,
          quality: st.quality,
          detail: st.detail ?? st.quality,
        })),
    ]);
  }

  private _renderSelectionPanel() {
    if (this.selectedRoom) {
      const room = this.selectedRoom;
      const visible = room.visible !== false;
      const area = this.areas.find((a) => a.area_id === room.area_id);
      return this._card({
        title: room.name,
        subtitle: area ? area.name : localize("canvas.card.room"),
        onClose: this._clearSelection,
        body: html`
          <div class="info-group">
            ${this._fieldRow(
              "mdi:floor-plan",
              localize("canvas.card.area"),
              this._selectWrap(
                html`<select
                  @change=${(e: Event) =>
                    this._fire("room-area-change", {
                      areaId: (e.target as HTMLSelectElement).value,
                    })}
                >
                  <option value="" ?selected=${!room.area_id}>
                    ${localize("canvas.room.custom")}
                  </option>
                  ${this._areaOptions(
                    this.areas.filter((a) => a.floor_id !== null),
                    room.area_id,
                  )}
                  ${
                    // Floor-less HA areas (decks, driveway…) — drawable onto any
                    // floor's plan without changing the area's floor in HA.
                    this.areas.some((a) => a.floor_id === null)
                      ? html`<optgroup label=${localize("canvas.room.outdoor")}>
                          ${this._areaOptions(
                            this.areas.filter((a) => a.floor_id === null),
                            room.area_id,
                          )}
                        </optgroup>`
                      : nothing
                  }
                </select>`,
              ),
            )}
            ${this._fieldRow(
              "mdi:pencil",
              localize("canvas.card.name"),
              html`<input
                type="text"
                class="text-field"
                .value=${room.name}
                @change=${(e: Event) => {
                  const input = e.target as HTMLInputElement;
                  const name = input.value.trim();
                  if (name) this._fire("room-name-change", { name });
                  else input.value = room.name;
                }}
              />`,
            )}
            ${this._actionRow(
              "mdi:vector-polygon",
              this.editingRoom
                ? localize("canvas.room.doneEditing")
                : localize("canvas.room.editVertices"),
              () => this._fire("room-edit-vertices-click"),
              this.editingRoom,
            )}
            ${
              room.label_position
                ? this._actionRow(
                    "mdi:format-text-variant-outline",
                    localize("canvas.room.resetLabel"),
                    () => this._fire("room-label-reset-click"),
                  )
                : nothing
            }
            ${this._fieldRow(
              "mdi:eye",
              localize("canvas.card.visible"),
              html`<input
                type="checkbox"
                class="switch"
                role="switch"
                .checked=${visible}
                @change=${() => this._fire("room-visible-toggle")}
              />`,
            )}
          </div>
          <div class="info-group">
            <div class="info-group-title">${localize("canvas.card.style")}</div>
            ${this._renderColourPicker(room)}
            ${this._fieldRow(
              "mdi:opacity",
              localize("canvas.room.fillOpacity"),
              html`<input
                type="range"
                class="room-opacity"
                min="0"
                max="1"
                step="0.02"
                style="--pct:${(room.fill_opacity ?? DEFAULT_ROOM_FILL_OPACITY) * 100}%"
                .value=${String(room.fill_opacity ?? DEFAULT_ROOM_FILL_OPACITY)}
                @input=${(e: Event) =>
                  this._fire("room-fill-opacity-change", {
                    opacity: Number((e.target as HTMLInputElement).value),
                  })}
              />`,
            )}
            ${this._fieldRow(
              "mdi:square-outline",
              localize("canvas.room.borderOpacity"),
              html`<input
                type="range"
                class="room-opacity"
                min="0"
                max="1"
                step="0.02"
                style="--pct:${(room.border_opacity ?? DEFAULT_ROOM_BORDER_OPACITY) * 100}%"
                .value=${String(room.border_opacity ?? DEFAULT_ROOM_BORDER_OPACITY)}
                @input=${(e: Event) =>
                  this._fire("room-border-opacity-change", {
                    opacity: Number((e.target as HTMLInputElement).value),
                  })}
              />`,
            )}
          </div>
        `,
        footer: this._deleteButton(
          localize("canvas.room.delete"),
          "room-delete-click",
        ),
      });
    }
    if (this.selectedPin) {
      const pin = this.selectedPin;
      return this._card({
        title: this._pinLabel(pin),
        subtitle: localize("canvas.card.device"),
        onClose: this._clearSelection,
        body: html`<div class="info-group">
            ${this._fieldRow(
              "mdi:tag-text",
              localize("canvas.card.label"),
              html`<input
                type="text"
                class="text-field"
                placeholder=${pinDisplayLabel(pin.device_id, this.entityLookup.values())}
                .value=${pin.label_override ?? ""}
                @change=${(e: Event) =>
                  this._fire("pin-label-change", {
                    label: (e.target as HTMLInputElement).value,
                  })}
              />`,
            )}
            ${this._actionRow("mdi:shape", localize("canvas.pin.setIcon"), () =>
              this._fire("pin-set-icon-click"),
            )}
            ${this._fieldRow(
              "mdi:human-male-height",
              localize("canvas.card.height", {
                unit: this.unitSystem === "imperial" ? "ft" : "m",
              }),
              html`<input
                type="text"
                inputmode="decimal"
                class="text-field short"
                placeholder=${this.unitSystem === "imperial" ? "6" : "1.8"}
                .value=${pin.height_m === null ? "" : formatLarge(pin.height_m, this.unitSystem)}
                @change=${(e: Event) =>
                  this._fire("pin-height-change", {
                    value: (e.target as HTMLInputElement).value,
                  })}
              />`,
            )}
          </div>
          ${this._renderDeviceNetwork(pin)}`,
        footer: this._deleteButton(
          localize("canvas.pin.delete"),
          "pin-delete-click",
        ),
      });
    }
    if (this.selectedWall) {
      const wall = this.selectedWall;
      const wallUnit =
        this._wallThicknessUnit ?? defaultSmallSubUnit(this.unitSystem);
      const wallAttrs = this._thicknessInputAttrs(wallUnit);
      return this._card({
        title: localize("canvas.card.wall"),
        subtitle: (() => {
          const m = WALL_MATERIALS.find((x) => x.id === wall.material);
          return m ? materialLabel(m) : undefined;
        })(),
        onClose: this._clearSelection,
        body: html`<div class="info-group">
          ${this._fieldRow(
            "mdi:wall",
            localize("canvas.wall.material"),
            this._selectWrap(
              html`<select
                @change=${(e: Event) =>
                  this._fire("wall-material-change", {
                    material: (e.target as HTMLSelectElement).value,
                  })}
              >
                ${WALL_MATERIALS.map(
                  (m) =>
                    html`<option
                      value=${m.id}
                      ?selected=${m.id === wall.material}
                    >
                      ${materialLabel(m)}
                    </option>`,
                )}
              </select>`,
            ),
          )}
          ${this._fieldRow(
            "mdi:arrow-expand-horizontal",
            localize("canvas.wall.thickness", { unit: wallUnit }),
            html`<span class="inline-pair"
              ><input
                type="number"
                class="wall-thickness"
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
              />${this._unitSelect(
                wallUnit,
                (unit) => (this._wallThicknessUnit = unit),
              )}</span
            >`,
          )}
          ${this._actionRow(
            "mdi:vector-polygon",
            this.editingWall
              ? localize("canvas.room.doneEditing")
              : localize("canvas.room.editVertices"),
            () => this._fire("wall-edit-vertices-click"),
            this.editingWall,
          )}
        </div>`,
        footer: this._deleteButton(
          localize("canvas.wall.delete"),
          "wall-delete-click",
        ),
      });
    }
    if (this.selectedOpening) {
      const opening = this.selectedOpening;
      const openingUnit =
        this._openingWidthUnit ?? defaultSmallSubUnit(this.unitSystem);
      const openingAttrs = this._thicknessInputAttrs(openingUnit);
      const unitsPerMeter = this.unitsPerMeter;
      return this._card({
        title: localize(`canvas.openingLabel.${opening.type}`),
        subtitle: localize("canvas.card.wallOpening"),
        onClose: this._clearSelection,
        body: html`<div class="info-group">
          ${this._fieldRow(
            "mdi:arrow-expand-horizontal",
            localize("canvas.opening.width", {
              unit:
                unitsPerMeter !== null
                  ? openingUnit
                  : localize("canvas.opening.storedUnits"),
            }),
            html`<span class="inline-pair"
              ><input
                type="number"
                class="wall-thickness"
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
              />${
                unitsPerMeter !== null
                  ? this._unitSelect(
                      openingUnit,
                      (unit) => (this._openingWidthUnit = unit),
                    )
                  : nothing
              }</span
            >`,
          )}
          ${
            unitsPerMeter === null
              ? html`<div class="info-row">
                  <span class="grow info-sub"
                    >${localize("canvas.opening.calibrate")}</span
                  >
                </div>`
              : nothing
          }
        </div>`,
        footer: this._deleteButton(
          localize("canvas.opening.delete"),
          "opening-delete-click",
        ),
      });
    }
    if (this.selectedMeshLink) {
      const link = this.selectedMeshLink;
      return this._card({
        title: `${this._pinLabel(link.fromPin)} → ${this._pinLabel(link.toPin)}`,
        subtitle: localize("canvas.card.link"),
        onClose: this._clearSelection,
        body: html`<div class="info-group">
          ${this._fieldRow(
            "mdi:signal",
            localize("canvas.card.quality"),
            html`<span style="color:${qualityColor(link.quality)}"
              >${link.detail ?? link.quality}</span
            >`,
          )}
        </div>`,
      });
    }
    if (this.selectedMeshStub) {
      const stub = this.selectedMeshStub;
      return this._card({
        title: `${this._pinLabel(stub.fromPin)} → ${stub.targetLabel}`,
        subtitle: stub.targetFloorName,
        onClose: this._clearSelection,
        body: html`<div class="info-group">
          ${this._fieldRow(
            "mdi:signal",
            localize("canvas.card.quality"),
            html`<span style="color:${qualityColor(stub.quality)}"
              >${stub.detail ?? stub.quality}</span
            >`,
          )}
          ${this._actionRow(
            "mdi:arrow-right-circle",
            localize("canvas.meshStub.goToFloor"),
            () => this._fire("mesh-stub-goto-floor-click"),
          )}
        </div>`,
      });
    }
    return nothing;
  }

  private _pinLabel(pin: Pin): string {
    if (pin.label_override) return pin.label_override;
    return pinDisplayLabel(pin.device_id, this.entityLookup.values());
  }

  private _renderPinStack() {
    if (!this.pinStack) return nothing;
    const stack = this.pinStack;
    return this._card({
      title: localize("canvas.pin.stackTitle", { count: stack.length }),
      onClose: () => this._fire("pin-stack-dismiss"),
      body: html`<div class="info-group">
        ${stack.map(
          (pin) => html`
            <div class="info-row stack-row">
              <button
                class="stack-choose"
                @click=${() => this._fire("pin-stack-choose", { pinId: pin.id })}
              >
                ${this._pinLabel(pin)}
              </button>
              <button
                class="stack-remove"
                title=${localize("canvas.pin.removeFromSpot")}
                @click=${() =>
                  this._fire("pin-stack-remove-click", { pinId: pin.id })}
              >
                <ha-icon icon="mdi:delete"></ha-icon>
              </button>
            </div>
          `,
        )}
      </div>`,
    });
  }

  override render() {
    return html`
      <div class="tool-row">
        ${this._renderModeToolbar()} ${this._renderHintBar()}
        <div class="scale-badge floating-panel">
          ${this.scaleReadout ?? localize("canvas.notCalibrated")}
        </div>
        <slot name="row-end"></slot>
        <row-actions
          .dirty=${this.dirty}
          .saving=${this.saving}
          .canUndo=${this.canUndo}
          .canRedo=${this.canRedo}
        ></row-actions>
      </div>
      ${this.meshLegend ? renderMeshLegend() : nothing}
      ${this.pinStack ? this._renderPinStack() : this._renderSelectionPanel()}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "canvas-overlay": CanvasOverlay;
  }
}
