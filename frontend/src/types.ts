/** Types mirroring custom_components/spatial_context/storage.py's schema. */

export interface Room {
  id: string;
  name: string;
  area_id: string | null;
  points: [number, number][];
}

export interface Pin {
  id: string;
  /** The pin's whole identity — a device only physically exists in one
   * place, so this is what "already placed" checks and mesh-link
   * resolution key off. There is deliberately no entity_id here: a human
   * placing a device should never need to know or choose which of its HA
   * entities represents it — canvas/device-display.ts derives an icon and
   * a display name from this purely automatically (entities are AI-agent
   * plumbing, not something a person interacts with). Null only for a pin
   * whose original entity no longer resolves to any device (deleted
   * integration, orphaned registry entry) — never guessed at (see
   * registry_snapshot.py's async_migrate_pin_device_ids). */
  device_id: string | null;
  x: number;
  y: number;
  room_id: string | null;
  icon_override: string | null;
  label_override: string | null;
  /** Mounting height in metres above floor level, e.g. for judging a
   * mmWave sensor's detection cone. Null when not specified. */
  height_m: number | null;
}

export interface Wall {
  id: string;
  /** Material catalog id — see canvas/materials.ts. */
  material: string;
  /** Real wall thickness in centimetres — scales the material's per-cm RF
   * attenuation rate, and (once the floor is calibrated) the wall's drawn
   * line width. Optional only because a wall saved before this field
   * existed won't have one; use canvas/materials.ts's wallThicknessCm(wall)
   * rather than reading this raw, which falls back to the material's own
   * default thickness. */
  thickness_cm?: number;
  points: [number, number][];
}

/** A two-point calibration segment: `points` spans a known real-world
 * distance (`meters`), letting the whole floor's stored units be converted
 * to real-world metres. */
export interface Scale {
  points: [[number, number], [number, number]];
  meters: number;
}

export type OpeningType = "door" | "window";

/** A door or window along a wall. `x`/`y` is the opening's centre point;
 * `width` is measured along the wall's own local direction there. */
export interface Opening {
  id: string;
  wallId: string;
  type: OpeningType;
  x: number;
  y: number;
  width: number;
}

/** The canvas's visible region in its own stored coordinate space — what
 * `fitToScreen()`/pan/zoom actually manipulate. Persisted per floor (and
 * once for the Property tab) so a chosen viewing angle survives switching
 * away and back, captured at Save time from whatever the canvas is
 * currently showing (see panel.ts's `_save`/`_saveProperty`). */
export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FloorLayout {
  background_image_id: string | null;
  background_opacity: number;
  /** Where/how big the background image is drawn within this floor's own
   * stored coordinate space — (0, 0, 1) is "full BASE_WIDTH from the
   * origin", the historical fixed behavior every floor still has unless
   * Align Floors (see panel.ts's _onAlignApply) has rescaled it to line up
   * with another floor. */
  background_offset_x: number;
  background_offset_y: number;
  background_scale: number;
  /** Which "building" this floor belongs to — null until Align Floors
   * links it to another floor. Two floors sharing a non-null building_id
   * share one coordinate system (e.g. Top Floor + Bottom Floor of the
   * same house); a genuinely separate structure (a detached Garage, say)
   * stays null. Used to decide whether switching floors should keep the
   * current pan/zoom (same building) or fit fresh (different building) —
   * see panel.ts's _selectFloor. */
  building_id: string | null;
  /** Saved pan/zoom — restored whenever this floor is opened, in
   * preference to the same-building/fit-fresh fallback above. Null on a
   * floor whose view was never explicitly saved. */
  view_box: ViewBox | null;
  rooms: Room[];
  pins: Pin[];
  walls: Wall[];
  openings: Opening[];
  scale: Scale | null;
}

/** A floor's traced footprint extent (rooms + walls only), in that floor's
 * own stored coordinate space. Two floors sharing a building_id already
 * share one coordinate system (Align Floors), so their bounds can be
 * unioned directly — see panel.ts's `_buildings`. */
export interface ContentBounds {
  min_x: number;
  min_y: number;
  max_x: number;
  max_y: number;
}

export interface FloorMeta {
  floor_id: string;
  name: string;
  level: number | null;
  icon: string | null;
  has_layout: boolean;
  /** Non-null when this floor has been linked to another via Align Floors
   * (see FloorLayout.building_id) — floors sharing a building_id collapse
   * to one placement on the Property tab. Null means this floor is its own
   * building (e.g. a detached Garage never aligned to anything). */
  building_id: string | null;
  content_bounds: ContentBounds | null;
}

/** One building's labeled, rotatable footprint on the Property tab's
 * site photo. `floor_id` is the representative/anchor floor used for
 * navigation ("go to floor") and as the name/icon fallback; `building_id`
 * mirrors that floor's own FloorLayout.building_id (null for a standalone
 * floor acting as its own building). `x`/`y` is the rectangle's *center*,
 * `rotation_deg` is applied about that center. */
export interface PropertyPlacement {
  id: string;
  building_id: string | null;
  floor_id: string;
  label_override: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation_deg: number;
  /** width/height's locked ratio, captured from the building's traced
   * footprint at placement time — resize preserves this instead of
   * letting the rectangle be freely squashed/stretched. */
  aspect_ratio: number;
}

export interface PropertyLayout {
  background_image_id: string | null;
  background_opacity: number;
  background_offset_x: number;
  background_offset_y: number;
  background_scale: number;
  /** Saved pan/zoom, restored whenever the Property tab is opened. */
  view_box: ViewBox | null;
  placements: PropertyPlacement[];
}

export interface AreaMeta {
  area_id: string;
  name: string;
  floor_id: string | null;
  icon: string | null;
}

