import { describe, expect, it, vi } from "vitest";
import {
  PANEL_BUNDLE_PATH,
  panelBundleUrls,
  reloadFresh,
  restartRequired,
} from "./reload-fresh";
import type { VersionInfo } from "./types";

const docWith = (srcs: string[]) =>
  ({
    querySelectorAll: () => srcs.map((src) => ({ src })),
  }) as unknown as Pick<Document, "querySelectorAll">;

describe("panelBundleUrls", () => {
  it("includes the bare path and each loaded bundle URL, nothing else", () => {
    const urls = panelBundleUrls(
      docWith([
        "https://ha.local:8123/frontend_latest/app.js",
        "https://ha.local:8123/spatial_context_panel.js?v=1794070000",
      ]),
    );
    expect(urls).toEqual([
      PANEL_BUNDLE_PATH,
      "https://ha.local:8123/spatial_context_panel.js?v=1794070000",
    ]);
  });

  it("falls back to the bare path when no script matches", () => {
    expect(panelBundleUrls(docWith([]))).toEqual([PANEL_BUNDLE_PATH]);
  });
});

describe("reloadFresh", () => {
  it("refetches every URL with cache: reload before reloading", async () => {
    const order: string[] = [];
    const fetchFn = vi.fn(async (url: string, init: RequestInit) => {
      expect(init.cache).toBe("reload");
      order.push(`fetch ${url}`);
    });
    await reloadFresh(["/a.js", "/b.js?v=1"], fetchFn, () =>
      order.push("reload"),
    );
    expect(order).toEqual(["fetch /a.js", "fetch /b.js?v=1", "reload"]);
  });

  it("still reloads when a fetch fails", async () => {
    const reload = vi.fn();
    await reloadFresh(
      ["/a.js"],
      async () => {
        throw new Error("offline");
      },
      reload,
    );
    expect(reload).toHaveBeenCalledOnce();
  });
});

describe("restartRequired", () => {
  const base: VersionInfo = {
    loaded_version: "1.0.1-beta.4",
    installed_version: "1.0.1-beta.5",
    panel_build_id: "1.0.1-beta.5+x",
  };

  it("trusts the backend's answer, so a panel-only release needs no restart", () => {
    expect(restartRequired({ ...base, restart_required: false })).toBe(false);
    expect(
      restartRequired({
        ...base,
        installed_version: base.loaded_version,
        restart_required: true,
      }),
    ).toBe(true);
  });

  it("falls back to comparing versions on an older backend", () => {
    expect(restartRequired(base)).toBe(true);
    expect(
      restartRequired({ ...base, installed_version: base.loaded_version }),
    ).toBe(false);
  });
});
