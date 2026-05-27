import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

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
  gap: "0.1rem",
});

/** One row in the tree. Plain text strip; the disclosure button is the only click target. */
export const jobRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
  paddingBlock: "0.1rem",
  paddingInline: "0.2rem",
  whiteSpace: "nowrap",
  minInlineSize: 0,
  lineHeight: 1.3,
});

/** Job name. Doesn't shrink so the icon + name pair is always legible. */
export const jobName = style({
  flexShrink: 0,
});

/**
 * Reserved space at the start of every row so leaves and expandable nodes
 * line up. The disclosure button (when present) lives inside this slot.
 * Width is locked so the `>` and `v` glyphs occupy the same column.
 */
export const jobToggleSlot = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1em",
  blockSize: "1em",
  flexShrink: 0,
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
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
    borderRadius: "0.2rem",
    opacity: 0.75,
    selectors: {
      "&:hover": {
        opacity: 1,
      },
    },
  },
]);

/**
 * Tree node. Hover highlight uses fg-mix (not accent) so it reads cleanly on
 * both dark and light themes; accent at low alpha was nearly invisible
 * against the dark theme's near-black background.
 */
export const jobNode = style({
  borderRadius: "0.25rem",
  selectors: {
    [`&:has(> .${jobRow}:hover)`]: {
      background: `color-mix(in oklab, ${tokens.theme.fg} 8%, transparent)`,
    },
  },
});

/**
 * Status indicator slot. Sized identically to the disclosure slot for vertical
 * alignment; the glyph itself (braille / ✓ / ✕ / −) renders inside.
 */
export const jobStatusIcon = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1em",
  blockSize: "1em",
  flexShrink: 0,
  fontVariantNumeric: "tabular-nums",
});

export const jobStatusRunning = style({ color: tokens.theme.accent });
export const jobStatusCompleted = style({ color: "#4caf50" });
export const jobStatusFailed = style({ color: "#e57373" });
export const jobStatusCancelled = style({ opacity: 0.4 });

/** Latest-report text. Truncates with an ellipsis when wider than the available space. */
export const jobReportLine = style({
  fontSize: "0.85em",
  opacity: 0.65,
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
  paddingInlineStart: "1rem",
  borderInlineStart: `1px solid color-mix(in oklab, ${tokens.theme.accent} 25%, transparent)`,
  marginInlineStart: "0.6em",
  display: "flex",
  flexDirection: "column",
  gap: "0.1rem",
});
