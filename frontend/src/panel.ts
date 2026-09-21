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
  ResolvedMeshLink,
  Room,
  Wall,
  WifiMesh,
  ZigbeeMesh,
} from "./types";
import { dbmToQuality, lqiToQuality, qualityColor } from "./canvas/mesh-colors";
import {
  HaClient,
  backgroundImageUrl,
  emptyFloorLayout,
  emptyPin,
  newId,
  newOpening,
  newRoom,
  newWall,
} from "./ha-client";
import { findRoomForPoint } from "./canvas/geometry";
import { sharedStyles } from "./styles";
import "./canvas/floorplan-canvas";
import type { AlignOverlay, FloorplanCanvas } from "./canvas/floorplan-canvas";
import "./views/app-header";
import "./views/canvas-overlay";
import "./views/icon-popover";
import "./views/entity-picker-sidebar";

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

  private get _placedEntityIds(): Set<string> {
    return new Set(this._layout.pins.map((p) => p.entity_id));
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
    const entityLookup = this._entityLookup;
    const pinByDeviceId = new Map<string, Pin>();
    for (const pin of this._layout.pins) {
      const deviceId = entityLookup.get(pin.entity_id)?.device_id;
      if (deviceId) pinByDeviceId.set(deviceId, pin);
    }
    return pinByDeviceId;
  }

  /** Only links where both ends resolve to a pin placed on the currently
   * viewed floor — a cross-floor relay link (e.g. a repeater linking Top
   * Floor to Garage) is silently skipped, not drawn as a stub. Each
   * network's raw shape gets normalized here rather than in its own
   * backend response, so "how do we grade this" lives in one place. */
  private get _meshLinksForCurrentFloor(): ResolvedMeshLink[] {
    // The Connectivity Map popover's open/closed state is this feature's
    // master on/off switch — closed means off, full stop, regardless of
    // what's cached from an earlier session with it open.
    if (!this._meshPopoverOpen) return [];

    const pinByDeviceId = this._pinByDeviceId;
    const links: ResolvedMeshLink[] = [];

    if (this._networkType === "zigbee" && this._zigbeeMesh) {
      for (const link of this._zigbeeMesh.links) {
        if (!link.source_device_id || !link.target_device_id) continue;
        const fromPin = pinByDeviceId.get(link.source_device_id);
        const toPin = pinByDeviceId.get(link.target_device_id);
        if (fromPin && toPin) {
          links.push({
            fromPin,
            toPin,
            quality: lqiToQuality(link.lqi),
            detail: `LQI ${link.lqi}`,
          });
        }
      }
    } else if (this._networkType === "wifi" && this._wifiMesh) {
      for (const link of this._wifiMesh.links) {
        const fromPin = pinByDeviceId.get(link.source_device_id);
        const toPin = pinByDeviceId.get(link.target_device_id);
        if (fromPin && toPin) {
          links.push({
            fromPin,
            toPin,
            quality:
              link.rssi_dbm != null ? dbmToQuality(link.rssi_dbm) : "unknown",
            ...(link.rssi_dbm != null
              ? { detail: `${link.rssi_dbm} dBm` }
              : {}),
          });
        }
      }
    } else if (this._networkType === "matter" && this._matterTopology) {
      const deviceIdByNodeId = new Map<string, string>();
      for (const node of this._matterTopology.nodes) {
        if (node.ha_device_id) deviceIdByNodeId.set(node.id, node.ha_device_id);
      }
      for (const conn of this._matterTopology.connections) {
        const sourceDeviceId = deviceIdByNodeId.get(conn.source);
        const targetDeviceId = deviceIdByNodeId.get(conn.target);
        if (!sourceDeviceId || !targetDeviceId) continue;
        const fromPin = pinByDeviceId.get(sourceDeviceId);
        const toPin = pinByDeviceId.get(targetDeviceId);
        if (fromPin && toPin) {
          links.push({
            fromPin,
            toPin,
            quality: conn.strength,
            detail: conn.strength,
          });
        }
      }
    }
    return links;
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

  private get _scaleReadout(): string | null {
    const scale = this._layout.scale;
    if (!scale) return null;
    const [[x1, y1], [x2, y2]] = scale.points;
    const unitDistance = Math.hypot(x2 - x1, y2 - y1) || 1;
    const unitsPerMeter = unitDistance / scale.meters;
    return `Scale: 1 m ≈ ${unitsPerMeter.toFixed(1)} units`;
  }

  /** ~0.9m in stored units when calibrated, else a fixed fallback. */
  private _defaultOpeningWidth(): number {
    const scale = this._layout.scale;
    if (!scale) return 30;
    const [[x1, y1], [x2, y2]] = scale.points;
    const unitDistance = Math.hypot(x2 - x1, y2 - y1) || 1;
    const unitsPerMeter = unitDistance / scale.meters;
    return 0.9 * unitsPerMeter;
  }

  private async _init(): Promise<void> {
    const [floors, entities, areas] = await Promise.all([
      this._client.listFloors(),
      this._client.listPlaceableEntities(),
      this._client.listAreas(),
    ]);
    this._floors = floors;
    this._entities = entities;
    this._areas = areas;
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
    const previousBuildingId = this._layout.building_id;
    this._currentFloorId = floorId;
    this._layout = await this._client.getLayout(floorId);
    this._resetSelection();
    this._resetAlignState();
    this._dirty = false;

    // Two floors sharing a non-null building_id (see Align Floors) are one
    // physical building in one coordinate system — keep the current pan/
    // zoom so switching between them lands on the same physical spot on
    // screen. Anything else (a never-aligned floor, or a genuinely
    // separate building like a detached Garage) has no meaningful
    // correspondence to the previous floor's view, so fit fresh instead of
    // showing whatever unrelated region happened to be in frame.
    const sameBuilding =
      this._layout.building_id !== null &&
      this._layout.building_id === previousBuildingId;
    if (!sameBuilding) {
      await this.updateComplete;
      this._canvas?.fitToScreen();
    }
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
    this._armedEntityId = null;
    this._armedOpeningType = null;
  }

  private async _save(): Promise<void> {
    if (!this._currentFloorId) return;
    this._saving = true;
    try {
      await this._client.saveLayout(this._currentFloorId, this._layout);
      this._dirty = false;
      this._floors = this._floors.map((f) =>
        f.floor_id === this._currentFloorId ? { ...f, has_layout: true } : f,
      );
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

  private _onSaveClick = () => void this._save();
  private _onExportClick = () => void this._export();

  private _onResetClick = () => {
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
    if (!opening) {
      this._unsubscribeMatter();
      // Reset to the neutral "nothing picked" state so the *next* open
      // (this session or a fresh page load) never shows a layer already
      // armed — every open should look and behave the same.
      this._networkType = null;
    }
  };

  // Selecting a layer only changes which one is selected — it never fetches
  // or subscribes by itself. Every network type needs an explicit Load/
  // Connect click (see _onLoadMesh) so opening the menu is never itself a
  // (possibly slow, e.g. Zigbee's ~90s) network request.
  private _onNetworkTypeSelect = (type: NetworkType) => {
    this._networkType = type;
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
      this._updateLayout({
        background_image_id: imageId,
        background_opacity: 0.85,
      });
    } catch (err) {
      window.alert(`Background image upload failed: ${(err as Error).message}`);
    }
  };

  private _onRemoveBackgroundClick = () => {
    this._updateLayout({ background_image_id: null });
  };

  private _onOpacityChange = (e: Event) => {
    this._updateLayout({
      background_opacity: Number((e.target as HTMLInputElement).value),
    });
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
    const input = window.prompt(
      "Mounting height in metres above floor level (e.g. 1.8 for a high wall mount; blank to clear):",
      pin.height_m === null ? "" : String(pin.height_m),
    );
    if (input === null) return;
    const parsed = input.trim() === "" ? null : Number(input);
    this._patchPin(pin.id, {
      height_m: parsed !== null && Number.isFinite(parsed) ? parsed : null,
    });
  };

  private _onPinDelete = () => {
    const pin = this._selectedPin;
    if (!pin || !window.confirm(`Delete pin for ${pin.entity_id}?`)) return;
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

  private _onOpeningSetWidth = () => {
    const opening = this._selectedOpening;
    if (!opening) return;
    const input = window.prompt(
      "Width along the wall (stored units):",
      String(opening.width),
    );
    const width = input ? Number(input) : NaN;
    if (!Number.isFinite(width) || width <= 0) return;
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
    const pin = emptyPin(this._armedEntityId, e.detail.x, e.detail.y, roomId);
    // Placement is per physical device, not per entity (see
    // entity-picker-sidebar.ts) — but a device's chosen primary entity can
    // still carry its own, more specific name (e.g. a UniFi Protect camera
    // with no plain "camera.xxx" entity at all, only differently-named
    // "High/Medium/Low resolution channel" streams). Default the pin's
    // label to the device's own name in that case, so what's shown on the
    // map matches what the picker showed, not whichever stream/sub-entity
    // happened to be picked as primary. Still fully overridable per-pin.
    const entity = this._entityLookup.get(this._armedEntityId);
    if (entity && entity.device_name && entity.device_name !== entity.name) {
      pin.label_override = entity.device_name;
    }
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
    }
  };

  private _onPinStackSelect = (e: CustomEvent<{ pinIds: string[] }>) => {
    this._pinStackIds = e.detail.pinIds;
    this._selectedRoomId = null;
    this._selectedWallId = null;
    this._editingWallId = null;
    this._selectedOpeningId = null;
    this._selectedPinId = null;
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
    return this._entityLookup.get(pin.entity_id)?.name ?? pin.entity_id;
  }

  private _onScaleLineComplete = (
    e: CustomEvent<{ points: [number, number][] }>,
  ) => {
    const input = window.prompt(
      "Real-world distance between these two points, in metres:",
    );
    const meters = input ? Number(input) : NaN;
    if (!Number.isFinite(meters) || meters <= 0) return;
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
        .dirty=${this._dirty}
        .saving=${this._saving}
        @floor-selected=${this._onFloorSelected}
        @save-click=${this._onSaveClick}
        @export-click=${this._onExportClick}
        @reset-click=${this._onResetClick}
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
            ${this._layout.background_image_id ? "Replace background" : "Upload background"}
          </button>
          ${
            this._layout.background_image_id
              ? html`<button
                  class="menu-item"
                  @click=${this._onRemoveBackgroundClick}
                >
                  <ha-icon icon="mdi:image-remove"></ha-icon> Remove background
                </button>`
              : nothing
          }
          ${
            this._layout.background_image_id
              ? html`<label
                  class="popover-row hint"
                  style="padding: 8px 16px 4px"
                  >Opacity
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    .value=${String(this._layout.background_opacity)}
                    @input=${this._onOpacityChange}
                  />
                </label>`
              : nothing
          }
        </icon-popover>
        <icon-popover
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
              <ha-icon icon="mdi:wifi"></ha-icon> Wi-Fi Coverage
            </button>
            <button
              class="menu-item ${this._networkType === "matter" ? "active" : ""}"
              @click=${() => this._onNetworkTypeSelect("matter")}
            >
              <ha-icon icon="mdi:router-wireless"></ha-icon> Matter Network
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
                    this._networkType === "matter" && this._matterUnsubscribe
                      ? html`<span class="hint" style="padding: 4px 16px 8px"
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
                                ? "Connect"
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
                        ? html`<span class="hint" style="padding: 0 16px 8px"
                            >${this._meshAgeLabel(meshFetchedAt)}</span
                          >`
                        : nothing
                  }
                `
          }
        </icon-popover>
      </app-header>

      <div class="main">
        <div class="canvas-area">
          <floorplan-canvas
            .rooms=${this._layout.rooms}
            .pins=${this._layout.pins}
            .walls=${this._layout.walls}
            .openings=${this._layout.openings}
            .scale=${this._layout.scale}
            .meshLinks=${this._meshLinksForCurrentFloor}
            .entityLookup=${this._entityLookup}
            .backgroundImageUrl=${backgroundImageUrl(this._layout.background_image_id)}
            .backgroundOpacity=${this._layout.background_opacity}
            .backgroundOffsetX=${this._layout.background_offset_x}
            .backgroundOffsetY=${this._layout.background_offset_y}
            .backgroundScale=${this._layout.background_scale}
            .alignOverlay=${this._alignOverlay}
            .mode=${this._mode}
            .armedEntityId=${this._armedEntityId}
            .armedOpeningType=${this._armedOpeningType}
            .selectedRoomId=${this._selectedRoomId}
            .editingRoomId=${this._editingRoomId}
            .selectedPinId=${this._selectedPinId}
            .selectedWallId=${this._selectedWallId}
            .editingWallId=${this._editingWallId}
            .selectedOpeningId=${this._selectedOpeningId}
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
            .selectedRoom=${this._selectedRoom}
            .editingRoom=${!!this._editingRoomId}
            .areas=${this._areasForCurrentFloor}
            .selectedPin=${this._selectedPin}
            .selectedWall=${this._selectedWall}
            .editingWall=${!!this._editingWallId}
            .selectedOpening=${this._selectedOpening}
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
            @wall-edit-vertices-click=${this._onWallEditVertices}
            @wall-delete-click=${this._onWallDelete}
            @opening-set-width-click=${this._onOpeningSetWidth}
            @opening-delete-click=${this._onOpeningDelete}
            @pin-stack-choose=${this._onPinStackChoose}
            @pin-stack-dismiss=${this._onPinStackDismiss}
            @pin-stack-remove-click=${this._onPinStackRemove}
          ></canvas-overlay>
        </div>
        ${
          this._mode === "place"
            ? html`<entity-picker-sidebar
                .entities=${this._entities}
                .placedEntityIds=${this._placedEntityIds}
                .armedEntityId=${this._armedEntityId}
                .floors=${this._floors}
                .areas=${this._areas}
                .currentFloorId=${this._currentFloorId}
                @entity-armed=${this._onEntityArmed}
                @clear-all-pins=${this._onClearAllPins}
              ></entity-picker-sidebar>`
            : nothing
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
