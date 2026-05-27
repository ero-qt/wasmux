import { globalStyle, style } from "@vanilla-extract/css";
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

/**
 * One row in the tree. When the node has children the row itself becomes the
 * clickable toggle (cursor + focus ring + `role="button"` on the element);
 * otherwise it stays a plain text strip. Text inside remains selectable —
 * the browser swallows the synthetic click after a drag-select, so dragging
 * to copy a job name doesn't toggle the row.
 */
export const jobRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
  paddingBlock: "0.1rem",
  paddingInline: "0.2rem",
  whiteSpace: "nowrap",
  minInlineSize: 0,
  lineHeight: 1.3,
  selectors: {
    '&[role="button"]': {
      cursor: "pointer",
    },
    '&[role="button"]:focus-visible': {
      outline: `2px solid ${tokens.theme.accent}`,
      outlineOffset: "-2px",
      borderRadius: "0.25rem",
    },
  },
});

/** Job name. Doesn't shrink so the icon + name pair is always legible. */
export const jobName = style({
  flexShrink: 0,
});

/**
 * Reserved space at the start of every row so leaves and expandable nodes
 * line up. The chevron (or empty slot, for leaves) renders inside.
 */
export const jobToggleSlot = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1em",
  blockSize: "1em",
  flexShrink: 0,
  fontVariantNumeric: "tabular-nums",
});

/**
 * Chevron glyph (`›`). Rotates 90° when the row reports `aria-expanded="true"`
 * so the same character does double duty for collapsed / expanded states.
 * `transform-origin: center` keeps the rotation tidy inside the 1em slot.
 */
export const jobToggleIcon = style({
  display: "inline-block",
  transition: "transform 120ms ease",
  opacity: 0.75,
  transformOrigin: "center",
  selectors: {
    '[aria-expanded="true"] &': {
      transform: "rotate(90deg)",
    },
  },
});

/**
 * Tree node. Hover wash uses fg-mix (not accent) so it reads cleanly on
 * both dark and light themes; accent at low alpha was nearly invisible
 * against the dark theme's near-black background. The `:has(... :hover)`
 * exclusion is what makes hovering the *parent's negative space* (between
 * children, around the row) highlight the parent — without it, only direct
 * row hover lit up, leaving the body of the node dead to the cursor.
 */
export const jobNode = style({
  borderRadius: "0.25rem",
});

globalStyle(`.${jobNode}:hover:not(:has(.${jobNode}:hover))`, {
  background: `color-mix(in oklab, ${tokens.theme.fg} 8%, transparent)`,
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
