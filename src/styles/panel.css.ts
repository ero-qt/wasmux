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
 * Outer positioning box for a floating panel. Holds the size and the resize
 * handles but has no visual chrome of its own; `panelChrome` (filled inside)
 * owns the border, radius, background, and content clipping. Splitting them
 * lets the resize handles use negative insets to straddle the visible
 * border, since `overflow: hidden` on the chrome would otherwise clip them.
 *
 * Inline-size cap subtracts 2rem from viewport width to keep a margin on
 * either side on narrow screens. Min-block-size is roughly the title-bar
 * height so the panel can collapse to header-only.
 */
export const panel = style({
  position: "absolute",
  pointerEvents: "auto",
  minInlineSize: "16rem",
  minBlockSize: "1.4rem",
  maxInlineSize: "min(44rem, calc(100vw - 2rem))",
  maxBlockSize: "min(70vh, calc(100dvb - 2rem))",
});

/** Visible card inside `panel`. Owns the border, radius, drop shadow, and content clip. */
export const panelChrome = style({
  position: "absolute",
  inset: 0,
  background: tokens.theme.bg,
  borderRadius: "0.6rem",
  border: `1px solid color-mix(in oklab, ${tokens.theme.accent} 30%, transparent)`,
  boxShadow: `0 0.5rem 1.5rem color-mix(in oklab, ${tokens.theme.accent} 15%, transparent)`,
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

/**
 * Resize handles. Edge strips are 10px thick, positioned with a -4px offset
 * so they straddle the visible chrome border (4px outside, 1px on the border
 * itself, 5px inside). Corner squares are 14×14 with the same offset so the
 * corner cursor wins where it overlaps an edge.
 *
 * Logical insets keep the layout correct under RTL once we localise.
 */
const HANDLE_EDGE = "10px";
const HANDLE_CORNER = "14px";
const HANDLE_OFFSET = "-4px";

const handleBase = style({
  position: "absolute",
  background: "transparent",
  zIndex: 1,
});

export const handleTop = style([
  handleBase,
  {
    insetBlockStart: HANDLE_OFFSET,
    insetInlineStart: HANDLE_CORNER,
    insetInlineEnd: HANDLE_CORNER,
    blockSize: HANDLE_EDGE,
    cursor: "ns-resize",
  },
]);

export const handleBottom = style([
  handleBase,
  {
    insetBlockEnd: HANDLE_OFFSET,
    insetInlineStart: HANDLE_CORNER,
    insetInlineEnd: HANDLE_CORNER,
    blockSize: HANDLE_EDGE,
    cursor: "ns-resize",
  },
]);

export const handleLeft = style([
  handleBase,
  {
    insetInlineStart: HANDLE_OFFSET,
    insetBlockStart: HANDLE_CORNER,
    insetBlockEnd: HANDLE_CORNER,
    inlineSize: HANDLE_EDGE,
    cursor: "ew-resize",
  },
]);

export const handleRight = style([
  handleBase,
  {
    insetInlineEnd: HANDLE_OFFSET,
    insetBlockStart: HANDLE_CORNER,
    insetBlockEnd: HANDLE_CORNER,
    inlineSize: HANDLE_EDGE,
    cursor: "ew-resize",
  },
]);

export const handleTopLeft = style([
  handleBase,
  {
    insetBlockStart: HANDLE_OFFSET,
    insetInlineStart: HANDLE_OFFSET,
    inlineSize: HANDLE_CORNER,
    blockSize: HANDLE_CORNER,
    cursor: "nwse-resize",
  },
]);

export const handleTopRight = style([
  handleBase,
  {
    insetBlockStart: HANDLE_OFFSET,
    insetInlineEnd: HANDLE_OFFSET,
    inlineSize: HANDLE_CORNER,
    blockSize: HANDLE_CORNER,
    cursor: "nesw-resize",
  },
]);

export const handleBottomLeft = style([
  handleBase,
  {
    insetBlockEnd: HANDLE_OFFSET,
    insetInlineStart: HANDLE_OFFSET,
    inlineSize: HANDLE_CORNER,
    blockSize: HANDLE_CORNER,
    cursor: "nesw-resize",
  },
]);

export const handleBottomRight = style([
  handleBase,
  {
    insetBlockEnd: HANDLE_OFFSET,
    insetInlineEnd: HANDLE_OFFSET,
    inlineSize: HANDLE_CORNER,
    blockSize: HANDLE_CORNER,
    cursor: "nwse-resize",
  },
]);
