import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { HaClient } from "./ha-client";
import type {
  BluetoothAdvertisement,
  MatterNetworkTopology,
  NetworkType,
  WifiMesh,
  ZigbeeMesh,
} from "./types";
import { debugLog } from "./debug-log";
import { localize } from "./i18n";

/** The Connectivity Map's raw data: which network layer is picked and what
 * each one has loaded, with the timers and live subscriptions that keep it
 * fresh. Owned by the panel as a Lit controller, so a change re-renders the
 * panel and leaving the panel cleans everything up. Turning this raw data
 * into lines on the plan is mesh-resolve.ts's job. */
export class MeshDataController implements ReactiveController {
  /** null = no layer picked — the Connectivity Map's neutral starting
   * state, both on first load and every time the popover is reopened.
   * Nothing should read as "on" until the user explicitly picks one. */
  networkType: NetworkType | null = null;

  zigbeeMesh: ZigbeeMesh | null = null;
  zigbeeLoading = false;
  zigbeeError: string | null = null;
  zigbeeFetchedAt: number | null = null;
  /** Ticks once a second while the Zigbee fetch is in flight — the request
   * genuinely takes 90-130+ seconds (a live over-the-air neighbor-table
   * poll via Z2M/MQTT), and with nothing on screen changing for that long,
   * a static "Refreshing…" label is indistinguishable from a hung/broken
   * request. A live counter is the difference between "still working" and
   * "looks stuck" for something this slow. */
  zigbeeElapsedSeconds = 0;
  private _zigbeeTimer: number | null = null;
  private _zigbeeShowAll = false;

  wifiMesh: WifiMesh | null = null;
  wifiLoading = false;
  wifiError: string | null = null;

  matterTopology: MatterNetworkTopology | null = null;
  matterError: string | null = null;
  private _matterUnsubscribe: (() => void) | null = null;

  /** Bluetooth layer (#4): latest advertisement per BLE address, published
   * from a buffer every couple of seconds — HA streams one message per
   * advertisement, far more often than the map needs redrawing. */
  bluetoothAdverts: Map<string, BluetoothAdvertisement> = new Map();
  bluetoothDevices: Record<string, string[]> = {};
  bluetoothError: string | null = null;
  private _bluetoothBuffer: Map<string, BluetoothAdvertisement> = new Map();
  private _bluetoothFlushTimer: number | null = null;
  private _bluetoothUnsubscribe: (() => void) | null = null;

  constructor(
    private readonly _host: ReactiveControllerHost,
    private readonly _client: () => HaClient,
  ) {
    _host.addController(this);
  }

  hostDisconnected(): void {
    this._unsubscribeMatter();
    this._unsubscribeBluetooth();
    if (this._zigbeeTimer !== null) {
      window.clearInterval(this._zigbeeTimer);
      this._zigbeeTimer = null;
    }
  }

  /** Full neighbor table instead of selectZigbeeLinks' default pick. */
  get zigbeeShowAllLinks(): boolean {
    return this._zigbeeShowAll;
  }

  set zigbeeShowAllLinks(value: boolean) {
    this._zigbeeShowAll = value;
    this._host.requestUpdate();
  }

  /** Whether a live subscription is running for the picked layer (the
   * "Live" badge). */
  get live(): boolean {
    return (
      (this.networkType === "matter" && this._matterUnsubscribe !== null) ||
      (this.networkType === "bluetooth" && this._bluetoothUnsubscribe !== null)
    );
  }

  /** The error to show for the picked layer, if any. */
  get error(): string | null {
    return this.networkType === "zigbee"
      ? this.zigbeeError
      : this.networkType === "wifi"
        ? this.wifiError
        : this.networkType === "bluetooth"
          ? this.bluetoothError
          : this.matterError;
  }

