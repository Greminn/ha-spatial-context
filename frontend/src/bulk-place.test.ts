import { describe, expect, it } from "vitest";
import {
  bulkCounts,
  bulkSpacing,
  confirmPin,
  devicesWithAreas,
  distributeInPolygon,
  labelPoint,
  nextToArm,
  planBulkPlacement,
  polygonArea,
  roomForEachArea,
  unplacedDevices,
} from "./bulk-place";
import { pointInPolygon } from "./canvas/geometry";
import type { PlaceableEntity, Room } from "./types";

const square = (x: number, y: number, s: number): [number, number][] => [
  [x, y],
  [x + s, y],
  [x + s, y + s],
  [x, y + s],
];
const lShape: [number, number][] = [
  [0, 0],
  [100, 0],
  [100, 30],
  [30, 30],
  [30, 100],
  [0, 100],
];
const room = (id: string, area_id: string | null, points: [number, number][]) =>
  ({ id, name: "", area_id, points }) as Room;
const entity = (
  entity_id: string,
  device_id: string | null,
  area_id: string | null,
  extra: Partial<PlaceableEntity> = {},
) =>
  ({
    entity_id,
    name: entity_id,
    domain: entity_id.split(".")[0],
    device_class: null,
    area_id,
    area_name: null,
    device_id,
    device_name: null,
    entity_category: null,
    integration_domain: null,
    integration_name: null,
    placed_floor_id: null,
    placed_floor_name: null,
    ...extra,
  }) as PlaceableEntity;

const minGap = (pts: [number, number][]) => {
  let min = Infinity;
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 1; j < pts.length; j++)
      min = Math.min(
        min,
        Math.hypot(pts[i]![0] - pts[j]![0], pts[i]![1] - pts[j]![1]),
      );
  return min;
};

describe("polygonArea", () => {
  it("is the shoelace area either winding", () => {
    expect(polygonArea(square(0, 0, 10))).toBe(100);
    expect(polygonArea([...square(0, 0, 10)].reverse())).toBe(100);
    expect(polygonArea(lShape)).toBe(100 * 30 + 30 * 70);
  });
});

describe("distributeInPolygon", () => {
  it("starts at the pole of inaccessibility", () => {
    const [first] = distributeInPolygon(square(0, 0, 100), 1, 10);
    expect(first).toEqual(labelPoint(square(0, 0, 100)));
  });

  it("keeps every point inside and at least the spacing apart", () => {
    const pts = distributeInPolygon(square(0, 0, 100), 20, 10);
    expect(pts).toHaveLength(20);
    for (const [x, y] of pts)
      expect(pointInPolygon(x, y, square(0, 0, 100))).toBe(true);
    expect(minGap(pts)).toBeGreaterThanOrEqual(9.99);
  });

  it("stays inside a concave room", () => {
    const pts = distributeInPolygon(lShape, 15, 8);
    expect(pts).toHaveLength(15);
    for (const [x, y] of pts) expect(pointInPolygon(x, y, lShape)).toBe(true);
  });

  it("keeps clear of pins already there", () => {
    const pole = labelPoint(square(0, 0, 100));
    const pts = distributeInPolygon(square(0, 0, 100), 3, 10, [pole]);
    for (const [x, y] of pts)
      expect(Math.hypot(x - pole[0], y - pole[1])).toBeGreaterThanOrEqual(9.99);
  });

  it("tightens the spacing when the room is too small", () => {
    const pts = distributeInPolygon(square(0, 0, 10), 9, 10);
    expect(pts).toHaveLength(9);
    expect(minGap(pts)).toBeGreaterThan(0);
    for (const [x, y] of pts)
      expect(pointInPolygon(x, y, square(0, 0, 10))).toBe(true);
  });

  it("stacks on the pole as a last resort", () => {
    const tiny = square(0, 0, 1);
    const pts = distributeInPolygon(tiny, 50, 10);
    const pole = labelPoint(tiny);
    expect(pts).toHaveLength(50);
    expect(pts.every(([x, y]) => x === pole[0] && y === pole[1])).toBe(true);
  });

  it("is deterministic", () => {
    expect(distributeInPolygon(lShape, 12, 7)).toEqual(
      distributeInPolygon(lShape, 12, 7),
    );
  });

  it("returns nothing for nothing", () => {
    expect(distributeInPolygon(square(0, 0, 10), 0, 1)).toEqual([]);
    expect(distributeInPolygon([[0, 0]], 3, 1)).toEqual([]);
  });
});

