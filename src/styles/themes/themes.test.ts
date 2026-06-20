import { describe, expect, it } from "vitest";
import { defaultDarkTheme } from "~/styles/themes/default-dark.css";
import { defaultLightTheme } from "~/styles/themes/default-light.css";
import type { AppTheme } from "~/styles/themes/types";

const REQUIRED_KEYS: ReadonlyArray<keyof AppTheme> = [
  "bg0",
  "bg1",
  "bg2",
  "bg3",
  "bgHover",
  "border",
  "border2",
  "text0",
  "text1",
  "text2",
  "accent",
  "accentSoft",
  "accentLine",
  "accentFg",
  "cVideo",
  "cAudio",
  "cOther",
  "cDanger",
  "cDangerFg",
  "shadow",
];

describe("themes", () => {
  it("dark theme provides every contract key", () => {
    for (const key of REQUIRED_KEYS) {
      expect(defaultDarkTheme[key], `dark missing ${key}`).toBeTruthy();
    }
  });

  it("light theme provides every contract key", () => {
    for (const key of REQUIRED_KEYS) {
      expect(defaultLightTheme[key], `light missing ${key}`).toBeTruthy();
    }
  });
});
