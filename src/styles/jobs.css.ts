import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

/**
 * Soft pulse used by the running-status indicator. The global
 * `prefers-reduced-motion` reset in `global.css.ts` already clamps
 * `animation-duration` to 0.01ms, so motion-averse users see static dots.
 */
const dotPulse = keyframes({
  "0%, 80%, 100%": { opacity: 0.3 },
  "40%": { opacity: 1 },
});

export const jobsEmpty = style({
  margin: 0,
  opacity: 0.5,
  fontStyle: "italic",
});

export const jobsTreeRoot = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.15rem",
});

/** One row in the tree. Plain text strip; the disclosure button is the only click target. */
export const jobRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  paddingBlock: "0.15rem",
  paddingInline: "0.25rem",
  whiteSpace: "nowrap",
  minInlineSize: 0,
});

/** Job name. Doesn't shrink so the icon + name pair is always legible. */
export const jobName = style({
  flexShrink: 0,
});

/**
 * Reserved space at the start of every row so leaves and expandable nodes
 * line up. The disclosure button (when present) lives inside this slot.
 */
export const jobToggleSlot = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1.4em",
  blockSize: "1.4em",
  flexShrink: 0,
});

/** Disclosure button. Sized to match the slot; resets the global button chrome. */
export const jobToggleButton = style([
  jobToggleSlot,
  {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "inherit",
    font: "inherit",
    padding: 0,
    minBlockSize: "auto",
    minInlineSize: "auto",
    borderRadius: "0.25rem",
  },
]);

/** Triangle SVG. Rotates 90° via the row button's aria-expanded state. */
export const jobToggleIcon = style({
  transition: "transform 120ms ease",
  selectors: {
    'button[aria-expanded="true"] &': {
      transform: "rotate(90deg)",
    },
  },
});

/**
 * Tree node. Hover highlight lives here (not on the row) so the parent's
 * background extends across its row AND its children's `<ol>` as one big
 * box. `:has(> .jobRow:hover)` matches only the *direct* row inside this
 * node, so hovering a child does not bubble up to its ancestor.
 */
/**
 * Tree node. Hover highlight uses fg-mix (not accent) so it reads cleanly on
 * both dark and light themes; accent at low alpha was nearly invisible
 * against the dark theme's black background.
 */
export const jobNode = style({
  borderRadius: "0.3rem",
  selectors: {
    [`&:has(> .${jobRow}:hover)`]: {
      background: `color-mix(in oklab, ${tokens.theme.fg} 10%, transparent)`,
    },
  },
});

/** Status indicator slot. Sized identically to the disclosure slot for vertical alignment. */
export const jobStatusIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1.1em",
  blockSize: "1.1em",
  flexShrink: 0,
});

export const jobStatusRunning = style({ color: tokens.theme.accent });

/**
 * Three-dot pulse for the running indicator. Per-dot delays live in
 * `globalStyle` because vanilla-extract's `selectors` block must always have
 * `&` at the end of the selector chain, which prevents descendant rules.
 */
export const jobLoadingDots = style({});

globalStyle(`.${jobLoadingDots} circle`, {
  animation: `${dotPulse} 1.4s ease-in-out infinite`,
});

globalStyle(`.${jobLoadingDots} circle:nth-of-type(2)`, {
  animationDelay: "0.16s",
});

globalStyle(`.${jobLoadingDots} circle:nth-of-type(3)`, {
  animationDelay: "0.32s",
});
export const jobStatusCompleted = style({ color: "#4caf50" });
export const jobStatusFailed = style({ color: "#e57373" });
export const jobStatusCancelled = style({ opacity: 0.4 });

/** Latest-report text. Truncates with an ellipsis when wider than the available space. */
export const jobReportLine = style({
  fontSize: "0.85em",
  opacity: 0.7,
  overflow: "hidden",
  textOverflow: "ellipsis",
  minInlineSize: 0,
  flex: 1,
});

export const jobChainWidget = style({
  display: "inline-flex",
  alignItems: "baseline",
  gap: "0.3rem",
});

export const jobChainSeparator = style({
  opacity: 0.5,
});

export const jobChildren = style({
  listStyle: "none",
  margin: 0,
  paddingInlineStart: "1.2rem",
  borderInlineStart: `1px solid color-mix(in oklab, ${tokens.theme.accent} 25%, transparent)`,
  marginInlineStart: "0.7em",
  display: "flex",
  flexDirection: "column",
  gap: "0.15rem",
});
