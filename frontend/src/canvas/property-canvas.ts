import { LitElement, html, svg, css, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { safeCustomElement } from "../define";
import type {
  Pin,
  PlaceableEntity,
  PropertyMeshLink,
  PropertyPlacement,
  ViewBox,
} from "../types";
import type { HomeAssistant, MapBackground, PlacementGhost } from "../types";
import { cameraFor } from "../map/map-camera";
import type { MapGlueModule, MapLayerHandle } from "../map/map-layer-api";
import { localize } from "../i18n";
import {
  blurActiveElement,
  clamp,
  distance,
  pointToSegmentDistance,
} from "./geometry";
import { pinDisplayLabel } from "./device-display";
import { qualityColor } from "./mesh-colors";
import { PinIconResolver, pinStyles } from "./pin-render";
import { BASE_WIDTH } from "./floorplan-canvas";
import { sharedStyles } from "../styles";

/** The Property tab's own canvas — a whole-property site photo with a
 * labeled, rotatable rectangle placed per building (see panel.ts's
 * `_buildings`). Deliberately a separate, lighter component rather than
 * extending floorplan-canvas.ts: it shares that file's coordinate-space
 * convention (BASE_WIDTH) and pan/zoom technique, but floorplan-canvas.ts
 * is large and floor-specific (rooms/walls/pins/mesh) — duplicating this
 * much smaller pan/zoom/background scaffold here is a better trade than
 * risking that big, working component to share it. */
const DEFAULT_HEIGHT = 750;
const MIN_VIEWBOX_WIDTH = BASE_WIDTH / 4;
/** With a map behind, a building is a few dozen units across, so zoom in
 * much further (the map itself has the detail to show for it). */
const MIN_VIEWBOX_WIDTH_WITH_MAP = BASE_WIDTH / 64;
const MAX_VIEWBOX_WIDTH = BASE_WIDTH * 4;
const CLICK_MOVE_THRESHOLD_PX = 5;
const HANDLE_RADIUS_PX = 7;
const PIN_RADIUS_PX = 12;
const INDOOR_END_RADIUS_PX = 5;
const LINK_HIT_PX = 8;
const ROTATE_STICK_PX = 26;

export const DEFAULT_PLACEMENT_WIDTH = 220;
export const DEFAULT_PLACEMENT_HEIGHT = 160;
const MIN_PLACEMENT_SIZE = 10;

/** Corner index -> which side of center that corner is on, in the
 * placement's own unrotated local space (x: -1 left/+1 right, y: -1
 * top/+1 bottom). Order matches the TL/TR/BR/BL corner-handle circles
 * drawn in `_renderPlacement`. Resize keeps the *opposite* corner fixed
 * in world space (see `_lockGesture`/`_onPointerMove`'s resize branch),
 * not the center — dragging a corner should feel like stretching that
 * corner, not scaling from the middle. */
const CORNER_SIGN: [number, number][] = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

type DownHit =
  | { type: "pin"; id: string }
  | { type: "meshLink"; key: string }
  | { type: "resizeHandle"; id: string; corner: 0 | 1 | 2 | 3 }
  | { type: "rotateHandle"; id: string }
  | { type: "body"; id: string }
  | { type: "empty" };

type Gesture =
  | { kind: "pan" }
  /** "Move map" mode: dragging moves the map under the placements. */
  | { kind: "mapPan" }
  | {
      kind: "mapPinch";
      lastDistance: number;
      lastAngle: number;
      lastMid: { x: number; y: number };
    }
  | { kind: "move"; id: string }
  | { kind: "pinMove"; id: string }
  | {
      kind: "resize";
      id: string;
      corner: 0 | 1 | 2 | 3;
      /** The opposite corner's world position at gesture start — stays
       * fixed for the whole drag, since rotation doesn't change mid-resize. */
      anchorWorld: { x: number; y: number };
    }
  | { kind: "rotate"; id: string }
  | {
      kind: "pinch";
      startDistance: number;
      startViewBox: ViewBox;
      midImage: { x: number; y: number };
    }
  | null;

@safeCustomElement("property-canvas")
export class PropertyCanvas extends LitElement {
  static override styles = [
    sharedStyles,
    pinStyles,
    css`
      :host {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: white;
        user-select: none;
        -webkit-user-select: none;
      }
      svg {
        position: relative;
        width: 100%;
        height: 100%;
        touch-action: none;
        display: block;
        cursor: grab;
      }
      svg.place-mode,
      svg.place-mode * {
        cursor: crosshair !important;
      }
      .map-layer {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }
      .map-attribution {
        position: absolute;
        right: 12px;
        bottom: 60px;
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 0.7rem;
        color: #333;
        background: rgba(255, 255, 255, 0.8);
      }
      .map-attribution a {
        color: inherit;
      }
      .map-error {
        position: absolute;
        left: 12px;
        top: 64px;
        max-width: calc(100% - 16px);
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        color: var(--sc-fg);
        background: var(--sc-bg);
        border: 1px solid var(--sc-divider);
        pointer-events: none;
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
      .placement-rect {
        fill: var(--sc-accent);
        fill-opacity: 0.25;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: pointer;
      }
      .placement-rect.selected {
        stroke: var(--sc-danger);
        stroke-width: 3;
        fill-opacity: 0.35;
      }
      .ghost-room {
        fill: none;
        stroke: var(--sc-accent);
        stroke-opacity: 0.7;
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
        pointer-events: none;
      }
      .ghost-wall {
        fill: none;
        stroke: var(--sc-fg);
        stroke-opacity: 0.8;
        stroke-width: 1.5;
        vector-effect: non-scaling-stroke;
        pointer-events: none;
      }
      .placement-label {
        fill: var(--sc-fg);
        font-size: 16px;
        text-anchor: middle;
        pointer-events: none;
        paint-order: stroke;
        stroke: var(--sc-bg);
        stroke-width: 3px;
      }
      .rotate-stick {
        stroke: var(--sc-danger);
        stroke-width: 1.5;
      }
      .rotate-handle {
        fill: white;
        stroke: var(--sc-danger);
        stroke-width: 2;
        cursor: alias;
      }
      .resize-handle {
        fill: white;
        stroke: var(--sc-accent);
        stroke-width: 2;
        cursor: nwse-resize;
      }
      .mesh-link {
        stroke-width: 2;
        opacity: 0.85;
        cursor: pointer;
      }
      .mesh-link.indoor {
        stroke-dasharray: 6 4;
      }
      .mesh-link.selected {
        stroke-width: 4;
        opacity: 1;
      }
      .indoor-end {
        fill: var(--sc-fg-secondary);
        stroke: white;
        stroke-width: 1.5;
        pointer-events: none;
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

  @property({ attribute: false }) placements: PropertyPlacement[] = [];
  /** Traced rooms/walls per placement id, drawn faintly inside its
   * rectangle so the fit against the photo is visible (#6). */
  @property({ attribute: false }) ghosts: Map<string, PlacementGhost> =
    new Map();
  @property({ attribute: false }) floorNameById: Map<string, string> =
    new Map();
  @property({ attribute: false }) floorIconById: Map<string, string> =
    new Map();
  @property({ attribute: false }) backgroundImageUrl: string | null = null;
  @property({ type: Number }) backgroundOpacity = 0.85;
  @property({ type: Number }) backgroundOffsetX = 0;
  @property({ type: Number }) backgroundOffsetY = 0;
  @property({ type: Number }) backgroundScale = 1;
  /** "place" arms a building footprint; "place-pin" an outdoor device. */
  @property({ attribute: false }) mode:
    "select" | "place" | "place-pin" | "map" = "select";
  @property({ attribute: false }) selectedPlacementId: string | null = null;
  /** Outdoor device pins, in site-photo coordinates. */
  @property({ attribute: false }) pins: Pin[] = [];
  @property({ attribute: false }) selectedPinId: string | null = null;
  @property({ attribute: false }) entityLookup: Map<string, PlaceableEntity> =
    new Map();
  /** Connectivity Map lines with at least one outdoor end (see panel.ts's
   * _propertyMeshLinks). */
  @property({ attribute: false }) meshLinks: PropertyMeshLink[] = [];
  @property({ attribute: false }) selectedMeshLinkKey: string | null = null;
  /** The saved property view — this component is freshly created each
   * time the Property tab is opened (unlike floorplan-canvas, which stays
   * mounted across floor switches), so a plain `firstUpdated()` check is
   * enough; no reactive watch needed. */
  @property({ attribute: false }) initialViewBox: ViewBox | null = null;
  /** The live street map behind everything (#6), drawn by the lazily
   * loaded map module — see `_syncMap`. */
  @property({ attribute: false }) mapBackground: MapBackground | null = null;
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private _mapError: string | null = null;
  private _map: MapLayerHandle | undefined;
  private _mapStarting = false;
  private _mapSize = "";

  @state() private _viewBox: ViewBox = {
    x: 0,
    y: 0,
    w: BASE_WIDTH,
    h: DEFAULT_HEIGHT,
  };
  @state() private _naturalHeight = DEFAULT_HEIGHT;

  @query("svg") private _svg!: SVGSVGElement;

  private _pointers = new Map<number, { x: number; y: number }>();
  private _downHit: DownHit | null = null;
  private _downClient: { x: number; y: number } | null = null;
  private _lastClient: { x: number; y: number } | null = null;
  private _gesture: Gesture = null;
  private _moved = false;
  private _resizeObserver?: ResizeObserver;
  private _pinIcons = new PinIconResolver(this);
  /** Set by Esc mid-drag (cancelGesture): the rest of the press is ignored. */
  private _gestureCancelled = false;
  private _hasFittedOnce = false;

  override firstUpdated(): void {
    if (this.initialViewBox) {
      this._viewBox = { ...this.initialViewBox };
      this._hasFittedOnce = true;
    } else {
      this.fitToScreen();
      this._hasFittedOnce =
        this.placements.length > 0 || !this.backgroundImageUrl;
    }
    this._resizeObserver = new ResizeObserver(() => this.requestUpdate());
    this._resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._destroyMap();
  }

  private _destroyMap(): void {
    this._map?.destroy();
    this._map = undefined;
    this._mapSize = "";
  }

  /** Starts, updates or stops the map layer to match `mapBackground` and
   * the current pan/zoom. The map module (MapLibre + style builder) is only
   * fetched the first time a map is wanted. */
  private _syncMap(): void {
    const anchor = this.mapBackground;
    if (!anchor) {
      this._destroyMap();
      this._mapError = null;
      return;
    }
    if (this._mapError) return;
    const container = this.renderRoot.querySelector<HTMLElement>(".map-layer");
    if (!container || !this._svg) return;
    const rect = this._svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const { scale, offsetX, offsetY } = this._svgTransform();
    const vb = this._viewBox;
    const camera = cameraFor(
      anchor,
      vb.x + (rect.width / 2 - offsetX) / scale,
      vb.y + (rect.height / 2 - offsetY) / scale,
      scale,
    );
    const dark = this.hass?.themes?.darkMode ?? false;
    if (this._map) {
      this._map.setDark(dark);
      this._map.setStyleKind(anchor.style ?? "street");
      this._map.setOpacity(anchor.opacity);
      const size = `${rect.width}x${rect.height}`;
      if (size !== this._mapSize) {
        this._mapSize = size;
        this._map.resize();
      }
      this._map.setCamera(camera);
      return;
    }
    const connection = this.hass?.connection;
    if (this._mapStarting || !connection) return;
    this._mapStarting = true;
    this._mapError = null;
    const baseUrl = "/spatial_context/map";
    void (async () => {
      try {
        const glue = (await import(
          /* @vite-ignore */ `${baseUrl}/spatial-context-map.mjs?v=${__BUILD_ID__}`
        )) as MapGlueModule;
        if (!glue.supportsVectorMaps()) {
          throw new Error(localize("mapBackground.noWebgl"));
        }
        const handle = await glue.createMapLayer({
          container,
          baseUrl,
          connection,
          dark,
          styleKind: anchor.style ?? "street",
          language: this.hass?.locale?.language ?? this.hass?.language ?? "en",
          opacity: anchor.opacity,
          camera,
        });
        if (this.mapBackground && this.isConnected) {
          this._map = handle;
          this._mapSize = `${rect.width}x${rect.height}`;
        } else {
          handle.destroy();
        }
      } catch (err) {
        this._mapError = (err as { message?: string })?.message ?? String(err);
      } finally {
        this._mapStarting = false;
        this.requestUpdate();
      }
    })();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("mapBackground")) this._mapError = null;
    this._syncMap();
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
  }

  private _contentBounds(): ViewBox | null {
    if (this.placements.length === 0 && this.pins.length === 0) return null;
    const xs = [
      ...this.placements.flatMap((p) => [p.x - p.width, p.x + p.width]),
      ...this.pins.map((p) => p.x),
    ];
    const ys = [
      ...this.placements.flatMap((p) => [p.y - p.height, p.y + p.height]),
      ...this.pins.map((p) => p.y),
    ];
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const pad = Math.max(maxX - minX, maxY - minY) * 0.15 || 60;
    return {
      x: minX - pad,
      y: minY - pad,
      w: maxX - minX + pad * 2,
      h: maxY - minY + pad * 2,
    };
  }

  /** The canvas point at the middle of the visible area — what the map is
   * turned and zoomed about when that's done from a button or slider. */
  getViewCenter(): { x: number; y: number } {
    const rect = this._svg?.getBoundingClientRect();
    const { scale, offsetX, offsetY } = this._svgTransform();
    const vb = this._viewBox;
    return {
      x: vb.x + ((rect?.width ?? 0) / 2 - offsetX) / scale,
      y: vb.y + ((rect?.height ?? 0) / 2 - offsetY) / scale,
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

  /** The live pan/zoom right now — read by panel.ts at Save time. */
  getViewBox(): ViewBox {
    return { ...this._viewBox };
  }

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
    const svgEl = this._svg;
    const pt = svgEl.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgEl.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }

  /** World point -> a placement's own local (unrotated, center-origin)
   * space — the inverse of the rotate+translate transform each placement
   * is drawn with. */
  private _toLocal(
    p: PropertyPlacement,
    worldX: number,
    worldY: number,
  ): { x: number; y: number } {
    const rad = (p.rotation_deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const dx = worldX - p.x;
    const dy = worldY - p.y;
    return { x: cos * dx + sin * dy, y: -sin * dx + cos * dy };
  }

  private _localToWorld(
    p: PropertyPlacement,
    localX: number,
    localY: number,
  ): { x: number; y: number } {
    const rad = (p.rotation_deg * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return {
      x: p.x + cos * localX - sin * localY,
      y: p.y + sin * localX + cos * localY,
    };
  }

  private _hitTest(clientX: number, clientY: number): DownHit {
    const hitPx = HANDLE_RADIUS_PX * 2;
    // Outdoor pins sit on top of everything, then the selected
    // placement's handles, then mesh lines, then placement bodies.
    const image = this._clientToImage(clientX, clientY);
    const pinHit = this._pxToUnits(PIN_RADIUS_PX * 1.4);
    for (const pin of [...this.pins].reverse()) {
      if (distance(pin.x, pin.y, image.x, image.y) <= pinHit) {
        return { type: "pin", id: pin.id };
      }
    }
    const selected = this.placements.find(
      (p) => p.id === this.selectedPlacementId,
    );
    if (selected) {
      const stick = this._pxToUnits(ROTATE_STICK_PX);
      const corners: [number, number][] = CORNER_SIGN.map(([sx, sy]) => [
        (sx * selected.width) / 2,
        (sy * selected.height) / 2,
      ]);
      for (let i = 0; i < corners.length; i++) {
        const [lx, ly] = corners[i]!;
        const world = this._localToWorld(selected, lx, ly);
        const screen = this._imageToClient(world.x, world.y);
        if (distance(screen.x, screen.y, clientX, clientY) <= hitPx) {
          return {
            type: "resizeHandle",
            id: selected.id,
            corner: i as 0 | 1 | 2 | 3,
          };
        }
      }
      const rotateWorld = this._localToWorld(
        selected,
        0,
        -selected.height / 2 - stick,
      );
      const rotateScreen = this._imageToClient(rotateWorld.x, rotateWorld.y);
      if (distance(rotateScreen.x, rotateScreen.y, clientX, clientY) <= hitPx) {
        return { type: "rotateHandle", id: selected.id };
      }
    }
    const linkHit = this._pxToUnits(LINK_HIT_PX);
    let closestLink: PropertyMeshLink | null = null;
    let closestDist = linkHit;
    for (const link of this.meshLinks) {
      const d = pointToSegmentDistance(
        image.x,
        image.y,
        link.from.x,
        link.from.y,
        link.to.x,
        link.to.y,
      );
      if (d <= closestDist) {
        closestLink = link;
        closestDist = d;
      }
    }
    if (closestLink) return { type: "meshLink", key: closestLink.key };
    for (const p of [...this.placements].reverse()) {
      const local = this._toLocal(p, image.x, image.y);
      if (
        Math.abs(local.x) <= p.width / 2 &&
        Math.abs(local.y) <= p.height / 2
      ) {
        return { type: "body", id: p.id };
      }
    }
    return { type: "empty" };
  }

  private _imageToClient(
    imageX: number,
    imageY: number,
  ): { x: number; y: number } {
    const rect = this._svg.getBoundingClientRect();
    const { scale, offsetX, offsetY } = this._svgTransform();
    return {
      x: rect.left + offsetX + (imageX - this._viewBox.x) * scale,
      y: rect.top + offsetY + (imageY - this._viewBox.y) * scale,
    };
  }

  private _fire(name: string, detail?: unknown) {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true }),
    );
  }

  private _onPointerDown = (e: PointerEvent): void => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    blurActiveElement(this);
    this._svg.setPointerCapture(e.pointerId);
    this._pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this._pointers.size === 2) {
      const pts = [...this._pointers.values()];
      const [a, b] = pts as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const midClient = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      if (this.mode === "map" && this.mapBackground) {
        this._gesture = {
          kind: "mapPinch",
          lastDistance: distance(a.x, a.y, b.x, b.y) || 1,
          lastAngle: Math.atan2(b.y - a.y, b.x - a.x),
          lastMid: this._clientToImage(midClient.x, midClient.y),
        };
        return;
      }
      this._gesture = {
        kind: "pinch",
        startDistance: distance(a.x, a.y, b.x, b.y),
        startViewBox: { ...this._viewBox },
        midImage: this._clientToImage(midClient.x, midClient.y),
      };
      return;
    }
    if (this._pointers.size > 2) return;

    this._downClient = { x: e.clientX, y: e.clientY };
    this._lastClient = { x: e.clientX, y: e.clientY };
    this._moved = false;
    this._gesture = null;
    this._downHit =
      this.mode === "select"
        ? this._hitTest(e.clientX, e.clientY)
        : { type: "empty" };
  };

  private _lockGesture(): Gesture {
    if (this._downHit?.type === "resizeHandle") {
      const downHit = this._downHit;
      const p = this.placements.find((pl) => pl.id === downHit.id);
      if (!p) return { kind: "pan" };
      // The anchor is the corner OPPOSITE the one grabbed — its sign is
      // the negation of the dragged corner's (see CORNER_SIGN).
      const [dragSignX, dragSignY] = CORNER_SIGN[downHit.corner]!;
      const anchorWorld = this._localToWorld(
        p,
        (-dragSignX * p.width) / 2,
        (-dragSignY * p.height) / 2,
      );
      return { kind: "resize", id: p.id, corner: downHit.corner, anchorWorld };
    }
    if (this._downHit?.type === "rotateHandle")
      return { kind: "rotate", id: this._downHit.id };
    if (this._downHit?.type === "body")
      return { kind: "move", id: this._downHit.id };
    if (this._downHit?.type === "pin")
      return { kind: "pinMove", id: this._downHit.id };
    return this.mode === "map" && this.mapBackground
      ? { kind: "mapPan" }
      : { kind: "pan" };
  }

  private _onPointerMove = (e: PointerEvent): void => {
    if (!this._pointers.has(e.pointerId)) return;
    this._pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this._gesture?.kind === "mapPinch" && this._pointers.size === 2) {
      const [a, b] = [...this._pointers.values()] as [
        { x: number; y: number },
        { x: number; y: number },
      ];
      const g = this._gesture;
      const dist = distance(a.x, a.y, b.x, b.y) || 1;
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const mid = this._clientToImage((a.x + b.x) / 2, (a.y + b.y) / 2);
      this._fire("map-adjust", {
        op: "pinch",
        dx: mid.x - g.lastMid.x,
        dy: mid.y - g.lastMid.y,
        factor: dist / g.lastDistance,
        rotateDeg: ((angle - g.lastAngle) * 180) / Math.PI,
        at: mid,
      });
      g.lastDistance = dist;
      g.lastAngle = angle;
      g.lastMid = mid;
      return;
    }

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
        this._minViewBoxWidth,
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

    if (this._pointers.size !== 1 || !this._downClient) return;
    if (this._gestureCancelled) return;

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
      if (this._gesture?.kind === "pan" || this._gesture?.kind === "mapPan") {
        this._svg.style.cursor = "grabbing";
      } else if (this._gesture) {
        // The panel snapshots the layout here, for Esc to restore — these
        // drags update the layout as they go (see cancelGesture).
        this._fire("property-gesture-start");
      }
    }

    const scale = this._svgTransform().scale || 1;
    const last = this._lastClient ?? { x: e.clientX, y: e.clientY };

    if (this._gesture?.kind === "mapPan") {
      this._fire("map-adjust", {
        op: "pan",
        dx: (e.clientX - last.x) / scale,
        dy: (e.clientY - last.y) / scale,
      });
    } else if (this._gesture?.kind === "pan") {
      this._viewBox = {
        ...this._viewBox,
        x: this._viewBox.x - (e.clientX - last.x) / scale,
        y: this._viewBox.y - (e.clientY - last.y) / scale,
      };
    } else if (this._gesture?.kind === "move") {
      this._fire("placement-move", {
        id: this._gesture.id,
        dx: (e.clientX - last.x) / scale,
        dy: (e.clientY - last.y) / scale,
      });
    } else if (this._gesture?.kind === "pinMove") {
      const image = this._clientToImage(e.clientX, e.clientY);
      this._fire("outdoor-pin-move", {
        id: this._gesture.id,
        x: image.x,
        y: image.y,
      });
    } else if (this._gesture?.kind === "resize") {
      const gesture = this._gesture;
      const p = this.placements.find((pl) => pl.id === gesture.id);
      if (p) {
        const [dragSignX, dragSignY] = CORNER_SIGN[gesture.corner]!;
        const anchorSignX = -dragSignX;
        const anchorSignY = -dragSignY;
        const image = this._clientToImage(e.clientX, e.clientY);
        const rad = (p.rotation_deg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const dx = image.x - gesture.anchorWorld.x;
        const dy = image.y - gesture.anchorWorld.y;
        // Pointer position expressed in the placement's unrotated local
        // axes, measured from the fixed anchor corner (not the center).
        const localDX = cos * dx + sin * dy;
        const localDY = -sin * dx + cos * dy;
        const candidateWidth = Math.max(
          MIN_PLACEMENT_SIZE,
          dragSignX * localDX,
        );
        const candidateHeight = Math.max(
          MIN_PLACEMENT_SIZE,
          dragSignY * localDY,
        );
        // Locked to the building's real proportions (p.aspect_ratio, set
        // at placement time from its traced footprint) rather than
        // resizing width/height independently — grows to cover the
        // cursor on whichever axis is more constraining, then derives the
        // other dimension from the ratio.
        const ratio = p.aspect_ratio || candidateWidth / candidateHeight || 1;
        const width = Math.max(candidateWidth, candidateHeight * ratio);
        const height = width / ratio;
        // New center = anchor minus the (rotated) offset from center to
        // the anchor corner at the new size — keeps the anchor corner
        // exactly where it was in world space while the dragged corner
        // follows the pointer.
        const ax = anchorSignX * (width / 2);
        const ay = anchorSignY * (height / 2);
        this._fire("placement-resize", {
          id: p.id,
          width,
          height,
          x: gesture.anchorWorld.x - (cos * ax - sin * ay),
          y: gesture.anchorWorld.y - (sin * ax + cos * ay),
        });
      }
    } else if (this._gesture?.kind === "rotate") {
      const gestureId = this._gesture.id;
      const p = this.placements.find((pl) => pl.id === gestureId);
      if (p) {
        const image = this._clientToImage(e.clientX, e.clientY);
        const angleDeg =
          (Math.atan2(image.y - p.y, image.x - p.x) * 180) / Math.PI;
        const rotationDeg = (((angleDeg + 90) % 360) + 360) % 360;
        this._fire("placement-rotate", { id: p.id, rotationDeg });
      }
    }

    this._lastClient = { x: e.clientX, y: e.clientY };
  };

  private _onPointerUp = (e: PointerEvent): void => {
    this._pointers.delete(e.pointerId);
    this._svg.style.cursor = "";
    try {
      this._svg.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }

    if (this._pointers.size >= 1) {
      this._gesture = null;
      return;
    }

    if (!this._moved && this._downClient && !this._gestureCancelled) {
      this._handleClick();
    }

    this._gesture = null;
    this._downHit = null;
    this._downClient = null;
    this._moved = false;
    this._gestureCancelled = false;
  };

  /** Esc mid-drag of a building or outdoor device: stops the drag and
   * returns true; the panel restores the layout it snapshotted when the
   * drag started ("property-gesture-start"). */
  cancelGesture(): boolean {
    const kind = this._gesture?.kind;
    if (
      !this._moved ||
      !kind ||
      kind === "pan" ||
      kind === "pinch" ||
      kind === "mapPan" ||
      kind === "mapPinch"
    ) {
      return false;
    }
    this._gesture = null;
    this._gestureCancelled = true;
    this._svg.style.cursor = "";
    return true;
  }

  private _handleClick(): void {
    if (this.mode === "place" || this.mode === "place-pin") {
      if (!this._downClient) return;
      const image = this._clientToImage(this._downClient.x, this._downClient.y);
      this._fire(
        this.mode === "place" ? "placement-place" : "outdoor-pin-place",
        {
          x: image.x,
          y: image.y,
        },
      );
      return;
    }
    const hit = this._downHit;
    if (hit?.type === "pin") {
      this._fire("outdoor-pin-select", { id: hit.id });
    } else if (hit?.type === "meshLink") {
      this._fire("property-mesh-link-select", {
        key: hit.key === this.selectedMeshLinkKey ? null : hit.key,
      });
    } else {
      // Empty space or a placement: one selection at a time.
      this._fire("outdoor-pin-select", { id: null });
      this._fire("property-mesh-link-select", { key: null });
      this._fire("placement-select", {
        id: hit?.type === "body" ? hit.id : null,
      });
    }
  }

  private _onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    if (
      this.mode === "map" &&
      this.mapBackground &&
      (e.ctrlKey || e.shiftKey)
    ) {
      const at = this._clientToImage(e.clientX, e.clientY);
      this._fire(
        "map-adjust",
        e.ctrlKey
          ? { op: "zoom", factor: e.deltaY < 0 ? 1.1 : 1 / 1.1, at }
          : { op: "rotate", deltaDeg: e.deltaY < 0 ? 2 : -2, at },
      );
      return;
    }
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

  private get _minViewBoxWidth(): number {
    return this.mapBackground ? MIN_VIEWBOX_WIDTH_WITH_MAP : MIN_VIEWBOX_WIDTH;
  }

  private _zoomBy(factor: number, aroundImage: { x: number; y: number }): void {
    const newW = clamp(
      this._viewBox.w * factor,
      this._minViewBoxWidth,
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

  private _renderBackgroundOverlay() {
    if (!this.backgroundImageUrl) return nothing;
    const { scale, offsetX, offsetY } = this._svgTransform();
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
          style="width:${BASE_WIDTH}px; height:${this._naturalHeight}px; opacity:${this.backgroundOpacity};"
        />
      </div>
    `;
  }

  /** The building's traced rooms/walls, mapped into the placement's local
   * space the same way as property-mapping.ts's floorToProperty: source
   * bounds stretched onto the rectangle. */
  private _renderGhost(p: PropertyPlacement) {
    const ghost = this.ghosts.get(p.id);
    const b = p.source_bounds;
    if (!ghost || !b || b.max_x <= b.min_x || b.max_y <= b.min_y) {
      return nothing;
    }
    const sx = p.width / (b.max_x - b.min_x);
    const sy = p.height / (b.max_y - b.min_y);
    const pts = (points: [number, number][]) =>
      points.map(([x, y]) => `${x},${y}`).join(" ");
    return svg`
      <g
        class="ghost"
        transform="translate(${-p.width / 2} ${-p.height / 2}) scale(${sx} ${sy}) translate(${-b.min_x} ${-b.min_y})"
      >
        ${ghost.rooms.map((r) => svg`<polygon class="ghost-room" points=${pts(r)}></polygon>`)}
        ${ghost.walls.map((w) => svg`<polyline class="ghost-wall" points=${pts(w)}></polyline>`)}
      </g>
    `;
  }

  private _renderPlacement(p: PropertyPlacement) {
    const selected = p.id === this.selectedPlacementId;
    const label =
      p.label_override || this.floorNameById.get(p.floor_id) || p.floor_id;
    const hr = this._pxToUnits(HANDLE_RADIUS_PX);
    const stick = this._pxToUnits(ROTATE_STICK_PX);
    return svg`
      <g transform="translate(${p.x} ${p.y}) rotate(${p.rotation_deg})">
        <rect
          class="placement-rect ${selected ? "selected" : ""}"
          x=${-p.width / 2}
          y=${-p.height / 2}
          width=${p.width}
          height=${p.height}
        ></rect>
        ${this._renderGhost(p)}
        <text class="placement-label" y=${-p.height / 2 - hr}>${label}</text>
        ${
          selected
            ? svg`
              <line
                class="rotate-stick"
                x1="0" y1=${-p.height / 2}
                x2="0" y2=${-p.height / 2 - stick}
              ></line>
              <circle class="rotate-handle" cx="0" cy=${-p.height / 2 - stick} r=${hr}></circle>
              <circle class="resize-handle" cx=${-p.width / 2} cy=${-p.height / 2} r=${hr}></circle>
              <circle class="resize-handle" cx=${p.width / 2} cy=${-p.height / 2} r=${hr}></circle>
              <circle class="resize-handle" cx=${p.width / 2} cy=${p.height / 2} r=${hr}></circle>
              <circle class="resize-handle" cx=${-p.width / 2} cy=${p.height / 2} r=${hr}></circle>
            `
            : nothing
        }
      </g>
    `;
  }

  private _renderMeshLink(link: PropertyMeshLink) {
    const indoor = link.from.floorId !== null || link.to.floorId !== null;
    return svg`
      <line
        class="mesh-link ${indoor ? "indoor" : ""} ${
          link.key === this.selectedMeshLinkKey ? "selected" : ""
        }"
        x1=${link.from.x}
        y1=${link.from.y}
        x2=${link.to.x}
        y2=${link.to.y}
        style="stroke:${qualityColor(link.quality)}"
      >
        <title>${link.from.label} → ${link.to.label}: ${
          link.detail ?? link.quality
        }</title>
      </line>
    `;
  }

  /** A small dot where a line reaches an indoor device — drawn once per
   * device, at its real position inside its building's footprint. */
  private _renderIndoorEnds() {
    const r = this._pxToUnits(INDOOR_END_RADIUS_PX);
    const ends = new Map<string, { x: number; y: number; label: string }>();
    for (const link of this.meshLinks) {
      for (const end of [link.from, link.to]) {
        if (end.floorId !== null) ends.set(end.deviceId, end);
      }
    }
    return [...ends.values()].map(
      (end) => svg`
        <circle class="indoor-end" cx=${end.x} cy=${end.y} r=${r}>
          <title>${end.label}</title>
        </circle>
      `,
    );
  }

  private _renderPin(pin: Pin) {
    return this._pinIcons.renderMarker(
      pin.x,
      pin.y,
      this._pxToUnits(PIN_RADIUS_PX),
      this._pinIcons.iconForPin(pin, this.entityLookup.values()),
      "var(--sc-accent)",
      pin.id === this.selectedPinId,
      pin.label_override ??
        pinDisplayLabel(pin.device_id, this.entityLookup.values()),
    );
  }

  override render() {
    const vb = this._viewBox;
    return html`
      ${
        this.mapBackground
          ? html`<div class="map-layer"></div>
              ${
                this._mapError
                  ? html`<div class="map-error">
                      ${localize("mapBackground.failed", {
                        error: this._mapError,
                      })}
                    </div>`
                  : nothing
              }`
          : nothing
      }
      ${this._renderBackgroundOverlay()}
      ${svg`
        <svg
          viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}"
          class="${this.mode === "place" || this.mode === "place-pin" ? "place-mode" : ""}"
          @wheel=${this._onWheel}
          @pointerdown=${this._onPointerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
        >
          ${this.placements.map((p) => this._renderPlacement(p))}
          ${this.meshLinks.map((link) => this._renderMeshLink(link))}
          ${this._renderIndoorEnds()}
          ${this.pins.map((pin) => this._renderPin(pin))}
        </svg>
      `}
      ${
        this.mapBackground
          ? html`<div class="map-attribution">
              ${
                this.mapBackground.style === "aerial"
                  ? "Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community"
                  : html`©
                      <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noopener noreferrer"
                        >OpenStreetMap</a
                      >
                      contributors`
              }
            </div>`
          : nothing
      }
      <div class="controls">
        <button @click=${() => this.fitToScreen()} title="Fit to screen">
          ⤢ Fit
        </button>
        <button @click=${() => this._zoomButton(0.87)} title="Zoom in">
          +
        </button>
        <button @click=${() => this._zoomButton(1.15)} title="Zoom out">
          −
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "property-canvas": PropertyCanvas;
  }
}
