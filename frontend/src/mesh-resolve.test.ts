import { describe, expect, it } from "vitest";
import {
  floorContentBounds,
  floorMeshLegend,
  propertyMeshLegend,
  meshLinksForFloor,
  meshStubsForFloor,
  normalizeMeshLinks,
  propertyMeshLinks,
} from "./mesh-resolve";
import type { MeshContext } from "./mesh-resolve";
import {
  emptyFloorLayout,
  emptyPropertyLayout,
  emptySettings,
} from "./ha-client";
import type {
  FloorMeta,
  MatterMeshNode,
  MeshLink,
  Pin,
  PropertyPlacement,
} from "./types";

const pin = (device_id: string, x = 0, y = 0): Pin => ({
  id: `pin-${device_id}`,
  device_id,
  x,
  y,
  room_id: null,
  icon_override: null,
  label_override: device_id.toUpperCase(),
  height_m: null,
});

const floor = (
  floor_id: string,
  building_id: string | null = null,
): FloorMeta => ({
  floor_id,
  name: floor_id,
  level: 0,
  icon: null,
  has_layout: true,
  building_id,
  content_bounds: null,
});

const placement = (
  floor_id: string,
  over: Partial<PropertyPlacement> = {},
): PropertyPlacement => ({
  id: `placement-${floor_id}`,
  building_id: null,
  floor_id,
  label_override: null,
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotation_deg: 0,
  aspect_ratio: 1,
  source_bounds: { min_x: 0, min_y: 0, max_x: 100, max_y: 100 },
  ...over,
});

function context(over: Partial<MeshContext> = {}): MeshContext {
  return {
    networkType: null,
    zigbeeMesh: null,
    zigbeeShowAllLinks: false,
    wifiMesh: null,
    matterTopology: null,
    bluetoothAdverts: new Map(),
    bluetoothDevices: {},
    settings: emptySettings(),
    floors: [],
    currentFloorId: null,
    layout: emptyFloorLayout(),
    propertyLayout: emptyPropertyLayout(),
    pinByDeviceId: new Map(),
    outdoorPinByDeviceId: new Map(),
    otherFloorPinsByDeviceId: new Map(),
    entityLookup: new Map(),
    ...over,
  };
}

const wifi = (links: [string, string, number | null][]) => ({
  links: links.map(([source_device_id, target_device_id, rssi_dbm]) => ({
    source_device_id,
    target_device_id,
    rssi_dbm,
  })),
});

