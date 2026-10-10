import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import { PROPERTY_LOCATION_ID } from "../types";
import type { AreaMeta, FloorMeta, PlaceableEntity } from "../types";
import { pickDisplayEntity } from "../canvas/device-display";
import { localize } from "../i18n";
import { selectStyles, sharedStyles } from "../styles";

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
    css`
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        width: var(--sc-picker-width, 300px);
        min-width: 240px;
        max-width: 600px;
        border-left: 1px solid var(--sc-divider);
        background: var(--sc-panel-bg);
        height: 100%;
        overflow: hidden;
      }
      .picker-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 8px 0 16px;
      }
      .picker-title {
        font-size: var(--sc-fs-title);
      }
      .picker-close {
        display: grid;
        place-items: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border-radius: 50%;
      }
      /* Phones: a sheet under the canvas, not a column beside it. */
      @media (max-width: 700px) {
        :host {
          flex: 0 0 45%;
          width: 100%;
          min-width: 0;
          max-width: none;
          height: auto;
          border-left: none;
          border-top: 1px solid var(--sc-divider);
        }
        .resize-handle {
          display: none;
        }
      }
      .resize-handle {
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        cursor: ew-resize;
        z-index: 1;
      }
      .search {
        padding: 12px;
      }
      .more-button {
        flex: none;
        display: grid;
        place-items: center;
        width: 36px;
        height: var(--sc-h-field);
        padding: 0;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        color: var(--sc-fg-secondary);
      }
      .more-menu {
        position: absolute;
        right: 12px;
        z-index: 5;
        margin-top: 4px;
        min-width: 220px;
        padding: 6px;
      }
      .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        height: var(--sc-h-control);
        padding: 0 12px;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-bg);
      }
      .search-box:focus-within {
        border-color: var(--sc-accent);
      }
      .search-box .clear {
        display: grid;
        place-items: center;
        width: 24px;
        height: 24px;
        padding: 0;
        border-radius: 50%;
        color: var(--sc-fg-secondary);
      }
      .search-box ha-icon {
        --mdc-icon-size: 18px;
        color: var(--sc-fg-secondary);
        flex-shrink: 0;
      }
      .search-box input {
        flex: 1;
        min-width: 0;
        border: none;
        outline: none;
        background: transparent;
        font-size: var(--sc-fs-body);
        color: var(--sc-fg);
      }
      .filters {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      .filters .select-wrap {
        flex: 1;
      }
      .filters select {
        flex: 1;
        min-width: 0;
        height: var(--sc-h-field);
        padding: 0 12px;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-size: var(--sc-fs-small);
      }
      .list {
        overflow-y: auto;
        flex: 1;
        border-top: 1px solid var(--sc-divider);
      }
      .item {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 60px;
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid var(--sc-divider);
      }
      .item:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .item.armed {
        background: color-mix(in srgb, var(--sc-accent) 18%, transparent);
        color: var(--sc-accent);
      }
      .item.armed .meta {
        color: var(--sc-fg-secondary);
      }
      .item.placed {
        opacity: 0.55;
      }
      .item.blocked {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .item.blocked:hover {
        background: transparent;
      }
      .item .avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: var(--sc-h-field);
        border-radius: 50%;
        background: rgba(127, 127, 127, 0.2);
        flex-shrink: 0;
      }
      .item .avatar ha-icon {
        --mdc-icon-size: 20px;
        color: var(--sc-fg-secondary);
      }
      .item .avatar img {
        width: 24px;
        height: 24px;
        object-fit: contain;
      }
      .item .avatar ha-icon.hidden {
        display: none;
      }
      .item .text {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .item .name {
        font-size: var(--sc-fs-body);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item .meta {
        font-size: var(--sc-fs-caption);
        color: var(--sc-fg-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .empty {
        padding: 16px;
        color: var(--sc-fg-secondary);
        font-size: var(--sc-fs-body);
      }
    `,
  ];

  @state() private _menuOpen = false;
  @property({ attribute: false }) entities: PlaceableEntity[] = [];
  @property({ attribute: false }) placedDeviceIds: Set<string> = new Set();
  @property({ attribute: false }) armedEntityId: string | null = null;
  @property({ attribute: false }) floors: FloorMeta[] = [];
  @property({ attribute: false }) areas: AreaMeta[] = [];
  @property({ attribute: false }) currentFloorId: string | null = null;
  /** Floor-less areas (a Back Deck, say) that a room on the current floor
   * is linked to — counted as part of the current floor by the floor
   * filter, since that's where they've been drawn. */
  @property({ attribute: false }) linkedAreaIds: Set<string> = new Set();

  @state() private _search = "";
  /** null = "follow whichever floor is currently open" (the useful default
   * while placing devices onto that floor's plan); "all" = no floor
   * scoping at all; anything else is an explicit floor_id the user picked
   * from the dropdown, overriding the follow-current-floor default. */
  @state() private _floorFilter: string | "all" | null = null;
  @state() private _areaFilter: string | null = null;

  // --- resizable width (per-browser, not shared — see #22) --------------

  private static readonly WIDTH_STORAGE_KEY =
    "spatial-context.entityPickerSidebarWidth";
  private static readonly MIN_WIDTH = 240;
  private static readonly MAX_WIDTH = 600;

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
    return this._devices.filter((d) => {
      if (areaId) {
        if (d.areaId !== areaId) return false;
      } else if (floorId) {
        const area = this.areas.find((a) => a.area_id === d.areaId);
        if (!area || !this._areaIsOnFloor(area, floorId)) return false;
      }
      if (!q) return true;
      return (
        d.deviceName.toLowerCase().includes(q) ||
        (d.areaName ?? "").toLowerCase().includes(q) ||
        d.entities.some((e) => e.entity_id.toLowerCase().includes(q))
      );
    });
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
              <option value="all" ?selected=${this._floorFilter === "all"}>
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
            this.placedDeviceIds.size > 0
              ? html`<button
                  class="more-button"
                  title=${localize("picker.more")}
                  @click=${() => (this._menuOpen = !this._menuOpen)}
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>`
              : nothing
          }
        </div>
        ${
          this._menuOpen && this.placedDeviceIds.size > 0
            ? html`<div class="more-menu floating-panel">
                <button
                  class="menu-item danger"
                  @click=${() => {
                    this._menuOpen = false;
                    this.dispatchEvent(
                      new CustomEvent("clear-all-pins", {
                        bubbles: true,
                        composed: true,
                      }),
                    );
                  }}
                >
                  <ha-icon icon="mdi:playlist-remove"></ha-icon>
                  ${localize("picker.clearAll")}
                </button>
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
                      ${placed ? html`<span class="meta">${localize("picker.placed")}</span>` : nothing}
                    </span>
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
