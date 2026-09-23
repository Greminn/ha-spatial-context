import type { PlaceableEntity } from "../types";

/** Placement — and everything derived from a pin afterward (its icon, its
 * displayed name) — is about the physical DEVICE, never an entity; a human
 * placing "the U6+ access point" should never need to know or choose which
 * of its ten HA entities represents it, and the app itself shouldn't
 * reason about *which* entity either. `device_name` and `integration_domain`
 * are already device-level facts duplicated onto every entity of a device
 * (same config entry, same physical device — see registry_snapshot.py),
 * so any entity of the right device_id answers both questions identically;
 * there's nothing to rank or choose between. */
function anyEntityForDevice(
  deviceId: string | null,
  entities: Iterable<PlaceableEntity>,
): PlaceableEntity | null {
  if (!deviceId) return null;
  for (const entity of entities) {
    if (entity.device_id === deviceId) return entity;
  }
  return null;
}

/** A pin's displayed name when it has no label_override — the device's own
 * name (never an entity's, which can be a more specific sub-entity name
 * like a camera stream's "High resolution channel"), or a clean, honest
 * "Unknown device" when nothing resolves (never a raw entity_id — that's
 * internal plumbing, not something a person placing a device should ever
 * see). */
export function pinDisplayLabel(
  deviceId: string | null,
  entities: Iterable<PlaceableEntity>,
): string {
  return (
    anyEntityForDevice(deviceId, entities)?.device_name ?? "Unknown device"
  );
}

/** Which integration set up this device (e.g. "unifi", "esphome", "hue") —
 * a true device-level fact, unlike an entity's domain (light/sensor/...),
 * which only describes one facet of what the device happens to expose and
 * is not what a device "is". Used to show that integration's own brand
 * icon on the map (see floorplan-canvas.ts's _iconForPin) instead of
 * guessing a glyph from an arbitrary entity's domain. */
export function pinIntegrationDomain(
  deviceId: string | null,
  entities: Iterable<PlaceableEntity>,
): string | null {
  return anyEntityForDevice(deviceId, entities)?.integration_domain ?? null;
}
