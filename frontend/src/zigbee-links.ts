import type { ZigbeeMesh, MeshLink } from "./types";

/** Coordinator links weaker than this are left out of the default view —
 * the coordinator hears most of the house (51 neighbors on a ~70-node
 * mesh), and drawing every faint one buries the useful ones. "Show all
 * links" still shows them. */
const COORDINATOR_MIN_LQI = 50;

/** Which of the backend's unreduced pairs (see zigbee_mesh.py's
 * `_merge_links`) the default view draws. Floor-aware, which is why it
 * lives here and not on the backend (issue #27):
 *
 * - every parent/child link — the real route for an end device;
 * - every coordinator link at or above COORDINATOR_MIN_LQI — one-best-link
 *   rules never show the coordinator's neighborhood, since its own
 *   readings run low next to other chipsets';
 * - per device, its strongest same-floor link AND its strongest
 *   cross-floor link, kept separately — cross-floor LQI is structurally
 *   lower (a floor slab attenuates far more than a wall), so a single
 *   per-device pick never lets one survive, and the cross-floor stubs
 *   would have nothing to draw.
 *
 * Only pairs with both ends placed on some floor are considered — an
 * unplaced device's "best" link would otherwise win and then be dropped
 * downstream, leaving its placed neighbors with nothing. `showAll` skips
 * the selection entirely: the full neighbor table, like Z2M's own map. */
export function selectZigbeeLinks(
  mesh: ZigbeeMesh,
  floorOfDevice: (deviceId: string) => string | undefined,
  showAll: boolean,
): MeshLink[] {
  const placed = mesh.links.filter(
    (link) =>
      link.source_device_id &&
      link.target_device_id &&
      floorOfDevice(link.source_device_id) !== undefined &&
      floorOfDevice(link.target_device_id) !== undefined,
  );
  if (showAll) return placed;

  const coordinatorIeee = mesh.nodes.find(
    (n) => n.type === "Coordinator",
  )?.ieee;
  const kept = new Set<MeshLink>();
  const bestSame = new Map<string, MeshLink>();
  const bestCross = new Map<string, MeshLink>();

  for (const link of placed) {
    if (link.parent_child) kept.add(link);
    const touchesCoordinator =
      link.source_ieee === coordinatorIeee ||
      link.target_ieee === coordinatorIeee;
    if (touchesCoordinator && link.lqi >= COORDINATOR_MIN_LQI) kept.add(link);

    const crossFloor =
      floorOfDevice(link.source_device_id!) !==
      floorOfDevice(link.target_device_id!);
    const best = crossFloor ? bestCross : bestSame;
    for (const ieee of [link.source_ieee, link.target_ieee]) {
      const current = best.get(ieee);
      if (!current || link.lqi > current.lqi) best.set(ieee, link);
    }
  }
  for (const link of bestSame.values()) kept.add(link);
  for (const link of bestCross.values()) kept.add(link);
  return [...kept];
}
