import { LitElement, html, svg, css, nothing } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import type {
  CanvasMode,
  Opening,
  OpeningType,
  PlaceableEntity,
  Pin,
  ResolvedMeshLink,
  Room,
  Scale,
  Wall,
  ViewBox,
} from "../types";
import {
  centroid,
  clamp,
  distance,
  edgeMidpoints,
  nearestPointOnPolyline,
  openSegmentMidpoints,
  pointInPolygon,
  segmentDirection,
  snapToAxis,
} from "./geometry";
import {
  findOpeningAt,
  findPinsAt,
  findVertexAt,
  findWallAt,
} from "./pin-tool";
import { addTracePoint, startTrace, type PendingTrace } from "./polygon-tool";
import { fetchIconPathByName } from "./icon-cache";
import { type WallMaterial, wallMaterial, wallThicknessCm } from "./materials";
import { qualityColor } from "./mesh-colors";
import { GROUP_ICON_PATH, pinColor, pinIconPath } from "./pin-icons";
import { sharedStyles } from "../styles";

/** Fixed logical coordinate space width every floor's rooms/pins are stored in,
 * independent of the uploaded background image's actual pixel resolution. */
export const BASE_WIDTH = 1000;
const DEFAULT_HEIGHT = 750;
const MIN_VIEWBOX_WIDTH = BASE_WIDTH / 4; // 4x zoom in
const MAX_VIEWBOX_WIDTH = BASE_WIDTH * 4; // 4x zoom out
const CLICK_MOVE_THRESHOLD_PX = 5;
const HIT_RADIUS_PX = 14;
const SNAP_THRESHOLD_PX = 10;
const VERTEX_RADIUS_PX = 6;
const MIDPOINT_RADIUS_PX = 4;
const PIN_RADIUS_PX = 12;

/** What's currently being vertex-edited — a room (closed ring, min 3 points)
 * or a wall (open polyline, min 2 points). Only one at a time. */
interface EditingTarget {
  kind: "room" | "wall";
  id: string;
}

/** Align Floors mode's live, not-yet-committed overlay — see
 * _renderAlignOverlay and panel.ts's alignment state/_onAlignApply. */
export interface AlignOverlay {
  imageUrl: string;
  offsetX: number;
  offsetY: number;
  scale: number;
  opacity: number;
}

type DownHit =
  | { type: "vertex"; index: number }
  | { type: "edgeMidpoint"; index: number }
  | { type: "pin"; pin: Pin }
  | { type: "pinStack"; pins: Pin[] }
  | { type: "room"; room: Room }
  | { type: "wall"; wall: Wall }
  | { type: "opening"; opening: Opening }
  | { type: "openingHandle"; opening: Opening; whichEnd: 0 | 1 }
  | { type: "empty" };

type Gesture =
  | { kind: "pan" }
  | { kind: "alignDrag" }
  | { kind: "vertex"; index: number }
  | { kind: "pin"; pinId: string }
  | { kind: "openingMove"; openingId: string }
  | { kind: "openingHandle"; openingId: string; whichEnd: 0 | 1 }
  | {
      kind: "pinch";
      startDistance: number;
      startViewBox: ViewBox;
      midImage: { x: number; y: number };
    }
  | null;

