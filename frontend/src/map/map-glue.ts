import * as maplibregl from "maplibre-gl";
import { osm } from "@versatiles/style";
import type { StyleSpecification } from "maplibre-gl";
import type {
  MapGlueModule,
  MapLayerHandle,
  MapLayerOptions,
} from "./map-layer-api";

/** Lazily loaded by the Property canvas (see property-canvas.ts's
 * `_ensureMap`) — built separately from the panel bundle into
 * www/map/spatial-context-map.mjs, with MapLibre's own files beside it.
 *
 * Draws the same vector map as HA's map dashboard: Shortbread tiles from
 * core's `map_tiles` proxy, styled by @versatiles/style, with the proxy's
 * rotating token attached to every request. Glyphs come from the proxy
 * too; POI icon sprites are left out (HA ships its sprite sheet inside its
 * own frontend, which this panel can't rely on). */

const PROXY = "/api/map_tiles";
const TOKEN_HEADER = "X-Map-Tiles-Token";
/** Core rotates every 30 min and keeps two tokens live. */
const TOKEN_REFRESH_MS = 20 * 60 * 1000;

function supportsVectorMaps(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    const ok = !!gl && typeof BigInt === "function";
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}

/** Esri World Imagery — keyless, loaded straight from Esri by the browser
 * (so it must be credited on screen; see property-canvas.ts). Tiles stop
 * at zoom 19; MapLibre scales the last level up beyond that. */
const AERIAL_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    aerial: {
      type: "raster",
      tiles: [
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [{ id: "aerial", type: "raster", source: "aerial" }],
};

function buildStyle(
  kind: "street" | "aerial",
  dark: boolean,
  language: string,
): StyleSpecification {
  if (kind === "aerial") return AERIAL_STYLE;
  const style = osm({
    theme: dark ? "colorful-dark" : "colorful",
    text: { language: language === "de" ? "de" : "en" },
    layers: { icons: false },
    projection: "mercator",
    urls: {
      base: location.origin,
      osm: {
        tilejson: "3.0.0",
        scheme: "xyz",
        tiles: [`${location.origin}${PROXY}/vector/{z}/{x}/{y}.mvt`],
        minzoom: 0,
        maxzoom: 14,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      glyphsPattern: `${location.origin}${PROXY}/fonts/{fontstack}/{range}.pbf`,
      sprite: [],
    },
  });
  return style as StyleSpecification;
}

async function createMapLayer(
  options: MapLayerOptions,
): Promise<MapLayerHandle> {
  const base = options.baseUrl.replace(/\/+$/, "");
  maplibregl.setWorkerUrl(`${base}/maplibre-gl-worker.mjs`);

  // MapLibre's stylesheet (canvas positioning, attribution) — the Property
  // canvas lives in a shadow root, so the page's own <link> wouldn't reach.
  const root = options.container.getRootNode();
  const cssParent = root instanceof ShadowRoot ? root : document.head;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${base}/maplibre-gl.css`;
  cssParent.appendChild(link);

  let token: string | undefined;
  const fetchToken = async () => {
    try {
      token = (
        await options.connection.sendMessagePromise<{ token: string }>({
          type: "map_tiles/access_token",
        })
      ).token;
    } catch {
      /* keep the old token; the next interval retries */
    }
  };
  await fetchToken();
  if (!token) throw new Error("map_tiles isn't available");
  const interval = setInterval(() => void fetchToken(), TOKEN_REFRESH_MS);

  let dark = options.dark;
  let kind = options.styleKind;
  const map = new maplibregl.Map({
    container: options.container,
    style: buildStyle(kind, dark, options.language),
    center: [options.camera.lon, options.camera.lat],
    zoom: options.camera.zoom,
    bearing: options.camera.bearing,
    interactive: false,
    maxZoom: 24,
    fadeDuration: 0,
    // Credited by the Property canvas itself, clear of its zoom controls.
    attributionControl: false,
    canvasContextAttributes: { antialias: true },
    transformRequest: (url: string) =>
      url.startsWith(`${location.origin}${PROXY}/`) && token
        ? { url, headers: { [TOKEN_HEADER]: token } }
        : { url },
  });
  options.container.style.opacity = String(options.opacity);

  return {
    setCamera(camera) {
      map.jumpTo({
        center: [camera.lon, camera.lat],
        zoom: camera.zoom,
        bearing: camera.bearing,
      });
    },
    setOpacity(opacity) {
      options.container.style.opacity = String(opacity);
    },
    setDark(next) {
      if (next === dark) return;
      dark = next;
      if (kind === "street")
        map.setStyle(buildStyle(kind, dark, options.language));
    },
    setStyleKind(next) {
      if (next === kind) return;
      kind = next;
      map.setStyle(buildStyle(kind, dark, options.language));
    },
    resize() {
      map.resize();
    },
    destroy() {
      clearInterval(interval);
      map.remove();
      link.remove();
    },
  };
}

const glue: MapGlueModule = { createMapLayer, supportsVectorMaps };
export default glue;
export { createMapLayer, supportsVectorMaps };
