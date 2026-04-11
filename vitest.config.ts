import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Vitest ships its own nested copy of Vite, so the plugin types from
// vite-plugin-solid (typed against the top-level vite) don't unify with
// vitest's nested vite under exactOptionalPropertyTypes. Splitting the
// configs and using mergeConfig is the canonical Vitest workaround.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: false,
      passWithNoTests: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "artifacts/coverage",
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.test.{ts,tsx}"],
      },
    },
  }),
);
