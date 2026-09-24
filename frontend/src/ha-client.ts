import type {
  AreaMeta,
  ExportSnapshot,
  FloorLayout,
  FloorMeta,
  HomeAssistant,
  MatterNetworkTopology,
  Opening,
  OpeningType,
  Pin,
  PlaceableEntity,
  PropertyLayout,
  PropertyPlacement,
  Room,
  Settings,
  Wall,
  WifiMesh,
  ZigbeeMesh,
} from "./types";
import { DEFAULT_WALL_MATERIAL, wallMaterial } from "./canvas/materials";

/** Thin wrapper over the five spatial_context/* WebSocket commands + core's image upload API. */
export class HaClient {
  constructor(private hass: HomeAssistant) {}

  async listFloors(): Promise<FloorMeta[]> {
    const result = await this.hass.connection.sendMessagePromise<{
      floors: FloorMeta[];
    }>({
      type: "spatial_context/list_floors",
    });
    return result.floors;
  }

  async getLayout(floorId: string): Promise<FloorLayout> {
    return this.hass.connection.sendMessagePromise<FloorLayout>({
      type: "spatial_context/get_layout",
      floor_id: floorId,
    });
  }

  async saveLayout(
    floorId: string,
    layout: FloorLayout,
  ): Promise<{ success: boolean }> {
    return this.hass.connection.sendMessagePromise({
      type: "spatial_context/save_layout",
      floor_id: floorId,
      background_image_id: layout.background_image_id,
      background_opacity: layout.background_opacity,
      background_offset_x: layout.background_offset_x,
      background_offset_y: layout.background_offset_y,
      background_scale: layout.background_scale,
      building_id: layout.building_id,
      view_box: layout.view_box,
      rooms: layout.rooms,
      pins: layout.pins,
      walls: layout.walls,
      openings: layout.openings,
      scale: layout.scale,
    });
  }

  /** Tags a floor as sharing a building/coordinate-system with another
   * (see Align Floors, panel.ts's _onAlignApply) without a full layout
   * save — the floor being viewed may have other unsaved edits pending
   * that this must not also persist as a side effect. */
  async setBuildingId(
    floorId: string,
    buildingId: string | null,
  ): Promise<{ success: boolean }> {
    return this.hass.connection.sendMessagePromise({
      type: "spatial_context/set_building_id",
      floor_id: floorId,
      building_id: buildingId,
    });
  }

  async getPropertyLayout(): Promise<PropertyLayout> {
    return this.hass.connection.sendMessagePromise<PropertyLayout>({
      type: "spatial_context/get_property_layout",
    });
  }

  async savePropertyLayout(
    layout: PropertyLayout,
  ): Promise<{ success: boolean }> {
    return this.hass.connection.sendMessagePromise({
      type: "spatial_context/save_property_layout",
      background_image_id: layout.background_image_id,
      background_opacity: layout.background_opacity,
      background_offset_x: layout.background_offset_x,
      background_offset_y: layout.background_offset_y,
      background_scale: layout.background_scale,
      view_box: layout.view_box,
      placements: layout.placements,
    });
  }

  async getSettings(): Promise<Settings> {
    return this.hass.connection.sendMessagePromise<Settings>({
      type: "spatial_context/get_settings",
    });
  }

  async saveSettings(settings: Settings): Promise<{ success: boolean }> {
    return this.hass.connection.sendMessagePromise({
      type: "spatial_context/save_settings",
      unit_system: settings.unit_system,
    });
  }

  async listAreas(): Promise<AreaMeta[]> {
    const result = await this.hass.connection.sendMessagePromise<{
      areas: AreaMeta[];
    }>({
      type: "spatial_context/list_areas",
    });
    return result.areas;
  }

  async listPlaceableEntities(): Promise<PlaceableEntity[]> {
    const result = await this.hass.connection.sendMessagePromise<{
      entities: PlaceableEntity[];
    }>({ type: "spatial_context/list_placeable_entities" });
    return result.entities;
  }

  async exportSnapshot(): Promise<ExportSnapshot> {
    return this.hass.connection.sendMessagePromise<ExportSnapshot>({
      type: "spatial_context/export_snapshot",
    });
  }

  /** Slow (~60-90s) — only ever call this from an explicit user action. */
  async getZigbeeMesh(): Promise<ZigbeeMesh> {
    return this.hass.connection.sendMessagePromise<ZigbeeMesh>({
      type: "spatial_context/get_zigbee_mesh",
    });
  }

  /** Best-effort — empty link list if no integration exposes `ap_mac`. */
  async getWifiMesh(): Promise<WifiMesh> {
    return this.hass.connection.sendMessagePromise<WifiMesh>({
      type: "spatial_context/get_wifi_mesh",
    });
  }

