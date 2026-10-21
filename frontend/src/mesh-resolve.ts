import type {
  BluetoothAdvertisement,
  FloorLayout,
  FloorMeta,
  MatterNetworkTopology,
  MeshLegendInfo,
  NetworkType,
  PlaceableEntity,
  Pin,
  PropertyLayout,
  PropertyMeshEnd,
  PropertyMeshLink,
  ResolvedMeshLink,
  ResolvedMeshStub,
  Settings,
  WifiMesh,
  ZigbeeMesh,
} from "./types";
import { PROPERTY_LOCATION_ID } from "./types";
import {
  bleRssiToQuality,
  dbmToQuality,
  lqiToQuality,
} from "./canvas/mesh-colors";
import { pinDisplayLabel } from "./canvas/device-display";
import { selectZigbeeLinks, withCoordinatorDevice } from "./zigbee-links";
import { floorToProperty, propertyToFloor } from "./canvas/property-mapping";
import { rayBoxExit } from "./canvas/geometry";
import { placementForFloor } from "./property-layout";

/** Everything the Connectivity Map needs to turn each network's raw data
 * into lines and stubs on the floor and Property views. Gathered by
 * panel.ts, which owns the state; the functions below only read it. */
export interface MeshContext {
  networkType: NetworkType | null;
  zigbeeMesh: ZigbeeMesh | null;
  zigbeeShowAllLinks: boolean;
  wifiMesh: WifiMesh | null;
  matterTopology: MatterNetworkTopology | null;
  bluetoothAdverts: Map<string, BluetoothAdvertisement>;
  /** Bluetooth address → the HA devices registered under it. */
  bluetoothDevices: Record<string, string[]>;
  settings: Settings;
  floors: FloorMeta[];
  currentFloorId: string | null;
  /** The floor being viewed. */
  layout: FloorLayout;
  propertyLayout: PropertyLayout;
  /** Pins on the viewed floor, by device. */
  pinByDeviceId: Map<string, Pin>;
  /** Outdoor pins on the Property tab, by device. */
  outdoorPinByDeviceId: Map<string, Pin>;
  /** Pins on every other floor, by device. */
  otherFloorPinsByDeviceId: Map<string, { pin: Pin; floorId: string }>;
  entityLookup: Map<string, PlaceableEntity>;
}

export interface NormalizedMeshLink {
  sourceDeviceId: string;
  targetDeviceId: string;
  quality: "strong" | "medium" | "weak" | "unknown";
  detail?: string;
  /** LQI (Zigbee) or dBm (Wi-Fi, Bluetooth); Matter reports a rating only. */
  value?: number;
}

export function pinLabel(ctx: MeshContext, pin: Pin): string {
  if (pin.label_override) return pin.label_override;
  return pinDisplayLabel(pin.device_id, ctx.entityLookup.values());
}

/** Every network type's raw shape, normalized to one common shape before
 * anything downstream (both `meshLinksForFloor` and `meshStubsForFloor`
 * build off this) — so "how do we grade this" lives in one place. The
 * picked network layer is the master on/off switch: no layer picked
 * means off, and a picked layer stays drawn after the menu is closed. */
