import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

/**
 * Overlay container that hosts every floating panel. Sits above the app
 * shell with `pointer-events: none` so the empty regions of the overlay
 * pass clicks through to the editor; individual panels re-enable pointer
 * events on themselves.
 */
export const panelOverlay = style({
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  zIndex: 1000,
});

/** Common chrome for a floating panel: border, background, drop shadow. */
export const panel = style({
  position: "absolute",
  pointerEvents: "auto",
  background: tokens.theme.bg,
  border: `1px solid ${tokens.theme.accent}`,
  minInlineSize: "16rem",
  maxInlineSize: "min(28rem, 100vw)",
  maxBlockSize: "min(70vh, 100dvb)",
  display: "flex",
  flexDirection: "column",
});

export const panelHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  paddingBlock: "0.4rem",
  paddingInline: "0.75rem",
  borderBlockEnd: `1px solid ${tokens.theme.accent}`,
});

export const panelTitle = style({
  margin: 0,
  fontSize: "0.95em",
  fontWeight: "normal",
});

/** Close button is small and unobtrusive; overrides the global button rule. */
export const panelClose = style({
  paddingBlock: "0.1em",
  paddingInline: "0.5em",
  minBlockSize: "auto",
  minInlineSize: "auto",
  fontSize: "1em",
  lineHeight: 1,
});

export const panelBody = style({
  padding: "0.75rem",
  overflow: "auto",
  flex: 1,
});

/** Stacking position presets so callers don't reinvent inset values. */
export const panelTopRight = style({
  insetBlockStart: "1rem",
  insetInlineEnd: "1rem",
});

export const panelBottomRight = style({
  insetBlockEnd: "3rem",
  insetInlineEnd: "1rem",
});

export const panelBottomLeft = style({
  insetBlockEnd: "3rem",
  insetInlineStart: "1rem",
});
