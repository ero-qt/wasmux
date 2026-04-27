import { createTheme } from "@vanilla-extract/css";
import type { AppTheme } from "~/styles/themes/types";
import { tokens } from "~/styles/tokens.css";

export const defaultLightTheme: AppTheme = {
  bg: "#ffffff",
  fg: "#0a0a0a",
  accent: "#2c4d7e",
  accentSoft: "#2c4d7e1f",
};

export const defaultLight = createTheme(tokens, { theme: defaultLightTheme });
