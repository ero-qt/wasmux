import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

const HIT_PX = "0.5rem"; // ~8px hit area
const LINE_OPACITY = 0.15;
const LINE_OPACITY_HOVER = 0.3;

/**
 * Wraps the actual draggable line. Box has a generous hit area; the visible
 * line is a centered pseudo-element so the hover/drag affordance sits
 * exactly on the geometric boundary between siblings.
 */
const splitterBase = style({
  flexShrink: 0,
  position: "relative",
  background: "transparent",
  outline: "none",
  // reset user-agent <hr> defaults so the styled pseudo-element is the only visible line
  margin: 0,
  border: 0,
  blockSize: "auto",
  selectors: {
    "&:hover::before, &:focus-visible::before, &[data-dragging='true']::before": {
      background: `color-mix(in oklab, ${tokens.theme.text0} ${LINE_OPACITY_HOVER * 100}%, transparent)`,
    },
    "&:focus-visible": {
      outline: `2px solid ${tokens.theme.accent}`,
      outlineOffset: "-2px",
      borderRadius: "0.2rem",
    },
    "&::before": {
      content: "''",
      position: "absolute",
      background: `color-mix(in oklab, ${tokens.theme.text0} ${LINE_OPACITY * 100}%, transparent)`,
      transition: "background 120ms ease",
    },
  },
});

export const splitterRow = style([
  splitterBase,
  {
    inlineSize: HIT_PX,
    blockSize: "100%",
    cursor: "col-resize",
    touchAction: "none",
    selectors: {
      "&::before": {
        insetBlock: 0,
        insetInline: "calc(50% - 0.5px)",
        inlineSize: "1px",
      },
    },
  },
]);

export const splitterColumn = style([
  splitterBase,
  {
    blockSize: HIT_PX,
    inlineSize: "100%",
    cursor: "row-resize",
    touchAction: "none",
    selectors: {
      "&::before": {
        insetInline: 0,
        insetBlock: "calc(50% - 0.5px)",
        blockSize: "1px",
      },
    },
  },
]);
