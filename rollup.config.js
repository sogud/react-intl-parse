import path from "path"
import alias from "@rollup/plugin-alias"
import commonJs from "@rollup/plugin-commonJs"
import resolve from "@rollup/plugin-node-resolve"
import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"
import { valid } from "semver"
import { compilerOptions, include, exclude } from "./tsconfig.json"
import { version } from "./package.json"

const validVersion = valid(version)
if (!validVersion) {
  throw new Error(`${version}Illegal：${validVersion}`)
}

export default {
  input: "src/index.ts",
  // input: "main.ts",
  output: {
    dir: "lib",
    format: "cjs",
    exports: "auto",
    externalLiveBindings: false,
    freeze: false,
    chunkFileNames: "[name].js",
    entryFileNames: "[name].js",
    generatedCode: "es2015"
  },
  external: [
    "rollup",
    "pkg-updater",
    "chalk",
    "cli-progress",
    "commander",
    "inquirer",
    "mz-modules",
    "node-xlsx",
    "open",
    "ora",
    "shelljs",
    "undici",
    "@babel/parser",
    "ast-types",
    "winston"
  ],
  plugins: [
    resolve({ preferBuiltins: false }),
    commonJs(),
    typescript({ ...compilerOptions, module: "ES2020", include, exclude }),
    json(),
    alias({
      entries: [
        { find: "@", replacement: path.resolve(__dirname, "./lib") },
        { find: "react-intl-parse", replacement: path.resolve(__dirname, "./lib") }
      ]
    })
  ]
}
