import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const popoverContent = style({
  background: tokens.theme.bg1,
  color: tokens.theme.text0,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.4rem",
  boxShadow: tokens.theme.shadow,
  paddingBlock: "calc(0.5rem * var(--ui-density))",
  paddingInline: "calc(0.65rem * var(--ui-density))",
  minInlineSize: "10rem",
  maxInlineSize: "min(24rem, calc(100vw - 1rem))",
  outline: "none",
  zIndex: 2000,
  transformOrigin: "var(--kb-popover-content-transform-origin)",
  transition: "opacity 120ms ease, transform 120ms ease",
  selectors: {
    "&[data-expanded]": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&[data-closed]": {
      opacity: 0,
      transform: "translateY(2px)",
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "opacity 0ms",
      transform: "none",
    },
  },
});

export const popoverArrow = style({
  fill: tokens.theme.bg1,
  stroke: tokens.theme.border,
});
