import { style, styleVariants } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

const base = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "calc(0.4rem * var(--ui-density))",

  fontFamily: "inherit",
  fontSize: "inherit",
  fontWeight: 600,

  border: "1px solid transparent",
  borderRadius: "0.35rem",
  paddingBlock: "calc(0.35rem * var(--ui-density))",
  paddingInline: "calc(0.9rem * var(--ui-density))",

  cursor: "pointer",
  transition: "background-color 120ms ease, color 120ms ease, border-color 120ms ease",

  // WCAG 2.5.8 AA target size baseline.
  minBlockSize: "24px",
  minInlineSize: "24px",

  selectors: {
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});

export const buttonVariant = styleVariants({
  accent: [
    base,
    {
      background: tokens.theme.accent,
      color: tokens.theme.accentFg,
      selectors: {
        "&:hover:not(:disabled)": {
          // mix toward fg by ~12% for a perceptible but quiet hover.
          background: `color-mix(in oklab, ${tokens.theme.accent} 88%, ${tokens.theme.text0})`,
        },
        "&:active:not(:disabled)": {
          // deeper mix toward fg for a tactile press.
          background: `color-mix(in oklab, ${tokens.theme.accent} 72%, ${tokens.theme.text0})`,
        },
      },
    },
  ],
  danger: [
    base,
    {
      background: tokens.theme.cDanger,
      color: tokens.theme.cDangerFg,
      selectors: {
        "&:hover:not(:disabled)": {
          background: `color-mix(in oklab, ${tokens.theme.cDanger} 88%, ${tokens.theme.cDangerFg})`,
        },
        "&:active:not(:disabled)": {
          background: `color-mix(in oklab, ${tokens.theme.cDanger} 72%, ${tokens.theme.cDangerFg})`,
        },
      },
    },
  ],
  ghost: [
    base,
    {
      background: "transparent",
      color: tokens.theme.text0,
      borderColor: tokens.theme.border,
      selectors: {
        "&:hover:not(:disabled)": {
          background: tokens.theme.bgHover,
        },
        "&:active:not(:disabled)": {
          background: tokens.theme.accentSoft,
          color: tokens.theme.accent,
          borderColor: tokens.theme.accentLine,
        },
      },
    },
  ],
  icon: [
    base,
    {
      // default to accent fill, same look as the accent variant. small + square.
      background: tokens.theme.accent,
      color: tokens.theme.accentFg,
      inlineSize: "calc(1.75rem * var(--ui-density))",
      blockSize: "calc(1.75rem * var(--ui-density))",
      minInlineSize: "calc(1.75rem * var(--ui-density))",
      minBlockSize: "calc(1.75rem * var(--ui-density))",
      paddingBlock: 0,
      paddingInline: 0,
      borderRadius: "0.3rem",
      selectors: {
        "&:hover:not(:disabled)": {
          background: `color-mix(in oklab, ${tokens.theme.accent} 88%, ${tokens.theme.text0})`,
        },
        "&:active:not(:disabled)": {
          background: `color-mix(in oklab, ${tokens.theme.accent} 72%, ${tokens.theme.text0})`,
        },
        // toggle off-state: ghost-style transparent.
        '&[aria-pressed="false"]': {
          background: "transparent",
          color: tokens.theme.text1,
        },
        '&[aria-pressed="false"]:hover:not(:disabled)': {
          background: `color-mix(in oklab, ${tokens.theme.text0} 10%, transparent)`,
          color: tokens.theme.text0,
        },
        '&[aria-pressed="false"]:active:not(:disabled)': {
          background: tokens.theme.accentSoft,
          color: tokens.theme.accent,
        },
        // pressed-on stays at default (accent fill); no override needed.
      },
    },
  ],
});
