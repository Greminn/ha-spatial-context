import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { readFileSync, writeFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)),
);
const isDev =
  process.env.ROLLUP_WATCH === "true" || process.env.NODE_ENV === "development";

// Unique per build — baked into the bundle and written next to it, so the
// panel can tell when the browser is running an older build than the one
// installed (see frontend/src/version-check.ts and frontend.py).
const buildId = `${pkg.version}+${Date.now().toString(36)}`;
const outFile = "../custom_components/spatial_context/www/spatial-context-panel.js";

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

export default {
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
    !isDev &&
      terser({
        format: { comments: /^!/ },
      }),
  ].filter(Boolean),
};