export function normalizeMeshLinks(ctx: MeshContext): NormalizedMeshLink[] {
  if (ctx.networkType === null) return [];

  if (ctx.networkType === "zigbee" && ctx.zigbeeMesh) {
    const floorOfDevice = (deviceId: string) =>
      ctx.pinByDeviceId.has(deviceId)
        ? (ctx.currentFloorId ?? undefined)
        : ctx.outdoorPinByDeviceId.has(deviceId)
          ? PROPERTY_LOCATION_ID
          : ctx.otherFloorPinsByDeviceId.get(deviceId)?.floorId;
    return selectZigbeeLinks(
      withCoordinatorDevice(
        ctx.zigbeeMesh,
        ctx.settings.zigbee_coordinator_device_id,
      ),
      floorOfDevice,
      ctx.zigbeeShowAllLinks,
    ).map((link) => ({
      sourceDeviceId: link.source_device_id!,
      targetDeviceId: link.target_device_id!,
      quality: lqiToQuality(link.lqi),
      value: link.lqi,
      // `lqi` is scale-corrected (see zigbee_mesh.py's _reporter_scales) —
      // show the raw readings too whenever they differ from it, so a
      // saturated reporter (e.g. a Hue bulb claiming 252 everywhere) is
      // visible as such.
      detail: link.lqi_readings.every((raw) => raw === link.lqi)
        ? `LQI ${link.lqi}`
        : `LQI ${link.lqi} (raw ${link.lqi_readings.join(" / ")})`,
    }));
  }
  if (ctx.networkType === "wifi" && ctx.wifiMesh) {
    return ctx.wifiMesh.links.map((link) => ({
      sourceDeviceId: link.source_device_id,
      targetDeviceId: link.target_device_id,
      quality: link.rssi_dbm != null ? dbmToQuality(link.rssi_dbm) : "unknown",
      ...(link.rssi_dbm != null
        ? { detail: `${link.rssi_dbm} dBm`, value: link.rssi_dbm }
        : {}),
    }));
  }
  if (ctx.networkType === "bluetooth") {
    // Each BLE device → the scanner that heard it, both resolved through
    // their registered Bluetooth addresses (see bluetooth_mesh.py);
    // every candidate pair is emitted and only placed ones get drawn.
    const out: NormalizedMeshLink[] = [];
    for (const advert of ctx.bluetoothAdverts.values()) {
      const devices = ctx.bluetoothDevices[advert.address] ?? [];
      const scanners = ctx.bluetoothDevices[advert.source] ?? [];
      for (const deviceId of devices) {
        for (const scannerId of scanners) {
          if (deviceId === scannerId) continue; // a proxy hearing itself
          out.push({
            sourceDeviceId: deviceId,
            targetDeviceId: scannerId,
            quality:
              advert.rssi != null ? bleRssiToQuality(advert.rssi) : "unknown",
            ...(advert.rssi != null
              ? { detail: `RSSI ${advert.rssi} dBm`, value: advert.rssi }
              : {}),
          });
        }
      }
    }
    return out;
  }
  if (ctx.networkType === "matter" && ctx.matterTopology) {
    const deviceIdByNodeId = new Map<string, string>();
    for (const node of ctx.matterTopology.nodes) {
      // Border routers carry no ha_device_id in HA's topology (#38), so
      // they use the device the user picked in Settings.
      const deviceId =
        node.ha_device_id ??
        (node.kind === "border_router"
          ? ctx.settings.thread_border_router_device_id
          : null);
      if (deviceId) deviceIdByNodeId.set(node.id, deviceId);
    }
    const out: NormalizedMeshLink[] = [];
    for (const conn of ctx.matterTopology.connections) {
      const sourceDeviceId = deviceIdByNodeId.get(conn.source);
      const targetDeviceId = deviceIdByNodeId.get(conn.target);
      if (!sourceDeviceId || !targetDeviceId) continue;
      out.push({
        sourceDeviceId,
        targetDeviceId,
        quality: conn.strength,
        detail: conn.strength,
      });
    }
    return out;
  }
  return [];
}

/** Where a device sits on the Property tab's site photo: an outdoor pin
 * as-is, or an indoor pin mapped through its building's placement (see
 * canvas/property-mapping.ts). Null when it isn't placed, or its
 * building hasn't been placed on the Property tab. */
function propertyEnd(
  ctx: MeshContext,
  deviceId: string,
): PropertyMeshEnd | null {
  const outdoor = ctx.outdoorPinByDeviceId.get(deviceId);
  if (outdoor) {
    return {
      deviceId,
      x: outdoor.x,
      y: outdoor.y,
      label: pinLabel(ctx, outdoor),
      floorId: null,
    };
  }
  const local = ctx.pinByDeviceId.get(deviceId);
  const indoor = local
    ? { pin: local, floorId: ctx.currentFloorId }
    : ctx.otherFloorPinsByDeviceId.get(deviceId);
  if (!indoor?.floorId) return null;
  const placement = placementForFloor(
    ctx.floors,
    ctx.propertyLayout,
    indoor.floorId,
  );
  const point = placement
    ? floorToProperty(placement, indoor.pin.x, indoor.pin.y)
    : null;
  if (!point) return null;
  return {
    deviceId,
    ...point,
    label: pinLabel(ctx, indoor.pin),
    floorId: indoor.floorId,
  };
}

/** Connectivity Map lines for the Property tab — every link with at
 * least one outdoor end, the indoor end (if any) drawn at its real spot
 * inside its building. Indoor-to-indoor links stay on the floor views. */
