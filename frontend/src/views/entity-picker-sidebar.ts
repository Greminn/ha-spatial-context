import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { AreaMeta, FloorMeta, PlaceableEntity } from "../types";
import { sharedStyles } from "../styles";

/** Row avatar icon per domain — `mdi:` name strings (not path data, unlike
 * canvas/pin-icons.ts) since this list is plain HTML, not SVG-nested, so
 * `<ha-icon>` works fine here. Same domain→icon choices as the map pins,
 * so a device looks the same in the picker as it does once placed. */
const DOMAIN_ICON_NAMES: Record<string, string> = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  sensor: "mdi:eye",
  binary_sensor: "mdi:eye",
  climate: "mdi:thermostat",
  lock: "mdi:lock",
  cover: "mdi:window-shutter",
  camera: "mdi:cctv",
  media_player: "mdi:speaker",
  fan: "mdi:fan",
  humidifier: "mdi:air-humidifier",
  vacuum: "mdi:robot-vacuum",
  alarm_control_panel: "mdi:shield-home",
  water_heater: "mdi:water-boiler",
  device_tracker: "mdi:crosshairs-gps",
  valve: "mdi:valve",
  siren: "mdi:bullhorn",
  assist_satellite: "mdi:microphone-variant",
};

/** Placement is per physical device, not per entity — a device with several
 * entities (e.g. a combo temp/humidity/motion sensor) still occupies one
 * spot in the house, so it gets one row and one pin. This ranks a device's
 * entities so the "main" one (light over its diagnostic-adjacent sensors,
 * etc.) becomes the entity_id the pin actually stores. */
const DOMAIN_PRIORITY = [
  "light",
  "switch",
  "climate",
  "media_player",
  "lock",
  "cover",
  "fan",
  "vacuum",
  "alarm_control_panel",
  "valve",
  "humidifier",
  "siren",
  "water_heater",
  "camera",
  "assist_satellite",
  "device_tracker",
  "binary_sensor",
  "sensor",
];

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

@customElement("entity-picker-sidebar")
export class EntityPickerSidebar extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        width: 300px;
        min-width: 300px;
        border-left: 1px solid var(--sc-divider);
        background: var(--sc-panel-bg);
        height: 100%;
        overflow: hidden;
      }
      .search {
        padding: 12px;
      }
      .clear-all-button {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        margin-top: 8px;
        padding: 8px 12px;
        font-size: 13px;
        color: var(--sc-danger);
        border-radius: 8px;
        justify-content: flex-start;
      }
      .clear-all-button ha-icon {
        --mdc-icon-size: 18px;
      }
      .search-box {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 40px;
        padding: 0 12px;
        border: 1px solid rgb(94, 94, 94);
        border-radius: 10px;
        background: var(--sc-bg);
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
        font-size: 14px;
        color: var(--sc-fg);
      }
      .filters {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }
      .filters select {
        flex: 1;
        min-width: 0;
        height: 36px;
        padding: 0 8px;
        border: 1px solid rgb(94, 94, 94);
        border-radius: 10px;
        background: var(--sc-bg);
        color: var(--sc-fg);
        font-size: 13px;
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
        background: var(--sc-accent);
        color: white;
      }
      .item.armed .meta {
        color: rgba(255, 255, 255, 0.75);
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
        height: 36px;
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
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .item .meta {
        font-size: 12px;
        color: var(--sc-fg-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .empty {
        padding: 16px;
        color: var(--sc-fg-secondary);
        font-size: 14px;
      }
    `,
  ];

  @property({ attribute: false }) entities: PlaceableEntity[] = [];
  @property({ attribute: false }) placedEntityIds: Set<string> = new Set();
  @property({ attribute: false }) armedEntityId: string | null = null;
  @property({ attribute: false }) floors: FloorMeta[] = [];
  @property({ attribute: false }) areas: AreaMeta[] = [];
  @property({ attribute: false }) currentFloorId: string | null = null;

  @state() private _search = "";
  /** null = "follow whichever floor is currently open" (the useful default
   * while placing devices onto that floor's plan); "all" = no floor
   * scoping at all; anything else is an explicit floor_id the user picked
   * from the dropdown, overriding the follow-current-floor default. */
  @state() private _floorFilter: string | "all" | null = null;
  @state() private _areaFilter: string | null = null;

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
      : this.areas.filter((a) => a.floor_id === floorId);
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
      const sorted = [...entities].sort((a, b) => {
        const categoryRank = (e: PlaceableEntity) =>
          e.entity_category ? 1 : 0;
        const domainRank = (e: PlaceableEntity) => {
          const i = DOMAIN_PRIORITY.indexOf(e.domain);
          return i === -1 ? DOMAIN_PRIORITY.length : i;
        };
        return (
          categoryRank(a) - categoryRank(b) || domainRank(a) - domainRank(b)
        );
      });
      const primary = sorted[0]!;
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
        if (!area || area.floor_id !== floorId) return false;
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
      <div class="search">
        <div class="search-box">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="search"
            placeholder="Search devices…"
            .value=${this._search}
            @input=${(e: Event) => (this._search = (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="filters">
          <select @change=${this._onFloorFilterChange}>
            <option value="all" ?selected=${this._floorFilter === "all"}>
              All Floors
            </option>
            ${this.floors.map(
              (f) =>
                html`<option
                  value=${f.floor_id}
                  ?selected=${this._effectiveFloorFilter === f.floor_id}
                >
                  ${f.name}
                </option>`,
            )}
          </select>
          <select
            @change=${(e: Event) =>
              (this._areaFilter =
                (e.target as HTMLSelectElement).value || null)}
          >
            <option value="" ?selected=${!this._areaFilter}>All Areas</option>
            ${this._areasForFilter.map(
              (a) =>
                html`<option
                  value=${a.area_id}
                  ?selected=${this._areaFilter === a.area_id}
                >
                  ${a.name}
                </option>`,
            )}
          </select>
        </div>
        ${
          this.placedEntityIds.size > 0
            ? html`<button
                class="clear-all-button"
                @click=${() =>
                  this.dispatchEvent(
                    new CustomEvent("clear-all-pins", {
                      bubbles: true,
                      composed: true,
                    }),
                  )}
              >
                <ha-icon icon="mdi:playlist-remove"></ha-icon> Clear all placed
                devices
              </button>`
            : nothing
        }
      </div>
      <div class="list">
        ${
          filtered.length === 0
            ? html`<div class="empty">No matching devices.</div>`
            : filtered.map((device) => {
                const placed = device.entities.some((e) =>
                  this.placedEntityIds.has(e.entity_id),
                );
                const blockedFloorName = this._blockedFloorName(device);
                const armed = this.armedEntityId === device.primaryEntityId;
                const primaryDomain = device.entities.find(
                  (e) => e.entity_id === device.primaryEntityId,
                )?.domain;
                const icon =
                  DOMAIN_ICON_NAMES[primaryDomain ?? ""] ?? "mdi:help-box";
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
                        ? `Already placed on ${blockedFloorName} — remove it there first`
                        : ""
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
                        icon=${icon}
                        class=${device.integrationDomain ? "hidden" : ""}
                      ></ha-icon>
                    </span>
                    <span class="text">
                      <span class="name">${device.deviceName}</span>
                      ${
                        blockedFloorName
                          ? html`<span class="meta"
                              >Placed on ${blockedFloorName}</span
                            >`
                          : subtitle
                            ? html`<span class="meta">${subtitle}</span>`
                            : nothing
                      }
                      ${placed ? html`<span class="meta">✓ placed</span>` : nothing}
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
