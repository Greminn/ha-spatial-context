/** Wall material catalog. Deliberately small and residential-construction
 * focused rather than exhaustive. `attenuationDbPerCm` is an approximate
 * 2.4GHz RF signal loss *per centimetre* of that material — rough, but
 * concrete enough to be useful context for reasoning about Zigbee/Wi-Fi
 * mesh coverage (e.g. "why is the LQI to that sensor so poor — is there a
 * concrete wall in the way, and how thick?"). A wall's total attenuation is
 * `attenuationDbPerCm * wall.thickness_cm` (see wallAttenuationDb) — a
 * thicker wall of the same material blocks more, which a single flat
 * per-material number couldn't express. `defaultThicknessCm` is only the
 * starting value offered when a new wall picks this material or an old
 * wall (saved before thickness existed) needs a fallback — never silently
 * re-applied over a thickness the user already set. Mirrored in
 * custom_components/spatial_context/export.py; keep both in sync if this
 * list changes. */
export interface WallMaterial {
  id: string;
  label: string;
  color: string;
  attenuationDbPerCm: number;
  defaultThicknessCm: number;
}

export const WALL_MATERIALS: WallMaterial[] = [
  {
    id: "timber_frame",
    label: "Timber framed (drywall)",
    color: "#212121",
    attenuationDbPerCm: 0.3,
    defaultThicknessCm: 10,
  },
  {
    id: "brick_veneer",
    label: "Brick veneer",
    color: "#3e2723",
    attenuationDbPerCm: 0.55,
    defaultThicknessCm: 11,
  },
  {
    id: "concrete_block",
    label: "Concrete / block",
    color: "#000000",
    attenuationDbPerCm: 0.6,
    defaultThicknessCm: 20,
  },
  {
    id: "aerated_concrete_block",
    label: "Aerated/foam concrete block (plastered)",
    color: "#757575",
    attenuationDbPerCm: 0.37,
    defaultThicknessCm: 13,
  },
  {
    id: "ceramic_poroton_block",
    label: "Ceramic / Poroton block",
    color: "#8d6e63",
    attenuationDbPerCm: 0.42,
    defaultThicknessCm: 25,
  },
  {
    id: "glass",
    label: "Glass",
    color: "#37474f",
    attenuationDbPerCm: 2,
    defaultThicknessCm: 1,
  },
  {
    id: "steel_frame",
    label: "Steel frame",
    color: "#263238",
    attenuationDbPerCm: 1,
    defaultThicknessCm: 10,
  },
];

export const DEFAULT_WALL_MATERIAL = "timber_frame";

export function wallMaterial(id: string): WallMaterial {
  return WALL_MATERIALS.find((m) => m.id === id) ?? WALL_MATERIALS[0]!;
}

/** A wall's total attenuation — its material's per-cm rate times its
 * actual thickness. `thicknessCm` is nullable/optional-safe since a wall
 * saved before this field existed won't have one; callers should pass
 * `wallThicknessCm(wall)` (below) rather than `wall.thickness_cm` raw. */
export function wallAttenuationDb(
  materialId: string,
  thicknessCm: number,
): number {
  return wallMaterial(materialId).attenuationDbPerCm * thicknessCm;
}

/** A wall's effective thickness — its own stored value, or its material's
 * default when missing (a wall saved before thickness_cm existed). */
export function wallThicknessCm(wall: {
  material: string;
  thickness_cm?: number;
}): number {
  return wall.thickness_cm ?? wallMaterial(wall.material).defaultThicknessCm;
}
