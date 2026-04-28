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

// Deny every powerful browser feature by default. Re-enable individual
// directives here only when a feature lands that legitimately needs them.
// Production deployments must echo this header.
const permissionsPolicyHeader = {
  "Permissions-Policy": [
    "accelerometer=()",
    "ambient-light-sensor=()",
    "autoplay=(self)",
    "battery=()",
    "bluetooth=()",
    "camera=()",
    "clipboard-read=(self)",
    "clipboard-write=(self)",
    "display-capture=()",
    "encrypted-media=()",
    "fullscreen=(self)",
    "gamepad=()",
    "geolocation=()",
    "gyroscope=()",
    "hid=()",
    "idle-detection=()",
    "magnetometer=()",
    "microphone=()",
    "midi=()",
    "payment=()",
    "picture-in-picture=()",
    "publickey-credentials-get=()",
    "screen-wake-lock=(self)",
    "serial=()",
    "usb=()",
    "web-share=()",
    "xr-spatial-tracking=()",
  ].join(", "),
};

const securityHeaders = {
  ...crossOriginIsolationHeaders,
  ...permissionsPolicyHeader,
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

export default defineConfig({
  plugins: [solid(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    headers: securityHeaders,
    strictPort: true,
    port: 5173,
  },
  preview: {
    headers: securityHeaders,
    strictPort: true,
    port: 4173,
  },
  build: {
    outDir: "artifacts/build",
    target: "es2022",
    sourcemap: "hidden",
    cssCodeSplit: true,
  },
});
