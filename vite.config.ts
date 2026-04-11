import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Cross-Origin Isolation is required for SharedArrayBuffer, which is required
// for WebAssembly threads, memory64, and the multithreaded media pipeline.
// These headers must also be set by whatever serves the production build.
const crossOriginIsolationHeaders = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
};

export default defineConfig({
  plugins: [solid(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    headers: crossOriginIsolationHeaders,
    strictPort: true,
    port: 5173,
  },
  preview: {
    headers: crossOriginIsolationHeaders,
    strictPort: true,
    port: 4173,
  },
  build: {
    outDir: "artifacts/build",
    target: "es2022",
    sourcemap: true,
    cssCodeSplit: true,
  },
});
