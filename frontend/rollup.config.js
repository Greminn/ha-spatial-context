import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)),
);
const isDev =
  process.env.ROLLUP_WATCH === "true" || process.env.NODE_ENV === "development";

// Unique per build — baked into the bundle and written next to it, so the
// panel can tell when the browser is running an older build than the one
// installed (see frontend/src/version-check.ts and frontend.py).
const buildId = `${pkg.version}+${Date.now().toString(36)}`;
const outFile =
  "../custom_components/spatial_context/www/spatial-context-panel.js";

/** Writes www/mdi-index.json — every non-deprecated Material Design Icon
 * name with its aliases and tags, for the icon picker's search. A separate
 * file fetched when the picker first opens, so it doesn't weigh down every
 * panel load. Built from @mdi/svg pinned to the version Home Assistant
 * itself ships, so every listed name is one HA's <ha-icon> can draw. */
const writeIconIndex = () => ({
  name: "write-icon-index",
  writeBundle() {
    const meta = createRequire(import.meta.url)("@mdi/svg/meta.json");
    const index = meta
      .filter((icon) => !icon.deprecated)
      .map((icon) => [
        icon.name,
        [...icon.aliases, ...icon.tags].join(" ").toLowerCase(),
      ]);
    writeFileSync(
      outFile.replace(/spatial-context-panel\.js$/, "mdi-index.json"),
      JSON.stringify(index),
    );
  },
});

/** Writes www/spatial-context-panel.build.json alongside the bundle. */
const writeBuildInfo = () => ({
  name: "write-build-info",
  writeBundle() {
    writeFileSync(
      outFile.replace(/\.js$/, ".build.json"),
      JSON.stringify({ version: pkg.version, build_id: buildId }) + "\n",
    );
  },
});

const mapDir = "../custom_components/spatial_context/www/map";

/** Copies the MapLibre files the lazily loaded map module needs beside it:
 * the worker (plus the shared chunk it imports) is loaded by URL, not
 * bundled, and the stylesheet is linked into the panel's shadow root. */
const copyMapLibreFiles = () => ({
  name: "copy-maplibre-files",
  writeBundle() {
    const dist = createRequire(import.meta.url).resolve(
      "maplibre-gl/package.json",
    );
    const dir = dist.replace(/package\.json$/, "dist/");
    mkdirSync(mapDir, { recursive: true });
    for (const file of [
      "maplibre-gl-worker.mjs",
      "maplibre-gl-shared.mjs",
      "maplibre-gl.css",
    ]) {
      copyFileSync(dir + file, `${mapDir}/${file}`);
    }
  },
});

/** The map module: MapLibre + the Shortbread style builder + glue, loaded
 * on demand by the Property canvas so the panel itself stays light. */
const mapModule = {
  input: "src/map/map-glue.ts",
  output: {
    file: `${mapDir}/spatial-context-map.mjs`,
    format: "es",
    sourcemap: isDev,
  },
  plugins: [
    nodeResolve({ browser: true, extensions: [".js", ".ts", ".mjs"] }),
    commonjs(),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      noEmitOnError: !isDev,
      compilerOptions: {
        noEmit: false,
        declaration: false,
        sourceMap: isDev,
        outDir: mapDir,
      },
      outputToFilesystem: false,
    }),
    copyMapLibreFiles(),
    !isDev && terser({ module: true, format: { comments: /^!/ } }),
  ].filter(Boolean),
};

const panel = {
  input: "src/index.ts",
  output: {
    file: outFile,
    format: "iife",
    name: "SpatialContextPanelBundle",
    sourcemap: isDev,
    banner: `/*! spatial-context-panel v${pkg.version} | ${pkg.license} */`,
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        __VERSION__: JSON.stringify(pkg.version),
        __BUILD_ID__: JSON.stringify(buildId),
      },
    }),
    nodeResolve({ browser: true, extensions: [".js", ".ts", ".mjs"] }),
    commonjs(),
    json(),
    typescript({
      tsconfig: "./tsconfig.json",
      noEmitOnError: !isDev,
      compilerOptions: {
        noEmit: false,
        declaration: false,
        sourceMap: isDev,
        outDir: "../custom_components/spatial_context/www",
      },
      outputToFilesystem: false,
    }),
    writeBuildInfo(),
    writeIconIndex(),
    !isDev &&
      terser({
        format: { comments: /^!/ },
      }),
  ].filter(Boolean),
};

export default [panel, mapModule];
