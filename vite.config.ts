import { fileURLToPath } from "node:url";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

// Cross-Origin Isolation is required for SharedArrayBuffer, which is required
// for WebAssembly threads, memory64, and the multithreaded media pipeline.
// dev and preview must serve these or the wasm code won't load at all.
//
// every other production header (Permissions-Policy, Referrer-Policy,
// X-Content-Type-Options, frame-ancestors via CSP) lives in public/_headers
// and is asserted by src/privacy.test.ts. that file is the single source of
// truth; this config only carries what dev/preview need to boot.
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
    sourcemap: "hidden",
    cssCodeSplit: true,
    minify: "esbuild",
    cssMinify: true,
  },
});