  // Picking a layer shows it straight away wherever that's cheap: Wi-Fi is
  // read from entity states and Matter is a live subscription, both
  // near-instant, so they load on pick with no button. Zigbee only ever
  // shows the backend's cache on pick (cache_only — never a scan); a real
  // scan (~90s+) still needs an explicit Load/Refresh click (loadZigbee).
  select(picked: NetworkType): void {
    // Tapping the layer that's already on turns the overlay off.
    const type = this.networkType === picked ? null : picked;
    if (this.networkType === "matter" && type !== "matter") {
      this._unsubscribeMatter();
    }
    if (this.networkType === "bluetooth" && type !== "bluetooth") {
      this._unsubscribeBluetooth();
    }
    this.networkType = type;
    this._host.requestUpdate();
    if (type === "wifi") void this.refreshWifi();
    else if (type === "matter") void this.subscribeMatter();
    else if (type === "bluetooth") void this.subscribeBluetooth();
    else if (type === "zigbee") void this._loadCachedZigbee();
  }

  /** The Load / Refresh button. Reuses the exact same "already fetched
   * once" check the button's own label (Load vs Refresh) is driven by, so
   * the label and the actual force-refresh behavior can't drift apart —
   * force_refresh only on an explicit "Refresh" click, never on the
   * initial "Load" open (which should prefer any pre-warmed cache, see
   * zigbee_mesh.py). */
  loadZigbee(): void {
    void this.refreshZigbee(this.zigbeeFetchedAt !== null);
  }

  /** Shows a warm backend cache (e.g. from an earlier visit, or pre-warmed
   * by the refresh_zigbee_mesh service) without the user having to click
   * Load — and picks up a newer one than this tab holds, e.g. a scheduled
   * refresh that ran while the panel stayed open. Silent on failure — the
   * Load button is still there. */
  private async _loadCachedZigbee(): Promise<void> {
    try {
      const cached = await this._client().getCachedZigbeeMesh();
      // A real scan in flight wins over this cache read.
      if (!cached?.fetched_at || this.zigbeeLoading) return;
      const cachedAt = cached.fetched_at * 1000;
      if (this.zigbeeFetchedAt && cachedAt <= this.zigbeeFetchedAt) {
        return;
      }
      this.zigbeeMesh = cached;
      this.zigbeeFetchedAt = cachedAt;
      this._host.requestUpdate();
    } catch {
      // Transient error — no-op.
    }
  }

  async refreshZigbee(forceRefresh = false): Promise<void> {
    this.zigbeeLoading = true;
    this.zigbeeError = null;
    const startedAt = Date.now();
    this.zigbeeElapsedSeconds = 0;
    this._host.requestUpdate();
    this._zigbeeTimer = window.setInterval(() => {
      this.zigbeeElapsedSeconds = Math.round((Date.now() - startedAt) / 1000);
      this._host.requestUpdate();
    }, 1000);
    try {
      this.zigbeeMesh = await this._client().getZigbeeMesh(forceRefresh);
      debugLog.log("mesh_load", {
        network: "zigbee",
        force_refresh: forceRefresh,
        ms: Date.now() - startedAt,
        links: this.zigbeeMesh.links.length,
        nodes: this.zigbeeMesh.nodes.length,
      });
      // Backend uses time.time() (epoch seconds) — convert to ms to match
      // Date.now(), which the age label expects. A cache hit can be well
      // in the past (e.g. pre-warmed overnight by the refresh_zigbee_mesh
      // service), not "just now".
      this.zigbeeFetchedAt = this.zigbeeMesh.fetched_at
        ? this.zigbeeMesh.fetched_at * 1000
        : Date.now();
    } catch (err) {
      const message = meshErrorMessage(err, localize("errors.zigbeeFailed"));
      this.zigbeeError = message;
      debugLog.log("mesh_error", { network: "zigbee", error: message });
    } finally {
      this.zigbeeLoading = false;
      if (this._zigbeeTimer !== null) {
        window.clearInterval(this._zigbeeTimer);
        this._zigbeeTimer = null;
      }
      this._host.requestUpdate();
    }
  }