@customElement("floorplan-canvas")
export class FloorplanCanvas extends LitElement {
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: white;
      }
      svg {
        position: relative;
        width: 100%;
        height: 100%;
        touch-action: none;
        display: block;
        cursor: grab;
      }
      /* Dedicated Pan tool (Innerspace-style, separate from Select) — every
       * drag pans unconditionally (see _hitTest's mode !== "select" early
       * return), so every element shows the pan cursor too, not its own
       * pointer/ew-resize/copy hint. */
      svg.pan-mode * {
        cursor: grab !important;
      }
      /* Every non-select, non-pan mode (trace room/wall, add door/window,
       * set scale, place device) is a pure "click here to do the thing"
       * mode — _hitTest's mode !== select early return means none of
       * these ever select/drag an existing element, so none of them should
       * show the select-mode pointer/hand either. Both the svg root itself
       * (blank canvas) and its children need the override — the base
       * svg cursor:grab rule above only applies to the root element, so a
       * bare descendant selector would miss it. */
      svg.draw-mode,
      svg.draw-mode * {
        cursor: crosshair !important;
      }
      .bg-overlay {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        pointer-events: none;
      }
      .bg-overlay img {
        display: block;
        background: white;
      }
      .mesh-link {
        stroke-width: 2;
        opacity: 0.85;
        pointer-events: none;
      }
      .room-poly {
        fill: var(--sc-accent);
        fill-opacity: 0.18;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: pointer;
      }
      .room-poly.selected {
        fill-opacity: 0.32;
        stroke-width: 3;
      }
      .room-label {
        fill: var(--sc-fg);
        font-size: 16px;
        text-anchor: middle;
        pointer-events: none;
        paint-order: stroke;
        stroke: var(--sc-bg);
        stroke-width: 3px;
      }
      .pending-trace {
        fill: none;
        stroke: var(--sc-accent);
        stroke-width: 2;
        stroke-dasharray: 6 4;
      }
      .wall-line {
        fill: none;
        cursor: pointer;
      }
      .wall-line.selected {
        stroke: var(--sc-danger) !important;
      }
      .opening-line {
        stroke-width: 6;
        cursor: pointer;
      }
      .opening-line.door {
        stroke: #d7ccc8;
      }
      .opening-line.window {
        stroke: #81d4fa;
      }
      .opening-line.selected {
        stroke: var(--sc-danger);
      }
      .opening-handle {
        fill: white;
        stroke: var(--sc-danger);
        stroke-width: 2;
        cursor: ew-resize;
      }
      .pending-scale,
      .scale-line {
        stroke: #43a047;
        stroke-width: 2;
        stroke-dasharray: 4 3;
      }
      .scale-label {
        fill: #43a047;
        font-size: 14px;
        text-anchor: middle;
        paint-order: stroke;
        stroke: var(--sc-bg);
        stroke-width: 3px;
      }
      .vertex-handle {
        fill: white;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: pointer;
      }
      .vertex-handle.selected {
        fill: var(--sc-danger);
      }
      .vertex-delete {
        fill: var(--sc-danger);
        cursor: pointer;
      }
      .vertex-delete-x {
        stroke: white;
        stroke-width: 1.5;
        pointer-events: none;
      }
      .midpoint-handle {
        fill: var(--sc-accent);
        opacity: 0.5;
        cursor: copy;
      }
      .pin-hit {
        fill: transparent;
        cursor: pointer;
      }
      .pin-dot {
        /* Per-domain color is set inline per-instance (see pin-icons.ts's
         * pinColor) — this is only the fallback for the brief moment before
         * that style attribute is present. */
        fill: var(--sc-accent);
        stroke: white;
        stroke-width: 2;
        pointer-events: none;
      }
      .pin-dot.selected {
        /* Selection always wins over a domain's own color — the inline
         * style is left empty for a selected pin (see _renderPinMarker)
         * precisely so this class rule isn't fighting a same-specificity
         * inline fill. */
        fill: var(--sc-danger);
      }
      .pin-icon {
        pointer-events: none;
      }
      .pin-icon path {
        fill: white;
      }
      .controls {
        position: absolute;
        right: 12px;
        bottom: 12px;
        display: flex;
        gap: 4px;
      }
      .controls button {
        background: var(--sc-panel-bg);
        box-shadow: var(--sc-panel-shadow);
        border-radius: var(--sc-panel-radius);
      }
    `,
  ];

  @property({ attribute: false }) rooms: Room[] = [];
  @property({ attribute: false }) pins: Pin[] = [];
  @property({ attribute: false }) walls: Wall[] = [];
  @property({ attribute: false }) openings: Opening[] = [];
  @property({ attribute: false }) scale: Scale | null = null;
  @property({ attribute: false }) meshLinks: ResolvedMeshLink[] = [];
  @property({ attribute: false }) entityLookup: Map<string, PlaceableEntity> =
    new Map();
  @property({ attribute: false }) backgroundImageUrl: string | null = null;
  @property({ type: Number }) backgroundOpacity = 0.5;
  @property({ type: Number }) backgroundOffsetX = 0;
  @property({ type: Number }) backgroundOffsetY = 0;
  @property({ type: Number }) backgroundScale = 1;
  @property({ attribute: false }) alignOverlay: AlignOverlay | null = null;
  /** The currently-selected floor's saved pan/zoom — applied (see
   * `updated()`) whenever this reference changes, i.e. on every floor
   * switch, in preference to the same-building/fit-fresh fallback below. */
  @property({ attribute: false }) initialViewBox: ViewBox | null = null;
  /** Whether the floor just switched TO shares a building_id with the one
   * switched FROM — when `initialViewBox` is null, this decides whether to
   * keep the current live pan/zoom (same building, existing continuity
   * behavior) or fit fresh (different/no building). See panel.ts's
   * `_selectFloor`. */
  @property({ type: Boolean }) sameBuildingAsPrevious = false;
  @property({ attribute: false }) mode: CanvasMode = "select";
  @property({ attribute: false }) armedEntityId: string | null = null;
  @property({ attribute: false }) armedOpeningType: OpeningType | null = null;
  @property({ attribute: false }) selectedRoomId: string | null = null;
  @property({ attribute: false }) editingRoomId: string | null = null;
  @property({ attribute: false }) editingWallId: string | null = null;
  @property({ attribute: false }) selectedPinId: string | null = null;
  @property({ attribute: false }) selectedWallId: string | null = null;
  @property({ attribute: false }) selectedOpeningId: string | null = null;

  @state() private _viewBox: ViewBox = {
    x: 0,
    y: 0,
    w: BASE_WIDTH,
    h: DEFAULT_HEIGHT,
  };
  @state() private _naturalHeight = DEFAULT_HEIGHT;
  @state() private _alignNaturalHeight = DEFAULT_HEIGHT;
  @state() private _pendingTrace: PendingTrace | null = null;
  @state() private _pendingScalePoints: [number, number][] = [];
  @state() private _liveEditPoints: [number, number][] | null = null;
  @state() private _liveDragPin: { id: string; x: number; y: number } | null =
    null;
  @state() private _liveOpeningEdit: {
    id: string;
    x: number;
    y: number;
    width: number;
  } | null = null;
  @state() private _selectedVertexIndex: number | null = null;

  @query("svg") private _svg!: SVGSVGElement;

  private _pointers = new Map<number, { x: number; y: number }>();
  private _downHit: DownHit | null = null;
  private _downClient: { x: number; y: number } | null = null;
  private _lastImage: { x: number; y: number } | null = null;
  /** Client-pixel position as of the last pointermove — used only for
   * panning (see that branch below): `_clientToImage` depends on the SVG's
   * *rendered* `viewBox` attribute via `getScreenCTM()`, which lags a frame
   * behind our own `_viewBox` state during a drag (Lit's re-render hasn't
   * flushed yet), so computing each frame's pan delta that way compounds a
   * stale-transform error into visible jitter. Client-pixel deltas scaled
   * by `_svgTransform().scale` (JS state + container rect only, never the
   * DOM's viewBox attribute) sidestep that entirely. */
  private _lastClient: { x: number; y: number } | null = null;
  private _gesture: Gesture = null;
  private _moved = false;

  private get _editingTarget(): EditingTarget | null {
    if (this.editingRoomId) return { kind: "room", id: this.editingRoomId };
    if (this.editingWallId) return { kind: "wall", id: this.editingWallId };
    return null;
  }

  private _rawPointsFor(target: EditingTarget): [number, number][] | null {
    if (target.kind === "room")
      return this.rooms.find((r) => r.id === target.id)?.points ?? null;
    return this.walls.find((w) => w.id === target.id)?.points ?? null;
  }

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("editingRoomId") || changed.has("editingWallId")) {
      const target = this._editingTarget;
      const points = target ? this._rawPointsFor(target) : null;
      this._liveEditPoints = points ? [...points] : null;
      this._selectedVertexIndex = null;
    }
    if (changed.has("mode")) {
      // Switching modes abandons any in-progress trace/calibration.
      this._pendingTrace = null;
      this._pendingScalePoints = [];
    }
  }

  private _resizeObserver?: ResizeObserver;
  /** Fit-to-screen only ever runs automatically once, on this component's
   * very first content — every floor switch after that leaves the current
   * pan/zoom exactly as it was (see the backgroundImageUrl handler in
   * `updated()` below), so aligned floors stay lined up on screen when you
   * switch between them instead of each one recentering on its own
   * content. The explicit Fit button still works any time. */
  private _hasFittedOnce = false;

  override firstUpdated(): void {
    this.fitToScreen();
    // A blank floor (nothing traced yet) whose background image hasn't
    // finished loading has nothing real to fit to yet — this._naturalHeight
    // is still the generic DEFAULT_HEIGHT placeholder at this point, not
    // that image's actual aspect ratio. Leave the flag unset so the
    // image-load handler below still gets one real fit once it knows the
    // image's actual shape, instead of freezing on a wrong-aspect guess.
    this._hasFittedOnce =
      this._contentBounds() !== null || !this.backgroundImageUrl;
    // The SVG's own content (rooms/walls/pins) re-flows for free on any
    // container resize — it's native browser rendering, always live. Our
    // background-image overlay is a manually-computed CSS transform baked
    // into a Lit render, though, so it only updates when floorplan-canvas
    // itself re-renders. A resize caused by something else entirely (e.g.
    // the toolbar growing a hint row when a wall trace starts) would
    // otherwise leave the overlay's transform stale relative to the SVG
    // content until something unrelated happened to trigger a re-render.
    this._resizeObserver = new ResizeObserver(() => this.requestUpdate());
    this._resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("backgroundImageUrl") && this.backgroundImageUrl) {
      const img = new Image();
      img.onload = () => {
        this._naturalHeight =
          (img.naturalHeight / img.naturalWidth) * BASE_WIDTH || DEFAULT_HEIGHT;
        if (!this._hasFittedOnce) {
          this.fitToScreen();
          this._hasFittedOnce = true;
        }
      };
      img.src = this.backgroundImageUrl;
    }
    if (changed.has("initialViewBox")) {
      if (this.initialViewBox) {
        this._viewBox = { ...this.initialViewBox };
        this._hasFittedOnce = true;
      } else if (!this.sameBuildingAsPrevious) {
        this.fitToScreen();
        this._hasFittedOnce =
          this._contentBounds() !== null || !this.backgroundImageUrl;
      }
      // else: same building, no saved view for the floor just switched to
      // — leave the live pan/zoom exactly as it was (existing continuity
      // behavior for floors that haven't explicitly saved a view yet).
    }
    if (changed.has("alignOverlay")) {
      const prev = changed.get("alignOverlay") as
        AlignOverlay | null | undefined;
      if (this.alignOverlay && this.alignOverlay.imageUrl !== prev?.imageUrl) {
        const img = new Image();
        img.onload = () => {
          this._alignNaturalHeight =
            (img.naturalHeight / img.naturalWidth) * BASE_WIDTH ||
            DEFAULT_HEIGHT;
        };
        img.src = this.alignOverlay.imageUrl;
      }
    }
    if (changed.has("_pendingTrace") || changed.has("_pendingScalePoints")) {
      const count =
        this.mode === "scale"
          ? this._pendingScalePoints.length
          : (this._pendingTrace?.points.length ?? 0);
      this.dispatchEvent(
        new CustomEvent("pending-changed", { detail: { count } }),
      );
    }
  }

  /** The traced floor plan (rooms/walls/pins) is the main focus of the
   * page, not the background image underneath it — that's only ever there
   * as a tracing/placement reference. Fit-to-screen frames that traced
   * content with some breathing room, falling back to the background
   * image's own bounds only when nothing's been traced yet at all (a
   * brand-new floor with just a photo uploaded and nothing drawn over it). */
  private _contentBounds(): ViewBox | null {
    const points: [number, number][] = [];
    for (const room of this.rooms) points.push(...room.points);
    for (const wall of this.walls) points.push(...wall.points);
    for (const pin of this.pins) points.push([pin.x, pin.y]);
    if (points.length === 0) return null;
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = Math.max(maxX - minX, maxY - minY) * 0.08 || 40;
    return {
      x: minX - pad,
      y: minY - pad,
      w: maxX - minX + pad * 2,
      h: maxY - minY + pad * 2,
    };
  }

  fitToScreen(): void {
    this._viewBox = this._contentBounds() ?? {
      x: 0,
      y: 0,
      w: BASE_WIDTH,
      h: this._naturalHeight,
    };
  }

  /** The live pan/zoom right now — read by panel.ts at Save time so the
   * current viewing angle gets persisted alongside everything else. */
  getViewBox(): ViewBox {
    return { ...this._viewBox };
  }

  /**
   * The SVG element's default `preserveAspectRatio` ("xMidYMid meet")
   * letterboxes/centers its content whenever the container's aspect ratio
   * doesn't match the viewBox's — which it usually won't. Every other
   * screen<->image conversion in this file must replicate that exact
   * scale + centering, or things drawn outside the SVG (the background
   * image overlay) drift away from things drawn inside it (rooms, walls,
   * pins) as soon as there's any letterboxing.
   */
  private _svgTransform(): { scale: number; offsetX: number; offsetY: number } {
    const rect = this._svg?.getBoundingClientRect();
    const containerW = rect?.width || this._viewBox.w;
    const containerH = rect?.height || this._viewBox.h;
    const scale =
      Math.min(containerW / this._viewBox.w, containerH / this._viewBox.h) || 1;
    return {
      scale,
      offsetX: (containerW - this._viewBox.w * scale) / 2,
      offsetY: (containerH - this._viewBox.h * scale) / 2,
    };
  }

  private _pxToUnits(px: number): number {
    return px / this._svgTransform().scale;
  }

  private _clientToImage(
    clientX: number,
    clientY: number,
  ): { x: number; y: number } {
    const svg = this._svg;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }

  /** Live-edited points for whichever room/wall is currently being vertex-edited,
   * else that shape's own stored points. */
  private _effectivePoints(
    kind: "room" | "wall",
    id: string,
    points: [number, number][],
  ): [number, number][] {
    const target = this._editingTarget;
    return target &&
      target.kind === kind &&
      target.id === id &&
      this._liveEditPoints
      ? this._liveEditPoints
      : points;
  }

  /** Snaps a new trace point onto horizontal/vertical from the trace's last
   * point, unless `disableSnap` (held Shift) is set. */
  private _snappedTracePoint(
    existingPoints: [number, number][],
    x: number,
    y: number,
    disableSnap: boolean,
  ): [number, number] {
    if (disableSnap || existingPoints.length === 0) return [x, y];
    const prev = existingPoints[existingPoints.length - 1]!;
    return snapToAxis(prev, [x, y], this._pxToUnits(SNAP_THRESHOLD_PX));
  }

  /** Snaps a moved/dragged vertex onto horizontal/vertical from whichever
   * neighbor it has (previous, wrapping for closed rings, else next). */
  private _snappedVertexPoint(
    points: [number, number][],
    index: number,
    x: number,
    y: number,
    closed: boolean,
    disableSnap: boolean,
  ): [number, number] {
    if (disableSnap) return [x, y];
    const threshold = this._pxToUnits(SNAP_THRESHOLD_PX);
    const prevIndex = index > 0 ? index - 1 : closed ? points.length - 1 : -1;
    if (prevIndex >= 0 && prevIndex !== index) {
      return snapToAxis(points[prevIndex]!, [x, y], threshold);
    }
    const nextIndex = index < points.length - 1 ? index + 1 : closed ? 0 : -1;
    if (nextIndex >= 0 && nextIndex !== index) {
      return snapToAxis(points[nextIndex]!, [x, y], threshold);
    }
    return [x, y];
  }

  /** `opening` with any in-progress move/resize drag applied. */
  private _effectiveOpening(opening: Opening): Opening {
    return this._liveOpeningEdit?.id === opening.id
      ? {
          ...opening,
          x: this._liveOpeningEdit.x,
          y: this._liveOpeningEdit.y,
          width: this._liveOpeningEdit.width,
        }
      : opening;
  }

  /** The two endpoints of an opening's drawn segment, along its wall's local direction. */
  private _openingEndpoints(
    opening: Opening,
  ): [[number, number], [number, number]] | null {
    const wall = this.walls.find((w) => w.id === opening.wallId);
    if (!wall) return null;
    const points = this._effectivePoints("wall", wall.id, wall.points);
    if (points.length < 2) return null;
    const live = this._effectiveOpening(opening);
    const { segmentIndex } = nearestPointOnPolyline(points, live.x, live.y);
    const [dx, dy] = segmentDirection(points, segmentIndex);
    const half = live.width / 2;
    return [
      [live.x - dx * half, live.y - dy * half],
      [live.x + dx * half, live.y + dy * half],
    ];
  }

  /** Snaps a new wall-trace point onto an existing wall's line when close to
   * one (so internal walls attach cleanly to exterior walls), else falls
   * back to ordinary axis-snapping against the trace's last point. */
  private _snappedWallPoint(
    existingTracePoints: [number, number][],
    x: number,
    y: number,
    disableSnap: boolean,
  ): [number, number] {
    if (!disableSnap) {
      const hitR = this._pxToUnits(HIT_RADIUS_PX);
      const wall = findWallAt(this.walls, x, y, hitR);
      if (wall) return nearestPointOnPolyline(wall.points, x, y).point;
    }
    return this._snappedTracePoint(existingTracePoints, x, y, disableSnap);
  }

  private _hitTest(
    clientX: number,
    clientY: number,
    image: { x: number; y: number },
  ): DownHit {
    const hitR = this._pxToUnits(HIT_RADIUS_PX);

    if (this.mode !== "select") return { type: "empty" };

    const target = this._editingTarget;
    if (target && this._liveEditPoints) {
      const points = this._liveEditPoints;
      const vIndex = findVertexAt(points, image.x, image.y, hitR);
      if (vIndex !== null) return { type: "vertex", index: vIndex };
      const mids =
        target.kind === "room"
          ? edgeMidpoints(points)
          : openSegmentMidpoints(points);
      const mIndex = findVertexAt(mids, image.x, image.y, hitR);
      if (mIndex !== null) return { type: "edgeMidpoint", index: mIndex };
      return { type: "empty" };
    }

    const pinsHere = findPinsAt(this.pins, image.x, image.y, hitR);
    if (pinsHere.length > 1) return { type: "pinStack", pins: pinsHere };
    if (pinsHere.length === 1) return { type: "pin", pin: pinsHere[0]! };
    if (this.selectedOpeningId) {
      const selectedOpening = this.openings.find(
        (o) => o.id === this.selectedOpeningId,
      );
      const ends = selectedOpening
        ? this._openingEndpoints(selectedOpening)
        : null;
      if (selectedOpening && ends) {
        const idx = findVertexAt(ends, image.x, image.y, hitR);
        if (idx !== null) {
          return {
            type: "openingHandle",
            opening: selectedOpening,
            whichEnd: idx as 0 | 1,
          };
        }
      }
    }
    const opening = findOpeningAt(this.openings, image.x, image.y, hitR);
    if (opening) return { type: "opening", opening };
    const wall = findWallAt(this.walls, image.x, image.y, hitR);
    if (wall) return { type: "wall", wall };
    const room = this.rooms.find(
      (r) => r.points.length >= 3 && pointInPolygon(image.x, image.y, r.points),
    );
    if (room) return { type: "room", room };
    return { type: "empty" };
  }

  private _onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    this._svg.setPointerCapture(e.pointerId);
    this._pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this._pointers.size === 2) {
      const pts = [...this._pointers.values()];
      const [a, b] = pts as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const midClient = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      this._gesture = {
        kind: "pinch",
        startDistance: distance(a.x, a.y, b.x, b.y),
        startViewBox: { ...this._viewBox },
        midImage: this._clientToImage(midClient.x, midClient.y),
      };
      return;
    }
    if (this._pointers.size > 2) return;

    const image = this._clientToImage(e.clientX, e.clientY);
    this._downClient = { x: e.clientX, y: e.clientY };
    this._lastImage = image;
    this._lastClient = { x: e.clientX, y: e.clientY };
    this._moved = false;
    this._gesture = null;
    this._downHit =
      this.mode === "select"
        ? this._hitTest(e.clientX, e.clientY, image)
        : { type: "empty" };
  };

  private _onPointerMove = (e: PointerEvent): void => {
    if (!this._pointers.has(e.pointerId)) return;
    this._pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this._gesture?.kind === "pinch" && this._pointers.size === 2) {
      const pts = [...this._pointers.values()];
      const [a, b] = pts as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const dist = distance(a.x, a.y, b.x, b.y) || 1;
      const scale = this._gesture.startDistance / dist;
      const startVb = this._gesture.startViewBox;
      const newW = clamp(
        startVb.w * scale,
        MIN_VIEWBOX_WIDTH,
        MAX_VIEWBOX_WIDTH,
      );
      const actualScale = newW / startVb.w;
      const newH = startVb.h * actualScale;
      const { x: cx, y: cy } = this._gesture.midImage;
      this._viewBox = {
        x: cx - (cx - startVb.x) * actualScale,
        y: cy - (cy - startVb.y) * actualScale,
        w: newW,
        h: newH,
      };
      return;
    }

    if (this._pointers.size !== 1 || !this._downClient || !this._lastImage)
      return;

    if (!this._moved) {
      const movedPx = distance(
        this._downClient.x,
        this._downClient.y,
        e.clientX,
        e.clientY,
      );
      if (movedPx < CLICK_MOVE_THRESHOLD_PX) return;
      this._moved = true;
      this._gesture = this._lockGesture();
      if (
        this._gesture?.kind === "pan" ||
        this._gesture?.kind === "alignDrag"
      ) {
        this._svg.style.cursor = "grabbing";
      }
    }

    const image = this._clientToImage(e.clientX, e.clientY);
    if (this._gesture?.kind === "pan") {
      const scale = this._svgTransform().scale || 1;
      const last = this._lastClient ?? { x: e.clientX, y: e.clientY };
      this._viewBox = {
        ...this._viewBox,
        x: this._viewBox.x - (e.clientX - last.x) / scale,
        y: this._viewBox.y - (e.clientY - last.y) / scale,
      };
    } else if (this._gesture?.kind === "alignDrag") {
      const scale = this._svgTransform().scale || 1;
      const last = this._lastClient ?? { x: e.clientX, y: e.clientY };
      this.dispatchEvent(
        new CustomEvent("align-drag", {
          detail: {
            dx: (e.clientX - last.x) / scale,
            dy: (e.clientY - last.y) / scale,
          },
        }),
      );
    } else if (this._gesture?.kind === "vertex" && this._liveEditPoints) {
      const closed = this._editingTarget?.kind === "room";
      const [sx, sy] = this._snappedVertexPoint(
        this._liveEditPoints,
        this._gesture.index,
        image.x,
        image.y,
        closed,
        e.shiftKey,
      );
      const points = [...this._liveEditPoints];
      points[this._gesture.index] = [sx, sy];
      this._liveEditPoints = points;
    } else if (this._gesture?.kind === "pin") {
      this._liveDragPin = { id: this._gesture.pinId, x: image.x, y: image.y };
    } else if (this._gesture?.kind === "openingMove") {
      const gesture = this._gesture;
      const opening = this.openings.find((o) => o.id === gesture.openingId);
      const wall = opening && this.walls.find((w) => w.id === opening.wallId);
      if (opening && wall) {
        const points = this._effectivePoints("wall", wall.id, wall.points);
        const { point: snapped } = nearestPointOnPolyline(
          points,
          image.x,
          image.y,
        );
        this._liveOpeningEdit = {
          id: opening.id,
          x: snapped[0],
          y: snapped[1],
          width: opening.width,
        };
      }
    } else if (this._gesture?.kind === "openingHandle") {
      const gesture = this._gesture;
      const opening = this.openings.find((o) => o.id === gesture.openingId);
      const wall = opening && this.walls.find((w) => w.id === opening.wallId);
      const ends = opening && this._openingEndpoints(opening);
      if (opening && wall && ends) {
        const points = this._effectivePoints("wall", wall.id, wall.points);
        const { point: snapped } = nearestPointOnPolyline(
          points,
          image.x,
          image.y,
        );
        const fixedEnd = ends[gesture.whichEnd === 0 ? 1 : 0];
        const newCenter: [number, number] = [
          (fixedEnd[0] + snapped[0]) / 2,
          (fixedEnd[1] + snapped[1]) / 2,
        ];
        const newWidth = distance(
          fixedEnd[0],
          fixedEnd[1],
          snapped[0],
          snapped[1],
        );
        this._liveOpeningEdit = {
          id: opening.id,
          x: newCenter[0],
          y: newCenter[1],
          width: newWidth,
        };
      }
    }
    // Note: image recomputed fresh next move since viewBox may have shifted (pan case).
    this._lastImage = this._clientToImage(e.clientX, e.clientY);
    this._lastClient = { x: e.clientX, y: e.clientY };
  };

  private _lockGesture(): Gesture {
    // Align Floors: every drag moves the overlay, never the viewport (the
    // generic pan fallback below would otherwise win here too, since
    // _downHit is always "empty" in any non-select mode).
    if (this.mode === "align") return { kind: "alignDrag" };
    if (this._downHit?.type === "vertex")
      return { kind: "vertex", index: this._downHit.index };
    if (this._downHit?.type === "pin")
      return { kind: "pin", pinId: this._downHit.pin.id };
    if (this._downHit?.type === "openingHandle") {
      return {
        kind: "openingHandle",
        openingId: this._downHit.opening.id,
        whichEnd: this._downHit.whichEnd,
      };
    }
    if (this._downHit?.type === "opening") {
      return { kind: "openingMove", openingId: this._downHit.opening.id };
    }
    return { kind: "pan" };
  }

  private _onPointerUp = (e: PointerEvent): void => {
    this._pointers.delete(e.pointerId);
    this._svg.style.cursor = "";
    try {
      this._svg.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (this._pointers.size >= 1) {
      // A pointer lifted but at least one other is still down (e.g. a pinch
      // ending) — don't treat this release as a click/pan/vertex commit.
      this._gesture = null;
      return;
    }

    if (this._moved) {
      this._commitGesture();
    } else if (this._downClient) {
      this._handleClick(this._downClient.x, this._downClient.y, e.shiftKey);
    }

    this._gesture = null;
    this._downHit = null;
    this._downClient = null;
    this._moved = false;
  };

  private _dispatchVertexChanged(points: [number, number][]): void {
    const target = this._editingTarget;
    if (!target) return;
    const eventName =
      target.kind === "room" ? "room-vertex-changed" : "wall-vertex-changed";
    const idKey = target.kind === "room" ? "roomId" : "wallId";
    this.dispatchEvent(
      new CustomEvent(eventName, { detail: { [idKey]: target.id, points } }),
    );
  }

  private _commitGesture(): void {
    if (
      this._gesture?.kind === "vertex" &&
      this._editingTarget &&
      this._liveEditPoints
    ) {
      this._dispatchVertexChanged(this._liveEditPoints);
    } else if (this._gesture?.kind === "pin" && this._liveDragPin) {
      this.dispatchEvent(
        new CustomEvent("pin-move", {
          detail: {
            pinId: this._liveDragPin.id,
            x: this._liveDragPin.x,
            y: this._liveDragPin.y,
          },
        }),
      );
      this._liveDragPin = null;
    } else if (
      (this._gesture?.kind === "openingMove" ||
        this._gesture?.kind === "openingHandle") &&
      this._liveOpeningEdit
    ) {
      this.dispatchEvent(
        new CustomEvent("opening-update", {
          detail: {
            openingId: this._liveOpeningEdit.id,
            x: this._liveOpeningEdit.x,
            y: this._liveOpeningEdit.y,
            width: this._liveOpeningEdit.width,
          },
        }),
      );
      this._liveOpeningEdit = null;
    }
  }

  private _handleClick(
    clientX: number,
    clientY: number,
    shiftKey = false,
  ): void {
    const image = this._clientToImage(clientX, clientY);

    if (this.mode === "trace") {
      const closeThreshold = this._pxToUnits(HIT_RADIUS_PX);
      const trace = this._pendingTrace ?? startTrace();
      const [sx, sy] = this._snappedTracePoint(
        trace.points,
        image.x,
        image.y,
        shiftKey,
      );
      const result = addTracePoint(trace, sx, sy, closeThreshold);
      if (result.closed) {
        this.dispatchEvent(
          new CustomEvent("room-trace-complete", {
            detail: { points: trace.points },
          }),
        );
        this._pendingTrace = null;
      } else {
        this._pendingTrace = result.trace;
      }
      return;
    }

    if (this.mode === "wall") {
      const closeThreshold = this._pxToUnits(HIT_RADIUS_PX);
      const trace = this._pendingTrace ?? startTrace();
      const [sx, sy] = this._snappedWallPoint(
        trace.points,
        image.x,
        image.y,
        shiftKey,
      );
      const result = addTracePoint(trace, sx, sy, closeThreshold);
      if (result.closed) {
        // Click near the start closes the loop — same gesture as rooms,
        // but a wall additionally supports staying open via "Finish Wall".
        this.dispatchEvent(
          new CustomEvent("wall-trace-complete", {
            detail: { points: [...trace.points, trace.points[0]!] },
          }),
        );
        this._pendingTrace = null;
      } else {
        this._pendingTrace = result.trace;
      }
      return;
    }

    if (this.mode === "opening") {
      if (!this.armedOpeningType) return;
      const hitR = this._pxToUnits(HIT_RADIUS_PX);
      const wall = findWallAt(this.walls, image.x, image.y, hitR);
      if (!wall) return;
      const { point } = nearestPointOnPolyline(wall.points, image.x, image.y);
      this.dispatchEvent(
        new CustomEvent("opening-place", {
          detail: { wallId: wall.id, x: point[0], y: point[1] },
        }),
      );
      return;
    }

    if (this.mode === "scale") {
      const points: [number, number][] = [
        ...this._pendingScalePoints,
        [image.x, image.y],
      ];
      if (points.length >= 2) {
        this.dispatchEvent(
          new CustomEvent("scale-line-complete", {
            detail: { points: points.slice(0, 2) },
          }),
        );
        this._pendingScalePoints = [];
      } else {
        this._pendingScalePoints = points;
      }
      return;
    }

    if (this.mode === "place") {
      if (this.armedEntityId) {
        // Snap onto an existing pin's exact coordinates when physically
        // co-locating a device with one already placed there — otherwise a
        // near-miss click leaves two barely-offset dots instead of a clean
        // stack the multi-pin picker can disambiguate.
        const hitR = this._pxToUnits(HIT_RADIUS_PX);
        const existing = findPinsAt(this.pins, image.x, image.y, hitR)[0];
        const x = existing?.x ?? image.x;
        const y = existing?.y ?? image.y;
        this.dispatchEvent(new CustomEvent("pin-place", { detail: { x, y } }));
      }
      return;
    }

    // select mode
    const hit = this._downHit ?? { type: "empty" };
    if (hit.type === "vertex") {
      this._selectedVertexIndex =
        this._selectedVertexIndex === hit.index ? null : hit.index;
    } else if (
      hit.type === "edgeMidpoint" &&
      this._editingTarget &&
      this._liveEditPoints
    ) {
      const target = this._editingTarget;
      const mids =
        target.kind === "room"
          ? edgeMidpoints(this._liveEditPoints)
          : openSegmentMidpoints(this._liveEditPoints);
      const newPoint = mids[hit.index]!;
      const points = [...this._liveEditPoints];
      points.splice(hit.index + 1, 0, newPoint);
      this._liveEditPoints = points;
      this._dispatchVertexChanged(points);
    } else if (hit.type === "pin") {
      this.dispatchEvent(
        new CustomEvent("pin-select", {
          detail: {
            pinId: this.selectedPinId === hit.pin.id ? null : hit.pin.id,
          },
        }),
      );
    } else if (hit.type === "pinStack") {
      this.dispatchEvent(
        new CustomEvent("pin-stack-select", {
          detail: { pinIds: hit.pins.map((p) => p.id) },
        }),
      );
    } else if (hit.type === "room") {
      this.dispatchEvent(
        new CustomEvent("room-select", {
          detail: {
            roomId: this.selectedRoomId === hit.room.id ? null : hit.room.id,
          },
        }),
      );
    } else if (hit.type === "wall") {
      this.dispatchEvent(
        new CustomEvent("wall-select", {
          detail: {
            wallId: this.selectedWallId === hit.wall.id ? null : hit.wall.id,
          },
        }),
      );
    } else if (hit.type === "opening") {
      this.dispatchEvent(
        new CustomEvent("opening-select", {
          detail: {
            openingId:
              this.selectedOpeningId === hit.opening.id ? null : hit.opening.id,
          },
        }),
      );
    } else if (
      this._editingTarget &&
      this._selectedVertexIndex !== null &&
      this._liveEditPoints
    ) {
      // A vertex was selected by an earlier click — this click moves it here
      // instead of exiting edit mode, so "click a point, click where it
      // should go" works as an alternative to dragging.
      const closed = this._editingTarget.kind === "room";
      const [sx, sy] = this._snappedVertexPoint(
        this._liveEditPoints,
        this._selectedVertexIndex,
        image.x,
        image.y,
        closed,
        shiftKey,
      );
      const points = [...this._liveEditPoints];
      points[this._selectedVertexIndex] = [sx, sy];
      this._liveEditPoints = points;
      this._selectedVertexIndex = null;
      this._dispatchVertexChanged(points);
    } else {
      this._selectedVertexIndex = null;
      this.dispatchEvent(
        new CustomEvent("room-select", { detail: { roomId: null } }),
      );
      this.dispatchEvent(
        new CustomEvent("pin-select", { detail: { pinId: null } }),
      );
      this.dispatchEvent(
        new CustomEvent("wall-select", { detail: { wallId: null } }),
      );
      this.dispatchEvent(
        new CustomEvent("opening-select", { detail: { openingId: null } }),
      );
    }
  }

  /** Commits the in-progress wall trace (mode 'wall', >= 2 points). No-op otherwise. */
  finishPendingWall(): void {
    if (
      this.mode !== "wall" ||
      !this._pendingTrace ||
      this._pendingTrace.points.length < 2
    ) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("wall-trace-complete", {
        detail: { points: this._pendingTrace.points },
      }),
    );
    this._pendingTrace = null;
  }

  /** Abandons any in-progress room/wall trace or scale calibration. */
  cancelPending(): void {
    this._pendingTrace = null;
    this._pendingScalePoints = [];
  }

  private _deleteSelectedVertex(): void {
    const target = this._editingTarget;
    if (this._selectedVertexIndex === null || !target || !this._liveEditPoints)
      return;
    const minPoints = target.kind === "room" ? 3 : 2;
    if (this._liveEditPoints.length <= minPoints) return;
    const points = this._liveEditPoints.filter(
      (_, i) => i !== this._selectedVertexIndex,
    );
    this._liveEditPoints = points;
    this._selectedVertexIndex = null;
    this._dispatchVertexChanged(points);
  }

  /** Plain wheel/trackpad scroll pans, matching Innerspace and most modern
   * canvas tools — it does not zoom. Trackpad pinch-to-zoom still works:
   * Safari/Chrome synthesize those as wheel events with `ctrlKey: true`. */
  private _onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (e.ctrlKey) {
      const factor = e.deltaY < 0 ? 0.9 : 1.1;
      this._zoomBy(factor, this._clientToImage(e.clientX, e.clientY));
      return;
    }
    const pxToUnit = this._viewBox.w / this.getBoundingClientRect().width;
    this._viewBox = {
      ...this._viewBox,
      x: this._viewBox.x + e.deltaX * pxToUnit,
      y: this._viewBox.y + e.deltaY * pxToUnit,
    };
  };

  private _zoomBy(factor: number, aroundImage: { x: number; y: number }): void {
    const newW = clamp(
      this._viewBox.w * factor,
      MIN_VIEWBOX_WIDTH,
      MAX_VIEWBOX_WIDTH,
    );
    const scale = newW / this._viewBox.w;
    const newH = this._viewBox.h * scale;
    this._viewBox = {
      x: aroundImage.x - (aroundImage.x - this._viewBox.x) * scale,
      y: aroundImage.y - (aroundImage.y - this._viewBox.y) * scale,
      w: newW,
      h: newH,
    };
  }

  private _zoomButton(factor: number): void {
    const vb = this._viewBox;
    this._zoomBy(factor, { x: vb.x + vb.w / 2, y: vb.y + vb.h / 2 });
  }

  private _pinLabel(pin: Pin): string {
    if (pin.label_override) return pin.label_override;
    return this.entityLookup.get(pin.entity_id)?.name ?? pin.entity_id;
  }

  private _renderRoom(room: Room) {
    const points = this._effectivePoints("room", room.id, room.points);
    if (points.length < 2) return nothing;
    const pointsAttr = points.map(([x, y]) => `${x},${y}`).join(" ");
    const [cx, cy] = centroid(points);
    const isEditing = this.editingRoomId === room.id;

    return svg`
      <polygon
        class="room-poly ${room.id === this.selectedRoomId || isEditing ? "selected" : ""}"
        points=${pointsAttr}
      ></polygon>
      <text class="room-label" x=${cx} y=${cy}>${room.name}</text>
      ${isEditing ? this._renderVertexHandles(points, true) : nothing}
    `;
  }

  private _renderVertexHandles(points: [number, number][], closed: boolean) {
    const vr = this._pxToUnits(VERTEX_RADIUS_PX);
    const mr = this._pxToUnits(MIDPOINT_RADIUS_PX);
    const mids = closed ? edgeMidpoints(points) : openSegmentMidpoints(points);
    return svg`
      ${mids.map(
        ([x, y]) =>
          svg`<circle class="midpoint-handle" cx=${x} cy=${y} r=${mr}></circle>`,
      )}
      ${points.map(([x, y], i) => {
        const selected = i === this._selectedVertexIndex;
        return svg`
          <circle
            class="vertex-handle ${selected ? "selected" : ""}"
            cx=${x}
            cy=${y}
            r=${vr}
          ></circle>
          ${
            selected
              ? svg`
                <g
                  class="vertex-delete"
                  transform="translate(${x + vr * 2.2}, ${y - vr * 2.2})"
                  @pointerdown=${(ev: PointerEvent) => {
                    ev.stopPropagation();
                  }}
                  @click=${(ev: MouseEvent) => {
                    ev.stopPropagation();
                    this._deleteSelectedVertex();
                  }}
                >
                  <circle r=${vr}></circle>
                  <line
                    class="vertex-delete-x"
                    x1=${-vr * 0.5}
                    y1=${-vr * 0.5}
                    x2=${vr * 0.5}
                    y2=${vr * 0.5}
                  ></line>
                  <line
                    class="vertex-delete-x"
                    x1=${-vr * 0.5}
                    y1=${vr * 0.5}
                    x2=${vr * 0.5}
                    y2=${-vr * 0.5}
                  ></line>
                </g>
              `
              : nothing
          }
        `;
      })}
    `;
  }

  private _renderMeshLink(link: ResolvedMeshLink) {
    return svg`
      <line
        class="mesh-link"
        x1=${link.fromPin.x}
        y1=${link.fromPin.y}
        x2=${link.toPin.x}
        y2=${link.toPin.y}
        style="stroke:${qualityColor(link.quality)}"
      >
        <title>${link.detail ?? link.quality}</title>
      </line>
    `;
  }

  /** icon_override -> resolved path data (or null if unresolvable), filled
   * in lazily by _iconForOverride. Deliberately not a reactive @state —
   * icon-cache.ts's own module-level cache already dedupes the fetch
   * itself; this is just a synchronous read of whatever's resolved so
   * far, with requestUpdate() called explicitly once a fetch lands. */
  private _resolvedIconOverrides = new Map<string, string | null>();

  /** Path data for a pin's icon override, or null if it's not yet resolved
   * (a fetch is kicked off in the background; render() picks it up via
   * requestUpdate() once it lands) or permanently unresolvable. Callers
   * fall back to the domain-default icon whenever this returns null. */
  private _iconForOverride(override: string): string | null {
    if (this._resolvedIconOverrides.has(override)) {
      return this._resolvedIconOverrides.get(override) ?? null;
    }
    this._resolvedIconOverrides.set(override, null);
    void fetchIconPathByName(override).then((path) => {
      if (path !== null) {
        this._resolvedIconOverrides.set(override, path);
        this.requestUpdate();
      }
    });
    return null;
  }

  /** Groups by exact (x,y) — placement already snaps a new pin onto an
   * existing one's exact coordinates when co-locating (see place-mode
   * click handling below), so exact equality is enough to detect a
   * stack, no distance-threshold fuzziness needed. */
  private _pinGroups(): { x: number; y: number; pins: Pin[] }[] {
    const groups = new Map<string, Pin[]>();
    for (const pin of this.pins) {
      const key = `${pin.x},${pin.y}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(pin);
    }
    return [...groups.values()].map((pins) => ({
      x: pins[0]!.x,
      y: pins[0]!.y,
      pins,
    }));
  }

  private _renderPinGroup(group: { x: number; y: number; pins: Pin[] }) {
    const r = this._pxToUnits(PIN_RADIUS_PX);

    if (group.pins.length === 1) {
      const pin = group.pins[0]!;
      const live = this._liveDragPin?.id === pin.id ? this._liveDragPin : null;
      const x = live?.x ?? pin.x;
      const y = live?.y ?? pin.y;
      const selected = pin.id === this.selectedPinId;
      const entity = this.entityLookup.get(pin.entity_id);
      const domain = entity?.domain ?? pin.entity_id.split(".")[0] ?? "";
      const overridePath = pin.icon_override
        ? this._iconForOverride(pin.icon_override)
        : null;
      const iconPath = overridePath ?? pinIconPath(domain);
      return this._renderPinMarker(
        x,
        y,
        r,
        iconPath,
        pinColor(domain),
        selected,
        this._pinLabel(pin),
      );
    }

    const selected = group.pins.some((p) => p.id === this.selectedPinId);
    const label = `${group.pins.length} devices: ${group.pins.map((p) => this._pinLabel(p)).join(", ")}`;
    return this._renderPinMarker(
      group.x,
      group.y,
      r,
      GROUP_ICON_PATH,
      "var(--sc-accent)",
      selected,
      label,
    );
  }

  private _renderPinMarker(
    x: number,
    y: number,
    r: number,
    iconPath: string,
    color: string,
    selected: boolean,
    label: string,
  ) {
    const iconSize = r * 1.1; // native mdi viewBox is 24x24, scaled to fit the dot
    return svg`
      <g>
        <title>${label}</title>
        <circle
          class="pin-dot ${selected ? "selected" : ""}"
          cx=${x}
          cy=${y}
          r=${r}
          style="fill:${selected ? "" : color}"
        ></circle>
        <svg
          x=${x - iconSize / 2}
          y=${y - iconSize / 2}
          width=${iconSize}
          height=${iconSize}
          viewBox="0 0 24 24"
          class="pin-icon"
        >
          <path d=${iconPath}></path>
        </svg>
        <circle class="pin-hit" cx=${x} cy=${y} r=${r * 1.4}></circle>
      </g>
    `;
  }

  private _renderPendingTrace() {
    if (!this._pendingTrace || this._pendingTrace.points.length === 0)
      return nothing;
    const pointsAttr = this._pendingTrace.points
      .map(([x, y]) => `${x},${y}`)
      .join(" ");
    const r = this._pxToUnits(VERTEX_RADIUS_PX);
    return svg`
      <polyline class="pending-trace" points=${pointsAttr}></polyline>
      ${this._pendingTrace.points.map(
        ([x, y]) =>
          svg`<circle class="vertex-handle" cx=${x} cy=${y} r=${r}></circle>`,
      )}
    `;
  }

  /** The wall's `stroke-width` CSS value, including its unit. Once the
   * floor is calibrated, this is the wall's *real* thickness converted
   * through that calibration and left UNITLESS — plain SVG user-unit
   * strokes scale with the viewBox exactly like the wall's own points or
   * the background image already do, so a 24cm wall genuinely draws about
   * twice as thick on screen as a 12cm one, and both grow together as you
   * zoom in to trace precisely. Before calibration there's no real-world
   * conversion to use yet, so this falls back to a small constant CSS
   * pixel width instead (a "px" length is *not* affected by the viewBox
   * transform, so it stays legible at any zoom rather than being
   * meaningless without a real scale to interpret it against). */
  private _wallStrokeWidth(wall: Wall, material: WallMaterial): string {
    if (this.scale) {
      const [[x1, y1], [x2, y2]] = this.scale.points;
      const unitDistance = distance(x1, y1, x2, y2) || 1;
      const unitsPerMeter = unitDistance / this.scale.meters;
      const thicknessUnits = (wallThicknessCm(wall) / 100) * unitsPerMeter;
      return `${clamp(thicknessUnits, 0.5, 40)}`;
    }
    const px = clamp(
      4 + (material.attenuationDbPerCm * wallThicknessCm(wall)) / 3,
      4,
      8,
    );
    return `${px}px`;
  }

  private _renderWall(wall: Wall) {
    const points = this._effectivePoints("wall", wall.id, wall.points);
    const pointsAttr = points.map(([x, y]) => `${x},${y}`).join(" ");
    const selected = wall.id === this.selectedWallId;
    const isEditing = this.editingWallId === wall.id;
    const material = wallMaterial(wall.material);
    const strokeWidth = this._wallStrokeWidth(wall, material);
    return svg`
      <polyline
        class="wall-line ${selected || isEditing ? "selected" : ""}"
        points=${pointsAttr}
        style="stroke:${material.color}; stroke-width:${strokeWidth}"
      >
        <title>${material.label}</title>
      </polyline>
      ${isEditing ? this._renderVertexHandles(points, false) : nothing}
    `;
  }

  private _renderOpening(opening: Opening) {
    const ends = this._openingEndpoints(opening);
    if (!ends) return nothing;
    const [[x1, y1], [x2, y2]] = ends;
    const selected = opening.id === this.selectedOpeningId;
    const hr = this._pxToUnits(VERTEX_RADIUS_PX);
    return svg`
      <line
        class="opening-line ${opening.type} ${selected ? "selected" : ""}"
        x1=${x1}
        y1=${y1}
        x2=${x2}
        y2=${y2}
      >
        <title>${opening.type}</title>
      </line>
      ${
        selected
          ? svg`
            <circle class="opening-handle" cx=${x1} cy=${y1} r=${hr}></circle>
            <circle class="opening-handle" cx=${x2} cy=${y2} r=${hr}></circle>
          `
          : nothing
      }
    `;
  }

  private _renderScaleLine() {
    if (!this.scale) return nothing;
    const [[x1, y1], [x2, y2]] = this.scale.points;
    return svg`
      <line class="scale-line" x1=${x1} y1=${y1} x2=${x2} y2=${y2}></line>
      <text class="scale-label" x=${(x1 + x2) / 2} y=${(y1 + y2) / 2 - 6}>
        ${this.scale.meters} m
      </text>
    `;
  }

  private _renderPendingScale() {
    if (this._pendingScalePoints.length === 0) return nothing;
    const r = this._pxToUnits(VERTEX_RADIUS_PX);
    const [x, y] = this._pendingScalePoints[0]!;
    return svg`<circle class="vertex-handle" cx=${x} cy=${y} r=${r}></circle>`;
  }

  /**
   * Background image lives as a plain HTML <img> overlay, not an SVG
   * <foreignObject> — Safari fails to put <foreignObject> in the SVG
   * namespace when it's created via any of lit's template-preparation
   * paths (confirmed via direct DOM inspection: namespaceURI comes back
   * as XHTML, not SVG, even though the <svg> root and plain shapes are
   * namespaced correctly). This replicates the SVG viewBox's own
   * coordinate mapping with a manual CSS transform instead.
   */
  private _renderBackgroundOverlay() {
    if (!this.backgroundImageUrl) return nothing;
    const { scale, offsetX, offsetY } = this._svgTransform();
    // backgroundOffsetX/Y/Scale place this image-space rectangle at
    // (backgroundOffsetX, backgroundOffsetY) sized BASE_WIDTH*backgroundScale
    // wide within the floor's own coordinate space, rather than always
    // exactly (0,0) at BASE_WIDTH — see Align Floors (_renderAlignOverlay,
    // panel.ts's _onAlignApply), the only thing that ever sets these to
    // anything other than the (0, 0, 1) default.
    const tx = offsetX + scale * (this.backgroundOffsetX - this._viewBox.x);
    const ty = offsetY + scale * (this.backgroundOffsetY - this._viewBox.y);
    const bgScale = scale * this.backgroundScale;
    return html`
      <div
        class="bg-overlay"
        style="transform: translate(${tx}px, ${ty}px) scale(${bgScale});"
      >
        <img
          src=${this.backgroundImageUrl}
          style="width:${BASE_WIDTH}px; height:${this._naturalHeight}px; opacity:${
            this.backgroundOpacity
          };"
        />
      </div>
    `;
  }

  /** Align Floors mode: another floor's background image, drawn semi-
   * transparent over this one using the exact same image-space-to-screen
   * transform as `_renderBackgroundOverlay`, just with the live in-progress
   * offset/scale the user is dragging/resizing instead of this floor's own
   * stored background placement. */
  private _renderAlignOverlay() {
    if (!this.alignOverlay) return nothing;
    const { scale, offsetX, offsetY } = this._svgTransform();
    const tx = offsetX + scale * (this.alignOverlay.offsetX - this._viewBox.x);
    const ty = offsetY + scale * (this.alignOverlay.offsetY - this._viewBox.y);
    const overlayScale = scale * this.alignOverlay.scale;
    return html`
      <div
        class="bg-overlay"
        style="transform: translate(${tx}px, ${ty}px) scale(${overlayScale});"
      >
        <img
          src=${this.alignOverlay.imageUrl}
          style="width:${BASE_WIDTH}px; height:${this._alignNaturalHeight}px; opacity:${
            this.alignOverlay.opacity
          };"
        />
      </div>
    `;
  }

  override render() {
    const vb = this._viewBox;
    return html`
      ${this._renderBackgroundOverlay()} ${this._renderAlignOverlay()}
      ${svg`
        <svg
          viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}"
          class="${
            this.mode === "pan" || this.mode === "align"
              ? "pan-mode"
              : this.mode !== "select"
                ? "draw-mode"
                : ""
          }"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
        >
          ${this.rooms.map((room) => this._renderRoom(room))}
          ${this.walls.map((wall) => this._renderWall(wall))}
          ${this.openings.map((opening) => this._renderOpening(opening))}
          ${this.meshLinks.map((link) => this._renderMeshLink(link))}
          ${this.mode === "trace" || this.mode === "wall" ? this._renderPendingTrace() : nothing}
          ${this._renderScaleLine()}
          ${this.mode === "scale" ? this._renderPendingScale() : nothing}
          ${this._pinGroups().map((group) => this._renderPinGroup(group))}
        </svg>
      `}
      <div class="controls">
        <button @click=${() => this.fitToScreen()} title="Fit to screen">
          ⤢ Fit
        </button>
        <button @click=${() => this._zoomButton(0.8)} title="Zoom in">+</button>
        <button @click=${() => this._zoomButton(1.25)} title="Zoom out">
          −
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "floorplan-canvas": FloorplanCanvas;
  }
}
