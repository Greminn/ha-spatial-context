#!/usr/bin/env node
// rsync (over SSH) the built panel bundle to the configured HA host, straight
// into the integration's own already-deployed www/ directory. With --watch,
// re-rsyncs on every bundle change.
//
// This is a convenience for the specific case of an SSH-reachable HA host —
// it is NOT required. If you don't have SSH access (HA OS without an SSH
// add-on, Cloud-managed, etc.), just run `npm run build` and copy the one
// resulting file, custom_components/spatial_context/www/spatial-context-panel.js,
// onto your HA instance however you can reach its config directory (Samba,
// the File editor/Studio Code Server add-on, etc.) — see the README's
// Development section.
//
// Configured via .env at frontend/ root:
//   HA_HOST      — SSH alias or user@host (e.g. "user@homeassistant.local")
//   HA_DEV_PATH  — absolute path on HA, must end with "/"
//                  (e.g. "/config/custom_components/spatial_context/www/")
//
// Usage:
//   npm run push          (one-shot)
//   npm run push:watch    (watch + re-rsync; used internally by `npm run dev`)

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import chokidar from "chokidar";
import "dotenv/config";

const FRONTEND_ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);
const BUNDLE_PATH = resolve(
  FRONTEND_ROOT,
  "..",
  "custom_components/spatial_context/www/spatial-context-panel.js",
);

const { HA_HOST, HA_DEV_PATH } = process.env;

if (!HA_HOST || !HA_DEV_PATH) {
  console.error(
    [
      "[push] HA_HOST or HA_DEV_PATH not set.",
      "       Copy .env.example to .env and fill in both, e.g.",
      "         HA_HOST=user@homeassistant.local",
      "         HA_DEV_PATH=/config/custom_components/spatial_context/www/",
      "",
      "       No SSH access to your HA host? Skip this script — just copy",
      "       spatial-context-panel.js onto HA yourself (Samba, the File",
      "       editor add-on, etc.). See the README's Development section.",
    ].join("\n"),
  );
  process.exit(1);
}

if (!HA_DEV_PATH.endsWith("/")) {
  console.error(`[push] HA_DEV_PATH must end with "/" (got "${HA_DEV_PATH}").`);
  process.exit(1);
}

const watchMode = process.argv.includes("--watch");
const target = `${HA_HOST}:${HA_DEV_PATH}`;

function rsyncOnce({ verbose } = { verbose: false }) {
  const args = [verbose ? "-av" : "-a", BUNDLE_PATH, target];
  const result = spawnSync("rsync", args, { stdio: "inherit" });
  if (result.error?.code === "ENOENT") {
    console.error("[push] rsync not found on PATH. Install rsync and retry.");
    process.exit(1);
  }
  return result.status === 0;
}

if (!watchMode) {
  console.info(`[push] syncing to ${target}`);
  process.exit(rsyncOnce({ verbose: true }) ? 0 : 1);
}

console.info(`[push] watching ${BUNDLE_PATH}, syncing to ${target}`);
const ok = rsyncOnce();
if (!ok) {
  console.error("[push] initial sync failed; continuing to watch anyway.");
}

let pending = false;

chokidar
  .watch(BUNDLE_PATH, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 100 },
  })
  .on("all", () => {
    if (pending) return;
    pending = true;
    queueMicrotask(() => {
      pending = false;
      console.info("[push] bundle changed, syncing...");
      rsyncOnce();
    });
  });

// Make Ctrl-C clean.
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => process.exit(0));
}
