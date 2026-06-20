import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const tooltipContent = style({
  background: tokens.theme.bg1,
  color: tokens.theme.text0,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.3rem",
  boxShadow: tokens.theme.shadow,
  paddingBlock: "calc(0.25rem * var(--ui-density))",
  paddingInline: "calc(0.5rem * var(--ui-density))",
  fontSize: "0.78rem",
  maxInlineSize: "20rem",
  pointerEvents: "none",
  zIndex: 2100,
  selectors: {
    "&[data-expanded]": {
      opacity: 1,
    },
    "&[data-closed]": {
      opacity: 0,
    },
  },
  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      transition: "opacity 100ms ease",
    },
    "(hover: none)": {
      display: "none",
    },
  },
});

export const tooltipArrow = style({
  fill: tokens.theme.bg1,
  stroke: tokens.theme.border,
});

export const tooltipInner = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4em",
});
