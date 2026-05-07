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
  gap: "0.25rem",
});

export const jobNode = style({});

/**
 * One row in the tree. Used as a `<button>` for nodes with children (whole
 * row toggles) and as a `<div>` for leaves. Resets the global button rule so
 * the row reads as a flat highlight strip rather than a bordered button.
 *
 * Hover behaviour: hovering a row highlights itself plus every descendant
 * row in its sibling `<ol>`. Hovering a child does not bubble up because
 * `:hover` here is scoped to the row element, not the surrounding `<li>`.
 */
export const jobRow = style({
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  inlineSize: "100%",
  background: "transparent",
  border: "none",
  borderRadius: "0.3rem",
  paddingBlock: "0.2rem",
  paddingInline: "0.3rem",
  minBlockSize: "auto",
  minInlineSize: "auto",
  textAlign: "start",
  color: "inherit",
  font: "inherit",
  selectors: {
    "button&": {
      cursor: "pointer",
    },
    "&:hover, &:hover + ol &": {
      background: `color-mix(in oklab, ${tokens.theme.accent} 10%, transparent)`,
    },
  },
});

/**
 * Reserved space at the start of every row so the disclosure icon (or its
 * absence on leaves) keeps text columns aligned.
 */
export const jobToggleSlot = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1.1em",
  blockSize: "1.1em",
  flexShrink: 0,
});

/** Triangle SVG inside an expandable row. Rotates 90° when the row is expanded. */
export const jobToggleIcon = style({
  transition: "transform 120ms ease",
  selectors: {
    'button[aria-expanded="true"] &': {
      transform: "rotate(90deg)",
    },
  },
});

export const jobStatusBadge = style({
  fontSize: "0.8em",
  opacity: 0.6,
});

export const jobReportLine = style({
  fontSize: "0.85em",
  opacity: 0.7,
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
  borderInlineStart: `1px solid ${tokens.theme.accent}`,
  marginInlineStart: "0.4em",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});
