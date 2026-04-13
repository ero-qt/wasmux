import { createGlobalTheme } from "@vanilla-extract/css";

/** Design tokens exposed as CSS custom properties on :root. */
export const tokens = createGlobalTheme(":root", {
  color: {
    accent: "#80a0d0",
  },
});