describe("normalizeMeshLinks", () => {
  it("draws nothing until a network layer is picked", () => {
    const ctx = context({ wifiMesh: wifi([["a", "b", -40]]) });
    expect(normalizeMeshLinks(ctx)).toEqual([]);
  });

  it("grades Wi-Fi links by signal and leaves an unmeasured one unknown", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([
        ["a", "ap", -40],
        ["b", "ap", -60],
        ["c", "ap", -80],
        ["d", "ap", null],
      ]),
    });
    expect(normalizeMeshLinks(ctx).map((l) => l.quality)).toEqual([
      "strong",
      "medium",
      "weak",
      "unknown",
    ]);
    expect(normalizeMeshLinks(ctx)[0]?.detail).toBe("-40 dBm");
    expect(normalizeMeshLinks(ctx)[3]).not.toHaveProperty("detail");
  });

  it("pairs each Bluetooth device with the scanner that heard it, never with itself", () => {
    const ctx = context({
      networkType: "bluetooth",
      bluetoothAdverts: new Map([
        ["AA", { address: "AA", source: "PROXY", rssi: -60, name: null }],
        [
          "PROXY",
          { address: "PROXY", source: "PROXY", rssi: null, name: null },
        ],
      ]),
      bluetoothDevices: { AA: ["sensor"], PROXY: ["proxy"] },
    });
    expect(normalizeMeshLinks(ctx)).toEqual([
      {
        sourceDeviceId: "sensor",
        targetDeviceId: "proxy",
        quality: "strong",
        detail: "RSSI -60 dBm",
        value: -60,
      },
    ]);
  });

  it("uses the Settings device for a Thread border router and skips unmapped nodes", () => {
    const node = (
      id: string,
      kind: MatterMeshNode["kind"],
      ha: string | null,
    ) => ({ id, kind, ha_device_id: ha }) as unknown as MatterMeshNode;
    const settings = {
      ...emptySettings(),
      thread_border_router_device_id: "hub",
    };
    const matterTopology = {
      nodes: [
        node("n1", "matter", "lamp"),
        node("br", "border_router", null),
        node("n2", "matter", null),
      ],
      connections: [
        { source: "n1", target: "br", strength: "strong" },
        { source: "n1", target: "n2", strength: "weak" },
      ],
    } as unknown as MeshContext["matterTopology"];
    const links = normalizeMeshLinks(
      context({ networkType: "matter", matterTopology, settings }),
    );
    expect(links).toEqual([
      {
        sourceDeviceId: "lamp",
        targetDeviceId: "hub",
        quality: "strong",
        detail: "strong",
      },
    ]);
  });

  it("shows the raw Zigbee readings only when they differ from the corrected value", () => {
    const link = (lqi: number, readings: number[]): MeshLink => ({
      source_ieee: "s",
      target_ieee: "t",
      lqi,
      lqi_readings: readings,
      parent_child: true,
      source_device_id: "a",
      target_device_id: "b",
    });
    const zigbee = (l: MeshLink) =>
      context({
        networkType: "zigbee",
        zigbeeMesh: { nodes: [], links: [l], fetched_at: 0 },
        pinByDeviceId: new Map([
          ["a", pin("a")],
          ["b", pin("b")],
        ]),
        currentFloorId: "up",
      });
    expect(normalizeMeshLinks(zigbee(link(200, [200, 200])))[0]?.detail).toBe(
      "LQI 200",
    );
    expect(normalizeMeshLinks(zigbee(link(60, [252, 60])))[0]?.detail).toBe(
      "LQI 60 (raw 252 / 60)",
    );
  });
});

describe("meshLinksForFloor", () => {
  it("keeps only links with both ends placed on the viewed floor", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([
        ["a", "b", -40],
        ["a", "away", -40],
      ]),
      pinByDeviceId: new Map([
        ["a", pin("a")],
        ["b", pin("b")],
      ]),
    });
    expect(meshLinksForFloor(ctx)).toHaveLength(1);
    expect(meshLinksForFloor(ctx)[0]?.toPin.device_id).toBe("b");
  });
});