  async refreshWifi(): Promise<void> {
    this.wifiLoading = true;
    this.wifiError = null;
    this._host.requestUpdate();
    try {
      this.wifiMesh = await this._client().getWifiMesh();
      debugLog.log("mesh_load", {
        network: "wifi",
        links: this.wifiMesh.links.length,
      });
    } catch (err) {
      const message = meshErrorMessage(err, localize("errors.wifiFailed"));
      this.wifiError = message;
      debugLog.log("mesh_error", { network: "wifi", error: message });
    } finally {
      this.wifiLoading = false;
      this._host.requestUpdate();
    }
  }

  async subscribeMatter(): Promise<void> {
    this._unsubscribeMatter();
    this.matterError = null;
    this._host.requestUpdate();
    try {
      this._matterUnsubscribe = await this._client().subscribeMatterTopology(
        (topology) => {
          this.matterTopology = topology;
          this._host.requestUpdate();
        },
      );
    } catch (err) {
      this.matterError = meshErrorMessage(err, localize("errors.matterFailed"));
    }
    this._host.requestUpdate();
  }

  private _unsubscribeMatter(): void {
    this._matterUnsubscribe?.();
    this._matterUnsubscribe = null;
  }

  async subscribeBluetooth(): Promise<void> {
    this._unsubscribeBluetooth();
    this.bluetoothError = null;
    this._bluetoothBuffer = new Map();
    this.bluetoothAdverts = new Map();
    this._host.requestUpdate();
    let coreStream = false;
    try {
      this.bluetoothDevices = (
        await this._client().getBluetoothDevices()
      ).devices;
      this._host.requestUpdate();
      // Past this point an unknown command is HA core's own (the stream
      // arrived in HA 2025.2), not ours — so it's HA that's too old.
      coreStream = true;
      this._bluetoothUnsubscribe =
        await this._client().subscribeBluetoothAdvertisements((event) => {
          for (const advert of event.add ?? []) {
            this._bluetoothBuffer.set(advert.address, {
              address: advert.address,
              source: advert.source,
              rssi: advert.rssi,
              name: advert.name,
            });
          }
          for (const { address } of event.remove ?? []) {
            this._bluetoothBuffer.delete(address);
          }
          this._bluetoothFlushTimer ??= window.setTimeout(() => {
            this._bluetoothFlushTimer = null;
            this.bluetoothAdverts = new Map(this._bluetoothBuffer);
            this._host.requestUpdate();
          }, 2000);
        });
      // Show the first snapshot straight away rather than after the delay.
      window.setTimeout(() => {
        this.bluetoothAdverts = new Map(this._bluetoothBuffer);
        this._host.requestUpdate();
        debugLog.log("mesh_load", {
          network: "bluetooth",
          adverts: this._bluetoothBuffer.size,
          known_addresses: Object.keys(this.bluetoothDevices).length,
        });
      }, 300);
    } catch (err) {
      // HA allows the advertisement stream for admins only.
      this.bluetoothError =
        coreStream && (err as { code?: string })?.code === "unknown_command"
          ? localize("errors.bluetoothVersion")
          : meshErrorMessage(err, localize("errors.bluetoothFailed"));
      debugLog.log("mesh_error", {
        network: "bluetooth",
        error: this.bluetoothError,
      });
      this._host.requestUpdate();
    }
  }

  private _unsubscribeBluetooth(): void {
    this._bluetoothUnsubscribe?.();
    this._bluetoothUnsubscribe = null;
    if (this._bluetoothFlushTimer !== null) {
      window.clearTimeout(this._bluetoothFlushTimer);
      this._bluetoothFlushTimer = null;
    }
  }
}

/** A Connectivity Map error, worded as what to do about it. An unknown
 * command means the panel is newer than the backend HA is running (it
 * was updated without a restart yet). */
export function meshErrorMessage(err: unknown, fallback: string): string {
  const { code, message } = (err ?? {}) as {
    code?: string;
    message?: string;
  };
  if (code === "unknown_command") {
    return localize("errors.restartHa");
  }
  if (code === "unauthorized") {
    return localize("errors.needsAdmin");
  }
  return message || fallback;
}
