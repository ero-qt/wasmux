import { createTheme } from "@vanilla-extract/css";
import type { AppTheme } from "~/styles/themes/types";
import { tokens } from "~/styles/tokens.css";

export const defaultLightTheme: AppTheme = {
  bg: "#ffffff",
  fg: "#0a0a0a",
  accent: "#2c4d7e",
  accentSoft: "color-mix(in oklab, #2c4d7e 12%, transparent)",
};

export const defaultLight = createTheme(tokens, { theme: defaultLightTheme });
