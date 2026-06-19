/**
 * Theme contract for wasmux. Direct port of the Reel handoff's token names,
 * adapted to vanilla-extract's camelCase convention. Every key here must be
 * provided by every concrete theme (see {@link defaultDarkTheme}).
 */
export interface AppTheme {
  /** Deepest surface — viewport backdrop. */
  bg0: string;

  /** Panel surfaces. */
  bg1: string;

  /** Cards, popovers, modals. */
  bg2: string;

  /** Inputs, slider tracks. */
  bg3: string;

  /** Interactive hover wash. */
  bgHover: string;

  /** Subtle line. */
  border: string;

  /** Prominent line. */
  border2: string;

  /** Primary text. */
  text0: string;

  /** Secondary text. */
  text1: string;

  /** Tertiary / muted text. */
  text2: string;

  /** Main accent (user-chosen). */
  accent: string;

  /** 18%-translucent accent wash. */
  accentSoft: string;

  /** 40%-translucent accent line. */
  accentLine: string;

  /** Legible-on-accent text colour. */
  accentFg: string;

  /** Type-tint: video clips. */
  cVideo: string;

  /** Type-tint: audio clips. */
  cAudio: string;

  /** Type-tint: everything else (image, text, shape). */
  cOther: string;

  /** 2-layer drop shadow. */
  shadow: string;
}

export const themeContract: Record<keyof AppTheme, null> = {
  bg0: null,
  bg1: null,
  bg2: null,
  bg3: null,
  bgHover: null,
  border: null,
  border2: null,
  text0: null,
  text1: null,
  text2: null,
  accent: null,
  accentSoft: null,
  accentLine: null,
  accentFg: null,
  cVideo: null,
  cAudio: null,
  cOther: null,
  shadow: null,
};
