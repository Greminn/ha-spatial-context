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
  Room,
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

export function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function emptyPin(
  entityId: string,
  x: number,
  y: number,
  roomId: string | null,
): Pin {
  return {
    id: newId("pin"),
    entity_id: entityId,
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

export function emptyFloorLayout(): FloorLayout {
  return {
    background_image_id: null,
    background_opacity: 0.5,
    background_offset_x: 0,
    background_offset_y: 0,
    background_scale: 1,
    building_id: null,
    rooms: [],
    pins: [],
    walls: [],
    openings: [],
    scale: null,
  };
}
