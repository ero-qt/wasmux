import { defaultDarkTheme } from "~/styles/themes/default-dark.css";
import { defaultLightTheme } from "~/styles/themes/default-light.css";
import type { AppTheme } from "~/styles/themes/types";

export { type AppTheme, themeContract } from "~/styles/themes/types";

export const themes = {
  defaultDark: defaultDarkTheme,
  defaultLight: defaultLightTheme,
} as const satisfies Record<string, AppTheme>;
