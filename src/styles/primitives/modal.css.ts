import { globalStyle, style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

// neutralise the scrollbar layout shift that the body-scroll-lock effect would otherwise cause.
globalStyle(":root", {
  scrollbarGutter: "stable",
});

export const modalDialog = style({
  background: tokens.theme.bg1,
  color: tokens.theme.text0,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.6rem",
  boxShadow: tokens.theme.shadow,
  padding: 0,
  inlineSize: "min(100% - 2rem, var(--modal-inline-size, 32rem))",
  maxBlockSize: "calc(100dvh - 4rem)",
  // dialog defaults to inset:0; clear it so margin:auto centres reliably.
  inset: 0,
  margin: "auto",
  selectors: {
    '&[data-size="sm"]': {
      vars: { "--modal-inline-size": "24rem" },
    },
    '&[data-size="md"]': {
      vars: { "--modal-inline-size": "32rem" },
    },
    '&[data-size="lg"]': {
      vars: { "--modal-inline-size": "48rem" },
    },
    "&::backdrop": {
      background: "color-mix(in oklab, black 50%, transparent)",
      backdropFilter: "blur(4px)",
    },
  },
});

export const modalHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "calc(0.6rem * var(--ui-density))",
  paddingBlock: "calc(0.6rem * var(--ui-density))",
  paddingInline: "calc(0.9rem * var(--ui-density))",
  borderBlockEnd: `1px solid ${tokens.theme.border}`,
});

export const modalTitle = style({
  margin: 0,
  fontSize: "0.92rem",
  fontWeight: 600,
  color: tokens.theme.text0,
});

export const modalDescription = style({
  margin: 0,
  marginBlockStart: "0.25rem",
  fontSize: "0.78rem",
  color: tokens.theme.text1,
});

export const modalCloseButton = style({
  background: "transparent",
  border: "none",
  color: tokens.theme.text1,
  cursor: "pointer",
  inlineSize: "1.6rem",
  blockSize: "1.6rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "0.3rem",
  selectors: {
    "&:hover": {
      background: tokens.theme.bgHover,
      color: tokens.theme.text0,
    },
    "&:focus-visible": {
      outline: `2px solid ${tokens.theme.accentLine}`,
      outlineOffset: "2px",
    },
  },
});

export const modalBody = style({
  paddingBlock: "calc(0.8rem * var(--ui-density))",
  paddingInline: "calc(0.9rem * var(--ui-density))",
  overflow: "auto",
});