describe("bulkSpacing", () => {
  it("is half a metre when calibrated", () => {
    expect(bulkSpacing(square(0, 0, 100), 4, 40)).toBe(20);
  });
  it("is proportional to the room otherwise", () => {
    const few = bulkSpacing(square(0, 0, 100), 2, null);
    const many = bulkSpacing(square(0, 0, 100), 50, null);
    expect(few).toBeGreaterThan(many);
    expect(few).toBeLessThanOrEqual(100 / 3);
  });
});

describe("devicesWithAreas / unplacedDevices", () => {
  const entities = [
    entity("light.a", "dev-a", "kitchen"),
    entity("sensor.a_battery", "dev-a", "kitchen", {
      entity_category: "diagnostic",
    }),
    entity("switch.b", "dev-b", "lounge"),
    entity("sensor.c", "dev-c", "kitchen", { placed_floor_id: "upstairs" }),
    entity("sensor.d", "dev-d", "kitchen"),
    entity("sensor.orphan", null, "kitchen"),
  ];

  it("groups per device and skips device-less entities", () => {
    const devices = devicesWithAreas(entities);
    expect(devices.map((d) => d.deviceId).sort()).toEqual([
      "dev-a",
      "dev-b",
      "dev-c",
      "dev-d",
    ]);
    expect(devices.find((d) => d.deviceId === "dev-a")!.entityId).toBe(
      "light.a",
    );
  });

  it("drops placed (here or elsewhere) and hidden devices", () => {
    const devices = unplacedDevices(
      entities,
      new Set(["dev-b"]),
      new Set(["dev-d"]),
      "ground",
    );
    expect(devices.map((d) => d.deviceId)).toEqual(["dev-a"]);
  });
});

describe("planBulkPlacement", () => {
  const rooms = [
    room("r-kitchen", "kitchen", square(0, 0, 100)),
    room("r-lounge", "lounge", square(200, 0, 100)),
    room("r-none", null, square(400, 0, 100)),
  ];
  const devices = [
    { deviceId: "k2", entityId: "e.k2", areaId: "kitchen" },
    { deviceId: "k1", entityId: "e.k1", areaId: "kitchen" },
    { deviceId: "l1", entityId: "e.l1", areaId: "lounge" },
    { deviceId: "x1", entityId: "e.x1", areaId: "garage" },
    { deviceId: "n1", entityId: "e.n1", areaId: null },
  ];

  it("puts each device into its area's room", () => {
    const spots = planBulkPlacement({
      rooms,
      devices,
      unitsPerMeter: 20,
      occupied: [],
    });
    expect(spots.map((s) => [s.deviceId, s.roomId])).toEqual([
      ["k1", "r-kitchen"],
      ["k2", "r-kitchen"],
      ["l1", "r-lounge"],
    ]);
    for (const s of spots) {
      const r = rooms.find((x) => x.id === s.roomId)!;
      expect(pointInPolygon(s.x, s.y, r.points)).toBe(true);
    }
  });

  it("can be limited to one area", () => {
    const spots = planBulkPlacement({
      rooms,
      devices,
      unitsPerMeter: null,
      occupied: [],
      areaId: "lounge",
    });
    expect(spots.map((s) => s.deviceId)).toEqual(["l1"]);
  });

  it("uses the largest room when an area is linked twice", () => {
    const linked = roomForEachArea([
      room("small", "kitchen", square(0, 0, 10)),
      room("big", "kitchen", square(50, 0, 40)),
    ]);
    expect(linked.get("kitchen")!.id).toBe("big");
  });

  it("counts per area", () => {
    expect([...bulkCounts(rooms, devices)]).toEqual([
      ["kitchen", 2],
      ["lounge", 1],
    ]);
  });
});

describe("nextToArm", () => {
  const rows = [
    { entityId: "a", placed: false },
    { entityId: "b", placed: true },
    { entityId: "c", placed: false },
  ];
  it("arms the next unplaced row after the one just placed", () => {
    expect(nextToArm(rows, "a")).toBe("c");
  });
  it("wraps around", () => {
    expect(nextToArm(rows, "c")).toBe("a");
  });
  it("starts from the top when the placed row left the list", () => {
    expect(nextToArm(rows, "gone")).toBe("a");
  });
  it("is null when everything is placed", () => {
    expect(nextToArm([{ entityId: "a", placed: true }], "a")).toBeNull();
  });
});

describe("confirmPin", () => {
  it("drops the flag and leaves the rest", () => {
    const pin = { id: "p", x: 1, approximate: true };
    expect(confirmPin(pin)).toEqual({ id: "p", x: 1 });
    expect("approximate" in confirmPin(pin)).toBe(false);
  });
  it("returns an unflagged pin unchanged", () => {
    const pin: { id: string; x: number; approximate?: boolean } = {
      id: "p",
      x: 1,
    };
    expect(confirmPin(pin)).toBe(pin);
  });
});