export function propertyMeshLinks(ctx: MeshContext): PropertyMeshLink[] {
  const outdoor = ctx.outdoorPinByDeviceId;
  const links: PropertyMeshLink[] = [];
  for (const link of normalizeMeshLinks(ctx)) {
    if (
      !outdoor.has(link.sourceDeviceId) &&
      !outdoor.has(link.targetDeviceId)
    ) {
      continue;
    }
    const from = propertyEnd(ctx, link.sourceDeviceId);
    const to = propertyEnd(ctx, link.targetDeviceId);
    if (!from || !to) continue;
    links.push({
      key: `${link.sourceDeviceId}|${link.targetDeviceId}`,
      from,
      to,
      quality: link.quality,
      ...(link.detail ? { detail: link.detail } : {}),
      ...(link.value !== undefined ? { value: link.value } : {}),
    });
  }
  return links;
}

/** Only links where both ends resolve to a pin placed on the currently
 * viewed floor — see `meshStubsForFloor` for the case where just one end
 * does. */
export function meshLinksForFloor(ctx: MeshContext): ResolvedMeshLink[] {
  const links: ResolvedMeshLink[] = [];
  for (const link of normalizeMeshLinks(ctx)) {
    const fromPin = ctx.pinByDeviceId.get(link.sourceDeviceId);
    const toPin = ctx.pinByDeviceId.get(link.targetDeviceId);
    if (fromPin && toPin) {
      links.push({
        fromPin,
        toPin,
        quality: link.quality,
        ...(link.detail ? { detail: link.detail } : {}),
        ...(link.value !== undefined ? { value: link.value } : {}),
      });
    }
  }
  return links;
}

/** The viewed floor's traced content extent (rooms + walls), padded — the
 * box a cross-building stub gets projected to the edge of. Null on a floor
 * with nothing traced yet. */
export function floorContentBounds(layout: FloorLayout): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} | null {
  const points: [number, number][] = [];
  for (const room of layout.rooms) points.push(...room.points);
  for (const wall of layout.walls) points.push(...wall.points);
  if (points.length === 0) return null;
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pad = Math.max(maxX - minX, maxY - minY) * 0.05 || 20;
  return {
    minX: minX - pad,
    minY: minY - pad,
    maxX: maxX + pad,
    maxY: maxY + pad,
  };
}

/** For a cross-*building* link (no shared coordinate system) — a real
 * compass bearing, computed from where each building actually sits on
 * the Property tab's site photo, adjusted for this floor's own rotation
 * there, then projected from `localPin` out to the edge of this floor's
 * traced content. Null whenever there isn't enough placement data to
 * compute a genuine bearing from (either building never placed on the
 * Property tab) or nothing's been traced on this floor yet — no stub is
 * better than a fabricated direction. */
export function projectStubTowardBuilding(
  ctx: MeshContext,
  localPin: Pin,
  targetFloorId: string,
): { x: number; y: number } | null {
  if (!ctx.currentFloorId) return null;
  const currentPlacement = placementForFloor(
    ctx.floors,
    ctx.propertyLayout,
    ctx.currentFloorId,
  );
  const targetPlacement = placementForFloor(
    ctx.floors,
    ctx.propertyLayout,
    targetFloorId,
  );
  if (!currentPlacement || !targetPlacement) return null;
  const bounds = floorContentBounds(ctx.layout);
  if (!bounds) return null;

  const angleProperty = Math.atan2(
    targetPlacement.y - currentPlacement.y,
    targetPlacement.x - currentPlacement.x,
  );
  const rotationRad = (currentPlacement.rotation_deg * Math.PI) / 180;
  const angleLocal = angleProperty - rotationRad;
  return rayBoxExit(
    localPin.x,
    localPin.y,
    Math.cos(angleLocal),
    Math.sin(angleLocal),
    bounds,
  );
}

/** Links with exactly one end on the currently-viewed floor — the other
 * end is real (placed on some other floor), just off-screen. Rendered
 * as a stub: a line to a marker at the other device's real position
 * (floors sharing a building_id already share one coordinate system —
 * Align Floors), or, for a genuinely separate building (e.g. a detached
 * Garage), a marker projected toward that building's true direction via
 * the Property tab's own placements. Silently omitted (not drawn at a
 * guessed position) whenever that direction can't be computed. */