export interface PlaceableEntity {
  entity_id: string;
  name: string;
  domain: string;
  device_class: string | null;
  area_id: string | null;
  area_name: string | null;
  device_id: string | null;
  device_name: string | null;
  /** "diagnostic" | "config" | null — see entity-picker-sidebar's device grouping. */
  entity_category: string | null;
  /** Integration slug (e.g. "unifiprotect") that set up this entity — used
   * to fetch its brand icon from brands.home-assistant.io, the same public
   * CDN the HA frontend itself uses for every integration logo. */
  integration_domain: string | null;
  integration_name: string | null;
  /** Which floor (if any) this entity is *currently* placed on, house-wide
   * — an entity only physically exists in one place, so the picker uses
   * this to block placing an already-placed device onto a *different*
   * floor (see entity-picker-sidebar.ts). Null means not placed anywhere
   * yet; compare against the currently-open floor_id, since a device
   * already placed on *this* floor should stay placeable (re-armable) here,
   * just not on any other floor. */
  placed_floor_id: string | null;
  placed_floor_name: string | null;
}

export interface ExportSnapshot {
  exported_at: string;
  floors: {
    floor_id: string;
    name: string;
    /** Metres per stored coordinate unit, or null if this floor was never calibrated. */
    meters_per_unit: number | null;
    rooms: {
      id: string | null;
      name: string;
      devices: {
        device_id: string | null;
        /** Null when device_id has no resolvable placeable entity
         * (deleted/disabled since placement) — see export.py. */
        entity_id: string | null;
        name: string;
        domain: string | null;
        device_class: string | null;
        area_name: string | null;
        x: number;
        y: number;
        x_m: number | null;
        y_m: number | null;
        height_m: number | null;
      }[];
    }[];
    walls: {
      material: string;
      material_label: string;
      attenuation_db: number | null;
      points: [number, number][];
      points_m: [number, number][] | null;
      openings: {
        type: OpeningType;
        x: number;
        y: number;
        width: number;
        x_m: number | null;
        y_m: number | null;
        width_m: number | null;
      }[];
    }[];
  }[];
}

export type CanvasMode =
  "select" | "pan" | "trace" | "wall" | "opening" | "scale" | "place" | "align";

export type NetworkType = "zigbee" | "wifi" | "matter";

/** Live Zigbee2MQTT topology — never persisted, fetched fresh on each
 * "Refresh Mesh" click. Global/floor-agnostic like PlaceableEntity/AreaMeta;
 * the panel cross-references against the current floor's placed pins. */
export interface MeshNode {
  ieee: string;
  friendly_name: string;
  device_id: string | null;
}

export interface MeshLink {
  source_ieee: string;
  target_ieee: string;
  lqi: number;
  source_device_id: string | null;
  target_device_id: string | null;
}

export interface ZigbeeMesh {
  nodes: MeshNode[];
  links: MeshLink[];
}

/** Wi-Fi client→AP links, read from entity states (see wifi_mesh.py) —
 * best-effort, only populated for integrations that expose `ap_mac`.
 * `rssi_dbm` is null unless the same device also happens to expose a
 * standard `signal_strength` sensor. */
export interface WifiMesh {
  links: {
    source_device_id: string;
    target_device_id: string;
    rssi_dbm: number | null;
  }[];
}

/** Live Matter/Thread topology — this is HA core's own already-shipped
 * `matter/subscribe_network_topology` WS command (the same one powering
 * Settings → Matter → "Show map"), subscribed to directly; no backend
 * code of ours is involved. */
export interface MatterMeshNode {
  id: string;
  kind: "matter" | "border_router";
  network_type: string;
  node_id: number | null;
  role: string;
  available: boolean | null;
  ext_address: string;
  network_name: string;
  vendor_name: string | null;
  model_name: string | null;
  ha_device_id: string | null;
}

export interface MatterMeshConnection {
  source: string;
  target: string;
  network: string;
  strength: "strong" | "medium" | "weak";
  path_cost: number;
}

export interface MatterNetworkTopology {
  nodes: MatterMeshNode[];
  connections: MatterMeshConnection[];
}

/** What every network type's raw data gets normalized into before
 * rendering — see mesh-colors.ts's LinkQuality. `detail` is an optional
 * tooltip string ("LQI 119", "RSSI -74dBm"), absent for Wi-Fi. */
export interface ResolvedMeshLink {
  fromPin: Pin;
  toPin: Pin;
  quality: "strong" | "medium" | "weak" | "unknown";
  detail?: string;
}

/** A mesh link where exactly one end is placed on the *currently viewed*
 * floor — the other end is real (placed on some other floor), just not
 * drawable as a normal ResolvedMeshLink since its pin isn't on screen.
 * `x`/`y` is where the stub marker renders in this floor's own coordinate
 * space: the other pin's real position when both floors share a
 * building_id (Align Floors — same coordinate system), or a projected
 * point at the edge of this floor's traced content, in the true bearing
 * toward the other building's Property-tab placement, when they don't
 * (see panel.ts's `_meshStubsForCurrentFloor`). */
export interface ResolvedMeshStub {
  fromPin: Pin;
  x: number;
  y: number;
  targetDeviceId: string;
  targetFloorId: string;
  targetFloorName: string;
  targetLabel: string;
  quality: "strong" | "medium" | "weak" | "unknown";
  detail?: string;
}

/** The slice of `hass` this panel actually touches. */
export interface HomeAssistant {
  connection: {
    sendMessagePromise<T>(message: Record<string, unknown>): Promise<T>;
    subscribeMessage<T>(
      callback: (result: T) => void,
      message: Record<string, unknown>,
    ): Promise<() => void>;
  };
  fetchWithAuth(path: string, init?: RequestInit): Promise<Response>;
  states: Record<string, { attributes: Record<string, unknown> } | undefined>;
}
