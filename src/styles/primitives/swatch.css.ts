import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const swatchRowRoot = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "calc(0.3rem * var(--ui-density))",
});

export const swatch = style({
  display: "inline-block",
  inlineSize: "calc(1.4rem * var(--ui-density))",
  blockSize: "calc(1.4rem * var(--ui-density))",
  borderRadius: "0.25rem",
  border: `1px solid ${tokens.theme.border2}`,
  cursor: "pointer",
  padding: 0,
  selectors: {
    // double-ring selection: inner 1px gap in surface color, outer 2px hard
    // outline in text0. invariant to swatch fill and accent — works on any
    // colour including when the swatch IS the accent.
    '&[aria-pressed="true"]': {
      borderColor: tokens.theme.bg1,
      boxShadow: `0 0 0 2px ${tokens.theme.text0}`,
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});

// transparency checkerboard for the "checker" tone. uses two layered gradients
// for a 2-tone diamond. 8px is half the swatch box at default density.
export const swatchChecker = style({
  background: `
    conic-gradient(${tokens.theme.bg2} 90deg, ${tokens.theme.bg3} 90deg 180deg, ${tokens.theme.bg2} 180deg 270deg, ${tokens.theme.bg3} 270deg) 0 0/8px 8px
  `,
});