describe("meshStubsForFloor", () => {
  const base = {
    networkType: "wifi" as const,
    wifiMesh: wifi([["here", "there", -40]]),
    currentFloorId: "up",
    pinByDeviceId: new Map([["here", pin("here", 10, 10)]]),
  };

  it("points straight at the device when both floors are one building", () => {
    const ctx = context({
      ...base,
      floors: [floor("up", "house"), floor("down", "house")],
      otherFloorPinsByDeviceId: new Map([
        ["there", { pin: pin("there", 55, 66), floorId: "down" }],
      ]),
    });
    const [stub] = meshStubsForFloor(ctx);
    expect(stub).toMatchObject({
      x: 55,
      y: 66,
      targetFloorId: "down",
      targetLabel: "THERE",
    });
  });

  it("leaves out a separate building that has never been placed on the property", () => {
    const ctx = context({
      ...base,
      floors: [floor("up"), floor("garage")],
      otherFloorPinsByDeviceId: new Map([
        ["there", { pin: pin("there"), floorId: "garage" }],
      ]),
    });
    expect(meshStubsForFloor(ctx)).toEqual([]);
  });

  it("aims at a separate building along its real bearing and stops at the plan's edge", () => {
    const layout = {
      ...emptyFloorLayout(),
      walls: [
        {
          id: "w",
          material: "glass",
          thickness_cm: null,
          points: [
            [0, 0],
            [100, 0],
            [100, 100],
          ],
        },
      ],
    } as unknown as MeshContext["layout"];
    const ctx = context({
      ...base,
      layout,
      floors: [floor("up"), floor("garage")],
      propertyLayout: {
        ...emptyPropertyLayout(),
        // The garage sits due east (+x) of the house on the site photo.
        placements: [
          placement("up", { x: 0, y: 0 }),
          placement("garage", { x: 500, y: 0 }),
        ],
      },
      pinByDeviceId: new Map([["here", pin("here", 50, 50)]]),
      otherFloorPinsByDeviceId: new Map([
        ["there", { pin: pin("there"), floorId: "garage" }],
      ]),
    });
    const [stub] = meshStubsForFloor(ctx);
    // Padded content box is 105 wide, so due east from x=50 exits at x=105.
    expect(stub?.x).toBeCloseTo(105);
    expect(stub?.y).toBeCloseTo(50);
  });

  it("maps an outdoor device through this floor's placement", () => {
    const ctx = context({
      ...base,
      floors: [floor("up")],
      propertyLayout: {
        ...emptyPropertyLayout(),
        placements: [placement("up", { x: 100, y: 100 })],
      },
      outdoorPinByDeviceId: new Map([["there", pin("there", 100, 100)]]),
    });
    const [stub] = meshStubsForFloor(ctx);
    // The placement's centre (100, 100) is the middle of its 0..100 footprint.
    expect(stub).toMatchObject({ x: 50, y: 50, targetFloorName: "Outside" });
  });

  it("draws nothing for a link with both ends on this floor, or neither", () => {
    const ctx = context({
      ...base,
      pinByDeviceId: new Map([
        ["here", pin("here")],
        ["there", pin("there")],
      ]),
    });
    expect(meshStubsForFloor(ctx)).toEqual([]);
  });
});

describe("propertyMeshLinks", () => {
  it("draws only links with an outdoor end, placing the indoor end inside its building", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([
        ["gate", "router", -40],
        ["router", "lamp", -40],
      ]),
      currentFloorId: "up",
      floors: [floor("up")],
      propertyLayout: {
        ...emptyPropertyLayout(),
        placements: [placement("up", { x: 200, y: 200 })],
      },
      pinByDeviceId: new Map([["router", pin("router", 50, 50)]]),
      outdoorPinByDeviceId: new Map([["gate", pin("gate", 10, 20)]]),
    });
    const links = propertyMeshLinks(ctx);
    expect(links).toHaveLength(1);
    expect(links[0]?.from).toMatchObject({ x: 10, y: 20, floorId: null });
    expect(links[0]?.to).toMatchObject({ x: 200, y: 200, floorId: "up" });
  });
});

describe("floorContentBounds", () => {
  it("is null for an empty floor and padded by 5% otherwise", () => {
    expect(floorContentBounds(emptyFloorLayout())).toBeNull();
    const layout = {
      ...emptyFloorLayout(),
      rooms: [
        {
          id: "r",
          name: "x",
          points: [
            [0, 0],
            [200, 0],
            [200, 100],
          ],
        },
      ],
    } as unknown as MeshContext["layout"];
    expect(floorContentBounds(layout)).toEqual({
      minX: -10,
      minY: -10,
      maxX: 210,
      maxY: 110,
    });
  });
});

