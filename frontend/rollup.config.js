import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url)),
);
const isDev =
  process.env.ROLLUP_WATCH === "true" || process.env.NODE_ENV === "development";

export default {
  input: "src/index.ts",
  output: {
    file: "../custom_components/spatial_context/www/spatial-context-panel.js",
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
    !isDev &&
      terser({
        format: { comments: /^!/ },
      }),
  ].filter(Boolean),
};
