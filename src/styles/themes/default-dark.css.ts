import { createTheme } from "@vanilla-extract/css";
import type { AppTheme } from "~/styles/themes/types";
import { tokens } from "~/styles/tokens.css";

export const defaultDarkTheme: AppTheme = {
  bg0: "oklch(0.165 0.004 300)",
  bg1: "oklch(0.195 0.004 300)",
  bg2: "oklch(0.23 0.005 300)",
  bg3: "oklch(0.275 0.006 300)",
  bgHover: "oklch(0.31 0.008 300)",

  border: "oklch(0.30 0.006 300)",
  border2: "oklch(0.385 0.009 300)",

  text0: "oklch(0.95 0.003 300)",
  text1: "oklch(0.705 0.007 300)",
  text2: "oklch(0.55 0.007 300)",

  accent: "oklch(0.72 0.15 300)",
  accentSoft: "color-mix(in oklab, oklch(0.72 0.15 300) 18%, transparent)",
  accentLine: "color-mix(in oklab, oklch(0.72 0.15 300) 40%, transparent)",
  accentFg: "oklch(0.16 0.02 300)",

  cVideo: "oklch(0.68 0.12 250)",
  cAudio: "oklch(0.72 0.12 158)",
  cOther: "oklch(0.72 0.10 205)",
  cDanger: "oklch(0.62 0.20 25)",
  cDangerFg: "oklch(0.16 0.04 25)",

  shadow: "0 8px 30px -6px rgba(0,0,0,.55), 0 2px 8px -2px rgba(0,0,0,.4)",
};

export const defaultDark = createTheme(tokens, { theme: defaultDarkTheme });
