import { LitElement, html, css, nothing } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import type {
  AreaMeta,
  CanvasMode,
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
  PropertyPlacement,
  ResolvedMeshLink,
  ResolvedMeshStub,
  Room,
  Settings,
  UnitSystem,
  Wall,
  WifiMesh,
  ZigbeeMesh,
} from "./types";
import { dbmToQuality, lqiToQuality, qualityColor } from "./canvas/mesh-colors";
import { pinDisplayLabel } from "./canvas/device-display";
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
import { findRoomForPoint, rayBoxExit } from "./canvas/geometry";
import {
  formatLarge,
  largeUnitLabel,
  parseLarge,
  unitsPerDisplayUnit,
} from "./units";
import { sharedStyles } from "./styles";
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
import "./views/entity-picker-sidebar";
import "./views/property-overlay";
import type { PropertyBuilding } from "./views/property-overlay";

@customElement("spatial-context-panel")
export class SpatialContextPanel extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: var(--sc-bg);
      }
      .main {
        flex: 1;
        display: flex;
        min-height: 0;
      }
      .canvas-area {
        flex: 1;
        min-width: 0;
        position: relative;
      }
      .loading,
      .no-floors {
        padding: 32px;
        color: var(--sc-fg-secondary);
      }
      .popover-row {
        display: flex;
        align-items: center;
        gap: 8px;
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
      .quality-legend {
        padding: 8px 16px 4px;
      }
      .legend-gradient {
        display: block;
        height: 6px;
        border-radius: 3px;
      }
      .legend-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        color: var(--sc-fg-secondary);
        margin-top: 2px;
      }
      .hidden-file-input {
        display: none;
      }
      input[type="range"] {
        width: 120px;
      }
      .hint {
        font-size: 0.8rem;
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
  @state() private _wifiMesh: WifiMesh | null = null;
  @state() private _wifiMeshLoading = false;
  @state() private _wifiMeshError: string | null = null;
  @state() private _wifiMeshFetchedAt: number | null = null;
  @state() private _matterTopology: MatterNetworkTopology | null = null;
  @state() private _matterError: string | null = null;
  private _matterUnsubscribe: (() => void) | null = null;
  @state() private _backgroundPopoverOpen = false;
  @state() private _meshPopoverOpen = false;
  /** Shared across every viewer of the panel (see ha-client.ts's
   * getSettings/saveSettings) — not per-browser, same as floors/property. */
  @state() private _settings: Settings = emptySettings();
  @state() private _settingsPopoverOpen = false;
  @state() private _moreOptionsPopoverOpen = false;

  // --- Property tab ---------------------------------------------------
  @state() private _view: "floor" | "property" = "floor";
  @state() private _propertyLayout: PropertyLayout = emptyPropertyLayout();
  @state() private _propertyDirty = false;
  @state() private _propertySaving = false;
  @state() private _selectedPlacementId: string | null = null;
  @state() private _propertyMode: "select" | "place" = "select";
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
      this._layout.pins
        .map((p) => p.device_id)
        .filter((id): id is string => id !== null),
    );
  }

  private get _selectedRoom(): Room | null {
    return (
      this._layout.rooms.find((r) => r.id === this._selectedRoomId) ?? null
    );
  }

  private get _areasForCurrentFloor(): AreaMeta[] {
    return this._areas.filter((a) => a.floor_id === this._currentFloorId);
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
    const bounds = floors
      .map((f) => f.content_bounds)
      .filter((b): b is NonNullable<FloorMeta["content_bounds"]> => b !== null);
    if (bounds.length === 0) {
      return DEFAULT_PLACEMENT_WIDTH / DEFAULT_PLACEMENT_HEIGHT;
    }
    const minX = Math.min(...bounds.map((b) => b.min_x));
    const minY = Math.min(...bounds.map((b) => b.min_y));
    const maxX = Math.max(...bounds.map((b) => b.max_x));
    const maxY = Math.max(...bounds.map((b) => b.max_y));
    const width = maxX - minX;
    const height = maxY - minY;
    return width > 0 && height > 0
      ? width / height
      : DEFAULT_PLACEMENT_WIDTH / DEFAULT_PLACEMENT_HEIGHT;
  }

  private get _floorNameById(): Map<string, string> {
    return new Map(this._floors.map((f) => [f.floor_id, f.name]));
  }

  private get _floorIconById(): Map<string, string> {
    return new Map(
      this._floors.map((f) => [f.floor_id, f.icon || "mdi:floor-plan"]),
    );
  }

  private get _selectedPlacement(): PropertyPlacement | null {
    return (
      this._propertyLayout.placements.find(
        (p) => p.id === this._selectedPlacementId,
      ) ?? null
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
   * this" lives in one place. The Connectivity Map popover's open/closed
   * state is this whole feature's master on/off switch — closed means
   * off, full stop, regardless of what's cached from an earlier session
   * with it open. */
  private get _normalizedMeshLinks(): {
    sourceDeviceId: string;
    targetDeviceId: string;
    quality: "strong" | "medium" | "weak" | "unknown";
    detail?: string;
  }[] {
    if (!this._meshPopoverOpen) return [];

    if (this._networkType === "zigbee" && this._zigbeeMesh) {
      return this._zigbeeMesh.links
        .filter((link) => link.source_device_id && link.target_device_id)
        .map((link) => ({
          sourceDeviceId: link.source_device_id!,
          targetDeviceId: link.target_device_id!,
          quality: lqiToQuality(link.lqi),
          detail: `LQI ${link.lqi}`,
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

  private get _scaleReadout(): string | null {
    const unitsPerMeter = this._unitsPerMeter();
    if (unitsPerMeter === null) return null;
    const system = this._settings.unit_system;
    const unitsPerDisplay = unitsPerDisplayUnit(unitsPerMeter, system);
    return `Scale: 1 ${largeUnitLabel(system)} ≈ ${unitsPerDisplay.toFixed(1)} units`;
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
    if (floors.length > 0) {
      await this._selectFloor(floors[0]!.floor_id, { skipDirtyCheck: true });
    }
    this._loading = false;
  }

  private async _selectFloor(
    floorId: string,
    opts: { skipDirtyCheck?: boolean } = {},
  ): Promise<void> {
    if (!opts.skipDirtyCheck && this._dirty) {
      if (!window.confirm("Discard unsaved changes to this floor?")) return;
    }
    this._view = "floor";
    const previousBuildingId = this._layout.building_id;
    this._currentFloorId = floorId;
    this._layout = await this._client.getLayout(floorId);
    this._resetSelection();
    this._resetAlignState();
    this._dirty = false;
    void this._loadOtherFloorPins(floorId);

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
      await this._client.saveLayout(this._currentFloorId, this._layout);
      this._dirty = false;
      this._floors = this._floors.map((f) =>
        f.floor_id === this._currentFloorId ? { ...f, has_layout: true } : f,
      );
      // A save can add/move/remove pins, which changes which devices are
      // "already placed elsewhere" — the entity picker's own copy of that
      // (fetched once at panel load) would otherwise only catch up on a
      // full page reload.
      this._entities = await this._client.listPlaceableEntities();
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
      if (!window.confirm("Discard unsaved changes to the property view?"))
        return;
    }
    this._propertyLayout = await this._client.getPropertyLayout();
    this._propertyDirty = false;
    this._selectedPlacementId = null;
    this._propertyMode = "select";
    this._armedBuildingKey = null;
    this._view = "property";
  }

  private _updatePropertyLayout(patch: Partial<PropertyLayout>): void {
    this._propertyLayout = { ...this._propertyLayout, ...patch };
    this._propertyDirty = true;
  }

  private async _saveProperty(): Promise<void> {
    this._propertySaving = true;
    try {
      const viewBox =
        this._propertyCanvas?.getViewBox() ?? this._propertyLayout.view_box;
      this._propertyLayout = { ...this._propertyLayout, view_box: viewBox };
      await this._client.savePropertyLayout(this._propertyLayout);
      this._propertyDirty = false;
    } finally {
      this._propertySaving = false;
    }
  }

  private _onPropertyModeChange = (
    e: CustomEvent<{ mode: "select" | "place" }>,
  ) => {
    this._propertyMode = e.detail.mode;
    this._armedBuildingKey = null;
    this._selectedPlacementId = null;
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
  };

  private _onPlacementRenameClick = () => {
    const p = this._selectedPlacement;
    if (!p) return;
    const current =
      p.label_override ?? this._floorNameById.get(p.floor_id) ?? p.floor_id;
    const name = window.prompt("Label (blank to clear override):", current);
    if (name === null) return;
    this._patchPlacement(p.id, { label_override: name || null });
  };

  private _onPlacementDeleteClick = () => {
    const p = this._selectedPlacement;
    if (!p) return;
    const label =
      p.label_override ?? this._floorNameById.get(p.floor_id) ?? p.floor_id;
    if (!window.confirm(`Delete the "${label}" placement?`)) return;
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
    if (this._view === "property") void this._saveProperty();
    else void this._save();
  };
  private _onExportClick = () => void this._export();

  private _onResetClick = () => {
    if (this._view === "property") {
      if (
        !window.confirm(
          "Reset the property view? This clears every building placement and the " +
            "background photo. Nothing is permanent until you hit Save afterward.",
        )
      ) {
        return;
      }
      this._propertyLayout = emptyPropertyLayout();
      this._propertyDirty = true;
      this._selectedPlacementId = null;
      return;
    }
    const floorName =
      this._floors.find((f) => f.floor_id === this._currentFloorId)?.name ??
      "this floor";
    if (
      !window.confirm(
        `Reset "${floorName}"? This clears every room, wall, opening, placed device, and the ` +
          `background image on this floor. Nothing is permanent until you hit Save afterward.`,
      )
    ) {
      return;
    }
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

  /** The popover's open/closed state doubles as the Connectivity Map's
   * master on/off switch (see `_meshLinksForCurrentFloor`) — closing it
   * (including clicking the header icon again while open) hides whatever
   * mesh is currently drawn and drops the live Matter subscription, rather
   * than leaving a stale overlay showing after the menu's put away. */
  private _onToggleMeshPopover = () => {
    const opening = !this._meshPopoverOpen;
    this._meshPopoverOpen = opening;
    this._backgroundPopoverOpen = false;
    this._settingsPopoverOpen = false;
    this._moreOptionsPopoverOpen = false;
    if (!opening) {
      this._unsubscribeMatter();
      // Reset to the neutral "nothing picked" state so the *next* open
      // (this session or a fresh page load) never shows a layer already
      // armed — every open should look and behave the same.
      this._networkType = null;
      this._selectedMeshLink = null;
      this._selectedMeshStub = null;
    }
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

  /** Instant-apply, no dirty-tracking — this is a small shared app-wide
   * preference (see types.ts's Settings), not floor/property content, so
   * it persists the moment you pick it rather than waiting for Save. */
  private _onUnitSystemSelect = (system: UnitSystem) => {
    this._settingsPopoverOpen = false;
    if (this._settings.unit_system === system) return;
    this._settings = { ...this._settings, unit_system: system };
    void this._client.saveSettings(this._settings);
  };

  // Selecting a layer only changes which one is selected — it never fetches
  // or subscribes by itself. Every network type needs an explicit Load/
  // Connect click (see _onLoadMesh) so opening the menu is never itself a
  // (possibly slow, e.g. Zigbee's ~90s) network request.
  private _onNetworkTypeSelect = (type: NetworkType) => {
    this._networkType = type;
    this._selectedMeshLink = null;
    this._selectedMeshStub = null;
  };

  private _onLoadMesh = () => {
    if (this._networkType === "zigbee") void this._refreshZigbeeMesh();
    else if (this._networkType === "wifi") void this._refreshWifiMesh();
    else if (this._networkType === "matter") void this._subscribeMatter();
  };

  private async _refreshZigbeeMesh(): Promise<void> {
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
      this._zigbeeMesh = await this._client.getZigbeeMesh();
      this._zigbeeMeshFetchedAt = Date.now();
    } catch (err) {
      const message = (err as { message?: string })?.message;
      this._zigbeeMeshError = message || "Zigbee mesh request failed";
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
      this._wifiMeshFetchedAt = Date.now();
    } catch (err) {
      const message = (err as { message?: string })?.message;
      this._wifiMeshError = message || "Wi-Fi mesh request failed";
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
      const message = (err as { message?: string })?.message;
      this._matterError = message || "Matter topology subscription failed";
    }
  }

  private _unsubscribeMatter(): void {
    this._matterUnsubscribe?.();
    this._matterUnsubscribe = null;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribeMatter();
    if (this._zigbeeMeshTimer !== null) {
      window.clearInterval(this._zigbeeMeshTimer);
      this._zigbeeMeshTimer = null;
    }
  }

  private _onFileInputChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    try {
      const imageId = await this._client.uploadBackgroundImage(file);
      const patch = { background_image_id: imageId, background_opacity: 0.85 };
      if (this._view === "property") this._updatePropertyLayout(patch);
      else this._updateLayout(patch);
    } catch (err) {
      window.alert(`Background image upload failed: ${(err as Error).message}`);
    }
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

  private _onAlignScaleClick = (e: CustomEvent<{ factor: number }>) => {
    this._alignScale *= e.detail.factor;
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
      "that floor";
    if (
      !window.confirm(
        `Apply this alignment to "${targetName}"? This rewrites every room, wall, door/window, ` +
          `and placed device position on that floor — plus its background image's placement and, ` +
          `if this floor has one set, its scale calibration too — to match this floor's coordinate ` +
          `system. This saves immediately and cannot be undone.`,
      )
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
  };

  private _onRoomRename = () => {
    const room = this._selectedRoom;
    if (!room) return;
    const name = window.prompt("Room name:", room.name);
    if (!name) return;
    this._updateLayout({
      rooms: this._layout.rooms.map((r) =>
        r.id === room.id ? { ...r, name } : r,
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

  private _onRoomEditVertices = () => {
    if (!this._selectedRoomId) return;
    this._editingRoomId =
      this._editingRoomId === this._selectedRoomId
        ? null
        : this._selectedRoomId;
  };

  private _onRoomDelete = () => {
    const room = this._selectedRoom;
    if (!room || !window.confirm(`Delete room "${room.name}"?`)) return;
    this._updateLayout({
      rooms: this._layout.rooms.filter((r) => r.id !== room.id),
      pins: this._layout.pins.map((p) =>
        p.room_id === room.id ? { ...p, room_id: null } : p,
      ),
    });
    this._selectedRoomId = null;
    this._editingRoomId = null;
  };

  private _onPinSetLabel = () => {
    const pin = this._selectedPin;
    if (!pin) return;
    const label = window.prompt(
      "Label override (blank to clear):",
      pin.label_override ?? "",
    );
    if (label === null) return;
    this._patchPin(pin.id, { label_override: label || null });
  };

  private _onPinSetIcon = () => {
    const pin = this._selectedPin;
    if (!pin) return;
    const icon = window.prompt(
      "Icon override, e.g. mdi:motion-sensor (blank to clear):",
      pin.icon_override ?? "",
    );
    if (icon === null) return;
    this._patchPin(pin.id, { icon_override: icon || null });
  };

  private _onPinSetHeight = () => {
    const pin = this._selectedPin;
    if (!pin) return;
    const system = this._settings.unit_system;
    const unitWord = system === "imperial" ? "feet" : "metres";
    const example = system === "imperial" ? "6" : "1.8";
    const input = window.prompt(
      `Mounting height in ${unitWord} above floor level (e.g. ${example} for a high wall mount; blank to clear):`,
      pin.height_m === null ? "" : formatLarge(pin.height_m, system),
    );
    if (input === null) return;
    const parsed = input.trim() === "" ? null : parseLarge(input, system);
    this._patchPin(pin.id, {
      height_m: parsed !== null && Number.isFinite(parsed) ? parsed : null,
    });
  };

  private _onPinDelete = () => {
    const pin = this._selectedPin;
    if (!pin || !window.confirm(`Delete pin for ${this._pinLabel(pin)}?`))
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
    if (
      !wall ||
      !window.confirm(
        "Delete this wall? Any doors/windows on it will be removed too.",
      )
    ) {
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
    if (!opening || !window.confirm(`Delete this ${opening.type}?`)) return;
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
        `Remove all ${count} placed device${count === 1 ? "" : "s"} from this floor?`,
      )
    ) {
      return;
    }
    this._updateLayout({ pins: [] });
    this._selectedPinId = null;
    this._pinStackIds = null;
  };

  // --- canvas ---------------------------------------------------------

  private _onRoomTraceComplete = (
    e: CustomEvent<{ points: [number, number][] }>,
  ) => {
    const room = newRoom("New Room", e.detail.points, null);
    this._updateLayout({ rooms: [...this._layout.rooms, room] });
    this._selectedRoomId = room.id;
  };

  private _onRoomVertexChanged = (
    e: CustomEvent<{ roomId: string; points: [number, number][] }>,
  ) => {
    this._updateLayout({
      rooms: this._layout.rooms.map((r) =>
        r.id === e.detail.roomId ? { ...r, points: e.detail.points } : r,
      ),
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
    void this._selectFloor(stub.targetFloorId);
  };

  private _onPinStackChoose = (e: CustomEvent<{ pinId: string }>) => {
    this._pinStackIds = null;
    this._selectedPinId = e.detail.pinId;
  };

  private _onPinStackDismiss = () => {
    this._pinStackIds = null;
  };

  private _onPinStackRemove = (e: CustomEvent<{ pinId: string }>) => {
    const pin = this._layout.pins.find((p) => p.id === e.detail.pinId);
    if (!pin) return;
    if (!window.confirm(`Remove ${this._pinLabel(pin)} from this spot?`))
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
    const unitWord = system === "imperial" ? "feet" : "metres";
    const input = window.prompt(
      `Real-world distance between these two points, in ${unitWord}:`,
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

  private _meshAgeLabel(fetchedAt: number): string {
    const seconds = Math.round((Date.now() - fetchedAt) / 1000);
    if (seconds < 60) return `refreshed ${seconds}s ago`;
    return `refreshed ${Math.round(seconds / 60)}m ago`;
  }

  override render() {
    if (this._loading) {
      return html`<div class="loading">Loading Spatial Context…</div>`;
    }
    if (this._floors.length === 0) {
      return html`<div class="no-floors">
        No floors found. Add floors under Settings → Areas → Floors, then reopen
        this panel.
      </div>`;
    }

    const meshLoading =
      this._networkType === "zigbee"
        ? this._zigbeeMeshLoading
        : this._wifiMeshLoading;
    const meshError =
      this._networkType === "zigbee"
        ? this._zigbeeMeshError
        : this._networkType === "wifi"
          ? this._wifiMeshError
          : this._matterError;
    const meshFetchedAt =
      this._networkType === "zigbee"
        ? this._zigbeeMeshFetchedAt
        : this._wifiMeshFetchedAt;

    return html`
      <app-header
        .floors=${this._floors}
        .selectedFloorId=${this._currentFloorId}
        .propertySelected=${this._view === "property"}
        .dirty=${this._view === "property" ? this._propertyDirty : this._dirty}
        .saving=${this._view === "property" ? this._propertySaving : this._saving}
        @floor-selected=${this._onFloorSelected}
        @property-selected=${this._onPropertySelected}
        @save-click=${this._onSaveClick}
      >
        <icon-popover
          icon="mdi:image"
          label="Background"
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
            ${this._activeBackground.imageId ? "Replace background" : "Upload background"}
          </button>
          ${
            this._activeBackground.imageId
              ? html`<button
                  class="menu-item"
                  @click=${this._onRemoveBackgroundClick}
                >
                  <ha-icon icon="mdi:image-remove"></ha-icon> Remove background
                </button>`
              : nothing
          }
          ${
            this._activeBackground.imageId
              ? html`<label
                  class="popover-row hint"
                  style="padding: 8px 16px 4px"
                  >Opacity
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    .value=${String(this._activeBackground.opacity)}
                    @input=${this._onOpacityChange}
                  />
                </label>`
              : nothing
          }
        </icon-popover>
        ${
          this._view === "floor"
            ? html`<icon-popover
                icon="mdi:layers"
                label="Connectivity Map"
                .open=${this._meshPopoverOpen}
                @toggle=${this._onToggleMeshPopover}
              >
                <div class="layer-list">
                  <button
                    class="menu-item ${this._networkType === "zigbee" ? "active" : ""}"
                    @click=${() => this._onNetworkTypeSelect("zigbee")}
                  >
                    <ha-icon icon="mdi:zigbee"></ha-icon> Zigbee Mesh
                  </button>
                  <button
                    class="menu-item ${this._networkType === "wifi" ? "active" : ""}"
                    @click=${() => this._onNetworkTypeSelect("wifi")}
                  >
                    <ha-icon icon="mdi:wifi"></ha-icon> Wi-Fi Network
                  </button>
                  <button
                    class="menu-item ${this._networkType === "matter" ? "active" : ""}"
                    @click=${() => this._onNetworkTypeSelect("matter")}
                  >
                    <ha-icon icon="mdi:router-wireless"></ha-icon> Matter
                    Network
                  </button>
                </div>
                ${
                  this._networkType === null
                    ? html`<span class="hint" style="padding: 4px 16px 8px"
                        >Pick a network above to load it.</span
                      >`
                    : html`
                        <div class="quality-legend">
                          <span
                            class="legend-gradient"
                            style="background: linear-gradient(to right, ${qualityColor(
                              "weak",
                            )}, ${qualityColor("medium")}, ${qualityColor("strong")})"
                          ></span>
                          <div class="legend-labels">
                            <span>Weak</span><span>Strong</span>
                          </div>
                        </div>
                        ${
                          this._networkType === "matter" &&
                          this._matterUnsubscribe
                            ? html`<span
                                class="hint"
                                style="padding: 4px 16px 8px"
                                >● Live</span
                              >`
                            : html`<button
                                class="menu-item"
                                ?disabled=${meshLoading}
                                @click=${this._onLoadMesh}
                              >
                                <ha-icon icon="mdi:refresh"></ha-icon>
                                ${
                                  meshLoading
                                    ? this._networkType === "zigbee"
                                      ? `Loading… ${this._zigbeeMeshElapsedSeconds}s (usually 1-2 min)`
                                      : "Loading…"
                                    : this._networkType === "matter"
                                      ? "Load Network"
                                      : this._networkType === "wifi"
                                        ? meshFetchedAt
                                          ? "Refresh Network"
                                          : "Load Network"
                                        : meshFetchedAt
                                          ? "Refresh Mesh"
                                          : "Load Mesh"
                                }
                              </button>`
                        }
                        ${
                          meshError
                            ? html`<span
                                class="hint"
                                style="color: var(--sc-danger); padding: 0 16px 8px"
                                >${meshError}</span
                              >`
                            : meshFetchedAt && this._networkType !== "matter"
                              ? html`<span
                                  class="hint"
                                  style="padding: 0 16px 8px"
                                  >${this._meshAgeLabel(meshFetchedAt)}</span
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
          icon="mdi:tune"
          label="Settings"
          .open=${this._settingsPopoverOpen}
          @toggle=${this._onToggleSettingsPopover}
        >
          <span class="popover-row hint" style="padding: 8px 16px 4px"
            >Units</span
          >
          <button
            class="menu-item ${this._settings.unit_system === "metric" ? "active" : ""}"
            @click=${() => this._onUnitSystemSelect("metric")}
          >
            <ha-icon icon="mdi:ruler"></ha-icon> Metric (m / cm)
          </button>
          <button
            class="menu-item ${this._settings.unit_system === "imperial" ? "active" : ""}"
            @click=${() => this._onUnitSystemSelect("imperial")}
          >
            <ha-icon icon="mdi:ruler"></ha-icon> Imperial (ft / in)
          </button>
        </icon-popover>
        <icon-popover
          slot="end"
          icon="mdi:dots-vertical"
          label="More options"
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
            <ha-icon icon="mdi:download"></ha-icon> Export JSON
          </button>
          <button
            class="menu-item danger"
            @click=${() => {
              this._moreOptionsPopoverOpen = false;
              this._onResetClick();
            }}
          >
            <ha-icon icon="mdi:delete-sweep"></ha-icon>
            ${this._view === "property" ? "Reset property" : "Reset floor"}
          </button>
        </icon-popover>
      </app-header>

      <div class="main">
        ${
          this._view === "property"
            ? html`
                <div class="canvas-area">
                  <property-canvas
                    .placements=${this._propertyLayout.placements}
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
                    @placement-place=${this._onPlacementPlace}
                    @placement-move=${this._onPlacementMove}
                    @placement-resize=${this._onPlacementResize}
                    @placement-rotate=${this._onPlacementRotate}
                    @placement-select=${this._onPlacementSelect}
                  ></property-canvas>
                  <property-overlay
                    .mode=${this._propertyMode}
                    .buildings=${this._buildings}
                    .armedBuildingKey=${this._armedBuildingKey}
                    .selectedPlacement=${this._selectedPlacement}
                    .floorNameById=${this._floorNameById}
                    @property-mode-change=${this._onPropertyModeChange}
                    @placement-arm=${this._onPlacementArm}
                    @placement-rename-click=${this._onPlacementRenameClick}
                    @placement-delete-click=${this._onPlacementDeleteClick}
                    @placement-goto-floor-click=${this._onPlacementGotoFloorClick}
                  ></property-overlay>
                </div>
              `
            : html`
                <div class="canvas-area">
                  <floorplan-canvas
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
                    .mode=${this._mode}
                    .armedOpeningType=${this._armedOpeningType}
                    .hasPendingTrace=${this._mode === "trace" && this._pendingCount > 0}
                    .hasPendingWall=${this._mode === "wall" && this._pendingCount >= 2}
                    .pendingScaleCount=${this._mode === "scale" ? this._pendingCount : 0}
                    .scaleReadout=${this._scaleReadout}
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
                    @room-rename-click=${this._onRoomRename}
                    @room-area-change=${this._onRoomAreaChange}
                    @room-edit-vertices-click=${this._onRoomEditVertices}
                    @room-delete-click=${this._onRoomDelete}
                    @pin-set-label-click=${this._onPinSetLabel}
                    @pin-set-icon-click=${this._onPinSetIcon}
                    @pin-set-height-click=${this._onPinSetHeight}
                    @pin-delete-click=${this._onPinDelete}
                    @wall-material-change=${this._onWallMaterialChange}
                    @wall-thickness-change=${this._onWallThicknessChange}
                    @wall-edit-vertices-click=${this._onWallEditVertices}
                    @wall-delete-click=${this._onWallDelete}
                    @opening-width-change=${this._onOpeningWidthChange}
                    @opening-delete-click=${this._onOpeningDelete}
                    @pin-stack-choose=${this._onPinStackChoose}
                    @pin-stack-dismiss=${this._onPinStackDismiss}
                    @pin-stack-remove-click=${this._onPinStackRemove}
                    @mesh-stub-goto-floor-click=${this._onMeshStubGotoFloorClick}
                  ></canvas-overlay>
                </div>
                ${
                  this._mode === "place"
                    ? html`<entity-picker-sidebar
                        .entities=${this._entities}
                        .placedDeviceIds=${this._placedDeviceIds}
                        .armedEntityId=${this._armedEntityId}
                        .floors=${this._floors}
                        .areas=${this._areas}
                        .currentFloorId=${this._currentFloorId}
                        @entity-armed=${this._onEntityArmed}
                        @clear-all-pins=${this._onClearAllPins}
                      ></entity-picker-sidebar>`
                    : nothing
                }
              `
        }
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "spatial-context-panel": SpatialContextPanel;
  }
}
