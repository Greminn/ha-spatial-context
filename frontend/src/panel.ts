import { LitElement, html, css, nothing } from "lit";
import { query, state } from "lit/decorators.js";
import { safeCustomElement } from "./define";
import type {
  AreaMeta,
  BluetoothAdvertisement,
  CanvasMode,
  ContentBounds,
  FloorLayout,
  FloorMeta,
  HomeAssistant,
  MatterNetworkTopology,
  NetworkType,
  Opening,
  OpeningType,
  Pin,
  PlaceableEntity,
  PropertyLayout,
  PropertyMeshEnd,
  PropertyMeshLink,
  MapBackground,
  MapStyleKind,
  PlacementGhost,
  PropertyPlacement,
  ResolvedMeshLink,
  ResolvedMeshStub,
  Room,
  Settings,
  SnapMode,
  VersionInfo,
  Wall,
  WifiMesh,
  ZigbeeMesh,
} from "./types";
import { PROPERTY_LOCATION_ID } from "./types";
import {
  bleRssiToQuality,
  dbmToQuality,
  lqiToQuality,
} from "./canvas/mesh-colors";
import { pinDisplayLabel } from "./canvas/device-display";
import { selectZigbeeLinks, withCoordinatorDevice } from "./zigbee-links";
import { EditHistory } from "./history";
import { debugLog } from "./debug-log";
import { floorToProperty, propertyToFloor } from "./canvas/property-mapping";
import {
  HaClient,
  backgroundImageUrl,
  emptyFloorLayout,
  emptyPin,
  emptyPropertyLayout,
  emptySettings,
  newId,
  newOpening,
  newPlacement,
  newRoom,
  newWall,
} from "./ha-client";
import {
  findRoomForPoint,
  pointInPolygon,
  rayBoxExit,
  reassignPinRooms,
} from "./canvas/geometry";
import { largeUnitLabel, parseLarge, unitsPerDisplayUnit } from "./units";
import {
  selectStyles,
  sharedStyles,
  sliderStyles,
  switchStyles,
} from "./styles";
import "./canvas/floorplan-canvas";
import type { AlignOverlay, FloorplanCanvas } from "./canvas/floorplan-canvas";
import "./canvas/property-canvas";
import {
  DEFAULT_PLACEMENT_HEIGHT,
  DEFAULT_PLACEMENT_WIDTH,
} from "./canvas/property-canvas";
import type { PropertyCanvas } from "./canvas/property-canvas";
import "./views/app-header";
import "./views/canvas-overlay";
import "./views/icon-popover";
import "./views/row-actions";
import "./views/entity-picker-sidebar";
import "./views/property-overlay";
import "./views/icon-picker-dialog";
import { localize } from "./i18n";
import { panMap, rotateMapTo, zoomMap } from "./map/map-camera";
import "./views/settings-menu";
import type { PropertyBuilding } from "./views/property-overlay";

/** Snap mode is per-browser, like the picker sidebar's width — a drawing
 * habit, not a fact every viewer should share. Browser storage can throw
 * or come back empty; fall back to snapping onto everything. */
const SNAP_MODE_STORAGE_KEY = "spatial-context-snap-mode";

function readStoredSnapMode(): SnapMode {
  try {
    const raw = localStorage.getItem(SNAP_MODE_STORAGE_KEY);
    if (raw === "all" || raw === "same" || raw === "off") return raw;
  } catch {
    // Fall through to the default.
  }
  return "all";
}

