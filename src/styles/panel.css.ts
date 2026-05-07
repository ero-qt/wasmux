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

/**
 * Common chrome for a floating panel. Soft outline + drop shadow rather than a
 * solid border so the panel reads as a card without a hard edge. Inline-size
 * cap subtracts 2rem from viewport width to keep a margin on either side on
 * narrow screens.
 */
export const panel = style({
  position: "absolute",
  pointerEvents: "auto",
  background: tokens.theme.bg,
  borderRadius: "0.6rem",
  border: `1px solid color-mix(in oklab, ${tokens.theme.accent} 30%, transparent)`,
  boxShadow: `0 0.5rem 1.5rem color-mix(in oklab, ${tokens.theme.accent} 15%, transparent)`,
  minInlineSize: "16rem",
  maxInlineSize: "min(44rem, calc(100vw - 2rem))",
  maxBlockSize: "min(70vh, calc(100dvb - 2rem))",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

/**
 * Thin accent-tinted strip that doubles as the drag handle. The accent wash
 * makes the affordance obvious without adding extra chrome; height is set by
 * the title font size + minimal padding.
 */
export const panelHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  paddingBlock: "0.15rem",
  paddingInline: "0.5rem",
  cursor: "move",
  userSelect: "none",
  background: `color-mix(in oklab, ${tokens.theme.accent} 16%, transparent)`,
});

export const panelTitle = style({
  margin: 0,
  fontSize: "0.78em",
  fontWeight: "normal",
  letterSpacing: "0.02em",
  opacity: 0.85,
});

/** Close button: tiny, borderless, picks up the soft hover wash from button.css. */
export const panelClose = style({
  paddingBlock: "0",
  paddingInline: "0.35em",
  minBlockSize: "auto",
  minInlineSize: "auto",
  fontSize: "0.95em",
  lineHeight: 1,
  border: "none",
  borderRadius: "0.3rem",
});

export const panelBody = style({
  padding: "0.75rem",
  overflow: "auto",
  flex: 1,
});

/**
 * Stacking position presets. Every preset anchors by `inset-block-start` and
 * `inset-inline-start` so panels grow toward the bottom-right as their content
 * expands. "bottom" / "right" presets compute the start offset from viewport
 * dimensions to place the panel near that edge on first open without pinning
 * it there.
 *
 * `max(1rem, …)` keeps the start edge inside the viewport on small screens.
 * 30rem and 28rem mirror the assumed default block / max inline sizes; actual
 * panels still respect `max-block-size: min(70vh, 100dvb)` and
 * `max-inline-size: min(28rem, 100vw)` from `panel`.
 */
const BOTTOM_TOP = "max(1rem, calc(100dvh - 30rem - 3rem))";
const RIGHT_LEFT = "max(1rem, calc(100vw - 44rem - 1rem))";

export const panelTopRight = style({
  insetBlockStart: "1rem",
  insetInlineStart: RIGHT_LEFT,
});

export const panelBottomRight = style({
  insetBlockStart: BOTTOM_TOP,
  insetInlineStart: RIGHT_LEFT,
});

export const panelBottomLeft = style({
  insetBlockStart: BOTTOM_TOP,
  insetInlineStart: "1rem",
});
