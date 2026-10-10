/** Where the live street map sits behind the Property canvas (#6).
 *
 * The layout stores one anchor: canvas point (0, 0) is at `lat`/`lon`, and
 * at the canvas's own scale one canvas unit is one CSS pixel at map zoom
 * `zoom`; the map is turned `rotation_deg` clockwise about that point.
 * Panning/zooming the canvas just moves the map camera to match, so
 * placements stay pinned to real ground — and moving, zooming or turning
 * the *map* (the helpers below) is how a building is lined up with it.
 * Web-Mercator maths with MapLibre's 512px world tile. */

import type { MapBackground } from "../types";

const WORLD_AT_ZOOM_0 = 512;
const MAX_LAT = 85.0511287798;
export const MAP_MIN_ZOOM = 3;
export const MAP_MAX_ZOOM = 21;

export interface MapCamera {
  lat: number;
  lon: number;
  zoom: number;
  /** Degrees clockwise from north, as MapLibre's bearing. */
  bearing: number;
}

type Vec = { x: number; y: number };

function project(lat: number, lon: number, zoom: number): Vec {
  const world = WORLD_AT_ZOOM_0 * 2 ** zoom;
  const clamped = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat));
  const rad = (clamped * Math.PI) / 180;
  return {
    x: ((lon + 180) / 360) * world,
    y:
      (0.5 - Math.log(Math.tan(Math.PI / 4 + rad / 2)) / (2 * Math.PI)) * world,
  };
}

function unproject(x: number, y: number, zoom: number) {
  const world = WORLD_AT_ZOOM_0 * 2 ** zoom;
  const lon = (x / world) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / world;
  const lat = (Math.atan(Math.sinh(n)) * 180) / Math.PI;
  return { lat, lon };
}

/** Clockwise rotation (y points down) of a canvas-unit vector by `deg`. */
function rotate(v: Vec, deg: number): Vec {
  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: cos * v.x - sin * v.y, y: sin * v.x + cos * v.y };
}

function normalizeDeg(deg: number): number {
  const d = ((((deg + 180) % 360) + 360) % 360) - 180;
  return d === -180 ? 180 : d;
}

const rotationOf = (anchor: MapBackground) => anchor.rotation_deg ?? 0;

function worldOf(anchor: MapBackground): Vec {
  return project(anchor.lat, anchor.lon, anchor.zoom);
}

/** The anchor with its canvas origin moved to world pixel (x, y) at `zoom`. */
function withWorld(
  anchor: MapBackground,
  x: number,
  y: number,
  zoom: number,
  rotationDeg: number,
): MapBackground {
  const { lat, lon } = unproject(x, y, zoom);
  return {
    ...anchor,
    lat,
    lon,
    zoom,
    rotation_deg: normalizeDeg(rotationDeg),
  };
}

/** Camera for a canvas whose visible centre is canvas point (`cx`, `cy`)
 * with `pxPerUnit` screen pixels per canvas unit. */
export function cameraFor(
  anchor: MapBackground,
  cx: number,
  cy: number,
  pxPerUnit: number,
): MapCamera {
  const bearing = rotationOf(anchor);
  const a = worldOf(anchor);
  const offset = rotate({ x: cx, y: cy }, bearing);
  const center = unproject(a.x + offset.x, a.y + offset.y, anchor.zoom);
  return {
    lat: center.lat,
    lon: center.lon,
    zoom: anchor.zoom + Math.log2(pxPerUnit),
    bearing,
  };
}

/** Drags the map by (dx, dy) canvas units: the ground under the pointer
 * follows it. */
export function panMap(
  anchor: MapBackground,
  dx: number,
  dy: number,
): MapBackground {
  const a = worldOf(anchor);
  const shift = rotate({ x: dx, y: dy }, rotationOf(anchor));
  return withWorld(
    anchor,
    a.x - shift.x,
    a.y - shift.y,
    anchor.zoom,
    rotationOf(anchor),
  );
}

/** Scales the map by `factor` (>1 = closer) keeping the ground under canvas
 * point `at` where it is. */
export function zoomMap(
  anchor: MapBackground,
  factor: number,
  at: Vec,
): MapBackground {
  const zoom = Math.min(
    MAP_MAX_ZOOM,
    Math.max(MAP_MIN_ZOOM, anchor.zoom + Math.log2(factor)),
  );
  const f = 2 ** (zoom - anchor.zoom);
  const bearing = rotationOf(anchor);
  const a = worldOf(anchor);
  const r = rotate(at, bearing);
  return withWorld(
    anchor,
    f * (a.x + r.x) - r.x,
    f * (a.y + r.y) - r.y,
    zoom,
    bearing,
  );
}

/** Turns the map to `rotationDeg` about canvas point `at`. */
export function rotateMapTo(
  anchor: MapBackground,
  rotationDeg: number,
  at: Vec,
): MapBackground {
  const a = worldOf(anchor);
  const ground = rotate(at, rotationOf(anchor));
  const next = rotate(at, rotationDeg);
  return withWorld(
    anchor,
    a.x + ground.x - next.x,
    a.y + ground.y - next.y,
    anchor.zoom,
    rotationDeg,
  );
}

/** Metres on the ground per canvas unit — what a map-derived scale would
 * use (the Property scale readout doesn't yet). */
export function metersPerUnit(anchor: MapBackground): number {
  const worldMeters = 40075016.686;
  const world = WORLD_AT_ZOOM_0 * 2 ** anchor.zoom;
  return (worldMeters * Math.cos((anchor.lat * Math.PI) / 180)) / world;
}