export function meshStubsForFloor(ctx: MeshContext): ResolvedMeshStub[] {
  if (!ctx.currentFloorId) return [];
  const currentFloor = ctx.floors.find(
    (f) => f.floor_id === ctx.currentFloorId,
  );
  const stubs: ResolvedMeshStub[] = [];

  for (const link of normalizeMeshLinks(ctx)) {
    const localIsSource = ctx.pinByDeviceId.has(link.sourceDeviceId);
    const localIsTarget = ctx.pinByDeviceId.has(link.targetDeviceId);
    if (localIsSource === localIsTarget) continue;
    const localPin = ctx.pinByDeviceId.get(
      localIsSource ? link.sourceDeviceId : link.targetDeviceId,
    )!;
    const remoteDeviceId = localIsSource
      ? link.targetDeviceId
      : link.sourceDeviceId;
    const outdoorPin = ctx.outdoorPinByDeviceId.get(remoteDeviceId);
    if (outdoorPin) {
      // An outdoor device: its real spot, mapped from the site photo into
      // this floor's coordinates through this floor's own placement.
      const placement = placementForFloor(
        ctx.floors,
        ctx.propertyLayout,
        ctx.currentFloorId,
      );
      const point = placement
        ? propertyToFloor(placement, outdoorPin.x, outdoorPin.y)
        : null;
      if (!point) continue;
      stubs.push({
        fromPin: localPin,
        x: point.x,
        y: point.y,
        targetDeviceId: remoteDeviceId,
        targetFloorId: PROPERTY_LOCATION_ID,
        targetFloorName: "Outside",
        targetLabel: pinLabel(ctx, outdoorPin),
        quality: link.quality,
        ...(link.detail ? { detail: link.detail } : {}),
        ...(link.value !== undefined ? { value: link.value } : {}),
      });
      continue;
    }
    const remote = ctx.otherFloorPinsByDeviceId.get(remoteDeviceId);
    if (!remote || remote.floorId === ctx.currentFloorId) continue;
    const remoteFloor = ctx.floors.find((f) => f.floor_id === remote.floorId);
    const remoteLabel =
      remote.pin.label_override ??
      pinDisplayLabel(remote.pin.device_id, ctx.entityLookup.values());

    const sameBuilding =
      currentFloor?.building_id !== null &&
      currentFloor?.building_id === remoteFloor?.building_id;
    const point = sameBuilding
      ? { x: remote.pin.x, y: remote.pin.y }
      : projectStubTowardBuilding(ctx, localPin, remote.floorId);
    if (!point) continue;

    stubs.push({
      fromPin: localPin,
      x: point.x,
      y: point.y,
      targetDeviceId: remoteDeviceId,
      targetFloorId: remote.floorId,
      targetFloorName: remoteFloor?.name ?? remote.floorId,
      targetLabel: remoteLabel,
      quality: link.quality,
      ...(link.detail ? { detail: link.detail } : {}),
      ...(link.value !== undefined ? { value: link.value } : {}),
    });
  }
  return stubs;
}

const UNIT_FOR_NETWORK: Partial<Record<NetworkType, "lqi" | "dbm">> = {
  zigbee: "lqi",
  wifi: "dbm",
  bluetooth: "dbm",
};

/** The ends of the colour scale: the weakest and strongest readings among the
 * links drawn. Null when the network gives no readings, or they are all the
 * same (one number would label both ends). */
function legendRange(
  network: NetworkType,
  links: { value?: number }[],
): MeshLegendInfo["range"] {
  const unit = UNIT_FOR_NETWORK[network];
  const values = links
    .map((link) => link.value)
    .filter((value): value is number => value !== undefined);
  if (!unit || values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min < max ? { min, max, unit } : null;
}

/** The legend for a floor view: a dashed key only when a link runs to
 * another floor or outdoors (a stub), a grey key only when a link has no
 * signal reading. Null with no layer picked. */
export function floorMeshLegend(ctx: MeshContext): MeshLegendInfo | null {
  if (ctx.networkType === null) return null;
  const stubs = meshStubsForFloor(ctx);
  const drawn = [...meshLinksForFloor(ctx), ...stubs];
  return {
    network: ctx.networkType,
    dashed: stubs.length > 0 ? "floor" : null,
    unknown: drawn.some((link) => link.quality === "unknown"),
    range: legendRange(ctx.networkType, drawn),
  };
}

/** The legend for the Property tab, where a dashed line is one that ends
 * at a device inside a building. */
export function propertyMeshLegend(ctx: MeshContext): MeshLegendInfo | null {
  if (ctx.networkType === null) return null;
  const links = propertyMeshLinks(ctx);
  return {
    network: ctx.networkType,
    dashed: links.some(
      (link) => link.from.floorId !== null || link.to.floorId !== null,
    )
      ? "property"
      : null,
    unknown: links.some((link) => link.quality === "unknown"),
    range: legendRange(ctx.networkType, links),
  };
}
