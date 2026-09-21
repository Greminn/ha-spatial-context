/** Wall material catalog. Deliberately small and residential-construction
 * focused rather than exhaustive. `attenuationDb` is an approximate 2.4GHz
 * RF signal loss for a single wall of that material — rough, but concrete
 * enough to be useful context for reasoning about Zigbee/Wi-Fi mesh
 * coverage (e.g. "why is the LQI to that sensor so poor — is there a
 * concrete wall in the way?"). Mirrored in
 * custom_components/spatial_context/websocket_api.py for the export;
 * keep both in sync if this list changes. */
export interface WallMaterial {
  id: string;
  label: string;
  color: string;
  attenuationDb: number;
}

export const WALL_MATERIALS: WallMaterial[] = [
  {
    id: "timber_frame",
    label: "Timber framed (drywall)",
    color: "#212121",
    attenuationDb: 3,
  },
  {
    id: "brick_veneer",
    label: "Brick veneer",
    color: "#3e2723",
    attenuationDb: 6,
  },
  {
    id: "concrete_block",
    label: "Concrete / block",
    color: "#000000",
    attenuationDb: 12,
  },
  { id: "glass", label: "Glass", color: "#37474f", attenuationDb: 2 },
  {
    id: "steel_frame",
    label: "Steel frame",
    color: "#263238",
    attenuationDb: 10,
  },
];

export const DEFAULT_WALL_MATERIAL = "timber_frame";

export function wallMaterial(id: string): WallMaterial {
  return WALL_MATERIALS.find((m) => m.id === id) ?? WALL_MATERIALS[0]!;
}
