import { mdiDevices, mdiDotsGrid } from "@mdi/js";

/** A device's icon on the map is its integration's own brand logo (see
 * floorplan-canvas.ts's _iconForPin) — a real device-level fact, unlike an
 * entity's domain, which only describes one facet of what it happens to
 * expose. This is the fallback for when there's no integration_domain to
 * work from, or that integration has no logo on brands.home-assistant.io.
 * Deliberately generic (not domain-derived) — nothing here should imply
 * "this is a light" or "this is a sensor" from an arbitrarily-chosen entity. */
export const GENERIC_DEVICE_ICON_PATH = mdiDevices;

/** Marker for 2+ devices co-located at (near enough) the same spot. */
export const GROUP_ICON_PATH = mdiDotsGrid;