  /** HA core's own command (powers Settings → Matter → "Show map"), not
   * anything of ours. Live push, not a one-shot fetch — returns the
   * unsubscribe function, which the caller must invoke on teardown. */
  async subscribeMatterTopology(
    callback: (topology: MatterNetworkTopology) => void,
  ): Promise<() => void> {
    return this.hass.connection.subscribeMessage<MatterNetworkTopology>(
      callback,
      {
        type: "matter/subscribe_network_topology",
      },
    );
  }

  /** Uploads via HA core's built-in image_upload component, returns the new image id. */
  async uploadBackgroundImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.hass.fetchWithAuth("/api/image/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(
        `Image upload failed: ${response.status} ${response.statusText}`,
      );
    }
    const data = (await response.json()) as { id: string };
    return data.id;
  }
}

export function backgroundImageUrl(imageId: string | null): string | null {
  return imageId ? `/api/image/serve/${imageId}/original` : null;
}

/** A pin/room/wall/etc.'s unique id. `crypto.randomUUID()` is the obvious
 * choice, but the spec restricts it to secure contexts (HTTPS) — plenty of
 * HA installs are reached over plain HTTP on the LAN, where it's simply
 * not a function at all. Confirmed live: this broke wall/room/device
 * creation entirely for real users on plain HTTP (GitHub issues #8 and
 * #9) — every add silently threw inside newId() before the new
 * room/wall/pin ever reached state, so it looked like the drawing just
 * vanished. `crypto.getRandomValues()` has no such secure-context
 * restriction, so build a standard UUID v4 from that instead when native
 * randomUUID() isn't available; a non-crypto Math.random() fallback
 * covers the (effectively never happens) case where crypto itself is
 * entirely absent — these ids only need to be unique within one floor's
 * layout, never security-sensitive. */
export function newId(prefix: string): string {
  return `${prefix}-${uuidV4()}`;
}

function uuidV4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6]! & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 10
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(
      "",
    );
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function emptyPin(
  deviceId: string | null,
  x: number,
  y: number,
  roomId: string | null,
): Pin {
  return {
    id: newId("pin"),
    device_id: deviceId,
    x,
    y,
    room_id: roomId,
    icon_override: null,
    label_override: null,
    height_m: null,
  };
}

export function newRoom(
  name: string,
  points: [number, number][],
  areaId: string | null,
): Room {
  return { id: newId("room"), name, area_id: areaId, points };
}

export function newWall(
  points: [number, number][],
  material = DEFAULT_WALL_MATERIAL,
): Wall {
  return {
    id: newId("wall"),
    material,
    thickness_cm: wallMaterial(material).defaultThicknessCm,
    points,
  };
}

export function newOpening(
  wallId: string,
  type: OpeningType,
  x: number,
  y: number,
  width: number,
): Opening {
  return { id: newId("opening"), wallId, type, x, y, width };
}

/** New placements are sized to this on their longer side, with the other
 * side derived from `aspectRatio` — the actual on-screen starting size is
 * cosmetic, since the user resizes it into place; what matters is starting
 * proportional to the real building rather than an arbitrary rectangle. */
const NEW_PLACEMENT_LONG_SIDE = 220;

export function newPlacement(
  floorId: string,
  buildingId: string | null,
  x: number,
  y: number,
  aspectRatio: number,
): PropertyPlacement {
  const width =
    aspectRatio >= 1
      ? NEW_PLACEMENT_LONG_SIDE
      : NEW_PLACEMENT_LONG_SIDE * aspectRatio;
  const height =
    aspectRatio >= 1
      ? NEW_PLACEMENT_LONG_SIDE / aspectRatio
      : NEW_PLACEMENT_LONG_SIDE;
  return {
    id: newId("placement"),
    building_id: buildingId,
    floor_id: floorId,
    label_override: null,
    x,
    y,
    width,
    height,
    rotation_deg: 0,
    aspect_ratio: aspectRatio,
  };
}

export function emptySettings(): Settings {
  return {
    unit_system: "metric",
  };
}

export function emptyPropertyLayout(): PropertyLayout {
  return {
    background_image_id: null,
    background_opacity: 0.85,
    background_offset_x: 0,
    background_offset_y: 0,
    background_scale: 1,
    view_box: null,
    placements: [],
  };
}

export function emptyFloorLayout(): FloorLayout {
  return {
    background_image_id: null,
    background_opacity: 0.5,
    background_offset_x: 0,
    background_offset_y: 0,
    background_scale: 1,
    building_id: null,
    view_box: null,
    rooms: [],
    pins: [],
    walls: [],
    openings: [],
    scale: null,
  };
}
