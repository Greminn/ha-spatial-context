import { LitElement, html, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import { PROPERTY_LOCATION_ID } from "../types";
import type { AreaMeta, FloorMeta, PlaceableEntity } from "../types";
import { pickDisplayEntity } from "../canvas/device-display";
import { isDevicePlaced } from "../picker-placement";
import { nextToArm } from "../bulk-place";
import { localize } from "../i18n";
import { selectStyles, sharedStyles } from "../styles";
import { entityPickerSidebarStyles } from "./entity-picker-sidebar-styles";

/** Fallback row icon when a device's integration has no brand logo on
 * brands.home-assistant.io (see the `<img>`/`@error` pair below) — one
 * generic glyph for every device, derived from its ranked representative
 * entity (see canvas/device-display.ts's pickDisplayEntity), never an
 * arbitrary one. */
const GENERIC_DEVICE_ICON_NAME = "mdi:devices";

interface DeviceGroup {
  deviceId: string;
  deviceName: string;
  areaId: string | null;
  areaName: string | null;
  integrationDomain: string | null;
  integrationName: string | null;
  entities: PlaceableEntity[];
  primaryEntityId: string;
}

@safeCustomElement("entity-picker-sidebar")
export class EntityPickerSidebar extends LitElement {
  static override styles = [
    sharedStyles,
    selectStyles,
    entityPickerSidebarStyles,
  ];

  @state() private _menuOpen = false;
  @property({ attribute: false }) entities: PlaceableEntity[] = [];
  @property({ attribute: false }) placedDeviceIds: Set<string> = new Set();
  /** Devices the user hid from this list (#43). */
  @property({ attribute: false }) hiddenDeviceIds: Set<string> = new Set();
  @property({ attribute: false }) armedEntityId: string | null = null;
  @property({ attribute: false }) floors: FloorMeta[] = [];
  @property({ attribute: false }) areas: AreaMeta[] = [];
  @property({ attribute: false }) currentFloorId: string | null = null;
  /** Floor-less areas (a Back Deck, say) that a room on the current floor
   * is linked to — counted as part of the current floor by the floor
   * filter, since that's where they've been drawn. */
  @property({ attribute: false }) linkedAreaIds: Set<string> = new Set();
  /** Unplaced devices per area that has a room on this plan — what
   * "place by area" would place (see bulk-place.ts). */
  @property({ attribute: false }) bulkCounts: Map<string, number> = new Map();
  /** Devices whose pin was bulk-placed and not yet confirmed. */
  @property({ attribute: false }) approximateDeviceIds: Set<string> = new Set();

  /** Keep placing: after a pin is placed, arm the next unplaced device in
   * the current list. A per-browser preference, like the width. */
  @state() private _keepArmed = EntityPickerSidebar._readKeepArmed();

  @state() private _search = "";
  /** null = "follow whichever floor is currently open" (the useful default
   * while placing devices onto that floor's plan); "all" = no floor
   * scoping at all; anything else is an explicit floor_id the user picked
   * from the dropdown, overriding the follow-current-floor default. */
  @state() private _floorFilter: string | "all" | null = null;
  @state() private _areaFilter: string | null = null;
  @state() private _placedFilter:
    "all" | "unplaced" | "placed" | "approximate" | "hidden" = "all";

  // --- resizable width (per-browser, not shared — see #22) --------------

  private static readonly WIDTH_STORAGE_KEY =
    "spatial-context.entityPickerSidebarWidth";
  private static readonly KEEP_ARMED_STORAGE_KEY =
    "spatial-context.keepPlacing";
  private static readonly MIN_WIDTH = 240;
  private static readonly MAX_WIDTH = 600;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("pointerdown", this._onOutsidePress, true);
  }

  private static _readKeepArmed(): boolean {
    try {
      return (
        localStorage.getItem(EntityPickerSidebar.KEEP_ARMED_STORAGE_KEY) === "1"
      );
    } catch {
      return false;
    }
  }

  private _toggleKeepArmed = () => {
    this._keepArmed = !this._keepArmed;
    try {
      localStorage.setItem(
        EntityPickerSidebar.KEEP_ARMED_STORAGE_KEY,
        this._keepArmed ? "1" : "0",
      );
    } catch {
      // Only this session remembers it then.
    }
  };

  /** Keep placing: the armed device was just placed (the panel disarms
   * after every pin), so arm the next unplaced row in the current list. */
  private _maybeArmNext(changed: PropertyValues): void {
    if (!this._keepArmed || !changed.has("armedEntityId")) return;
    const previous = changed.get("armedEntityId") as string | null | undefined;
    if (!previous || this.armedEntityId !== null) return;
    const rows = this._filtered.map((d) => ({
      entityId: d.primaryEntityId,
      placed:
        isDevicePlaced(
          d.deviceId,
          d.entities,
          this.placedDeviceIds,
          this.currentFloorId,
        ) || this._blockedFloorName(d) !== null,
    }));
    const justPlaced = this._devices.find(
      (d) => d.primaryEntityId === previous,
    );
    // Disarmed without placing a new pin (clicked the row again, Escape,
    // or re-armed a device that was already placed): stop.
    const before = changed.get("placedDeviceIds") as Set<string> | undefined;
    if (
      !justPlaced ||
      !before ||
      before.has(justPlaced.deviceId) ||
      !this.placedDeviceIds.has(justPlaced.deviceId)
    ) {
      return;
    }
    const next = nextToArm(rows, previous);
    if (!next) return;
    this.dispatchEvent(
      new CustomEvent("entity-armed", {
        detail: { entityId: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private get _bulkTotal(): number {
    let total = 0;
    for (const n of this.bulkCounts.values()) total += n;
    return total;
  }

  private _emitBulkPlace(areaId: string | null): void {
    this._menuOpen = false;
    this.dispatchEvent(
      new CustomEvent("bulk-place", {
        detail: { areaId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override updated(changed: PropertyValues): void {
    this._maybeArmNext(changed);
    if (!changed.has("_menuOpen")) return;
    document.removeEventListener("pointerdown", this._onOutsidePress, true);
    if (this._menuOpen) {
      document.addEventListener("pointerdown", this._onOutsidePress, true);
    }
  }

  /** The more menu closes on a press anywhere outside it and its button. */
  private _onOutsidePress = (event: PointerEvent) => {
    const inside = event
      .composedPath()
      .some(
        (el) =>
          el instanceof HTMLElement &&
          (el.classList.contains("more-menu") ||
            el.classList.contains("more-button")),
      );
    if (!inside) this._menuOpen = false;
  };

  override connectedCallback(): void {
    super.connectedCallback();
    const stored = this._readStoredWidth();
    if (stored !== null) {
      this.style.setProperty("--sc-picker-width", `${stored}px`);
    }
  }

  /** localStorage is a deliberate exception in this codebase — everything
   * else is server-persisted (Store-backed layout, or the shared Settings
   * object), but a sidebar's width is a personal screen-ergonomics
   * preference, not a fact every viewer should share. Browser storage can
   * throw or come back empty (private mode, quota, disabled) — never let
   * that break rendering or resizing itself. */
  private _readStoredWidth(): number | null {
    try {
      const raw = localStorage.getItem(EntityPickerSidebar.WIDTH_STORAGE_KEY);
      if (!raw) return null;
      const n = Number(raw);
      if (!Number.isFinite(n)) return null;
      return Math.min(
        EntityPickerSidebar.MAX_WIDTH,
        Math.max(EntityPickerSidebar.MIN_WIDTH, n),
      );
    } catch {
      return null;
    }
  }

  private _writeStoredWidth(width: number): void {
    try {
      localStorage.setItem(
        EntityPickerSidebar.WIDTH_STORAGE_KEY,
        String(width),
      );
    } catch {
      // Won't persist across reloads — resizing itself still works fine.
    }
  }

  private _onResizeHandlePointerDown = (e: PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = this.getBoundingClientRect().width;
    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);

    const onMove = (ev: PointerEvent) => {
      // The handle sits on the sidebar's LEFT edge, and the sidebar is
      // anchored to the right of the canvas — dragging left (negative
      // clientX delta) should grow it, hence startX - clientX rather than
      // the more usual clientX - startX.
      const dx = startX - ev.clientX;
      const width = Math.min(
        EntityPickerSidebar.MAX_WIDTH,
        Math.max(EntityPickerSidebar.MIN_WIDTH, startWidth + dx),
      );
      this.style.setProperty("--sc-picker-width", `${width}px`);
    };
    const onUp = (ev: PointerEvent) => {
      handle.releasePointerCapture(ev.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      this._writeStoredWidth(Math.round(this.getBoundingClientRect().width));
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  };

  private get _effectiveFloorFilter(): string | null {
    if (this._floorFilter === "all") return null;
    // With one floor there is nothing to narrow by, and a device with no
    // area (or an area on no floor) would be hidden for no visible reason
    // (#54), so the list starts on every device.
    if (
      this._floorFilter === null &&
      this.floors.length <= 1 &&
      this.currentFloorId !== PROPERTY_LOCATION_ID
    ) {
      return null;
    }
    return this._floorFilter ?? this.currentFloorId;
  }

  /** Areas offered in the Area dropdown — scoped to the selected floor
   * filter (or every area, once floor scoping is set to "all"). */
  private get _areasForFilter(): AreaMeta[] {
    const floorId = this._effectiveFloorFilter;
    return floorId === null
      ? this.areas
      : this.areas.filter((a) => this._areaIsOnFloor(a, floorId));
  }

  private _areaIsOnFloor(area: AreaMeta, floorId: string): boolean {
    // The Property tab's "floor": every area HA has on no floor at all.
    if (floorId === PROPERTY_LOCATION_ID) return area.floor_id === null;
    return (
      area.floor_id === floorId ||
      (floorId === this.currentFloorId && this.linkedAreaIds.has(area.area_id))
    );
  }

  private _onFloorFilterChange = (e: Event) => {
    const value = (e.target as HTMLSelectElement).value;
    this._floorFilter = value === "all" ? "all" : value;
    // Drop an area choice that no longer belongs to the newly-selected floor.
    if (
      this._areaFilter &&
      !this._areasForFilter.some((a) => a.area_id === this._areaFilter)
    ) {
      this._areaFilter = null;
    }
  };

  private get _devices(): DeviceGroup[] {
    const groups = new Map<string, PlaceableEntity[]>();
    for (const e of this.entities) {
      const key = e.device_id ?? e.entity_id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(e);
    }

    const devices: DeviceGroup[] = [];
    for (const [deviceId, entities] of groups) {
      // Placement is per physical device, not per entity — a device with
      // several entities (e.g. a combo temp/humidity/motion sensor) still
      // occupies one spot in the house, so it gets one row and one pin.
      // Which entity represents it isn't arbitrary, though: a helper
      // integration (Dynamic Energy Cost, a utility meter, ...) can attach
      // its own entities to another integration's device, so the same
      // ranked pick used for the export applies here too (see
      // canvas/device-display.ts's pickDisplayEntity) — falls back to
      // entities[0] only in the deviceId-was-really-an-entity_id edge case
      // (see the `groups` key above), where nothing can match by device_id.
      const primary = pickDisplayEntity(deviceId, entities) ?? entities[0]!;
      devices.push({
        deviceId,
        deviceName: primary.device_name ?? primary.name,
        areaId: primary.area_id,
        areaName: primary.area_name,
        integrationDomain: primary.integration_domain,
        integrationName: primary.integration_name,
        entities,
        primaryEntityId: primary.entity_id,
      });
    }
    devices.sort((a, b) => a.deviceName.localeCompare(b.deviceName));
    return devices;
  }

  /** Non-null (the floor name/id it's on) when this device's primary
   * entity is already placed on a *different* floor than the one currently
   * open — that device can't be placed here too until it's removed from
   * where it already is (an entity only physically exists in one place). */
  private _blockedFloorName(device: DeviceGroup): string | null {
    const primary = device.entities.find(
      (e) => e.entity_id === device.primaryEntityId,
    );
    if (
      !primary?.placed_floor_id ||
      primary.placed_floor_id === this.currentFloorId
    )
      return null;
    return primary.placed_floor_name ?? primary.placed_floor_id;
  }

  private get _filtered(): DeviceGroup[] {
    const q = this._search.trim().toLowerCase();
    const floorId = this._effectiveFloorFilter;
    const areaId = this._areaFilter;
    const showHidden = this._placedFilter === "hidden";
    return this._devices.filter((d) => {
      if (this.hiddenDeviceIds.has(d.deviceId) !== showHidden) return false;
      if (areaId) {
        if (d.areaId !== areaId) return false;
      } else if (floorId) {
        const area = this.areas.find((a) => a.area_id === d.areaId);
        if (!area || !this._areaIsOnFloor(area, floorId)) return false;
      }
      if (
        this._placedFilter === "approximate" &&
        !this.approximateDeviceIds.has(d.deviceId)
      ) {
        return false;
      }
      if (
        this._placedFilter === "unplaced" ||
        this._placedFilter === "placed"
      ) {
        const placed = isDevicePlaced(
          d.deviceId,
          d.entities,
          this.placedDeviceIds,
          this.currentFloorId,
        );
        if (placed !== (this._placedFilter === "placed")) return false;
      }
      if (!q) return true;
      return (
        d.deviceName.toLowerCase().includes(q) ||
        (d.areaName ?? "").toLowerCase().includes(q) ||
        d.entities.some((e) => e.entity_id.toLowerCase().includes(q))
      );
    });
  }

  /** A row button: act on that device's pin without arming the row. */
  private _emitForDevice(event: Event, name: string, deviceId: string): void {
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { deviceId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** A floor plan is open (not the Property tab, which has no rooms). */
  private get _onFloorPlan(): boolean {
    return (
      this.currentFloorId !== null &&
      this.currentFloorId !== PROPERTY_LOCATION_ID
    );
  }

  private get _showMoreMenu(): boolean {
    return this.placedDeviceIds.size > 0 || this._onFloorPlan;
  }

  /** "Place by area" (see bulk-place.ts): the filtered area into its room,
   * or every linked area on this floor. Shown greyed out with nothing to
   * place, so the feature can be found before any room is linked. */
  private _renderBulkMenuItems() {
    if (!this._onFloorPlan) return nothing;
    const area = this._areaFilter
      ? this.areas.find((a) => a.area_id === this._areaFilter)
      : null;
    const areaCount = area ? (this.bulkCounts.get(area.area_id) ?? 0) : 0;
    const total = this._bulkTotal;
    return html`
      ${
        area
          ? html`<button
              class="menu-item"
              ?disabled=${areaCount === 0}
              title=${areaCount === 0 ? localize("picker.bulkAreaNone") : ""}
              @click=${() => this._emitBulkPlace(area.area_id)}
            >
              <ha-icon icon="mdi:map-marker-multiple"></ha-icon>
              ${localize("picker.bulkArea", {
                count: areaCount,
                area: area.name,
              })}
            </button>`
          : nothing
      }
      <button
        class="menu-item"
        ?disabled=${total === 0}
        title=${total === 0 ? localize("picker.bulkFloorNone") : ""}
        @click=${() => this._emitBulkPlace(null)}
      >
        <ha-icon icon="mdi:home-group-plus"></ha-icon>
        ${localize("picker.bulkFloor", { count: total })}
      </button>
    `;
  }

  override render() {
    const filtered = this._filtered;
    return html`
      <div
        class="resize-handle"
        @pointerdown=${this._onResizeHandlePointerDown}
      ></div>
      <div class="picker-head">
        <span class="picker-title">${localize("picker.title")}</span>
        <button
          class="picker-close"
          title=${localize("canvas.button.close")}
          aria-label=${localize("canvas.button.close")}
          @click=${() =>
            this.dispatchEvent(
              new CustomEvent("picker-close", {
                bubbles: true,
                composed: true,
              }),
            )}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      <div class="search">
        <div class="search-box">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            placeholder=${localize("picker.search")}
            .value=${this._search}
            @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)}
          />
          ${
            this._search
              ? html`<button
                  class="clear"
                  title=${localize("picker.clearSearch")}
                  aria-label=${localize("picker.clearSearch")}
                  @click=${() => (this._search = "")}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>`
              : nothing
          }
        </div>
        <div class="filters">
          <span class="select-wrap"
            ><select @change=${this._onFloorFilterChange}>
              <option
                value="all"
                ?selected=${this._effectiveFloorFilter === null}
              >
                ${localize("picker.allFloors")}
              </option>
              <option
                value=${PROPERTY_LOCATION_ID}
                ?selected=${this._effectiveFloorFilter === PROPERTY_LOCATION_ID}
              >
                ${localize("picker.outdoor")}
              </option>
              ${this.floors.map(
                (f) =>
                  html`<option
                    value=${f.floor_id}
                    ?selected=${this._effectiveFloorFilter === f.floor_id}
                  >
                    ${f.name}
                  </option>`,
              )}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
          <span class="select-wrap"
            ><select
              @change=${(e: Event) =>
                (this._areaFilter =
                  (e.target as HTMLSelectElement).value || null)}
            >
              <option value="" ?selected=${!this._areaFilter}>
                ${localize("picker.allAreas")}
              </option>
              ${this._areasForFilter.map(
                (a) =>
                  html`<option
                    value=${a.area_id}
                    ?selected=${this._areaFilter === a.area_id}
                  >
                    ${a.name}
                  </option>`,
              )}</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
          ${
            this._showMoreMenu
              ? html`<button
                  class="more-button"
                  title=${localize("picker.more")}
                  aria-label=${localize("picker.more")}
                  @click=${() => (this._menuOpen = !this._menuOpen)}
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>`
              : nothing
          }
        </div>
        <div class="filters">
          <span class="select-wrap"
            ><select
              aria-label=${localize("picker.showAll")}
              @change=${(e: Event) =>
                (this._placedFilter = (e.target as HTMLSelectElement)
                  .value as typeof this._placedFilter)}
            >
              <option value="all" ?selected=${this._placedFilter === "all"}>
                ${localize("picker.showAll")}
              </option>
              <option
                value="unplaced"
                ?selected=${this._placedFilter === "unplaced"}
              >
                ${localize("picker.showUnplaced")}
              </option>
              <option
                value="placed"
                ?selected=${this._placedFilter === "placed"}
              >
                ${localize("picker.showPlaced")}
              </option>
              ${
                this.approximateDeviceIds.size > 0 ||
                this._placedFilter === "approximate"
                  ? html`<option
                      value="approximate"
                      ?selected=${this._placedFilter === "approximate"}
                    >
                      ${localize("picker.showApproximate")}
                    </option>`
                  : nothing
              }
              ${
                this.hiddenDeviceIds.size > 0 || this._placedFilter === "hidden"
                  ? html`<option
                      value="hidden"
                      ?selected=${this._placedFilter === "hidden"}
                    >
                      ${localize("picker.showHidden")}
                    </option>`
                  : nothing
              }</select
            ><ha-icon class="chev" icon="mdi:menu-down"></ha-icon
          ></span>
          ${
            this._onFloorPlan
              ? html`<button
                  class="keep-armed ${this._keepArmed ? "on" : ""}"
                  title=${localize("picker.keepPlacingHint")}
                  aria-label=${localize("picker.keepPlacing")}
                  aria-pressed=${this._keepArmed ? "true" : "false"}
                  @click=${this._toggleKeepArmed}
                >
                  <ha-icon icon="mdi:repeat"></ha-icon>
                  ${localize("picker.keepPlacing")}
                </button>`
              : nothing
          }
        </div>
        ${
          this.approximateDeviceIds.size > 0
            ? html`<button
                class="approx-chip"
                title=${localize("picker.approximateHint")}
                @click=${() =>
                  (this._placedFilter =
                    this._placedFilter === "approximate"
                      ? "all"
                      : "approximate")}
              >
                <ha-icon icon="mdi:map-marker-question-outline"></ha-icon>
                ${localize("picker.approximateCount", {
                  count: this.approximateDeviceIds.size,
                })}
              </button>`
            : nothing
        }
        ${
          this._menuOpen && this._showMoreMenu
            ? html`<div class="more-menu floating-panel">
                ${this._renderBulkMenuItems()}
                ${
                  this.placedDeviceIds.size > 0
                    ? html`<button
                        class="menu-item danger"
                        @click=${() => {
                          this._menuOpen = false;
                          this.dispatchEvent(
                            new CustomEvent("clear-all-pins", {
                              detail: { areaId: this._areaFilter },
                              bubbles: true,
                              composed: true,
                            }),
                          );
                        }}
                      >
                        <ha-icon icon="mdi:playlist-remove"></ha-icon>
                        ${localize("picker.clearAll")}
                      </button>`
                    : nothing
                }
              </div>`
            : nothing
        }
      </div>
      <div class="list">
        ${
          filtered.length === 0
            ? html`<div class="empty">${localize("picker.noMatches")}</div>`
            : filtered.map((device) => {
                const placed = this.placedDeviceIds.has(device.deviceId);
                const blockedFloorName = this._blockedFloorName(device);
                const armed = this.armedEntityId === device.primaryEntityId;
                const subtitle = [device.areaName, device.integrationName]
                  .filter((part): part is string => !!part)
                  .join(" - ");
                return html`
                  <div
                    class="item ${armed ? "armed" : ""} ${placed ? "placed" : ""} ${
                      blockedFloorName ? "blocked" : ""
                    }"
                    title=${
                      blockedFloorName
                        ? localize("picker.alreadyPlaced", {
                            floor: blockedFloorName,
                          })
                        : [device.deviceName, subtitle]
                            .filter((part): part is string => !!part)
                            .join(" · ")
                    }
                    @click=${() => {
                      if (blockedFloorName) return;
                      this.dispatchEvent(
                        new CustomEvent("entity-armed", {
                          detail: { entityId: device.primaryEntityId },
                          bubbles: true,
                          composed: true,
                        }),
                      );
                    }}
                  >
                    <span class="avatar">
                      ${
                        device.integrationDomain
                          ? html`<img
                              src="https://brands.home-assistant.io/_/${device.integrationDomain}/icon.png"
                              alt=""
                              @error=${(e: Event) => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = "none";
                                img.nextElementSibling?.classList.remove(
                                  "hidden",
                                );
                              }}
                            />`
                          : nothing
                      }
                      <ha-icon
                        icon=${GENERIC_DEVICE_ICON_NAME}
                        class=${device.integrationDomain ? "hidden" : ""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${device.deviceName}</span>
                      ${
                        blockedFloorName
                          ? html`<span class="meta"
                              >${localize("picker.placedOn", { floor: blockedFloorName })}</span
                            >`
                          : subtitle
                            ? html`<span class="meta">${subtitle}</span>`
                            : nothing
                      }
                      ${
                        placed
                          ? html`<span class="meta"
                              >${localize(
                                this.approximateDeviceIds.has(device.deviceId)
                                  ? "picker.placedApproximate"
                                  : "picker.placed",
                              )}</span
                            >`
                          : nothing
                      }
                    </span>
                    ${
                      !placed
                        ? html`<span class="row-actions">
                            <button
                              title=${localize(
                                this.hiddenDeviceIds.has(device.deviceId)
                                  ? "picker.unhide"
                                  : "picker.hide",
                              )}
                              aria-label=${localize(
                                this.hiddenDeviceIds.has(device.deviceId)
                                  ? "picker.unhide"
                                  : "picker.hide",
                              )}
                              @click=${(e: Event) =>
                                this._emitForDevice(
                                  e,
                                  this.hiddenDeviceIds.has(device.deviceId)
                                    ? "device-unhide"
                                    : "device-hide",
                                  device.deviceId,
                                )}
                            >
                              <ha-icon
                                icon=${
                                  this.hiddenDeviceIds.has(device.deviceId)
                                    ? "mdi:eye-outline"
                                    : "mdi:eye-off-outline"
                                }
                              ></ha-icon>
                            </button>
                          </span>`
                        : nothing
                    }
                    ${
                      placed
                        ? html`<span class="row-actions">
                            <button
                              title=${localize("picker.locate")}
                              aria-label=${localize("picker.locate")}
                              @click=${(e: Event) =>
                                this._emitForDevice(
                                  e,
                                  "pin-locate",
                                  device.deviceId,
                                )}
                            >
                              <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
                            </button>
                            <button
                              title=${localize("picker.remove")}
                              aria-label=${localize("picker.remove")}
                              @click=${(e: Event) =>
                                this._emitForDevice(
                                  e,
                                  "pin-remove",
                                  device.deviceId,
                                )}
                            >
                              <ha-icon icon="mdi:delete-outline"></ha-icon>
                            </button>
                          </span>`
                        : nothing
                    }
                  </div>
                `;
              })
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "entity-picker-sidebar": EntityPickerSidebar;
  }
}
