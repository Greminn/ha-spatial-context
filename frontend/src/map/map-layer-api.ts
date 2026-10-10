import type { MapCamera } from "./map-camera";
import type { MapStyleKind } from "../types";

/** What the lazily loaded map module (map-glue.ts, built separately into
 * www/map/) hands the Property canvas. Types only — the canvas never
 * imports the module statically, so MapLibre stays out of the main
 * bundle. */
export interface MapLayerHandle {
  setCamera(camera: MapCamera): void;
  setOpacity(opacity: number): void;
  setDark(dark: boolean): void;
  setStyleKind(kind: MapStyleKind): void;
  resize(): void;
  destroy(): void;
}

export interface MapLayerOptions {
  container: HTMLElement;
  /** URL of the directory MapLibre's files are served from. */
  baseUrl: string;
  connection: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
    addEventListener?(event: string, listener: () => void): void;
    removeEventListener?(event: string, listener: () => void): void;
  };
  dark: boolean;
  styleKind: MapStyleKind;
  language: string;
  opacity: number;
  camera: MapCamera;
}

export interface MapGlueModule {
  createMapLayer(options: MapLayerOptions): Promise<MapLayerHandle>;
  /** WebGL2 + BigInt — the same gate HA's own map uses. */
  supportsVectorMaps(): boolean;
}
