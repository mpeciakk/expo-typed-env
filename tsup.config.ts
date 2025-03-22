import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts", "src/babel-plugin-expo-env.ts"],
    clean: true,
    dts: true,
    shims: true,
    format: ["esm", "cjs"],
    sourcemap: true,
    outDir: "dist",
    external: [
      "@babel/core",
      "@babel/traverse",
      "@babel/types",
      "@expo/env",
      "zod",
      "ts-node",
    ],
  },
]);
