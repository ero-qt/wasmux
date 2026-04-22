import { createTheme } from "@vanilla-extract/css";
import type { AppTheme } from "~/styles/themes/types";
import { tokens } from "~/styles/tokens.css";

export const defaultDarkTheme: AppTheme = {
  bg: "#000",
  fg: "#fff",
  accent: "#80a0d0",
  accentSoft: "#80a0d01f",
};

export const defaultDark = createTheme(tokens, { theme: defaultDarkTheme });
