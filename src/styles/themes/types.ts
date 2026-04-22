export interface AppTheme {
  bg: string;
  fg: string;
  accent: string;
  /** Translucent accent wash for hover surfaces. */
  accentSoft: string;
}

export const themeContract: Record<keyof AppTheme, null> = {
  bg: null,
  fg: null,
  accent: null,
  accentSoft: null,
};