describe("legend", () => {
  const here = new Map([["here", pin("here", 10, 10)]]);
  const remote = new Map([
    ["there", { pin: pin("there", 55, 66), floorId: "down" }],
  ]);

  it("is hidden until a layer is picked", () => {
    expect(floorMeshLegend(context())).toBeNull();
    expect(propertyMeshLegend(context())).toBeNull();
  });

  it("always names the network but only keys what the floor view draws", () => {
    const plain = context({
      networkType: "wifi",
      wifiMesh: wifi([["here", "also", -40]]),
      pinByDeviceId: new Map([...here, ["also", pin("also")]]),
    });
    expect(floorMeshLegend(plain)).toEqual({
      network: "wifi",
      dashed: null,
      unknown: false,
      range: null,
    });
  });

  it("keys dashed lines when a link runs to another floor", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([["here", "there", -40]]),
      currentFloorId: "up",
      floors: [floor("up", "house"), floor("down", "house")],
      pinByDeviceId: here,
      otherFloorPinsByDeviceId: remote,
    });
    expect(floorMeshLegend(ctx)?.dashed).toBe("floor");
  });

  it("keys the grey line only for a link with no reading", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([["here", "also", null]]),
      pinByDeviceId: new Map([...here, ["also", pin("also")]]),
    });
    expect(floorMeshLegend(ctx)?.unknown).toBe(true);
  });

  it("keys dashed lines on the Property tab only for links into a building", () => {
    const base = {
      networkType: "wifi" as const,
      currentFloorId: "up",
      floors: [floor("up")],
      propertyLayout: {
        ...emptyPropertyLayout(),
        placements: [placement("up", { x: 200, y: 200 })],
      },
      outdoorPinByDeviceId: new Map([["gate", pin("gate", 10, 20)]]),
    };
    const indoor = context({
      ...base,
      wifiMesh: wifi([["gate", "router", -40]]),
      pinByDeviceId: new Map([["router", pin("router", 50, 50)]]),
    });
    expect(propertyMeshLegend(indoor)?.dashed).toBe("property");
    const outdoorOnly = context({
      ...base,
      wifiMesh: wifi([["gate", "post", -40]]),
      outdoorPinByDeviceId: new Map([
        ["gate", pin("gate")],
        ["post", pin("post")],
      ]),
    });
    expect(propertyMeshLegend(outdoorOnly)?.dashed).toBeNull();
  });
});

describe("legend range", () => {
  const two = new Map([
    ["a", pin("a")],
    ["b", pin("b")],
    ["c", pin("c")],
  ]);

  it("labels the ends with the weakest and strongest readings drawn", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([
        ["a", "b", -80],
        ["a", "c", -45],
        ["b", "c", -60],
      ]),
      pinByDeviceId: two,
    });
    expect(floorMeshLegend(ctx)?.range).toEqual({
      min: -80,
      max: -45,
      unit: "dbm",
    });
  });

  it("counts only the links drawn in this view", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([
        ["a", "b", -80],
        ["a", "away", -30],
      ]),
      pinByDeviceId: new Map([
        ["a", pin("a")],
        ["b", pin("b")],
      ]),
    });
    // The -30 link ends at a device that isn't placed anywhere, so it is not drawn.
    expect(floorMeshLegend(ctx)?.range).toBeNull();
  });

  it("uses LQI for Zigbee and gives nothing for Matter", () => {
    const zlink = (lqi: number, target: string): MeshLink => ({
      source_ieee: "s",
      target_ieee: target,
      lqi,
      lqi_readings: [lqi],
      parent_child: true,
      source_device_id: "a",
      target_device_id: target,
    });
    const zigbee = context({
      networkType: "zigbee",
      zigbeeMesh: {
        nodes: [],
        links: [zlink(55, "b"), zlink(145, "c")],
        fetched_at: 0,
      },
      currentFloorId: "up",
      pinByDeviceId: two,
    });
    expect(floorMeshLegend(zigbee)?.range).toEqual({
      min: 55,
      max: 145,
      unit: "lqi",
    });
    expect(
      floorMeshLegend(context({ networkType: "matter", pinByDeviceId: two }))
        ?.range,
    ).toBeNull();
  });

  it("gives no range when every link reads the same", () => {
    const ctx = context({
      networkType: "wifi",
      wifiMesh: wifi([
        ["a", "b", -60],
        ["a", "c", -60],
      ]),
      pinByDeviceId: two,
    });
    expect(floorMeshLegend(ctx)?.range).toBeNull();
  });
});