@safeCustomElement("spatial-context-panel")
export class SpatialContextPanel extends LitElement {
  static override styles = [
    sharedStyles,
    selectStyles,
    sliderStyles,
    switchStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        /* iOS Safari: 100vh is taller than the visible area. */
        height: 100dvh;
        background: var(--sc-bg);
      }
      .main {
        flex: 1;
        display: flex;
        min-height: 0;
        position: relative;
      }
      .save-error {
        position: absolute;
        top: 68px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 5;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: min(640px, calc(100% - 32px));
        padding: 8px 12px;
        border-left: 4px solid var(--sc-danger);
        font-size: var(--sc-fs-body);
      }
      .save-error ha-icon {
        color: var(--sc-danger);
        flex: none;
      }
      /* Phones: the device picker becomes a sheet under the canvas. */
      @media (max-width: 700px) {
        .main {
          flex-direction: column;
        }
        .canvas-area {
          min-height: 0;
        }
      }
      .canvas-area {
        flex: 1;
        min-width: 0;
        position: relative;
        /* Room for the controls row the overlay draws across the top. */
        padding-top: 56px;
      }
      .canvas-area.drag-over {
        outline: 2px dashed var(--sc-accent);
        outline-offset: -2px;
      }
      .loading,
      .no-floors {
        padding: 32px;
        color: var(--sc-fg-secondary);
      }
      .popover-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        min-height: 44px;
        padding: 6px 16px;
        font-size: var(--sc-fs-row);
      }
      .menu-divider {
        height: 1px;
        margin: 6px 0;
        background: var(--sc-divider);
      }
      .menu-item .trail {
        margin-left: auto;
        color: var(--sc-accent);
      }
      /* Innerspace-style layer menu: "Connectivity Map" opens a list of
       * mutually-exclusive layers (only one network is ever drawn at once)
       * instead of a plain <select>, plus a quality legend echoing the
       * same weak/medium/strong colors the mesh lines themselves use. */
      .layer-list {
        display: flex;
        flex-direction: column;
        min-width: 220px;
      }
      .hidden-file-input {
        display: none;
      }
      input[type="range"] {
        width: 130px;
      }
      .popover-row select {
        height: var(--sc-h-field);
        padding: 0 12px;
        border: 1px solid var(--sc-divider);
        border-radius: var(--sc-r-control);
        background: var(--sc-panel-bg);
        color: var(--sc-fg);
        font: inherit;
        font-size: var(--sc-fs-body);
      }
      .popover-row select:focus {
        outline: none;
        border-color: var(--sc-accent);
      }
      .hint {
        font-size: var(--sc-fs-small);
        color: var(--sc-fg-secondary);
      }
    `,
  ];

  @state() private _floors: FloorMeta[] = [];
  @state() private _currentFloorId: string | null = null;
  @state() private _layout: FloorLayout = emptyFloorLayout();
  @state() private _entities: PlaceableEntity[] = [];
  @state() private _areas: AreaMeta[] = [];
  @state() private _mode: CanvasMode = "select";
  @state() private _snapMode: SnapMode = readStoredSnapMode();
  /** Drop-zone highlight while dragging a file over the canvas — see
   * _onCanvasDragOver/_onCanvasDrop. */
  @state() private _dragOverCanvas = false;
  @state() private _armedEntityId: string | null = null;
  @state() private _armedOpeningType: OpeningType | null = null;
  @state() private _selectedRoomId: string | null = null;
  @state() private _editingRoomId: string | null = null;
  @state() private _selectedPinId: string | null = null;
  /** Set when a click/placement lands where 2+ pins share a spot — the
   * overlay shows a picker instead of guessing which one was meant. */
  @state() private _pinStackIds: string[] | null = null;
  @state() private _selectedWallId: string | null = null;
  @state() private _editingWallId: string | null = null;
  @state() private _selectedOpeningId: string | null = null;
  @state() private _selectedMeshLink: ResolvedMeshLink | null = null;
  @state() private _selectedMeshStub: ResolvedMeshStub | null = null;
  /** device_id -> {pin, floorId} for every OTHER floor's placed pins,
   * refetched on every floor switch — powers the cross-floor mesh stub
   * feature (_meshStubsForCurrentFloor), which needs to know both WHERE a
   * link's other end really is and WHICH floor it's on. */
  @state() private _otherFloorPinsByDeviceId: Map<
    string,
    { pin: Pin; floorId: string }
  > = new Map();
  @state() private _dirty = false;
  @state() private _saving = false;
  @state() private _loading = true;
  @state() private _pendingCount = 0;
  /** null = no layer picked — the Connectivity Map's neutral starting
   * state, both on first load and every time the popover is reopened (see
   * _onToggleMeshPopover). Nothing should read as "on" until the user
   * explicitly picks a network. */
  @state() private _networkType: NetworkType | null = null;
  @state() private _zigbeeMesh: ZigbeeMesh | null = null;
  @state() private _zigbeeMeshLoading = false;
  @state() private _zigbeeMeshError: string | null = null;
  @state() private _zigbeeMeshFetchedAt: number | null = null;
  /** Ticks once a second while the Zigbee fetch is in flight — the request
   * genuinely takes 90-130+ seconds (a live over-the-air neighbor-table
   * poll via Z2M/MQTT), and with nothing on screen changing for that long,
   * a static "Refreshing…" label is indistinguishable from a hung/broken
   * request. A live counter is the difference between "still working" and
   * "looks stuck" for something this slow. */
  @state() private _zigbeeMeshElapsedSeconds = 0;
  private _zigbeeMeshTimer: number | null = null;
  /** Full neighbor table instead of selectZigbeeLinks' default pick. */
  @state() private _zigbeeShowAllLinks = false;
  @state() private _wifiMesh: WifiMesh | null = null;
  @state() private _wifiMeshLoading = false;
  @state() private _wifiMeshError: string | null = null;
  @state() private _matterTopology: MatterNetworkTopology | null = null;
  @state() private _matterError: string | null = null;
  private _matterUnsubscribe: (() => void) | null = null;
  /** Bluetooth layer (#4): latest advertisement per BLE address, published
   * from a buffer every couple of seconds — HA streams one message per
   * advertisement, far more often than the map needs redrawing. */
  @state() private _bluetoothAdverts: Map<string, BluetoothAdvertisement> =
    new Map();
  private _bluetoothBuffer: Map<string, BluetoothAdvertisement> = new Map();
  private _bluetoothFlushTimer: number | null = null;
  @state() private _bluetoothDevices: Record<string, string[]> = {};
  @state() private _bluetoothError: string | null = null;
  private _bluetoothUnsubscribe: (() => void) | null = null;
  @state() private _backgroundPopoverOpen = false;
  @state() private _meshPopoverOpen = false;
  /** Shared across every viewer of the panel (see ha-client.ts's
   * getSettings/saveSettings) — not per-browser, same as floors/property. */
  @state() private _settings: Settings = emptySettings();
  @state() private _settingsPopoverOpen = false;
  @state() private _moreOptionsPopoverOpen = false;

  // --- Property tab ---------------------------------------------------
  @state() private _view: "floor" | "property" = "floor";
  @state() private _placementGhosts: Map<string, PlacementGhost> = new Map();
  @state() private _propertyLayout: PropertyLayout = emptyPropertyLayout();
  @state() private _propertyDirty = false;
  /** Why the last save failed, until one succeeds — shown as a banner.
   * A failed save used to fail silently (only the dirty dot stayed on),
   * which with auto-save meant work could quietly never be stored. */
  @state() private _saveError: string | null = null;
  /** Which pin's icon the icon picker (#17) is choosing, or null when closed. */
  @state() private _iconPickerFor: {
    kind: "floor" | "outdoor";
    pinId: string;
  } | null = null;
  /** Version handshake result (see debug.py): the browser is running an
   * older panel than the one installed ("reload"), or HA hasn't restarted
   * since an update ("restart"). Null when everything matches. */
  @state() private _versionNotice: "reload" | "restart" | null = null;
  /** Pending auto-save (#32), debounced after each edit. */
  private _autoSaveTimer: number | null = null;
  /** Set by bulk-destructive actions (reset floor/property, remove all
   * pins), whose prompts promise "nothing is permanent until you hit
   * Save" — auto-save stays off until a manual Save (or a discard) so an
   * accidental reset isn't committed three seconds later. */
  private _autoSaveHeld = false;
  /** Undo/redo (#15) — the open floor's and the Property tab's, separately. */
  private _floorHistory = new EditHistory<FloorLayout>();
  private _propertyHistory = new EditHistory<PropertyLayout>();
  /** The Property layout as it was when the current drag started — what
   * Esc restores (see property-canvas.ts's cancelGesture). */
  private _propertyDragStart: PropertyLayout | null = null;
  @state() private _propertySaving = false;
  @state() private _selectedPlacementId: string | null = null;
  @state() private _propertyMode: "select" | "place" | "place-pin" | "map" =
    "select";
  /** Selected outdoor device pin on the Property tab. */
  @state() private _selectedOutdoorPinId: string | null = null;
  /** Selected Connectivity Map line on the Property tab (its key). */
  @state() private _selectedPropertyMeshLinkKey: string | null = null;
  @state() private _armedBuildingKey: string | null = null;
  /** Set in `_selectFloor` right before `_layout` is overwritten — passed
   * to floorplan-canvas.ts as `sameBuildingAsPrevious` so it knows whether
   * to keep the live pan/zoom when the floor just switched to has no
   * saved view of its own (see that component's `updated()`). */
  @state() private _sameBuildingAsPreviousFloor = false;

  /** Align Floors mode's working state — none of this is persisted until
   * Apply; Cancel or leaving align mode (see _resetAlignState) just drops
   * it. `_alignOffsetX/Y` + `_alignScale` are the live adjustment the user
   * is dragging/resizing, layered on top of whatever placement the target
   * floor's background already has (see floorplan-canvas.ts's
   * _renderAlignOverlay and this file's `_alignOverlay` getter). */
  @state() private _alignTargetFloorId: string | null = null;
  @state() private _alignTargetLayout: FloorLayout | null = null;
  @state() private _alignOffsetX = 0;
  @state() private _alignOffsetY = 0;
  @state() private _alignScale = 1;

  @query("floorplan-canvas") private _canvas?: FloorplanCanvas;
  @query("property-canvas") private _propertyCanvas?: PropertyCanvas;
  @query("#file-input") private _fileInput?: HTMLInputElement;

  private _hass?: HomeAssistant;
  private _initialized = false;

  set hass(value: HomeAssistant) {
    this._hass = value;
    if (!this._initialized) {
      this._initialized = true;
      void this._init();
    }
  }
  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  private get _client(): HaClient {
    return new HaClient(this._hass!);
  }

  private get _entityLookup(): Map<string, PlaceableEntity> {
    return new Map(this._entities.map((e) => [e.entity_id, e]));
  }

  private get _placedDeviceIds(): Set<string> {
    return new Set(
      (this._view === "property"
        ? this._propertyLayout.pins
        : this._layout.pins
      )
        .map((p) => p.device_id)
        .filter((id): id is string => id !== null),
    );
  }

  private get _selectedRoom(): Room | null {
    return (
      this._layout.rooms.find((r) => r.id === this._selectedRoomId) ?? null
    );
  }

  /** Areas a room on this floor can be linked to: the floor's own, plus
   * every area HA has on no floor at all — a Back Deck or Driveway sits
   * outside the house but still gets drawn onto a floor's plan. The area
   * itself stays floor-less in HA; only this layout links to it. */
  private get _areasForCurrentFloor(): AreaMeta[] {
    return this._areas.filter(
      (a) => a.floor_id === this._currentFloorId || a.floor_id === null,
    );
  }

  /** Floor-less areas a room on the current floor is linked to — the
   * device picker treats these as part of this floor, so a Back Deck
   * room's devices show up under Top Floor without switching to "All
   * Floors". */
  private get _outdoorAreaIdsOnCurrentFloor(): Set<string> {
    const floorless = new Set(
      this._areas.filter((a) => a.floor_id === null).map((a) => a.area_id),
    );
    return new Set(
      this._layout.rooms
        .map((r) => r.area_id)
        .filter((id): id is string => id !== null && floorless.has(id)),
    );
  }

  private get _otherFloors(): FloorMeta[] {
    return this._floors.filter((f) => f.floor_id !== this._currentFloorId);
  }

  /** Groups floors into "buildings" for the Property tab — floors sharing
   * a non-null building_id (linked via Align Floors) collapse to one entry;
   * a floor that's never been aligned to anything (a detached Garage, say)
   * is its own building, keyed by its own floor_id. */
  private get _buildings(): PropertyBuilding[] {
    const groups = new Map<string, FloorMeta[]>();
    for (const floor of this._floors) {
      const key = floor.building_id ?? floor.floor_id;
      const list = groups.get(key);
      if (list) list.push(floor);
      else groups.set(key, [floor]);
    }
    return [...groups.entries()].map(([key, floors]) => {
      const primary = floors[0]!;
      return {
        key,
        name:
          floors.length > 1
            ? floors.map((f) => f.name).join(" + ")
            : primary.name,
        icon: primary.icon || "mdi:home-city",
        floorId: primary.floor_id,
        buildingId: primary.building_id,
        aspectRatio: this._buildingAspectRatio(floors),
      };
    });
  }

  /** Union of every floor's traced footprint in the group (valid without
   * any further transform since floors sharing a building_id already
   * share one coordinate system — that's what Align Floors sets up), or a
   * neutral fallback ratio when nothing's been traced yet on any of them. */
  private _buildingAspectRatio(floors: FloorMeta[]): number {
    const bounds = this._buildingBounds(floors);
    const width = bounds ? bounds.max_x - bounds.min_x : 0;
    const height = bounds ? bounds.max_y - bounds.min_y : 0;
    return width > 0 && height > 0
      ? width / height
      : DEFAULT_PLACEMENT_WIDTH / DEFAULT_PLACEMENT_HEIGHT;
  }

  /** Union of a building's floors' traced footprints (see
   * _buildingAspectRatio), or null when none has anything traced. */
  private _buildingBounds(floors: FloorMeta[]): ContentBounds | null {
    const bounds = floors
      .map((f) => f.content_bounds)
      .filter((b): b is ContentBounds => b !== null);
    if (bounds.length === 0) return null;
    return {
      min_x: Math.min(...bounds.map((b) => b.min_x)),
      min_y: Math.min(...bounds.map((b) => b.min_y)),
      max_x: Math.max(...bounds.map((b) => b.max_x)),
      max_y: Math.max(...bounds.map((b) => b.max_y)),
    };
  }

  private get _floorNameById(): Map<string, string> {
    return new Map(this._floors.map((f) => [f.floor_id, f.name]));
  }

  private get _floorIconById(): Map<string, string> {
    return new Map(
      this._floors.map((f) => [f.floor_id, f.icon || "mdi:floor-plan"]),
    );
  }

  /** Placements whose building still has a floor in HA (#37) — a
   * building whose floors were all deleted stays in storage, just not
   * drawn. One whose anchor floor alone was deleted is re-anchored (in
   * this display copy only) onto a surviving floor of its building, so
   * its name/icon still resolve. Mirrors storage.py's live_placements. */
  private get _livePlacements(): PropertyPlacement[] {
    const live: PropertyPlacement[] = [];
    for (const p of this._propertyLayout.placements) {
      if (this._floors.some((f) => f.floor_id === p.floor_id)) {
        live.push(p);
        continue;
      }
      const member =
        p.building_id !== null
          ? this._floors.find((f) => f.building_id === p.building_id)
          : undefined;
      if (member) live.push({ ...p, floor_id: member.floor_id });
    }
    return live;
  }

  private get _selectedPlacement(): PropertyPlacement | null {
    return (
      this._livePlacements.find((p) => p.id === this._selectedPlacementId) ??
      null
    );
  }

  /** Which layout's background fields the header's "Background" popover
   * currently targets — the floor being viewed, or the whole-property
   * layout when the Property tab is active (see _onFileInputChange etc). */
  private get _activeBackground(): { imageId: string | null; opacity: number } {
    return this._view === "property"
      ? {
          imageId: this._propertyLayout.background_image_id,
          opacity: this._propertyLayout.background_opacity,
        }
      : {
          imageId: this._layout.background_image_id,
          opacity: this._layout.background_opacity,
        };
  }

  /** The live Align Floors overlay to draw, or null outside align mode /
   * before a target floor with a background has been chosen. Composes the
   * target floor's own existing background placement with the user's live
   * drag/scale adjustment — see floorplan-canvas.ts's _renderAlignOverlay
   * for why this composition (not just the raw adjustment) is what needs
   * to be drawn. */
  private get _alignOverlay(): AlignOverlay | null {
    if (this._mode !== "align" || !this._alignTargetLayout) return null;
    const url = backgroundImageUrl(this._alignTargetLayout.background_image_id);
    if (!url) return null;
    const target = this._alignTargetLayout;
    return {
      imageUrl: url,
      offsetX:
        this._alignScale * target.background_offset_x + this._alignOffsetX,
      offsetY:
        this._alignScale * target.background_offset_y + this._alignOffsetY,
      scale: this._alignScale * target.background_scale,
      opacity: 0.55,
    };
  }

  /** Floors in tab display order (#30). The backend always sends them
   * top-down, matching HA's own Areas page; "ground_up" reverses the
   * leveled floors only — unleveled ones (a detached Garage, say) stay
   * last either way rather than jumping to the front. */
  private get _orderedFloors(): FloorMeta[] {
    if (this._settings.floor_order !== "ground_up") return this._floors;
    const leveled = this._floors.filter((f) => f.level !== null);
    const unleveled = this._floors.filter((f) => f.level === null);
    return [...leveled.reverse(), ...unleveled];
  }

  /** Every placed device on any floor, labeled — the choices for the
   * Zigbee coordinator device setting. */
  private get _placedDeviceChoices(): { deviceId: string; label: string }[] {
    const labelFor = (pin: Pin) =>
      pin.label_override ??
      pinDisplayLabel(pin.device_id, this._entityLookup.values());
    const choices = new Map<string, string>();
    for (const pin of this._layout.pins) {
      if (pin.device_id) choices.set(pin.device_id, labelFor(pin));
    }
    for (const [deviceId, { pin }] of this._otherFloorPinsByDeviceId) {
      if (!choices.has(deviceId)) choices.set(deviceId, labelFor(pin));
    }
    return [...choices]
      .map(([deviceId, label]) => ({ deviceId, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private get _pinByDeviceId(): Map<string, Pin> {
    const pinByDeviceId = new Map<string, Pin>();
    for (const pin of this._layout.pins) {
      if (pin.device_id) pinByDeviceId.set(pin.device_id, pin);
    }
    return pinByDeviceId;
  }

  /** Every network type's raw shape, normalized to one common shape before
   * anything downstream (both `_meshLinksForCurrentFloor` and
   * `_meshStubsForCurrentFloor` build off this) — so "how do we grade
   * this" lives in one place. The picked network layer is the master
   * on/off switch: no layer picked means off, and a picked layer stays
   * drawn after the menu is closed. */
  private get _normalizedMeshLinks(): {
    sourceDeviceId: string;
    targetDeviceId: string;
    quality: "strong" | "medium" | "weak" | "unknown";
    detail?: string;
  }[] {
    if (this._networkType === null) return [];

    if (this._networkType === "zigbee" && this._zigbeeMesh) {
      const pinByDeviceId = this._pinByDeviceId;
      const outdoor = this._outdoorPinByDeviceId;
      const floorOfDevice = (deviceId: string) =>
        pinByDeviceId.has(deviceId)
          ? (this._currentFloorId ?? undefined)
          : outdoor.has(deviceId)
            ? PROPERTY_LOCATION_ID
            : this._otherFloorPinsByDeviceId.get(deviceId)?.floorId;
      return selectZigbeeLinks(
        withCoordinatorDevice(
          this._zigbeeMesh,
          this._settings.zigbee_coordinator_device_id,
        ),
        floorOfDevice,
        this._zigbeeShowAllLinks,
      ).map((link) => ({
        sourceDeviceId: link.source_device_id!,
        targetDeviceId: link.target_device_id!,
        quality: lqiToQuality(link.lqi),
        // `lqi` is scale-corrected (see zigbee_mesh.py's _reporter_scales) —
        // show the raw readings too whenever they differ from it, so a
        // saturated reporter (e.g. a Hue bulb claiming 252 everywhere) is
        // visible as such.
        detail: link.lqi_readings.every((raw) => raw === link.lqi)
          ? `LQI ${link.lqi}`
          : `LQI ${link.lqi} (raw ${link.lqi_readings.join(" / ")})`,
      }));
    }
    if (this._networkType === "wifi" && this._wifiMesh) {
      return this._wifiMesh.links.map((link) => ({
        sourceDeviceId: link.source_device_id,
        targetDeviceId: link.target_device_id,
        quality:
          link.rssi_dbm != null ? dbmToQuality(link.rssi_dbm) : "unknown",
        ...(link.rssi_dbm != null ? { detail: `${link.rssi_dbm} dBm` } : {}),
      }));
    }
    if (this._networkType === "bluetooth") {
      // Each BLE device → the scanner that heard it, both resolved through
      // their registered Bluetooth addresses (see bluetooth_mesh.py);
      // every candidate pair is emitted and only placed ones get drawn.
      const out: {
        sourceDeviceId: string;
        targetDeviceId: string;
        quality: "strong" | "medium" | "weak" | "unknown";
        detail?: string;
      }[] = [];
      for (const advert of this._bluetoothAdverts.values()) {
        const devices = this._bluetoothDevices[advert.address] ?? [];
        const scanners = this._bluetoothDevices[advert.source] ?? [];
        for (const deviceId of devices) {
          for (const scannerId of scanners) {
            if (deviceId === scannerId) continue; // a proxy hearing itself
            out.push({
              sourceDeviceId: deviceId,
              targetDeviceId: scannerId,
              quality:
                advert.rssi != null ? bleRssiToQuality(advert.rssi) : "unknown",
              ...(advert.rssi != null
                ? { detail: `RSSI ${advert.rssi} dBm` }
                : {}),
            });
          }
        }
      }
      return out;
    }
    if (this._networkType === "matter" && this._matterTopology) {
      const deviceIdByNodeId = new Map<string, string>();
      for (const node of this._matterTopology.nodes) {
        if (node.ha_device_id) deviceIdByNodeId.set(node.id, node.ha_device_id);
      }
      const out: {
        sourceDeviceId: string;
        targetDeviceId: string;
        quality: "strong" | "medium" | "weak" | "unknown";
        detail?: string;
      }[] = [];
      for (const conn of this._matterTopology.connections) {
        const sourceDeviceId = deviceIdByNodeId.get(conn.source);
        const targetDeviceId = deviceIdByNodeId.get(conn.target);
        if (!sourceDeviceId || !targetDeviceId) continue;
        out.push({
          sourceDeviceId,
          targetDeviceId,
          quality: conn.strength,
          detail: conn.strength,
        });
      }
      return out;
    }
    return [];
  }

  /** Outdoor device pins on the Property tab, by device. */
  private get _outdoorPinByDeviceId(): Map<string, Pin> {
    const map = new Map<string, Pin>();
    for (const pin of this._propertyLayout.pins) {
      if (pin.device_id) map.set(pin.device_id, pin);
    }
    return map;
  }

  /** Where a device sits on the Property tab's site photo: an outdoor pin
   * as-is, or an indoor pin mapped through its building's placement (see
   * canvas/property-mapping.ts). Null when it isn't placed, or its
   * building hasn't been placed on the Property tab. */
  private _propertyEnd(deviceId: string): PropertyMeshEnd | null {
    const outdoor = this._outdoorPinByDeviceId.get(deviceId);
    if (outdoor) {
      return {
        deviceId,
        x: outdoor.x,
        y: outdoor.y,
        label: this._pinLabel(outdoor),
        floorId: null,
      };
    }
    const local = this._pinByDeviceId.get(deviceId);
    const indoor = local
      ? { pin: local, floorId: this._currentFloorId }
      : this._otherFloorPinsByDeviceId.get(deviceId);
    if (!indoor?.floorId) return null;
    const placement = this._placementForFloor(indoor.floorId);
    const point = placement
      ? floorToProperty(placement, indoor.pin.x, indoor.pin.y)
      : null;
    if (!point) return null;
    return {
      deviceId,
      ...point,
      label: this._pinLabel(indoor.pin),
      floorId: indoor.floorId,
    };
  }

  /** Connectivity Map lines for the Property tab — every link with at
   * least one outdoor end, the indoor end (if any) drawn at its real spot
   * inside its building. Indoor-to-indoor links stay on the floor views. */
  private get _propertyMeshLinks(): PropertyMeshLink[] {
    const outdoor = this._outdoorPinByDeviceId;
    const links: PropertyMeshLink[] = [];
    for (const link of this._normalizedMeshLinks) {
      if (
        !outdoor.has(link.sourceDeviceId) &&
        !outdoor.has(link.targetDeviceId)
      ) {
        continue;
      }
      const from = this._propertyEnd(link.sourceDeviceId);
      const to = this._propertyEnd(link.targetDeviceId);
      if (!from || !to) continue;
      links.push({
        key: `${link.sourceDeviceId}|${link.targetDeviceId}`,
        from,
        to,
        quality: link.quality,
        ...(link.detail ? { detail: link.detail } : {}),
      });
    }
    return links;
  }

  private get _selectedPropertyMeshLink(): PropertyMeshLink | null {
    return (
      this._propertyMeshLinks.find(
        (l) => l.key === this._selectedPropertyMeshLinkKey,
      ) ?? null
    );
  }

  /** Only links where both ends resolve to a pin placed on the currently
   * viewed floor — see `_meshStubsForCurrentFloor` for the case where just
   * one end does. */
  private get _meshLinksForCurrentFloor(): ResolvedMeshLink[] {
    const pinByDeviceId = this._pinByDeviceId;
    const links: ResolvedMeshLink[] = [];
    for (const link of this._normalizedMeshLinks) {
      const fromPin = pinByDeviceId.get(link.sourceDeviceId);
      const toPin = pinByDeviceId.get(link.targetDeviceId);
      if (fromPin && toPin) {
        links.push({
          fromPin,
          toPin,
          quality: link.quality,
          ...(link.detail ? { detail: link.detail } : {}),
        });
      }
    }
    return links;
  }

  /** Which floor a given floor_id's *building* has been placed at on the
   * Property tab, if any — floors sharing a building_id (Align Floors)
   * all resolve to the same placement. */
  private _placementForFloor(floorId: string): PropertyPlacement | null {
    const floor = this._floors.find((f) => f.floor_id === floorId);
    if (!floor) return null;
    return (
      this._propertyLayout.placements.find((p) =>
        floor.building_id !== null
          ? p.building_id === floor.building_id
          : p.floor_id === floorId,
      ) ?? null
    );
  }

  /** The current floor's traced content extent (rooms + walls), padded —
   * the box a cross-building stub gets projected to the edge of. Null on
   * a floor with nothing traced yet. */
  private _currentFloorContentBounds(): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } | null {
    const points: [number, number][] = [];
    for (const room of this._layout.rooms) points.push(...room.points);
    for (const wall of this._layout.walls) points.push(...wall.points);
    if (points.length === 0) return null;
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = Math.max(maxX - minX, maxY - minY) * 0.05 || 20;
    return {
      minX: minX - pad,
      minY: minY - pad,
      maxX: maxX + pad,
      maxY: maxY + pad,
    };
  }

  /** For a cross-*building* link (no shared coordinate system) — a real
   * compass bearing, computed from where each building actually sits on
   * the Property tab's site photo, adjusted for this floor's own rotation
   * there, then projected from `localPin` out to the edge of this floor's
   * traced content. Null whenever there isn't enough placement data to
   * compute a genuine bearing from (either building never placed on the
   * Property tab) or nothing's been traced on this floor yet — no stub is
   * better than a fabricated direction. */
  private _projectStubTowardBuilding(
    localPin: Pin,
    targetFloorId: string,
  ): { x: number; y: number } | null {
    if (!this._currentFloorId) return null;
    const currentPlacement = this._placementForFloor(this._currentFloorId);
    const targetPlacement = this._placementForFloor(targetFloorId);
    if (!currentPlacement || !targetPlacement) return null;
    const bounds = this._currentFloorContentBounds();
    if (!bounds) return null;

    const angleProperty = Math.atan2(
      targetPlacement.y - currentPlacement.y,
      targetPlacement.x - currentPlacement.x,
    );
    const rotationRad = (currentPlacement.rotation_deg * Math.PI) / 180;
    const angleLocal = angleProperty - rotationRad;
    return rayBoxExit(
      localPin.x,
      localPin.y,
      Math.cos(angleLocal),
      Math.sin(angleLocal),
      bounds,
    );
  }

  /** Links with exactly one end on the currently-viewed floor — the other
   * end is real (placed on some other floor), just off-screen. Rendered
   * as a stub: a line to a marker at the other device's real position
   * (floors sharing a building_id already share one coordinate system —
   * Align Floors), or, for a genuinely separate building (e.g. a detached
   * Garage), a marker projected toward that building's true direction via
   * the Property tab's own placements. Silently omitted (not drawn at a
   * guessed position) whenever that direction can't be computed. */
  private get _meshStubsForCurrentFloor(): ResolvedMeshStub[] {
    if (!this._currentFloorId) return [];
    const pinByDeviceId = this._pinByDeviceId;
    const otherPins = this._otherFloorPinsByDeviceId;
    const currentFloor = this._floors.find(
      (f) => f.floor_id === this._currentFloorId,
    );
    const stubs: ResolvedMeshStub[] = [];

    for (const link of this._normalizedMeshLinks) {
      const localIsSource = pinByDeviceId.has(link.sourceDeviceId);
      const localIsTarget = pinByDeviceId.has(link.targetDeviceId);
      if (localIsSource === localIsTarget) continue;
      const localPin = pinByDeviceId.get(
        localIsSource ? link.sourceDeviceId : link.targetDeviceId,
      )!;
      const remoteDeviceId = localIsSource
        ? link.targetDeviceId
        : link.sourceDeviceId;
      const outdoorPin = this._outdoorPinByDeviceId.get(remoteDeviceId);
      if (outdoorPin) {
        // An outdoor device: its real spot, mapped from the site photo into
        // this floor's coordinates through this floor's own placement.
        const placement = this._placementForFloor(this._currentFloorId);
        const point = placement
          ? propertyToFloor(placement, outdoorPin.x, outdoorPin.y)
          : null;
        if (!point) continue;
        stubs.push({
          fromPin: localPin,
          x: point.x,
          y: point.y,
          targetDeviceId: remoteDeviceId,
          targetFloorId: PROPERTY_LOCATION_ID,
          targetFloorName: "Outside",
          targetLabel: this._pinLabel(outdoorPin),
          quality: link.quality,
          ...(link.detail ? { detail: link.detail } : {}),
        });
        continue;
      }
      const remote = otherPins.get(remoteDeviceId);
      if (!remote || remote.floorId === this._currentFloorId) continue;
      const remoteFloor = this._floors.find(
        (f) => f.floor_id === remote.floorId,
      );
      const remoteLabel =
        remote.pin.label_override ??
        pinDisplayLabel(remote.pin.device_id, this._entityLookup.values());

      const sameBuilding =
        currentFloor?.building_id !== null &&
        currentFloor?.building_id === remoteFloor?.building_id;
      const point = sameBuilding
        ? { x: remote.pin.x, y: remote.pin.y }
        : this._projectStubTowardBuilding(localPin, remote.floorId);
      if (!point) continue;

      stubs.push({
        fromPin: localPin,
        x: point.x,
        y: point.y,
        targetDeviceId: remoteDeviceId,
        targetFloorId: remote.floorId,
        targetFloorName: remoteFloor?.name ?? remote.floorId,
        targetLabel: remoteLabel,
        quality: link.quality,
        ...(link.detail ? { detail: link.detail } : {}),
      });
    }
    return stubs;
  }

  private get _selectedPin(): Pin | null {
    return this._layout.pins.find((p) => p.id === this._selectedPinId) ?? null;
  }

  private get _pinStack(): Pin[] | null {
    if (!this._pinStackIds) return null;
    const byId = new Map(this._layout.pins.map((p) => [p.id, p]));
    const pins = this._pinStackIds
      .map((id) => byId.get(id))
      .filter((p): p is Pin => !!p);
    return pins.length > 1 ? pins : null;
  }

  private get _selectedWall(): Wall | null {
    return (
      this._layout.walls.find((w) => w.id === this._selectedWallId) ?? null
    );
  }

  private get _selectedOpening(): Opening | null {
    return (
      this._layout.openings.find((o) => o.id === this._selectedOpeningId) ??
      null
    );
  }

  private get _selectedMeshLinkKey(): string | null {
    const link = this._selectedMeshLink;
    return link ? `${link.fromPin.id}|${link.toPin.id}` : null;
  }

  private get _selectedMeshStubKey(): string | null {
    const stub = this._selectedMeshStub;
    return stub ? `${stub.fromPin.id}|${stub.targetDeviceId}` : null;
  }

  /** Canvas/stored units per real metre, from the current floor's Scale
   * calibration — null when uncalibrated. Shared by _scaleReadout,
   * _defaultOpeningWidth, and the .unitsPerMeter prop passed down to
   * canvas-overlay.ts (which converts opening width) so this ratio is
   * computed in exactly one place. */
  private _unitsPerMeter(): number | null {
    const scale = this._layout.scale;
    if (!scale) return null;
    const [[x1, y1], [x2, y2]] = scale.points;
    const unitDistance = Math.hypot(x2 - x1, y2 - y1) || 1;
    return unitDistance / scale.meters;
  }

  /** Metres per Property-tab unit, worked out from placed buildings whose
   * floors are calibrated (#6). Mirrors storage.py's
   * property_meters_per_unit — keep both in sync: a placement is its
   * building's traced footprint scaled to `width` (aspect locked), so the
   * floor's scale carries straight over; the largest placement wins, and
   * `disagree` flags buildings more than 10% apart (one is probably sized
   * wrong against the photo). */
  private get _propertyScale(): {
    metersPerUnit: number;
    buildingName: string;
    disagree: boolean;
  } | null {
    const candidates: { area: number; mpu: number; name: string }[] = [];
    for (const placement of this._livePlacements) {
      const b = placement.source_bounds;
      if (!b || placement.width <= 0) continue;
      const sourceWidth = b.max_x - b.min_x;
      if (sourceWidth <= 0) continue;
      const floorMpu = this._buildingMetersPerUnit(placement);
      if (floorMpu === null) continue;
      candidates.push({
        area: placement.width * placement.height,
        mpu: (floorMpu * sourceWidth) / placement.width,
        name:
          placement.label_override ??
          this._floorNameById.get(placement.floor_id) ??
          "a building",
      });
    }
    if (candidates.length === 0) return null;
    const best = candidates.reduce((a, c) => (c.area > a.area ? c : a));
    return {
      metersPerUnit: best.mpu,
      buildingName: best.name,
      disagree: candidates.some((c) => Math.abs(c.mpu / best.mpu - 1) > 0.1),
    };
  }

  /** A placement's building scale: its anchor floor's calibration, else
   * any other floor sharing its building_id (one coordinate system). */
  private _buildingMetersPerUnit(placement: PropertyPlacement): number | null {
    const anchor = this._floors.find((f) => f.floor_id === placement.floor_id);
    if (anchor?.meters_per_unit) return anchor.meters_per_unit;
    if (placement.building_id === null) return null;
    const member = this._floors.find(
      (f) => f.building_id === placement.building_id && f.meters_per_unit,
    );
    return member?.meters_per_unit ?? null;
  }

  private get _propertyScaleReadout(): string | null {
    const scale = this._propertyScale;
    if (!scale) return null;
    const system = this._settings.unit_system;
    const unitsPerDisplay = unitsPerDisplayUnit(
      1 / scale.metersPerUnit,
      system,
    );
    return localize("panel.scaleFromBuilding", {
      building: scale.buildingName,
      unit: largeUnitLabel(system),
      value: unitsPerDisplay.toFixed(1),
    });
  }

  /** ~0.9m in stored units when calibrated, else a fixed fallback. Always
   * a real 0.9m default regardless of the display unit system — this is
   * an internal initial value, never user-facing text. */
  private _defaultOpeningWidth(): number {
    const unitsPerMeter = this._unitsPerMeter();
    return unitsPerMeter === null ? 30 : 0.9 * unitsPerMeter;
  }

  private async _init(): Promise<void> {
    const [floors, entities, areas, propertyLayout, settings] =
      await Promise.all([
        this._client.listFloors(),
        this._client.listPlaceableEntities(),
        this._client.listAreas(),
        // Loaded eagerly (not just when the Property tab itself is opened) —
        // cross-building mesh stubs (_projectStubTowardBuilding) need each
        // building's placement even while just viewing a floor.
        this._client.getPropertyLayout(),
        this._client.getSettings(),
      ]);
    this._floors = floors;
    this._entities = entities;
    this._areas = areas;
    this._propertyLayout = propertyLayout;
    this._settings = settings;
    debugLog.configure(this._client, settings.debug_logging);
    debugLog.log("panel_open", {
      panel_version: __VERSION__,
      panel_build: __BUILD_ID__,
      user_agent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      floors: floors.length,
    });
    void this._checkVersion();
    const firstFloor = this._orderedFloors[0];
    if (firstFloor) {
      await this._selectFloor(firstFloor.floor_id, { skipDirtyCheck: true });
    }
    this._loading = false;
  }

  private async _selectFloor(
    floorId: string,
    opts: { skipDirtyCheck?: boolean } = {},
  ): Promise<void> {
    if (!opts.skipDirtyCheck && this._dirty) {
      if (this._autoSaveActive) {
        if (!(await this._flushAutoSave())) {
          window.alert(localize("errors.floorSave"));
          return;
        }
      } else if (!window.confirm(localize("confirm.discardFloor"))) {
        return;
      }
    }
    this._autoSaveHeld = false;
    this._view = "floor";
    const previousBuildingId = this._layout.building_id;
    this._currentFloorId = floorId;
    this._layout = await this._client.getLayout(floorId);
    this._resetSelection();
    this._resetAlignState();
    // Self-heal a layout saved before room assignment was kept in sync with
    // room geometry (issue #25) — room_id is purely derived from where a
    // pin sits, never a user choice, so a stale value here is always safe
    // to correct. Only marks the floor dirty (prompting a Save) if this
    // actually found something to fix.
    this._floorHistory.clear();
    const healedPins = reassignPinRooms(this._layout.rooms, this._layout.pins);
    if (healedPins !== this._layout.pins) {
      this._layout = { ...this._layout, pins: healedPins };
      this._dirty = true;
    } else {
      this._dirty = false;
    }
    void this._loadOtherFloorPins(floorId);
    debugLog.log("floor_load", {
      floor_id: floorId,
      rooms: this._layout.rooms.length,
      walls: this._layout.walls.length,
      pins: this._layout.pins.length,
      healed: this._dirty,
    });

    // Two floors sharing a non-null building_id (see Align Floors) are one
    // physical building in one coordinate system — when the floor just
    // switched to has no saved view of its own, keep the current pan/zoom
    // so switching between them lands on the same physical spot on screen
    // rather than refitting. Anything else (a never-aligned floor, or a
    // genuinely separate building like a detached Garage) has no
    // meaningful correspondence to the previous floor's view. Actually
    // applying this (and any saved view_box) happens reactively in
    // floorplan-canvas.ts's `updated()`, driven by these two props.
    this._sameBuildingAsPreviousFloor =
      this._layout.building_id !== null &&
      this._layout.building_id === previousBuildingId;
  }

  /** Refetches every OTHER floor's placed pins, for the cross-floor mesh
   * stub feature (_meshStubsForCurrentFloor) — deliberately fire-and-forget
   * from _selectFloor rather than awaited, since the floor itself should
   * render immediately and the mesh overlay is off by default anyway.
   * Guards against a slow response landing after the user has already
   * moved on to a different floor. */
  private async _loadOtherFloorPins(forFloorId: string): Promise<void> {
    const otherFloors = this._floors.filter((f) => f.floor_id !== forFloorId);
    const layouts = await Promise.all(
      otherFloors.map((f) => this._client.getLayout(f.floor_id)),
    );
    if (this._currentFloorId !== forFloorId) return;
    const map = new Map<string, { pin: Pin; floorId: string }>();
    otherFloors.forEach((floor, i) => {
      for (const pin of layouts[i]!.pins) {
        if (pin.device_id)
          map.set(pin.device_id, { pin, floorId: floor.floor_id });
      }
    });
    this._otherFloorPinsByDeviceId = map;
  }

  /** Align Floors' working state only ever makes sense relative to
   * whichever floor is currently open — switching floors, leaving align
   * mode, Cancel, and a successful Apply all drop it the same way. */
  private _resetAlignState(): void {
    this._alignTargetFloorId = null;
    this._alignTargetLayout = null;
    this._alignOffsetX = 0;
    this._alignOffsetY = 0;
    this._alignScale = 1;
  }

  private _resetSelection(): void {
    this._selectedRoomId = null;
    this._editingRoomId = null;
    this._selectedPinId = null;
    this._selectedWallId = null;
    this._editingWallId = null;
    this._selectedOpeningId = null;
    this._selectedMeshLink = null;
    this._selectedMeshStub = null;
    this._armedEntityId = null;
    this._armedOpeningType = null;
  }

  private async _save(): Promise<void> {
    if (!this._currentFloorId) return;
    this._saving = true;
    try {
      // Capture the canvas's current pan/zoom into the layout being
      // saved, without marking merely panning/zooming as its own dirty
      // change the rest of the time.
      const viewBox = this._canvas?.getViewBox() ?? this._layout.view_box;
      this._layout = { ...this._layout, view_box: viewBox };
      const saved = this._layout;
      const started = performance.now();
      try {
        await this._client.saveLayout(this._currentFloorId, saved);
      } catch (err) {
        this._saveError = this._describeSaveError(err);
        debugLog.log("save_error", {
          target: this._currentFloorId,
          error: (err as { message?: string })?.message,
        });
        throw err;
      }
      debugLog.log("save", {
        target: this._currentFloorId,
        ms: Math.round(performance.now() - started),
        rooms: saved.rooms.length,
        pins: saved.pins.length,
      });
      this._saveError = null;
      // An edit made while the save was in flight is still unsaved.
      if (this._layout === saved) this._dirty = false;
      this._floors = this._floors.map((f) =>
        f.floor_id === this._currentFloorId ? { ...f, has_layout: true } : f,
      );
      // A save can add/move/remove pins, which changes which devices are
      // "already placed elsewhere" — the entity picker's own copy of that
      // (fetched once at panel load) would otherwise only catch up on a
      // full page reload. Only when the placed set actually changed, since
      // auto-save saves every few seconds while editing.
      await this._refreshEntitiesIfPlacementChanged();
    } finally {
      this._saving = false;
    }
  }

  private async _export(): Promise<void> {
    const snapshot = await this._client.exportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "layout.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  private _updateLayout(patch: Partial<FloorLayout>): void {
    this._floorHistory.record(this._layout);
    this._layout = { ...this._layout, ...patch };
    this._dirty = true;
  }

  // --- floor-tabs -----------------------------------------------------

  private _onFloorSelected = (e: CustomEvent<{ floorId: string }>) => {
    void this._selectFloor(e.detail.floorId);
  };

  // --- property tab -----------------------------------------------------

  private _onPropertySelected = () => void this._selectProperty();

  private async _selectProperty(): Promise<void> {
    if (this._propertyDirty) {
      if (this._autoSaveActive) {
        if (!(await this._flushAutoSave())) {
          window.alert(localize("errors.propertySave"));
          return;
        }
      } else if (!window.confirm(localize("confirm.discardProperty"))) {
        return;
      }
    }
    this._autoSaveHeld = false;
    // Floors too: their scales feed the Property tab's (see _propertyScale)
    // and may have been calibrated since the panel loaded.
    [this._propertyLayout, this._floors] = await Promise.all([
      this._client.getPropertyLayout(),
      this._client.listFloors(),
    ]);
    this._propertyHistory.clear();
    debugLog.log("property_load", {
      placements: this._propertyLayout.placements.length,
      outdoor_pins: this._propertyLayout.pins.length,
    });
    this._propertyDirty = false;
    this._selectedPlacementId = null;
    this._selectedOutdoorPinId = null;
    this._selectedPropertyMeshLinkKey = null;
    this._propertyMode = "select";
    this._armedBuildingKey = null;
    this._armedEntityId = null;
    this._view = "property";
    void this._loadPlacementGhosts();
  }

  /** Traced rooms and walls of each placed building (all its floors share
   * one coordinate system), for the Property canvas's ghost outline (#6).
   * Loaded after the tab opens so it never delays it; a floor that fails
   * to load just contributes nothing. */
  private async _loadPlacementGhosts(): Promise<void> {
    const placements = this._livePlacements;
    const floorIds = new Set<string>();
    const membersOf = (p: PropertyPlacement): FloorMeta[] =>
      this._floors.filter((f) =>
        p.building_id !== null
          ? f.building_id === p.building_id
          : f.floor_id === p.floor_id,
      );
    for (const p of placements) {
      for (const f of membersOf(p)) floorIds.add(f.floor_id);
    }
    const layouts = new Map<string, FloorLayout>();
    await Promise.all(
      [...floorIds].map(async (id) => {
        try {
          layouts.set(id, await this._client.getLayout(id));
        } catch {
          /* ghost is cosmetic */
        }
      }),
    );
    const ghosts = new Map<string, PlacementGhost>();
    for (const p of placements) {
      const rooms: [number, number][][] = [];
      const walls: [number, number][][] = [];
      for (const f of membersOf(p)) {
        const layout = layouts.get(f.floor_id);
        if (!layout) continue;
        for (const r of layout.rooms)
          if (r.visible !== false) rooms.push(r.points);
        for (const w of layout.walls) walls.push(w.points);
      }
      ghosts.set(p.id, { rooms, walls });
    }
    if (this._view === "property") this._placementGhosts = ghosts;
  }

  /** Whether HA can serve the map: core's map_tiles proxy (2026.10+) and a
   * home location to centre the map on. */
  private get _mapTilesAvailable(): boolean {
    const config = this._hass?.config;
    return (
      !!config?.components?.includes("map_tiles") &&
      typeof config.latitude === "number" &&
      typeof config.longitude === "number"
    );
  }

  /** Adds the map, centred on HA's home location at zoom 18 (a few hundred
   * metres across the default view), or removes it. */
  private _onToggleMapBackground = () => {
    const config = this._hass?.config;
    if (this._propertyLayout.map_background) {
      if (this._propertyMode === "map") this._propertyMode = "select";
      this._updatePropertyLayout({ map_background: null });
    } else if (
      config?.latitude !== undefined &&
      config.longitude !== undefined
    ) {
      this._updatePropertyLayout({
        map_background: {
          lat: config.latitude,
          lon: config.longitude,
          zoom: 18,
          opacity: 1,
          style: "street",
        },
      });
    }
  };

  /** Moves, zooms or turns the map under the (fixed) buildings — see
   * map/map-camera.ts. Gesture events come from the canvas; the overlay's
   * slider and buttons act about the middle of the view. */
  private _adjustMap(change: (map: MapBackground) => MapBackground): void {
    const map = this._propertyLayout.map_background;
    if (map) this._updatePropertyLayout({ map_background: change(map) });
  }

  private _onMapAdjust = (
    e: CustomEvent<
      | { op: "pan"; dx: number; dy: number }
      | { op: "zoom"; factor: number; at: { x: number; y: number } }
      | { op: "rotate"; deltaDeg: number; at: { x: number; y: number } }
      | {
          op: "pinch";
          dx: number;
          dy: number;
          factor: number;
          rotateDeg: number;
          at: { x: number; y: number };
        }
    >,
  ) => {
    const d = e.detail;
    this._adjustMap((map) => {
      switch (d.op) {
        case "pan":
          return panMap(map, d.dx, d.dy);
        case "zoom":
          return zoomMap(map, d.factor, d.at);
        case "rotate":
          return rotateMapTo(map, (map.rotation_deg ?? 0) + d.deltaDeg, d.at);
        case "pinch": {
          const moved = panMap(map, d.dx, d.dy);
          const zoomed = zoomMap(moved, d.factor, d.at);
          return rotateMapTo(
            zoomed,
            (zoomed.rotation_deg ?? 0) + d.rotateDeg,
            d.at,
          );
        }
      }
    });
  };

  private _onMapRotationSet = (e: CustomEvent<{ deg: number }>) => {
    const at = this._propertyCanvas?.getViewCenter() ?? { x: 0, y: 0 };
    this._adjustMap((map) => rotateMapTo(map, e.detail.deg, at));
  };

  private _onMapZoomStep = (e: CustomEvent<{ factor: number }>) => {
    const at = this._propertyCanvas?.getViewCenter() ?? { x: 0, y: 0 };
    this._adjustMap((map) => zoomMap(map, e.detail.factor, at));
  };

  private _onMapStyleChange = (e: Event) => {
    const map = this._propertyLayout.map_background;
    if (!map) return;
    this._updatePropertyLayout({
      map_background: {
        ...map,
        style: (e.target as HTMLSelectElement).value as MapStyleKind,
      },
    });
  };

  private _onMapOpacityChange = (e: Event) => {
    const map = this._propertyLayout.map_background;
    if (!map) return;
    this._updatePropertyLayout({
      map_background: {
        ...map,
        opacity: Number((e.target as HTMLInputElement).value),
      },
    });
  };

  private _updatePropertyLayout(patch: Partial<PropertyLayout>): void {
    this._propertyHistory.record(this._propertyLayout);
    this._propertyLayout = { ...this._propertyLayout, ...patch };
    this._propertyDirty = true;
  }

  // --- undo/redo (#15) ------------------------------------------------------

  /** Restores content only: the current pan/zoom stays (an undo shouldn't
   * jump the view), and so does the floor's building link (owned by Align
   * Floors, which clears this history anyway). */
  private _undoRedo(direction: "undo" | "redo"): void {
    debugLog.log(direction, { view: this._view });
    if (this._view === "property") {
      const current = this._propertyLayout;
      const restored =
        direction === "undo"
          ? this._propertyHistory.undo(current)
          : this._propertyHistory.redo(current);
      if (!restored) return;
      this._propertyLayout = { ...restored, view_box: current.view_box };
      this._propertyDirty = true;
      this._selectedPlacementId = null;
      this._selectedOutdoorPinId = null;
      this._selectedPropertyMeshLinkKey = null;
      return;
    }
    const current = this._layout;
    const restored =
      direction === "undo"
        ? this._floorHistory.undo(current)
        : this._floorHistory.redo(current);
    if (!restored) return;
    this._layout = {
      ...restored,
      view_box: current.view_box,
      building_id: current.building_id,
    };
    this._dirty = true;
    // Whatever was selected or mid-edit may not exist in the restored state.
    this._resetSelection();
    this._pinStackIds = null;
  }

  private _onUndo = () => this._undoRedo("undo");
  private _onRedo = () => this._undoRedo("redo");

  private get _canUndo(): boolean {
    return this._view === "property"
      ? this._propertyHistory.canUndo
      : this._floorHistory.canUndo;
  }

  private get _canRedo(): boolean {
    return this._view === "property"
      ? this._propertyHistory.canRedo
      : this._floorHistory.canRedo;
  }

  private async _saveProperty(): Promise<void> {
    this._propertySaving = true;
    try {
      const viewBox =
        this._propertyCanvas?.getViewBox() ?? this._propertyLayout.view_box;
      this._propertyLayout = { ...this._propertyLayout, view_box: viewBox };
      const saved = this._propertyLayout;
      const started = performance.now();
      try {
        await this._client.savePropertyLayout(saved);
      } catch (err) {
        this._saveError = this._describeSaveError(err);
        debugLog.log("save_error", {
          target: "property",
          error: (err as { message?: string })?.message,
        });
        throw err;
      }
      debugLog.log("save", {
        target: "property",
        ms: Math.round(performance.now() - started),
        placements: saved.placements.length,
        pins: saved.pins.length,
      });
      this._saveError = null;
      if (this._propertyLayout === saved) this._propertyDirty = false;
      // Placing a device outdoors removes it from any floor (storage.py) —
      // refresh the picker's "placed on" info to match.
      await this._refreshEntitiesIfPlacementChanged();
    } finally {
      this._propertySaving = false;
    }
  }

  private _onPropertyModeChange = (
    e: CustomEvent<{ mode: "select" | "place" | "place-pin" | "map" }>,
  ) => {
    this._propertyMode = e.detail.mode;
    this._armedBuildingKey = null;
    this._armedEntityId = null;
    this._selectedPlacementId = null;
  };

  // --- outdoor device pins (Property tab) ---------------------------------

  private get _selectedOutdoorPin(): Pin | null {
    return (
      this._propertyLayout.pins.find(
        (p) => p.id === this._selectedOutdoorPinId,
      ) ?? null
    );
  }

  private _patchOutdoorPin(id: string, patch: Partial<Pin>): void {
    this._updatePropertyLayout({
      pins: this._propertyLayout.pins.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    });
  }

  private _onOutdoorPinPlace = (e: CustomEvent<{ x: number; y: number }>) => {
    if (!this._armedEntityId) return;
    const entity = this._entityLookup.get(this._armedEntityId);
    const pin = emptyPin(
      entity?.device_id ?? null,
      e.detail.x,
      e.detail.y,
      null,
    );
    this._updatePropertyLayout({ pins: [...this._propertyLayout.pins, pin] });
    this._armedEntityId = null;
    this._selectedOutdoorPinId = pin.id;
    this._selectedPlacementId = null;
    this._selectedPropertyMeshLinkKey = null;
  };

  private _onOutdoorPinMove = (
    e: CustomEvent<{ id: string; x: number; y: number }>,
  ) => {
    this._patchOutdoorPin(e.detail.id, { x: e.detail.x, y: e.detail.y });
  };

  private _onOutdoorPinSelect = (e: CustomEvent<{ id: string | null }>) => {
    this._selectedOutdoorPinId = e.detail.id;
    if (e.detail.id !== null) {
      this._selectedPlacementId = null;
      this._selectedPropertyMeshLinkKey = null;
    }
  };

  private _onOutdoorPinLabelChange = (e: CustomEvent<{ label: string }>) => {
    const pin = this._selectedOutdoorPin;
    if (!pin) return;
    this._patchOutdoorPin(pin.id, {
      label_override: e.detail.label.trim() || null,
    });
  };

  /** The Property info cards' close button. */
  private _onPropertySelectionClear = () => {
    this._selectedPlacementId = null;
    this._selectedOutdoorPinId = null;
    this._selectedPropertyMeshLinkKey = null;
  };

  private _onOutdoorPinIcon = () => {
    const pin = this._selectedOutdoorPin;
    if (pin) this._iconPickerFor = { kind: "outdoor", pinId: pin.id };
  };

  private _onOutdoorPinDelete = () => {
    const pin = this._selectedOutdoorPin;
    if (!pin) return;
    if (!window.confirm(`Remove "${this._pinLabel(pin)}" from the property?`)) {
      return;
    }
    this._updatePropertyLayout({
      pins: this._propertyLayout.pins.filter((p) => p.id !== pin.id),
    });
    this._selectedOutdoorPinId = null;
  };

  private _onPropertyMeshLinkSelect = (
    e: CustomEvent<{ key: string | null }>,
  ) => {
    this._selectedPropertyMeshLinkKey = e.detail.key;
    if (e.detail.key !== null) {
      this._selectedOutdoorPinId = null;
      this._selectedPlacementId = null;
    }
  };

  private _onClearAllOutdoorPins = () => {
    const count = this._propertyLayout.pins.length;
    if (count === 0) return;
    if (
      !window.confirm(
        localize(
          count === 1
            ? "confirm.removeOutdoorOne"
            : "confirm.removeOutdoorMany",
          { count },
        ),
      )
    ) {
      return;
    }
    this._autoSaveHeld = true;
    this._updatePropertyLayout({ pins: [] });
    this._selectedOutdoorPinId = null;
  };

  private _onPropertyMeshGotoFloor = (e: CustomEvent<{ floorId: string }>) => {
    void this._selectFloor(e.detail.floorId);
  };

  private _onPlacementArm = (e: CustomEvent<{ key: string }>) => {
    this._armedBuildingKey = e.detail.key;
    this._propertyMode = "place";
    this._selectedPlacementId = null;
  };

  private _onPlacementPlace = (e: CustomEvent<{ x: number; y: number }>) => {
    if (!this._armedBuildingKey) return;
    const building = this._buildings.find(
      (b) => b.key === this._armedBuildingKey,
    );
    if (!building) return;
    const placement = newPlacement(
      building.floorId,
      building.buildingId,
      e.detail.x,
      e.detail.y,
      building.aspectRatio,
      this._buildingBounds(
        this._floors.filter(
          (f) => (f.building_id ?? f.floor_id) === building.key,
        ),
      ),
    );
    this._updatePropertyLayout({
      placements: [...this._propertyLayout.placements, placement],
    });
    this._armedBuildingKey = null;
    this._propertyMode = "select";
    this._selectedPlacementId = placement.id;
  };

  private _patchPlacement(id: string, patch: Partial<PropertyPlacement>): void {
    this._updatePropertyLayout({
      placements: this._propertyLayout.placements.map((p) =>
        p.id === id ? { ...p, ...patch } : p,
      ),
    });
  }

  private _onPlacementMove = (
    e: CustomEvent<{ id: string; dx: number; dy: number }>,
  ) => {
    const p = this._propertyLayout.placements.find(
      (pl) => pl.id === e.detail.id,
    );
    if (!p) return;
    this._patchPlacement(e.detail.id, {
      x: p.x + e.detail.dx,
      y: p.y + e.detail.dy,
    });
  };

  private _onPlacementResize = (
    e: CustomEvent<{
      id: string;
      width: number;
      height: number;
      x: number;
      y: number;
    }>,
  ) => {
    this._patchPlacement(e.detail.id, {
      width: e.detail.width,
      height: e.detail.height,
      x: e.detail.x,
      y: e.detail.y,
    });
  };

  private _onPlacementRotate = (
    e: CustomEvent<{ id: string; rotationDeg: number }>,
  ) => {
    this._patchPlacement(e.detail.id, { rotation_deg: e.detail.rotationDeg });
  };

  private _onPlacementSelect = (e: CustomEvent<{ id: string | null }>) => {
    this._selectedPlacementId = e.detail.id;
    if (e.detail.id !== null) {
      this._selectedOutdoorPinId = null;
      this._selectedPropertyMeshLinkKey = null;
    }
  };

  private _onPlacementLabelChange = (e: CustomEvent<{ label: string }>) => {
    const p = this._selectedPlacement;
    if (!p) return;
    this._patchPlacement(p.id, {
      label_override: e.detail.label.trim() || null,
    });
  };

  private _onPlacementDeleteClick = () => {
    const p = this._selectedPlacement;
    if (!p) return;
    const label =
      p.label_override ?? this._floorNameById.get(p.floor_id) ?? p.floor_id;
    if (!window.confirm(localize("confirm.deletePlacement", { label }))) return;
    this._updatePropertyLayout({
      placements: this._propertyLayout.placements.filter(
        (pl) => pl.id !== p.id,
      ),
    });
    this._selectedPlacementId = null;
  };

  private _onPlacementGotoFloorClick = () => {
    const p = this._selectedPlacement;
    if (!p) return;
    void this._selectFloor(p.floor_id);
  };

  // --- toolbar ----------------------------------------------------------

  private _onModeChange = (e: CustomEvent<{ mode: CanvasMode }>) => {
    // Clicking the already-active mode button turns it back off (e.g. so
    // "Place Device" closes the entity-picker sidebar again) rather than
    // being a no-op re-selection of the same mode.
    this._mode = this._mode === e.detail.mode ? "select" : e.detail.mode;
    this._armedEntityId = null;
    this._armedOpeningType = null;
    if (this._mode !== "select") {
      this._editingRoomId = null;
      this._editingWallId = null;
    }
    if (this._mode !== "align") {
      this._resetAlignState();
    }
  };

  private _onAddOpeningClick = (
    e: CustomEvent<{ openingType: OpeningType }>,
  ) => {
    this._mode = "opening";
    this._armedOpeningType = e.detail.openingType;
    this._editingRoomId = null;
    this._editingWallId = null;
  };

  private _onSaveClick = () => {
    this._autoSaveHeld = false;
    // A failure is reported by the save-error banner, not left unhandled.
    const save =
      this._view === "property" ? this._saveProperty() : this._save();
    save.catch(() => undefined);
  };

  private _describeSaveError(err: unknown): string {
    const message = (err as { message?: string })?.message || "unknown error";
    // A schema rejection after an update usually means the panel is newer
    // than the backend still running — fixed by restarting Home Assistant.
    return /not a valid option|extra keys not allowed|invalid_format/i.test(
      message,
    )
      ? `${message} — Home Assistant may need a restart to finish updating Spatial Context.`
      : message;
  }

  /** Placed device ids across the open floor and the Property tab, as
   * last reflected in the picker's `_entities`. */
  private _placementKeyForEntities: string | null = null;

  private _placementKey(): string {
    return [...this._layout.pins, ...this._propertyLayout.pins]
      .map((p) => p.device_id ?? "")
      .sort()
      .join(",");
  }

  private async _refreshEntitiesIfPlacementChanged(): Promise<void> {
    const key = this._placementKey();
    if (key === this._placementKeyForEntities) return;
    this._entities = await this._client.listPlaceableEntities();
    this._placementKeyForEntities = key;
  }

  // --- version handshake + debug (see debug.py) ------------------------------

  /** Compares this panel's build with what's installed and with the
   * backend HA is running. Rerun whenever the tab becomes visible again,
   * since a tab left open across an update is exactly when they drift. */
  private async _checkVersion(): Promise<void> {
    let notice: "reload" | "restart" | null = null;
    let info: VersionInfo | null = null;
    try {
      info = await this._client.getVersionInfo();
    } catch {
      // A backend without the command predates this panel — it's the
      // backend that's behind, so a restart (not a reload) fixes it.
      notice = "restart";
    }
    if (info) {
      if (
        info.loaded_version &&
        info.installed_version &&
        info.loaded_version !== info.installed_version
      ) {
        notice = "restart";
      } else if (info.panel_build_id && info.panel_build_id !== __BUILD_ID__) {
        notice = "reload";
      }
    }
    if (notice !== this._versionNotice) {
      debugLog.log("version_check", {
        notice,
        panel_build: __BUILD_ID__,
        ...(info ?? {}),
      });
    }
    this._versionNotice = notice;
  }

  private _onVisibilityChange = (): void => {
    if (document.visibilityState === "visible") void this._checkVersion();
  };

  private async _downloadDebugReport(): Promise<void> {
    await debugLog.flush();
    const report = await this._client.getDebugReport();
    const blob = new Blob(
      [
        JSON.stringify(
          {
            ...report,
            browser: {
              panel_version: __VERSION__,
              panel_build: __BUILD_ID__,
              user_agent: navigator.userAgent,
              viewport: `${window.innerWidth}x${window.innerHeight}`,
            },
          },
          null,
          2,
        ),
      ],
      { type: "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `spatial-context-debug-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- auto-save (#32) ------------------------------------------------------

  private static readonly AUTO_SAVE_DELAY_MS = 3000;

  private get _autoSaveActive(): boolean {
    return this._settings.auto_save && !this._autoSaveHeld;
  }

  /** Picking something on the canvas puts the header menus away (a layer
   * that's switched on stays on; only its menu closes). */
  override willUpdate(changed: Map<string, unknown>): void {
    const selectionKeys = [
      "_selectedRoomId",
      "_selectedPinId",
      "_selectedWallId",
      "_selectedOpeningId",
      "_selectedMeshLink",
      "_selectedMeshStub",
      "_pinStackIds",
      "_selectedPlacementId",
      "_selectedOutdoorPinId",
      "_selectedPropertyMeshLinkKey",
    ] as const;
    const picked = selectionKeys.some(
      (key) =>
        changed.has(key) &&
        (this as unknown as Record<string, unknown>)[key] != null,
    );
    if (picked) {
      this._meshPopoverOpen = false;
      this._backgroundPopoverOpen = false;
      this._moreOptionsPopoverOpen = false;
    }
  }

  /** The "Not calibrated" chip on the canvas starts Set Scale. */
  private _onCalibrateScaleClick = () => {
    if (this._mode !== "scale") {
      this._onModeChange(
        new CustomEvent("mode-change", { detail: { mode: "scale" as const } }),
      );
    }
  };

  /** The device picker's close button. */
  private _onPickerClose = () => {
    this._mode = "select";
    this._propertyMode = "select";
    this._armedEntityId = null;
  };

  override updated(changed: Map<string, unknown>): void {
    super.updated(changed);
    // Every edit replaces _layout/_propertyLayout with a new object, so
    // this restarts the debounce on each change.
    if (
      changed.has("_layout") ||
      changed.has("_propertyLayout") ||
      changed.has("_dirty") ||
      changed.has("_propertyDirty")
    ) {
      this._scheduleAutoSave();
    }
  }

  private _scheduleAutoSave(): void {
    if (this._autoSaveTimer !== null) {
      window.clearTimeout(this._autoSaveTimer);
      this._autoSaveTimer = null;
    }
    if (!this._autoSaveActive || (!this._dirty && !this._propertyDirty)) {
      return;
    }
    this._autoSaveTimer = window.setTimeout(
      () => void this._runAutoSave(),
      SpatialContextPanel.AUTO_SAVE_DELAY_MS,
    );
  }

  private async _runAutoSave(): Promise<void> {
    this._autoSaveTimer = null;
    if (!this._autoSaveActive) return;
    if (this._saving || this._propertySaving) {
      this._scheduleAutoSave();
      return;
    }
    try {
      if (this._dirty) await this._save();
      if (this._propertyDirty) await this._saveProperty();
    } catch {
      // Left dirty (the Save dot stays) — the next edit, or a manual
      // Save, tries again.
    }
  }

  /** Saves anything pending right now when auto-save is on — before
   * switching floors or leaving the panel. Returns whether all is saved. */
  private async _flushAutoSave(): Promise<boolean> {
    if (!this._autoSaveActive) return !this._dirty && !this._propertyDirty;
    if (this._autoSaveTimer !== null) {
      window.clearTimeout(this._autoSaveTimer);
      this._autoSaveTimer = null;
    }
    try {
      if (this._dirty) await this._save();
      if (this._propertyDirty) await this._saveProperty();
    } catch {
      return false;
    }
    return !this._dirty && !this._propertyDirty;
  }

  /** The browser's own "Leave site?" prompt on refresh/close while
   * anything is unsaved — the case #32 lost a floor's work to. */
  private _onBeforeUnload = (e: BeforeUnloadEvent): void => {
    if (!this._dirty && !this._propertyDirty) return;
    void this._flushAutoSave();
    e.preventDefault();
    e.returnValue = "";
  };
  private _onExportClick = () => void this._export();

  private _onResetClick = () => {
    if (this._view === "property") {
      if (!window.confirm(localize("confirm.resetProperty"))) {
        return;
      }
      this._autoSaveHeld = true;
      this._propertyHistory.record(this._propertyLayout);
      this._propertyLayout = emptyPropertyLayout();
      this._propertyDirty = true;
      this._selectedPlacementId = null;
      this._selectedOutdoorPinId = null;
      this._selectedPropertyMeshLinkKey = null;
      return;
    }
    const floorName =
      this._floors.find((f) => f.floor_id === this._currentFloorId)?.name ??
      localize("floor.thisFloor");
    if (!window.confirm(localize("confirm.resetFloor", { floor: floorName }))) {
      return;
    }
    this._autoSaveHeld = true;
    this._floorHistory.record(this._layout);
    this._layout = emptyFloorLayout();
    this._dirty = true;
    this._resetSelection();
    this._pinStackIds = null;
  };

  private _onToggleBackgroundPopover = () => {
    this._backgroundPopoverOpen = !this._backgroundPopoverOpen;
    this._meshPopoverOpen = false;
    this._settingsPopoverOpen = false;
    this._moreOptionsPopoverOpen = false;
  };

  /** Opens/closes the Connectivity Map menu. The picked layer is what
   * switches the overlay on (see `_normalizedMeshLinks`), so closing the
   * menu leaves it drawn; tap the selected layer again to turn it off. */
  private _onToggleMeshPopover = () => {
    this._meshPopoverOpen = !this._meshPopoverOpen;
    this._backgroundPopoverOpen = false;
    this._settingsPopoverOpen = false;
    this._moreOptionsPopoverOpen = false;
  };

  private _onToggleSettingsPopover = () => {
    this._settingsPopoverOpen = !this._settingsPopoverOpen;
    this._backgroundPopoverOpen = false;
    this._meshPopoverOpen = false;
    this._moreOptionsPopoverOpen = false;
  };

  private _onToggleMoreOptionsPopover = () => {
    this._moreOptionsPopoverOpen = !this._moreOptionsPopoverOpen;
    this._backgroundPopoverOpen = false;
    this._meshPopoverOpen = false;
    this._settingsPopoverOpen = false;
  };

  /** Every Settings change (see views/settings-menu.ts). Instant-apply, no
   * dirty-tracking — settings are small shared app-wide preferences, not
   * floor/property content, so they persist the moment they change. The
   * menu stays open, so several can be adjusted in one go. */
  private _onSettingsChange = (e: CustomEvent<Partial<Settings>>) => {
    const patch = e.detail;
    this._settings = { ...this._settings, ...patch };
    const saved = this._client.saveSettings(this._settings);
    if ("auto_save" in patch) this._scheduleAutoSave();
    if ("zigbee_coordinator_device_id" in patch) {
      this._selectedMeshLink = null;
      this._selectedMeshStub = null;
    }
    if ("debug_logging" in patch) {
      const enabled = !!patch.debug_logging;
      void saved.then(() => {
        debugLog.configure(this._client, enabled);
        debugLog.log("debug_logging_on", {
          panel_version: __VERSION__,
          panel_build: __BUILD_ID__,
          user_agent: navigator.userAgent,
        });
      });
    }
  };

  // Picking a layer shows it straight away wherever that's cheap: Wi-Fi is
  // read from entity states and Matter is a live subscription, both
  // near-instant, so they load on pick with no button. Zigbee only ever
  // shows the backend's cache on pick (cache_only — never a scan); a real
  // scan (~90s+) still needs an explicit Load/Refresh click (_onLoadMesh).
  private _onNetworkTypeSelect = (picked: NetworkType) => {
    // Tapping the layer that's already on turns the overlay off.
    const type = this._networkType === picked ? null : picked;
    if (this._networkType === "matter" && type !== "matter") {
      this._unsubscribeMatter();
    }
    if (this._networkType === "bluetooth" && type !== "bluetooth") {
      this._unsubscribeBluetooth();
    }
    this._networkType = type;
    this._selectedMeshLink = null;
    this._selectedMeshStub = null;
    if (type === "wifi") void this._refreshWifiMesh();
    else if (type === "matter") void this._subscribeMatter();
    else if (type === "bluetooth") void this._subscribeBluetooth();
    else if (type === "zigbee") void this._loadCachedZigbeeMesh();
  };

  private _onLoadMesh = () => {
    // Reuses the exact same "already fetched once" check the button's own
    // label (Load vs Refresh) is driven by, so the label and the actual
    // force-refresh behavior can't drift apart — force_refresh only on an
    // explicit "Refresh" click, never on the initial "Load" open (which
    // should prefer any pre-warmed cache, see zigbee_mesh.py).
    void this._refreshZigbeeMesh(this._zigbeeMeshFetchedAt !== null);
  };

  /** Shows a warm backend cache (e.g. from an earlier visit, or pre-warmed
   * by the refresh_zigbee_mesh service) without the user having to click
   * Load — and picks up a newer one than this tab holds, e.g. a scheduled
   * refresh that ran while the panel stayed open. Silent on failure — the
   * Load button is still there. */
  private async _loadCachedZigbeeMesh(): Promise<void> {
    try {
      const cached = await this._client.getCachedZigbeeMesh();
      // A real scan in flight wins over this cache read.
      if (!cached?.fetched_at || this._zigbeeMeshLoading) return;
      const cachedAt = cached.fetched_at * 1000;
      if (this._zigbeeMeshFetchedAt && cachedAt <= this._zigbeeMeshFetchedAt) {
        return;
      }
      this._zigbeeMesh = cached;
      this._zigbeeMeshFetchedAt = cachedAt;
    } catch {
      // Transient error — no-op.
    }
  }

  private async _refreshZigbeeMesh(forceRefresh = false): Promise<void> {
    this._zigbeeMeshLoading = true;
    this._zigbeeMeshError = null;
    const startedAt = Date.now();
    this._zigbeeMeshElapsedSeconds = 0;
    this._zigbeeMeshTimer = window.setInterval(() => {
      this._zigbeeMeshElapsedSeconds = Math.round(
        (Date.now() - startedAt) / 1000,
      );
    }, 1000);
    try {
      this._zigbeeMesh = await this._client.getZigbeeMesh(forceRefresh);
      debugLog.log("mesh_load", {
        network: "zigbee",
        force_refresh: forceRefresh,
        ms: Date.now() - startedAt,
        links: this._zigbeeMesh.links.length,
        nodes: this._zigbeeMesh.nodes.length,
      });
      // Backend uses time.time() (epoch seconds) — convert to ms to match
      // Date.now(), which _meshAgeLabel expects. A cache hit can be well
      // in the past (e.g. pre-warmed overnight by the refresh_zigbee_mesh
      // service), not "just now".
      this._zigbeeMeshFetchedAt = this._zigbeeMesh.fetched_at
        ? this._zigbeeMesh.fetched_at * 1000
        : Date.now();
    } catch (err) {
      const message = this._meshErrorMessage(
        err,
        localize("errors.zigbeeFailed"),
      );
      this._zigbeeMeshError = message;
      debugLog.log("mesh_error", { network: "zigbee", error: message });
    } finally {
      this._zigbeeMeshLoading = false;
      if (this._zigbeeMeshTimer !== null) {
        window.clearInterval(this._zigbeeMeshTimer);
        this._zigbeeMeshTimer = null;
      }
    }
  }

  private async _refreshWifiMesh(): Promise<void> {
    this._wifiMeshLoading = true;
    this._wifiMeshError = null;
    try {
      this._wifiMesh = await this._client.getWifiMesh();
      debugLog.log("mesh_load", {
        network: "wifi",
        links: this._wifiMesh.links.length,
      });
    } catch (err) {
      const message = this._meshErrorMessage(
        err,
        localize("errors.wifiFailed"),
      );
      this._wifiMeshError = message;
      debugLog.log("mesh_error", { network: "wifi", error: message });
    } finally {
      this._wifiMeshLoading = false;
    }
  }

  private async _subscribeMatter(): Promise<void> {
    this._unsubscribeMatter();
    this._matterError = null;
    try {
      this._matterUnsubscribe = await this._client.subscribeMatterTopology(
        (topology) => {
          this._matterTopology = topology;
        },
      );
    } catch (err) {
      this._matterError = this._meshErrorMessage(
        err,
        localize("errors.matterFailed"),
      );
    }
  }

  private _unsubscribeMatter(): void {
    this._matterUnsubscribe?.();
    this._matterUnsubscribe = null;
  }

  /** A Connectivity Map error, worded as what to do about it. An unknown
   * command means the panel is newer than the backend HA is running (it
   * was updated without a restart yet). */
  private _meshErrorMessage(err: unknown, fallback: string): string {
    const { code, message } = (err ?? {}) as {
      code?: string;
      message?: string;
    };
    if (code === "unknown_command") {
      return localize("errors.restartHa");
    }
    if (code === "unauthorized") {
      return localize("errors.needsAdmin");
    }
    return message || fallback;
  }

  private async _subscribeBluetooth(): Promise<void> {
    this._unsubscribeBluetooth();
    this._bluetoothError = null;
    this._bluetoothBuffer = new Map();
    this._bluetoothAdverts = new Map();
    let coreStream = false;
    try {
      this._bluetoothDevices = (
        await this._client.getBluetoothDevices()
      ).devices;
      // Past this point an unknown command is HA core's own (the stream
      // arrived in HA 2025.2), not ours — so it's HA that's too old.
      coreStream = true;
      this._bluetoothUnsubscribe =
        await this._client.subscribeBluetoothAdvertisements((event) => {
          for (const advert of event.add ?? []) {
            this._bluetoothBuffer.set(advert.address, {
              address: advert.address,
              source: advert.source,
              rssi: advert.rssi,
              name: advert.name,
            });
          }
          for (const { address } of event.remove ?? []) {
            this._bluetoothBuffer.delete(address);
          }
          this._bluetoothFlushTimer ??= window.setTimeout(() => {
            this._bluetoothFlushTimer = null;
            this._bluetoothAdverts = new Map(this._bluetoothBuffer);
          }, 2000);
        });
      // Show the first snapshot straight away rather than after the delay.
      window.setTimeout(() => {
        this._bluetoothAdverts = new Map(this._bluetoothBuffer);
        debugLog.log("mesh_load", {
          network: "bluetooth",
          adverts: this._bluetoothBuffer.size,
          known_addresses: Object.keys(this._bluetoothDevices).length,
        });
      }, 300);
    } catch (err) {
      // HA allows the advertisement stream for admins only.
      this._bluetoothError =
        coreStream && (err as { code?: string })?.code === "unknown_command"
          ? localize("errors.bluetoothVersion")
          : this._meshErrorMessage(err, localize("errors.bluetoothFailed"));
      debugLog.log("mesh_error", {
        network: "bluetooth",
        error: this._bluetoothError,
      });
    }
  }

  private _unsubscribeBluetooth(): void {
    this._bluetoothUnsubscribe?.();
    this._bluetoothUnsubscribe = null;
    if (this._bluetoothFlushTimer !== null) {
      window.clearTimeout(this._bluetoothFlushTimer);
      this._bluetoothFlushTimer = null;
    }
  }

  /** Size the panel to what's actually visible. On iOS the CSS viewport
   * units can include the area under the browser bar or home indicator, so
   * the bottom of the canvas (and its zoom controls) ended up off screen;
   * the visual viewport is the real visible height. */
  private _fitToViewport = (): void => {
    const visible = window.visualViewport?.height ?? window.innerHeight;
    const top = Math.max(this.getBoundingClientRect().top, 0);
    this.style.height = `${Math.max(240, Math.floor(visible - top))}px`;
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this._fitToViewport();
    window.visualViewport?.addEventListener("resize", this._fitToViewport);
    window.addEventListener("resize", this._fitToViewport);
    window.addEventListener("orientationchange", this._fitToViewport);
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("beforeunload", this._onBeforeUnload);
    document.addEventListener("visibilitychange", this._onVisibilityChange);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.visualViewport?.removeEventListener("resize", this._fitToViewport);
    window.removeEventListener("resize", this._fitToViewport);
    window.removeEventListener("orientationchange", this._fitToViewport);
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("beforeunload", this._onBeforeUnload);
    document.removeEventListener("visibilitychange", this._onVisibilityChange);
    void debugLog.flush();
    // Navigating to another HA panel never fires beforeunload — save
    // anything pending on the way out instead.
    void this._flushAutoSave();
    this._unsubscribeMatter();
    this._unsubscribeBluetooth();
    if (this._zigbeeMeshTimer !== null) {
      window.clearInterval(this._zigbeeMeshTimer);
      this._zigbeeMeshTimer = null;
    }
  }

  /** The actual focused element, piercing open shadow roots — the listener
   * is on window, so e.target would just be this outermost custom element
   * (shadow DOM retargeting), not whatever <input> the user is really
   * typing into. */
  private _deepActiveElement(): Element | null {
    let el: Element | null = document.activeElement;
    while (el?.shadowRoot?.activeElement) el = el.shadowRoot.activeElement;
    return el;
  }

  /** Only real text entry — a checkbox, slider, dropdown or color picker
   * that merely kept focus after being clicked must not swallow Ctrl/Cmd+Z
   * or Delete (the canvas itself can't take focus, so the last-touched
   * control keeps it while you draw). */
  private _isTypingTarget(): boolean {
    const el = this._deepActiveElement();
    if (!el) return false;
    if (el instanceof HTMLElement && el.isContentEditable) return true;
    if (el.tagName === "TEXTAREA") return true;
    if (el instanceof HTMLInputElement) {
      return [
        "text",
        "number",
        "search",
        "email",
        "url",
        "tel",
        "password",
      ].includes(el.type);
    }
    return false;
  }

  /** Esc cancel / Delete selection / Enter finish-wall — see #14. Never
   * fires while the user is typing in a text/number field (room name, wall
   * thickness, etc.), and Esc only cancels in-progress actions (a pending
   * trace, armed placement mode), never a persisted selection. */
  private _onKeyDown = (e: KeyboardEvent): void => {
    if (this._isTypingTarget()) return;
    // The icon picker handles its own keys; nothing behind it should react.
    if (this._iconPickerFor) return;

    if (e.key === "Escape") {
      e.preventDefault();
      // Mid-drag, Esc only puts the dragged thing back.
      if (this._view === "floor" && this._canvas?.cancelGesture()) return;
      if (this._view === "property" && this._propertyCanvas?.cancelGesture()) {
        if (this._propertyDragStart) {
          this._propertyHistory.discardIfLast(this._propertyDragStart);
          this._propertyLayout = this._propertyDragStart;
          this._propertyDragStart = null;
        }
        return;
      }
      this._onCancelPending();
      this._mode = "select";
      this._armedEntityId = null;
      this._armedOpeningType = null;
      this._armedBuildingKey = null;
      this._propertyMode = "select";
      return;
    }

    // Undo the last point of an in-progress trace (#26): Backspace, or
    // Ctrl/Cmd+Z. Checked before Delete/Backspace's delete-selection so
    // Backspace mid-trace never deletes whatever happens to be selected.
    const mod = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();
    const isUndo = mod && !e.shiftKey && key === "z";
    const isRedo = mod && ((e.shiftKey && key === "z") || key === "y");
    if ((isUndo || e.key === "Backspace") && this._canvas?.undoLastPoint()) {
      e.preventDefault();
      return;
    }
    // Otherwise Ctrl/Cmd+Z undoes the last edit itself (#15).
    if (isUndo || isRedo) {
      e.preventDefault();
      this._undoRedo(isUndo ? "undo" : "redo");
      return;
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      // Only what's on screen — a floor selection left over from before
      // switching to the Property tab must never be deleted from there.
      if (this._view === "property") {
        if (this._selectedOutdoorPin || this._selectedPlacement) {
          e.preventDefault();
        }
        if (this._selectedOutdoorPin) this._onOutdoorPinDelete();
        else if (this._selectedPlacement) this._onPlacementDeleteClick();
        return;
      }
      if (
        this._selectedRoom ||
        this._selectedPin ||
        this._selectedWall ||
        this._selectedOpening
      ) {
        e.preventDefault();
      }
      if (this._selectedRoom) this._onRoomDelete();
      else if (this._selectedPin) this._onPinDelete();
      else if (this._selectedWall) this._onWallDelete();
      else if (this._selectedOpening) this._onOpeningDelete();
      return;
    }

    if (e.key === "Enter" && this._mode === "wall") {
      e.preventDefault();
      this._onFinishWall();
    }
  };

  private _onFileInputChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    void this._handleBackgroundFile(file);
  };

  private static readonly _ACCEPTED_BACKGROUND_TYPES = new Set([
    "image/png",
    "image/jpeg",
    "image/gif",
  ]);

  /** Shared by the file-input picker and canvas drag-and-drop — drag-and-drop
   * bypasses the <input accept> restriction entirely, so the MIME check has
   * to live here rather than only on the input element. */
  private async _handleBackgroundFile(file: File): Promise<void> {
    if (!SpatialContextPanel._ACCEPTED_BACKGROUND_TYPES.has(file.type)) {
      window.alert(localize("errors.bgType"));
      return;
    }
    try {
      const imageId = await this._client.uploadBackgroundImage(file);
      const patch = { background_image_id: imageId, background_opacity: 0.85 };
      if (this._view === "property") this._updatePropertyLayout(patch);
      else this._updateLayout(patch);
    } catch (err) {
      window.alert(
        localize("errors.bgUpload", { error: (err as Error).message }),
      );
    }
  }

  private _onCanvasDragOver = (e: DragEvent) => {
    if (!e.dataTransfer?.types.includes("Files")) return;
    e.preventDefault();
    this._dragOverCanvas = true;
  };

  private _onCanvasDragLeave = () => {
    this._dragOverCanvas = false;
  };

  private _onCanvasDrop = (e: DragEvent) => {
    if (!e.dataTransfer?.types.includes("Files")) return;
    e.preventDefault();
    this._dragOverCanvas = false;
    const file = e.dataTransfer.files?.[0];
    if (file) void this._handleBackgroundFile(file);
  };

  private _onRemoveBackgroundClick = () => {
    if (this._view === "property") {
      this._updatePropertyLayout({ background_image_id: null });
    } else {
      this._updateLayout({ background_image_id: null });
    }
  };

  private _onOpacityChange = (e: Event) => {
    const background_opacity = Number((e.target as HTMLInputElement).value);
    if (this._view === "property") {
      this._updatePropertyLayout({ background_opacity });
    } else {
      this._updateLayout({ background_opacity });
    }
  };

  private _onCancelPending = () => this._canvas?.cancelPending();
  private _onFinishWall = () => this._canvas?.finishPendingWall();

  // --- align floors -----------------------------------------------------

  private _onAlignTargetChange = async (
    e: CustomEvent<{ floorId: string | null }>,
  ) => {
    const floorId = e.detail.floorId;
    if (!floorId) {
      this._resetAlignState();
      return;
    }
    this._alignTargetFloorId = floorId;
    this._alignOffsetX = 0;
    this._alignOffsetY = 0;
    this._alignScale = 1;
    this._alignTargetLayout = await this._client.getLayout(floorId);
  };

  private _onAlignDrag = (e: CustomEvent<{ dx: number; dy: number }>) => {
    this._alignOffsetX += e.detail.dx;
    this._alignOffsetY += e.detail.dy;
  };

  /** Scaling used to anchor at the overlay's raw top-left corner (a plain
   * `alignScale *= factor`, with the composed offset otherwise untouched)
   * — every +/- click also shifted the image, forcing a re-drag after
   * each scale nudge just to recompensate, which made it easy to
   * converge on an alignment that looked "close enough" on screen without
   * actually being pixel-precise (#13). Anchoring at the current view's
   * center instead — the same convention the main +/- zoom buttons
   * already use (see floorplan-canvas.ts's _zoomButton) — keeps whatever
   * you're currently looking at fixed in place while the image resizes
   * around it. */
  private _onAlignScaleClick = (e: CustomEvent<{ factor: number }>) => {
    const { factor } = e.detail;
    const vb = this._canvas?.getViewBox();
    if (vb) {
      const cx = vb.x + vb.w / 2;
      const cy = vb.y + vb.h / 2;
      this._alignOffsetX = factor * this._alignOffsetX + (1 - factor) * cx;
      this._alignOffsetY = factor * this._alignOffsetY + (1 - factor) * cy;
    }
    this._alignScale *= factor;
  };

  private _onAlignCancel = () => {
    this._mode = "select";
    this._resetAlignState();
  };

  private _onAlignApply = async () => {
    if (!this._alignTargetFloorId || !this._alignTargetLayout) return;
    const targetFloorId = this._alignTargetFloorId;
    const targetName =
      this._floors.find((f) => f.floor_id === targetFloorId)?.name ??
      localize("floor.thatFloor");
    if (
      !window.confirm(localize("confirm.applyAlignment", { floor: targetName }))
    ) {
      return;
    }

    const s = this._alignScale;
    const ox = this._alignOffsetX;
    const oy = this._alignOffsetY;
    const tp = ([x, y]: [number, number]): [number, number] => [
      x * s + ox,
      y * s + oy,
    ];
    const src = this._alignTargetLayout;

    // Aligning links these two floors as one "building" going forward —
    // switching between them should keep the same on-screen position
    // instead of each fitting to its own content (see _selectFloor), and a
    // floor that's never been aligned to anything (a detached Garage, say)
    // should never accidentally match another unaligned floor's default
    // null building_id, so a fresh id is minted the first time either side
    // of a pair gets aligned rather than reusing null itself as a group.
    const buildingId = this._layout.building_id ?? newId("building");

    const transformed: FloorLayout = {
      background_image_id: src.background_image_id,
      background_opacity: src.background_opacity,
      background_offset_x: src.background_offset_x * s + ox,
      background_offset_y: src.background_offset_y * s + oy,
      background_scale: src.background_scale * s,
      building_id: buildingId,
      // The target's own saved view is a rectangle in its OLD coordinate
      // space — transform it the same way as everything else rather than
      // dropping it, so a view saved before this alignment still points
      // at the same physical spot afterward.
      view_box: src.view_box
        ? (() => {
            const [x, y] = tp([src.view_box!.x, src.view_box!.y]);
            return { x, y, w: src.view_box!.w * s, h: src.view_box!.h * s };
          })()
        : null,
      rooms: src.rooms.map((r) => ({ ...r, points: r.points.map(tp) })),
      walls: src.walls.map((w) => ({ ...w, points: w.points.map(tp) })),
      pins: src.pins.map((p) => {
        const [x, y] = tp([p.x, p.y]);
        return { ...p, x, y };
      }),
      openings: src.openings.map((o) => {
        const [x, y] = tp([o.x, o.y]);
        return { ...o, x, y, width: o.width * s };
      }),
      // Once aligned, both floors share one coordinate system — this
      // floor's own calibration (if it has one) is the authoritative
      // "units per metre" for that shared system now, so it's copied onto
      // the target as-is (no transform needed, it's already expressed in
      // that same shared space) rather than trusting the target's own
      // independently-measured calibration to still agree with it.
      scale:
        this._layout.scale ??
        (src.scale
          ? {
              points: [tp(src.scale.points[0]), tp(src.scale.points[1])],
              meters: src.scale.meters,
            }
          : null),
    };

    await this._client.saveLayout(targetFloorId, transformed);
    if (this._layout.building_id !== buildingId) {
      await this._client.setBuildingId(this._currentFloorId!, buildingId);
      this._layout = { ...this._layout, building_id: buildingId };
    }
    this._floors = await this._client.listFloors();
    this._mode = "select";
    this._resetAlignState();
    // Alignment rewrote another floor in storage and relinked buildings —
    // undoing past it would quietly break that link.
    this._floorHistory.clear();
  };

  private _onRoomNameChange = (e: CustomEvent<{ name: string }>) => {
    const room = this._selectedRoom;
    if (!room) return;
    this._updateLayout({
      rooms: this._layout.rooms.map((r) =>
        r.id === room.id ? { ...r, name: e.detail.name } : r,
      ),
    });
  };

  private _onRoomAreaChange = (e: CustomEvent<{ areaId: string }>) => {
    const room = this._selectedRoom;
    if (!room) return;
    const areaId = e.detail.areaId || null;
    const area = this._areas.find((a) => a.area_id === areaId);
    this._updateLayout({
      rooms: this._layout.rooms.map((r) =>
        r.id === room.id
          ? { ...r, area_id: areaId, name: area ? area.name : r.name }
          : r,
      ),
    });
  };

  private _patchRoom(id: string, patch: Partial<Room>): void {
    this._updateLayout({
      rooms: this._layout.rooms.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    });
  }

  /** A selected room dragged whole: its outline, a hand-placed label and
   * the devices inside it move together, as one undo step. Walls are
   * separate drawings and stay put. */
  private _onRoomMove = (
    e: CustomEvent<{ roomId: string; dx: number; dy: number }>,
  ) => {
    const { roomId, dx, dy } = e.detail;
    debugLog.log("room_move", {
      room_id: roomId,
      dx: Math.round(dx),
      dy: Math.round(dy),
    });
    const shift = ([x, y]: [number, number]): [number, number] => [
      x + dx,
      y + dy,
    ];
    const rooms = this._layout.rooms.map((r) =>
      r.id === roomId
        ? {
            ...r,
            points: r.points.map(shift),
            ...(r.label_position
              ? { label_position: shift(r.label_position) }
              : {}),
          }
        : r,
    );
    const pins = this._layout.pins.map((p) =>
      p.room_id === roomId ? { ...p, x: p.x + dx, y: p.y + dy } : p,
    );
    this._updateLayout({ rooms, pins: reassignPinRooms(rooms, pins) });
  };

  private _onRoomLabelMoved = (
    e: CustomEvent<{ roomId: string; x: number; y: number }>,
  ) => {
    this._patchRoom(e.detail.roomId, {
      label_position: [e.detail.x, e.detail.y],
    });
  };

  private _onRoomLabelReset = () => {
    const room = this._selectedRoom;
    if (room) this._patchRoom(room.id, { label_position: null });
  };

  private _onRoomVisibleToggle = () => {
    const room = this._selectedRoom;
    if (!room) return;
    this._patchRoom(room.id, { visible: room.visible === false });
  };

  private _onRoomFillColorChange = (e: CustomEvent<{ color: string }>) => {
    const room = this._selectedRoom;
    if (!room) return;
    this._patchRoom(room.id, { fill_color: e.detail.color });
  };

  private _onRoomFillOpacityChange = (e: CustomEvent<{ opacity: number }>) => {
    const room = this._selectedRoom;
    if (!room) return;
    this._patchRoom(room.id, { fill_opacity: e.detail.opacity });
  };

  private _onRoomBorderOpacityChange = (
    e: CustomEvent<{ opacity: number }>,
  ) => {
    const room = this._selectedRoom;
    if (!room) return;
    this._patchRoom(room.id, { border_opacity: e.detail.opacity });
  };

  private _onRoomEditVertices = () => {
    if (!this._selectedRoomId) return;
    this._editingRoomId =
      this._editingRoomId === this._selectedRoomId
        ? null
        : this._selectedRoomId;
  };

  private _onRoomDelete = () => {
    const room = this._selectedRoom;
    if (
      !room ||
      !window.confirm(localize("confirm.deleteRoom", { name: room.name }))
    )
      return;
    const rooms = this._layout.rooms.filter((r) => r.id !== room.id);
    this._updateLayout({
      rooms,
      pins: reassignPinRooms(rooms, this._layout.pins),
    });
    this._selectedRoomId = null;
    this._editingRoomId = null;
  };

  private _onPinLabelChange = (e: CustomEvent<{ label: string }>) => {
    const pin = this._selectedPin;
    if (!pin) return;
    this._patchPin(pin.id, { label_override: e.detail.label.trim() || null });
  };

  private _onPinSetIcon = () => {
    const pin = this._selectedPin;
    if (pin) this._iconPickerFor = { kind: "floor", pinId: pin.id };
  };

  /** The pin the icon picker is open for, from whichever layout it's in. */
  private get _iconPickerPin(): Pin | null {
    const target = this._iconPickerFor;
    if (!target) return null;
    const pins =
      target.kind === "floor" ? this._layout.pins : this._propertyLayout.pins;
    return pins.find((p) => p.id === target.pinId) ?? null;
  }

  private _onIconPicked = (e: CustomEvent<{ icon: string | null }>) => {
    const target = this._iconPickerFor;
    this._iconPickerFor = null;
    if (!target) return;
    const patch = { icon_override: e.detail.icon };
    if (target.kind === "floor") this._patchPin(target.pinId, patch);
    else this._patchOutdoorPin(target.pinId, patch);
  };

  private _onIconPickerCancel = () => {
    this._iconPickerFor = null;
  };

  private _onPinHeightChange = (e: CustomEvent<{ value: string }>) => {
    const pin = this._selectedPin;
    if (!pin) return;
    const raw = e.detail.value.trim();
    const parsed =
      raw === "" ? null : parseLarge(raw, this._settings.unit_system);
    this._patchPin(pin.id, {
      height_m: parsed !== null && Number.isFinite(parsed) ? parsed : null,
    });
  };

  private _onPinDelete = () => {
    const pin = this._selectedPin;
    if (
      !pin ||
      !window.confirm(
        localize("confirm.deletePin", { name: this._pinLabel(pin) }),
      )
    )
      return;
    this._updateLayout({
      pins: this._layout.pins.filter((p) => p.id !== pin.id),
    });
    this._selectedPinId = null;
  };

  private _patchPin(pinId: string, patch: Partial<Pin>): void {
    this._updateLayout({
      pins: this._layout.pins.map((p) =>
        p.id === pinId ? { ...p, ...patch } : p,
      ),
    });
  }

  private _onWallMaterialChange = (e: CustomEvent<{ material: string }>) => {
    const wall = this._selectedWall;
    if (!wall) return;
    this._updateLayout({
      walls: this._layout.walls.map((w) =>
        w.id === wall.id ? { ...w, material: e.detail.material } : w,
      ),
    });
  };

  private _onWallThicknessChange = (
    e: CustomEvent<{ thicknessCm: number }>,
  ) => {
    const wall = this._selectedWall;
    if (!wall) return;
    if (!Number.isFinite(e.detail.thicknessCm) || e.detail.thicknessCm <= 0)
      return;
    this._updateLayout({
      walls: this._layout.walls.map((w) =>
        w.id === wall.id ? { ...w, thickness_cm: e.detail.thicknessCm } : w,
      ),
    });
  };

  private _onWallEditVertices = () => {
    if (!this._selectedWallId) return;
    this._editingWallId =
      this._editingWallId === this._selectedWallId
        ? null
        : this._selectedWallId;
  };

  private _onWallDelete = () => {
    const wall = this._selectedWall;
    if (!wall || !window.confirm(localize("confirm.deleteWall"))) {
      return;
    }
    this._updateLayout({
      walls: this._layout.walls.filter((w) => w.id !== wall.id),
      openings: this._layout.openings.filter((o) => o.wallId !== wall.id),
    });
    this._selectedWallId = null;
    this._editingWallId = null;
  };

  /** Width is edited live in canvas-overlay.ts's selection panel (a
   * number input + cm/m-or-in/ft picker), not via a prompt — this just
   * applies the already-converted canvas-unit value it fires. */
  private _onOpeningWidthChange = (e: CustomEvent<{ width: number }>) => {
    const opening = this._selectedOpening;
    if (!opening) return;
    const width = e.detail.width;
    this._updateLayout({
      openings: this._layout.openings.map((o) =>
        o.id === opening.id ? { ...o, width } : o,
      ),
    });
  };

  private _onOpeningDelete = () => {
    const opening = this._selectedOpening;
    if (
      !opening ||
      !window.confirm(
        localize(
          opening.type === "door"
            ? "confirm.deleteDoor"
            : "confirm.deleteWindow",
        ),
      )
    )
      return;
    this._updateLayout({
      openings: this._layout.openings.filter((o) => o.id !== opening.id),
    });
    this._selectedOpeningId = null;
  };

  // --- entity picker ------------------------------------------------------

  private _onEntityArmed = (e: CustomEvent<{ entityId: string }>) => {
    this._armedEntityId =
      this._armedEntityId === e.detail.entityId ? null : e.detail.entityId;
  };

  private _onClearAllPins = () => {
    const count = this._layout.pins.length;
    if (count === 0) return;
    if (
      !window.confirm(
        localize(
          count === 1 ? "confirm.removeFloorOne" : "confirm.removeFloorMany",
          { count },
        ),
      )
    ) {
      return;
    }
    this._autoSaveHeld = true;
    this._updateLayout({ pins: [] });
    this._selectedPinId = null;
    this._pinStackIds = null;
  };

  // --- canvas ---------------------------------------------------------

  private _onRoomTraceComplete = (
    e: CustomEvent<{ points: [number, number][] }>,
  ) => {
    const room = newRoom("New Room", e.detail.points, null);
    const rooms = [...this._layout.rooms, room];
    this._updateLayout({
      rooms,
      pins: reassignPinRooms(rooms, this._layout.pins),
    });
    this._selectedRoomId = room.id;
  };

  private _onRoomVertexChanged = (
    e: CustomEvent<{ roomId: string; points: [number, number][] }>,
  ) => {
    const rooms = this._layout.rooms.map((r) => {
      if (r.id !== e.detail.roomId) return r;
      // A hand-placed label the reshaped room no longer contains goes
      // back to automatic, rather than floating outside the room.
      const label = r.label_position;
      const labelStillInside =
        !label || pointInPolygon(label[0], label[1], e.detail.points);
      return {
        ...r,
        points: e.detail.points,
        ...(labelStillInside ? {} : { label_position: null }),
      };
    });
    this._updateLayout({
      rooms,
      pins: reassignPinRooms(rooms, this._layout.pins),
    });
  };

  private _onRoomSelect = (e: CustomEvent<{ roomId: string | null }>) => {
    this._selectedRoomId = e.detail.roomId;
    if (e.detail.roomId === null) {
      this._editingRoomId = null;
    } else {
      this._selectedPinId = null;
      this._pinStackIds = null;
      this._selectedWallId = null;
      this._editingWallId = null;
      this._selectedOpeningId = null;
      this._selectedMeshLink = null;
      this._selectedMeshStub = null;
    }
  };

  private _onWallTraceComplete = (
    e: CustomEvent<{ points: [number, number][] }>,
  ) => {
    this._updateLayout({
      walls: [...this._layout.walls, newWall(e.detail.points)],
    });
  };

  private _onWallVertexChanged = (
    e: CustomEvent<{ wallId: string; points: [number, number][] }>,
  ) => {
    this._updateLayout({
      walls: this._layout.walls.map((w) =>
        w.id === e.detail.wallId ? { ...w, points: e.detail.points } : w,
      ),
    });
  };

  private _onWallSelect = (e: CustomEvent<{ wallId: string | null }>) => {
    this._selectedWallId = e.detail.wallId;
    if (e.detail.wallId === null) {
      this._editingWallId = null;
    } else {
      this._selectedRoomId = null;
      this._editingRoomId = null;
      this._selectedPinId = null;
      this._pinStackIds = null;
      this._selectedOpeningId = null;
      this._selectedMeshLink = null;
      this._selectedMeshStub = null;
    }
  };

  private _onOpeningPlace = (
    e: CustomEvent<{ wallId: string; x: number; y: number }>,
  ) => {
    if (!this._armedOpeningType) return;
    const opening = newOpening(
      e.detail.wallId,
      this._armedOpeningType,
      e.detail.x,
      e.detail.y,
      this._defaultOpeningWidth(),
    );
    this._updateLayout({ openings: [...this._layout.openings, opening] });
  };

  private _onOpeningSelect = (e: CustomEvent<{ openingId: string | null }>) => {
    this._selectedOpeningId = e.detail.openingId;
    if (e.detail.openingId !== null) {
      this._selectedRoomId = null;
      this._editingRoomId = null;
      this._selectedPinId = null;
      this._pinStackIds = null;
      this._selectedWallId = null;
      this._editingWallId = null;
      this._selectedMeshLink = null;
      this._selectedMeshStub = null;
    }
  };

  private _onOpeningUpdate = (
    e: CustomEvent<{ openingId: string; x: number; y: number; width: number }>,
  ) => {
    this._updateLayout({
      openings: this._layout.openings.map((o) =>
        o.id === e.detail.openingId
          ? { ...o, x: e.detail.x, y: e.detail.y, width: e.detail.width }
          : o,
      ),
    });
  };

  private _onPinPlace = (e: CustomEvent<{ x: number; y: number }>) => {
    if (!this._armedEntityId) return;
    const roomId = findRoomForPoint(e.detail.x, e.detail.y, this._layout.rooms);
    const entity = this._entityLookup.get(this._armedEntityId);
    const pin = emptyPin(
      entity?.device_id ?? null,
      e.detail.x,
      e.detail.y,
      roomId,
    );
    // The canvas already snaps onto an existing pin's exact coordinates
    // when co-locating (see floorplan-canvas.ts) — an exact-coordinate
    // match here means the new pin landed deliberately on top of others.
    const coLocated = this._layout.pins.filter(
      (p) => p.x === e.detail.x && p.y === e.detail.y,
    );
    this._updateLayout({ pins: [...this._layout.pins, pin] });
    this._armedEntityId = null;
    if (coLocated.length > 0) {
      this._pinStackIds = [...coLocated.map((p) => p.id), pin.id];
      this._selectedPinId = null;
    } else {
      // Auto-select the pin just placed, so Set Height/Rename/etc. act on
      // it instead of whatever was selected before arming placement mode.
      this._pinStackIds = null;
      this._selectedPinId = pin.id;
      this._selectedRoomId = null;
      this._selectedWallId = null;
      this._editingWallId = null;
      this._selectedOpeningId = null;
      this._selectedMeshLink = null;
      this._selectedMeshStub = null;
    }
  };

  private _onPinMove = (
    e: CustomEvent<{ pinId: string; x: number; y: number }>,
  ) => {
    const roomId = findRoomForPoint(e.detail.x, e.detail.y, this._layout.rooms);
    this._patchPin(e.detail.pinId, {
      x: e.detail.x,
      y: e.detail.y,
      room_id: roomId,
    });
  };

  private _onPinSelect = (e: CustomEvent<{ pinId: string | null }>) => {
    this._selectedPinId = e.detail.pinId;
    this._pinStackIds = null;
    if (e.detail.pinId !== null) {
      this._selectedRoomId = null;
      this._selectedWallId = null;
      this._editingWallId = null;
      this._selectedOpeningId = null;
      this._selectedMeshLink = null;
      this._selectedMeshStub = null;
    }
  };

  private _onPinStackSelect = (e: CustomEvent<{ pinIds: string[] }>) => {
    this._pinStackIds = e.detail.pinIds;
    this._selectedRoomId = null;
    this._selectedWallId = null;
    this._editingWallId = null;
    this._selectedOpeningId = null;
    this._selectedPinId = null;
    this._selectedMeshLink = null;
    this._selectedMeshStub = null;
  };

  private _onMeshLinkSelect = (
    e: CustomEvent<{ link: ResolvedMeshLink | null }>,
  ) => {
    this._selectedMeshLink = e.detail.link;
    if (e.detail.link !== null) {
      this._selectedRoomId = null;
      this._editingRoomId = null;
      this._selectedPinId = null;
      this._pinStackIds = null;
      this._selectedWallId = null;
      this._editingWallId = null;
      this._selectedOpeningId = null;
      this._selectedMeshStub = null;
    }
  };

  private _onMeshStubSelect = (
    e: CustomEvent<{ stub: ResolvedMeshStub | null }>,
  ) => {
    this._selectedMeshStub = e.detail.stub;
    if (e.detail.stub !== null) {
      this._selectedRoomId = null;
      this._editingRoomId = null;
      this._selectedPinId = null;
      this._pinStackIds = null;
      this._selectedWallId = null;
      this._editingWallId = null;
      this._selectedOpeningId = null;
      this._selectedMeshLink = null;
    }
  };

  private _onMeshStubGotoFloorClick = () => {
    const stub = this._selectedMeshStub;
    if (!stub) return;
    if (stub.targetFloorId === PROPERTY_LOCATION_ID)
      void this._selectProperty();
    else void this._selectFloor(stub.targetFloorId);
  };

  private _onPinStackChoose = (e: CustomEvent<{ pinId: string }>) => {
    this._pinStackIds = null;
    this._selectedPinId = e.detail.pinId;
  };

  /** The info card's close button: drop whatever is selected. */
  private _onSelectionClear = () => {
    this._resetSelection();
    this._pinStackIds = null;
  };

  private _onPinStackDismiss = () => {
    this._pinStackIds = null;
  };

  private _onPinStackRemove = (e: CustomEvent<{ pinId: string }>) => {
    const pin = this._layout.pins.find((p) => p.id === e.detail.pinId);
    if (!pin) return;
    if (
      !window.confirm(
        localize("confirm.removeFromSpot", { name: this._pinLabel(pin) }),
      )
    )
      return;
    this._updateLayout({
      pins: this._layout.pins.filter((p) => p.id !== e.detail.pinId),
    });
    const remaining = (this._pinStackIds ?? []).filter(
      (id) => id !== e.detail.pinId,
    );
    // Fewer than 2 left is no longer a "stack" — fall back to ordinary
    // single-pin selection (or nothing) rather than showing a 1-item picker.
    this._pinStackIds = remaining.length > 1 ? remaining : null;
    this._selectedPinId = remaining.length === 1 ? remaining[0]! : null;
  };

  private _pinLabel(pin: Pin): string {
    if (pin.label_override) return pin.label_override;
    return pinDisplayLabel(pin.device_id, this._entityLookup.values());
  }

  private _onScaleLineComplete = (
    e: CustomEvent<{ points: [number, number][] }>,
  ) => {
    const system = this._settings.unit_system;
    const unitWord = localize(
      system === "imperial" ? "units.feet" : "units.metres",
    );
    const input = window.prompt(
      localize("prompt.distance", { unit: unitWord }),
    );
    const meters = input ? parseLarge(input, system) : null;
    if (meters === null || !Number.isFinite(meters) || meters <= 0) return;
    const points = e.detail.points as [[number, number], [number, number]];
    this._updateLayout({ scale: { points, meters } });
    this._mode = "select";
  };

  private _onPendingChanged = (e: CustomEvent<{ count: number }>) => {
    this._pendingCount = e.detail.count;
  };

  private _onSnapModeChange = (e: CustomEvent<{ snapMode: SnapMode }>) => {
    this._snapMode = e.detail.snapMode;
    try {
      localStorage.setItem(SNAP_MODE_STORAGE_KEY, this._snapMode);
    } catch {
      // Won't persist across reloads — snapping still follows the choice.
    }
  };

  private _meshAgeLabel(fetchedAt: number): string {
    const seconds = Math.round((Date.now() - fetchedAt) / 1000);
    if (seconds < 60)
      return localize("network.refreshedSeconds", { n: seconds });
    return localize("network.refreshedMinutes", {
      n: Math.round(seconds / 60),
    });
  }

  /** The Background menu — per floor (or Property tab), so it lives in the
   * controls row; each overlay slots it in as `row-end`. */
  private _renderBackgroundPopover() {
    return html`
      <icon-popover
        slot="row-end"
        compact
        icon="mdi:image"
        label=${localize("menu.background")}
        .open=${this._backgroundPopoverOpen}
        @toggle=${this._onToggleBackgroundPopover}
      >
        <input
          id="file-input"
          class="hidden-file-input"
          type="file"
          accept="image/png,image/jpeg,image/gif"
          @change=${this._onFileInputChange}
        />
        <button class="menu-item" @click=${() => this._fileInput?.click()}>
          <ha-icon icon="mdi:image-plus"></ha-icon>
          ${this._activeBackground.imageId ? localize("menu.replaceBackground") : localize("menu.uploadBackground")}
        </button>
        ${
          this._view === "property" &&
          this._mapTilesAvailable &&
          this._propertyLayout.map_background !== undefined
            ? html`<button
                  class="menu-item"
                  @click=${this._onToggleMapBackground}
                >
                  <ha-icon icon="mdi:map"></ha-icon>
                  ${
                    this._propertyLayout.map_background
                      ? localize("mapBackground.remove")
                      : localize("mapBackground.add")
                  }
                </button>
                ${
                  this._propertyLayout.map_background
                    ? html`<label class="popover-row"
                          >${localize("mapBackground.style")}
                          <span class="select-wrap"
                            ><select @change=${this._onMapStyleChange}>
                              <option
                                value="street"
                                ?selected=${this._propertyLayout.map_background.style !== "aerial"}
                              >
                                ${localize("mapBackground.street")}
                              </option>
                              <option
                                value="aerial"
                                ?selected=${this._propertyLayout.map_background.style === "aerial"}
                              >
                                ${localize("mapBackground.aerial")}
                              </option></select
                            ><ha-icon
                              class="chev"
                              icon="mdi:menu-down"
                            ></ha-icon
                          ></span>
                        </label>
                        <label class="popover-row"
                          >${localize("mapBackground.opacity")}
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            style="--pct:${((this._propertyLayout.map_background.opacity - 0.1) / 0.9) * 100}%"
                            .value=${String(this._propertyLayout.map_background.opacity)}
                            @input=${this._onMapOpacityChange}
                          />
                        </label>`
                    : nothing
                }`
            : nothing
        }
        ${
          this._activeBackground.imageId
            ? html`<button
                class="menu-item"
                @click=${this._onRemoveBackgroundClick}
              >
                <ha-icon icon="mdi:image-remove"></ha-icon>
                ${localize("menu.removeBackground")}
              </button>`
            : nothing
        }
        ${
          this._activeBackground.imageId
            ? html`<label class="popover-row"
                >${localize("menu.opacity")}
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  style="--pct:${((this._activeBackground.opacity - 0.1) / 0.9) * 100}%"
                  .value=${String(this._activeBackground.opacity)}
                  @input=${this._onOpacityChange}
                />
              </label>`
            : nothing
        }
      </icon-popover>
    `;
  }

  /** The active network layer's display name, or null with none on. */
  private get _networkLabel(): string | null {
    switch (this._networkType) {
      case "zigbee":
        return localize("network.zigbeeShort");
      case "wifi":
        return localize("network.wifiShort");
      case "matter":
        return localize("network.matterShort");
      case "bluetooth":
        return localize("network.bluetooth");
      default:
        return null;
    }
  }

  override render() {
    if (this._loading) {
      return html`<div class="loading">${localize("panel.loading")}</div>`;
    }
    if (this._floors.length === 0) {
      return html`<div class="no-floors">${localize("panel.noFloors")}</div>`;
    }

    const meshError =
      this._networkType === "zigbee"
        ? this._zigbeeMeshError
        : this._networkType === "wifi"
          ? this._wifiMeshError
          : this._networkType === "bluetooth"
            ? this._bluetoothError
            : this._matterError;

    return html`
      <app-header
        .floors=${this._orderedFloors}
        .selectedFloorId=${this._currentFloorId}
        .propertySelected=${this._view === "property"}
        @floor-selected=${this._onFloorSelected}
        @property-selected=${this._onPropertySelected}
      >
        ${
          this._view === "floor" || this._view === "property"
            ? html`<icon-popover
                icon="mdi:lan"
                label=${localize("menu.connectivity")}
                .open=${this._meshPopoverOpen}
                ?highlight=${this._networkType !== null}
                @toggle=${this._onToggleMeshPopover}
              >
                <div class="layer-list">
                  <button
                    class="menu-item ${this._networkType === "zigbee" ? "active" : ""}"
                    @click=${() => this._onNetworkTypeSelect("zigbee")}
                  >
                    <ha-icon icon="mdi:zigbee"></ha-icon>
                    ${localize("network.zigbee")}
                    ${this._networkType === "zigbee" ? html`<ha-icon class="trail" icon="mdi:check"></ha-icon>` : nothing}
                  </button>
                  <button
                    class="menu-item ${this._networkType === "wifi" ? "active" : ""}"
                    @click=${() => this._onNetworkTypeSelect("wifi")}
                  >
                    <ha-icon icon="mdi:wifi"></ha-icon>
                    ${localize("network.wifi")}
                    ${this._networkType === "wifi" ? html`<ha-icon class="trail" icon="mdi:check"></ha-icon>` : nothing}
                  </button>
                  <button
                    class="menu-item ${this._networkType === "matter" ? "active" : ""}"
                    @click=${() => this._onNetworkTypeSelect("matter")}
                  >
                    <ha-icon icon="mdi:router-wireless"></ha-icon>
                    ${localize("network.matter")}
                    ${this._networkType === "matter" ? html`<ha-icon class="trail" icon="mdi:check"></ha-icon>` : nothing}
                  </button>
                  <button
                    class="menu-item ${this._networkType === "bluetooth" ? "active" : ""}"
                    @click=${() => this._onNetworkTypeSelect("bluetooth")}
                  >
                    <ha-icon icon="mdi:bluetooth"></ha-icon>
                    ${localize("network.bluetooth")}
                    ${this._networkType === "bluetooth" ? html`<ha-icon class="trail" icon="mdi:check"></ha-icon>` : nothing}
                  </button>
                </div>
                ${
                  this._networkType === null
                    ? nothing
                    : html`
                        <div class="menu-divider"></div>
                        ${
                          this._networkType === "zigbee"
                            ? html`<button
                                  class="menu-item"
                                  ?disabled=${this._zigbeeMeshLoading}
                                  @click=${this._onLoadMesh}
                                >
                                  <ha-icon icon="mdi:refresh"></ha-icon>
                                  ${
                                    this._zigbeeMeshLoading
                                      ? localize("network.loadingZigbee", {
                                          seconds:
                                            this._zigbeeMeshElapsedSeconds,
                                        })
                                      : this._zigbeeMeshFetchedAt
                                        ? localize("network.refresh")
                                        : localize("network.load")
                                  }
                                </button>
                                <label class="popover-row">
                                  ${localize("network.showAll")}
                                  <input
                                    type="checkbox"
                                    class="switch"
                                    role="switch"
                                    .checked=${this._zigbeeShowAllLinks}
                                    @change=${(e: Event) => {
                                      this._zigbeeShowAllLinks = (
                                        e.target as HTMLInputElement
                                      ).checked;
                                      this._selectedMeshLink = null;
                                      this._selectedMeshStub = null;
                                    }}
                                  />
                                </label>`
                            : (this._networkType === "matter" &&
                                  this._matterUnsubscribe) ||
                                (this._networkType === "bluetooth" &&
                                  this._bluetoothUnsubscribe)
                              ? html`<span
                                  class="hint"
                                  style="padding: 4px 16px 8px"
                                  >${localize("network.live")}</span
                                >`
                              : this._networkType === "wifi" &&
                                  this._wifiMeshLoading
                                ? html`<span
                                    class="hint"
                                    style="padding: 4px 16px 8px"
                                    >${localize("network.loading")}</span
                                  >`
                                : nothing
                        }
                        ${
                          meshError
                            ? html`<span
                                class="hint"
                                style="color: var(--sc-danger); padding: 0 16px 8px"
                                >${meshError}</span
                              >`
                            : this._networkType === "zigbee" &&
                                this._zigbeeMeshFetchedAt
                              ? html`<span
                                  class="hint"
                                  style="padding: 0 16px 8px"
                                  >${this._meshAgeLabel(
                                    this._zigbeeMeshFetchedAt,
                                  )}</span
                                >`
                              : nothing
                        }
                      `
                }
              </icon-popover>`
            : nothing
        }
        <icon-popover
          slot="end"
          icon="mdi:cog"
          label="Settings"
          dialog
          .open=${this._settingsPopoverOpen}
          @toggle=${this._onToggleSettingsPopover}
        >
          <settings-menu
            .settings=${this._settings}
            .coordinatorChoices=${this._placedDeviceChoices}
            @settings-change=${this._onSettingsChange}
            @settings-close=${() => (this._settingsPopoverOpen = false)}
          ></settings-menu>
        </icon-popover>
        <icon-popover
          slot="end"
          icon="mdi:dots-vertical"
          label=${localize("menu.more")}
          .open=${this._moreOptionsPopoverOpen}
          @toggle=${this._onToggleMoreOptionsPopover}
        >
          <button
            class="menu-item"
            @click=${() => {
              this._moreOptionsPopoverOpen = false;
              this._onExportClick();
            }}
          >
            <ha-icon icon="mdi:download"></ha-icon>
            ${localize("menu.exportJson")}
          </button>
          <button
            class="menu-item"
            title=${localize("menu.debugReportHint")}
            @click=${() => {
              this._moreOptionsPopoverOpen = false;
              void this._downloadDebugReport();
            }}
          >
            <ha-icon icon="mdi:bug"></ha-icon> ${localize("menu.debugReport")}
          </button>
          <button
            class="menu-item danger"
            @click=${() => {
              this._moreOptionsPopoverOpen = false;
              this._onResetClick();
            }}
          >
            <ha-icon icon="mdi:delete-sweep"></ha-icon>
            ${this._view === "property" ? localize("menu.resetProperty") : localize("menu.resetFloor")}
          </button>
        </icon-popover>
      </app-header>

      <div class="main">
        ${
          this._versionNotice
            ? html`<div class="save-error floating-panel" role="status">
                <ha-icon icon="mdi:update"></ha-icon>
                <span
                  >${
                    this._versionNotice === "restart"
                      ? localize("panel.versionRestart")
                      : localize("panel.versionReload")
                  }</span
                >
                <button @click=${() => (this._versionNotice = null)}>
                  ${localize("panel.dismiss")}
                </button>
              </div>`
            : nothing
        }
        ${
          this._saveError
            ? html`<div class="save-error floating-panel" role="alert">
                <ha-icon icon="mdi:alert"></ha-icon>
                <span
                  >Couldn't save: ${this._saveError} Your changes are still here
                  — keep this tab open.</span
                >
                <button @click=${this._onSaveClick}>Retry</button>
              </div>`
            : nothing
        }
        ${
          this._view === "property"
            ? html`
                <div
                  class="canvas-area ${this._dragOverCanvas ? "drag-over" : ""}"
                  @dragover=${this._onCanvasDragOver}
                  @dragleave=${this._onCanvasDragLeave}
                  @drop=${this._onCanvasDrop}
                >
                  <property-canvas
                    .dark=${this._hass?.themes?.darkMode ?? false}
                    .placements=${this._livePlacements}
                    .ghosts=${this._placementGhosts}
                    .hass=${this._hass}
                    .mapBackground=${this._propertyLayout.map_background ?? null}
                    @map-adjust=${this._onMapAdjust}
                    .floorNameById=${this._floorNameById}
                    .floorIconById=${this._floorIconById}
                    .backgroundImageUrl=${backgroundImageUrl(
                      this._propertyLayout.background_image_id,
                    )}
                    .backgroundOpacity=${this._propertyLayout.background_opacity}
                    .backgroundOffsetX=${this._propertyLayout.background_offset_x}
                    .backgroundOffsetY=${this._propertyLayout.background_offset_y}
                    .backgroundScale=${this._propertyLayout.background_scale}
                    .initialViewBox=${this._propertyLayout.view_box}
                    .mode=${this._propertyMode}
                    .selectedPlacementId=${this._selectedPlacementId}
                    .pins=${this._propertyLayout.pins}
                    .selectedPinId=${this._selectedOutdoorPinId}
                    .entityLookup=${this._entityLookup}
                    .meshLinks=${this._propertyMeshLinks}
                    .selectedMeshLinkKey=${this._selectedPropertyMeshLinkKey}
                    @outdoor-pin-place=${this._onOutdoorPinPlace}
                    @property-gesture-start=${() =>
                      (this._propertyDragStart = this._propertyLayout)}
                    @outdoor-pin-move=${this._onOutdoorPinMove}
                    @outdoor-pin-select=${this._onOutdoorPinSelect}
                    @property-mesh-link-select=${this._onPropertyMeshLinkSelect}
                    @placement-place=${this._onPlacementPlace}
                    @placement-move=${this._onPlacementMove}
                    @placement-resize=${this._onPlacementResize}
                    @placement-rotate=${this._onPlacementRotate}
                    @placement-select=${this._onPlacementSelect}
                  ></property-canvas>
                  <property-overlay
                    .dirty=${this._propertyDirty}
                    .saving=${this._propertySaving}
                    .canUndo=${this._canUndo}
                    .canRedo=${this._canRedo}
                    @undo-click=${this._onUndo}
                    @redo-click=${this._onRedo}
                    @save-click=${this._onSaveClick}
                    .meshLegend=${this._networkType !== null}
                    .mode=${this._propertyMode}
                    .buildings=${this._buildings}
                    .scaleReadout=${this._propertyScaleReadout}
                    .scaleWarning=${
                      this._propertyScale?.disagree
                        ? localize("panel.scaleDisagree")
                        : null
                    }
                    .armedBuildingKey=${this._armedBuildingKey}
                    .selectedPlacement=${this._selectedPlacement}
                    .selectedPinLabel=${
                      this._selectedOutdoorPin
                        ? this._pinLabel(this._selectedOutdoorPin)
                        : null
                    }
                    .selectedMeshLink=${this._selectedPropertyMeshLink}
                    .selectedPinDefaultLabel=${
                      this._selectedOutdoorPin
                        ? pinDisplayLabel(
                            this._selectedOutdoorPin.device_id,
                            this._entityLookup.values(),
                          )
                        : null
                    }
                    .selectedPinOverride=${this._selectedOutdoorPin?.label_override ?? null}
                    .selectedPinDeviceId=${this._selectedOutdoorPin?.device_id ?? null}
                    .meshLinks=${this._propertyMeshLinks}
                    .networkLabel=${this._networkLabel}
                    .floorNameById=${this._floorNameById}
                    @outdoor-pin-label-change=${this._onOutdoorPinLabelChange}
                    @selection-clear=${this._onPropertySelectionClear}
                    @outdoor-pin-icon-click=${this._onOutdoorPinIcon}
                    @outdoor-pin-delete-click=${this._onOutdoorPinDelete}
                    @property-mesh-goto-floor-click=${this._onPropertyMeshGotoFloor}
                    @property-mode-change=${this._onPropertyModeChange}
                    @map-rotation-set=${this._onMapRotationSet}
                    @map-zoom-step=${this._onMapZoomStep}
                    .mapActive=${!!this._propertyLayout.map_background}
                    .mapRotation=${this._propertyLayout.map_background?.rotation_deg ?? 0}
                    @placement-arm=${this._onPlacementArm}
                    @placement-label-change=${this._onPlacementLabelChange}
                    @placement-delete-click=${this._onPlacementDeleteClick}
                    @placement-goto-floor-click=${this._onPlacementGotoFloorClick}
                    >${this._renderBackgroundPopover()}</property-overlay
                  >
                </div>
                ${
                  this._propertyMode === "place-pin"
                    ? html`<entity-picker-sidebar
                        @picker-close=${this._onPickerClose}
                        .entities=${this._entities}
                        .placedDeviceIds=${this._placedDeviceIds}
                        .armedEntityId=${this._armedEntityId}
                        .floors=${this._floors}
                        .areas=${this._areas}
                        .currentFloorId=${PROPERTY_LOCATION_ID}
                        @entity-armed=${this._onEntityArmed}
                        @clear-all-pins=${this._onClearAllOutdoorPins}
                      ></entity-picker-sidebar>`
                    : nothing
                }
              `
            : html`
                <div
                  class="canvas-area ${this._dragOverCanvas ? "drag-over" : ""}"
                  @dragover=${this._onCanvasDragOver}
                  @dragleave=${this._onCanvasDragLeave}
                  @drop=${this._onCanvasDrop}
                >
                  <floorplan-canvas
                    @calibrate-scale-click=${this._onCalibrateScaleClick}
                    .dark=${this._hass?.themes?.darkMode ?? false}
                    .rooms=${this._layout.rooms}
                    .pins=${this._layout.pins}
                    .walls=${this._layout.walls}
                    .openings=${this._layout.openings}
                    .scale=${this._layout.scale}
                    .unitSystem=${this._settings.unit_system}
                    .meshLinks=${this._meshLinksForCurrentFloor}
                    .meshStubs=${this._meshStubsForCurrentFloor}
                    .entityLookup=${this._entityLookup}
                    .backgroundImageUrl=${backgroundImageUrl(this._layout.background_image_id)}
                    .backgroundOpacity=${this._layout.background_opacity}
                    .backgroundOffsetX=${this._layout.background_offset_x}
                    .backgroundOffsetY=${this._layout.background_offset_y}
                    .backgroundScale=${this._layout.background_scale}
                    .alignOverlay=${this._alignOverlay}
                    .initialViewBox=${this._layout.view_box}
                    .sameBuildingAsPrevious=${this._sameBuildingAsPreviousFloor}
                    .mode=${this._mode}
                    .snapMode=${this._snapMode}
                    .armedEntityId=${this._armedEntityId}
                    .armedOpeningType=${this._armedOpeningType}
                    .selectedRoomId=${this._selectedRoomId}
                    .editingRoomId=${this._editingRoomId}
                    .selectedPinId=${this._selectedPinId}
                    .selectedWallId=${this._selectedWallId}
                    .editingWallId=${this._editingWallId}
                    .selectedOpeningId=${this._selectedOpeningId}
                    .selectedMeshLinkKey=${this._selectedMeshLinkKey}
                    .selectedMeshStubKey=${this._selectedMeshStubKey}
                    @room-trace-complete=${this._onRoomTraceComplete}
                    @room-vertex-changed=${this._onRoomVertexChanged}
                    @room-label-moved=${this._onRoomLabelMoved}
                    @room-move=${this._onRoomMove}
                    @room-select=${this._onRoomSelect}
                    @wall-trace-complete=${this._onWallTraceComplete}
                    @wall-vertex-changed=${this._onWallVertexChanged}
                    @wall-select=${this._onWallSelect}
                    @opening-place=${this._onOpeningPlace}
                    @opening-select=${this._onOpeningSelect}
                    @opening-update=${this._onOpeningUpdate}
                    @pin-place=${this._onPinPlace}
                    @pin-move=${this._onPinMove}
                    @pin-select=${this._onPinSelect}
                    @pin-stack-select=${this._onPinStackSelect}
                    @mesh-link-select=${this._onMeshLinkSelect}
                    @mesh-stub-select=${this._onMeshStubSelect}
                    @scale-line-complete=${this._onScaleLineComplete}
                    @pending-changed=${this._onPendingChanged}
                    @align-drag=${this._onAlignDrag}
                  ></floorplan-canvas>

                  <canvas-overlay
                    .dirty=${this._dirty}
                    .saving=${this._saving}
                    .canUndo=${this._canUndo}
                    .canRedo=${this._canRedo}
                    @undo-click=${this._onUndo}
                    @redo-click=${this._onRedo}
                    @save-click=${this._onSaveClick}
                    .meshLegend=${this._networkType !== null}
                    .mode=${this._mode}
                    .armedOpeningType=${this._armedOpeningType}
                    .hasPendingTrace=${this._mode === "trace" && this._pendingCount > 0}
                    .hasPendingWall=${this._mode === "wall" && this._pendingCount >= 2}
                    .snapMode=${this._snapMode}
                    .pendingScaleCount=${this._mode === "scale" ? this._pendingCount : 0}
                    .unitSystem=${this._settings.unit_system}
                    .unitsPerMeter=${this._unitsPerMeter()}
                    .selectedRoom=${this._selectedRoom}
                    .editingRoom=${!!this._editingRoomId}
                    .areas=${this._areasForCurrentFloor}
                    .selectedPin=${this._selectedPin}
                    .selectedWall=${this._selectedWall}
                    .editingWall=${!!this._editingWallId}
                    .selectedOpening=${this._selectedOpening}
                    .selectedMeshLink=${this._selectedMeshLink}
                    .meshLinks=${this._meshLinksForCurrentFloor}
                    .meshStubs=${this._meshStubsForCurrentFloor}
                    .networkLabel=${this._networkLabel}
                    .selectedMeshStub=${this._selectedMeshStub}
                    .pinStack=${this._pinStack}
                    .entityLookup=${this._entityLookup}
                    .otherFloors=${this._otherFloors}
                    .alignTargetFloorId=${this._alignTargetFloorId}
                    .alignTargetHasBackground=${
                      !this._alignTargetLayout ||
                      !!this._alignTargetLayout.background_image_id
                    }
                    @mode-change=${this._onModeChange}
                    @align-target-change=${this._onAlignTargetChange}
                    @align-scale-click=${this._onAlignScaleClick}
                    @align-apply-click=${this._onAlignApply}
                    @align-cancel-click=${this._onAlignCancel}
                    @add-opening-click=${this._onAddOpeningClick}
                    @cancel-pending-click=${this._onCancelPending}
                    @finish-wall-click=${this._onFinishWall}
                    @snap-mode-change=${this._onSnapModeChange}
                    @room-name-change=${this._onRoomNameChange}
                    @room-area-change=${this._onRoomAreaChange}
                    @room-visible-toggle=${this._onRoomVisibleToggle}
                    @room-fill-color-change=${this._onRoomFillColorChange}
                    @room-fill-opacity-change=${this._onRoomFillOpacityChange}
                    @room-border-opacity-change=${
                      this._onRoomBorderOpacityChange
                    }
                    @room-edit-vertices-click=${this._onRoomEditVertices}
                    @room-label-reset-click=${this._onRoomLabelReset}
                    @room-delete-click=${this._onRoomDelete}
                    @pin-label-change=${this._onPinLabelChange}
                    @pin-set-icon-click=${this._onPinSetIcon}
                    @pin-height-change=${this._onPinHeightChange}
                    @pin-delete-click=${this._onPinDelete}
                    @wall-material-change=${this._onWallMaterialChange}
                    @wall-thickness-change=${this._onWallThicknessChange}
                    @wall-edit-vertices-click=${this._onWallEditVertices}
                    @wall-delete-click=${this._onWallDelete}
                    @opening-width-change=${this._onOpeningWidthChange}
                    @opening-delete-click=${this._onOpeningDelete}
                    @pin-stack-choose=${this._onPinStackChoose}
                    @pin-stack-dismiss=${this._onPinStackDismiss}
                    @selection-clear=${this._onSelectionClear}
                    @pin-stack-remove-click=${this._onPinStackRemove}
                    @mesh-stub-goto-floor-click=${this._onMeshStubGotoFloorClick}
                    >${this._renderBackgroundPopover()}</canvas-overlay
                  >
                </div>
                ${
                  this._mode === "place"
                    ? html`<entity-picker-sidebar
                        @picker-close=${this._onPickerClose}
                        .entities=${this._entities}
                        .placedDeviceIds=${this._placedDeviceIds}
                        .armedEntityId=${this._armedEntityId}
                        .floors=${this._floors}
                        .areas=${this._areas}
                        .currentFloorId=${this._currentFloorId}
                        .linkedAreaIds=${this._outdoorAreaIdsOnCurrentFloor}
                        @entity-armed=${this._onEntityArmed}
                        @clear-all-pins=${this._onClearAllPins}
                      ></entity-picker-sidebar>`
                    : nothing
                }
              `
        }
      </div>
      ${
        this._iconPickerPin
          ? html`<icon-picker-dialog
              .value=${this._iconPickerPin.icon_override ?? null}
              .suggestFrom=${this._pinLabel(this._iconPickerPin)}
              @icon-picked=${this._onIconPicked}
              @icon-picker-cancel=${this._onIconPickerCancel}
            ></icon-picker-dialog>`
          : nothing
      }
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "spatial-context-panel": SpatialContextPanel;
  }
}
