import { createTheme } from "@vanilla-extract/css";
import type { AppTheme } from "~/styles/themes/types";
import { tokens } from "~/styles/tokens.css";

export const defaultLightTheme: AppTheme = {
  bg0: "oklch(0.905 0.004 300)",
  bg1: "oklch(0.95 0.003 300)",
  bg2: "oklch(0.99 0.002 300)",
  bg3: "oklch(0.965 0.003 300)",
  bgHover: "oklch(0.925 0.005 300)",

  border: "oklch(0.86 0.006 300)",
  border2: "oklch(0.79 0.009 300)",

  text0: "oklch(0.235 0.012 300)",
  text1: "oklch(0.46 0.012 300)",
  text2: "oklch(0.605 0.012 300)",

  accent: "oklch(0.72 0.15 300)",
  accentSoft: "color-mix(in oklab, oklch(0.72 0.15 300) 18%, transparent)",
  accentLine: "color-mix(in oklab, oklch(0.72 0.15 300) 40%, transparent)",
  accentFg: "oklch(0.16 0.02 300)",

  // light mode darkens the type-tints one step for contrast against light surfaces.
  cVideo: "oklch(0.55 0.14 250)",
  cAudio: "oklch(0.56 0.13 158)",
  cOther: "oklch(0.56 0.12 205)",
  cDanger: "oklch(0.57 0.22 25)",
  cDangerFg: "oklch(0.97 0.005 25)",

  shadow: "0 10px 34px -8px rgba(40,30,60,.22), 0 2px 8px -2px rgba(40,30,60,.12)",
};

export const defaultLight = createTheme(tokens, { theme: defaultLightTheme });
