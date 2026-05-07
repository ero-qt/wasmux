import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// vitest ships its own nested copy of vite, so the plugin types from
// vite-plugin-solid (typed against the top-level vite) don't unify with
// vitest's nested vite under exactOptionalPropertyTypes. splitting the
// configs and using mergeConfig is the canonical vitest workaround.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      globals: false,
      passWithNoTests: true,
      setupFiles: ["./src/test-setup.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html", "lcov"],
        reportsDirectory: "artifacts/coverage",
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.test.{ts,tsx}", "src/test-setup.ts"],
      },
    },
  }),
);
