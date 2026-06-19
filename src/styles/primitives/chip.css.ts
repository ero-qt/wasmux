import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const chipGroupRoot = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "calc(0.3rem * var(--ui-density))",
  flexWrap: "wrap",
});

export const chip = style({
  display: "inline-flex",
  alignItems: "center",
  paddingBlock: "calc(0.25rem * var(--ui-density))",
  paddingInline: "calc(0.7rem * var(--ui-density))",
  fontFamily: "inherit",
  fontSize: "0.78rem",
  fontWeight: 600,
  background: "transparent",
  color: tokens.theme.text1,
  border: `1px solid ${tokens.theme.border2}`,
  borderRadius: "9999px",
  cursor: "pointer",
  transition: "background-color 120ms ease, color 120ms ease, border-color 120ms ease",
  selectors: {
    "&:hover:not(:disabled)": {
      background: tokens.theme.bgHover,
      color: tokens.theme.text0,
    },
    "&:active:not(:disabled)": {
      background: tokens.theme.accentSoft,
      color: tokens.theme.accent,
      borderColor: tokens.theme.accentLine,
    },
    '&[aria-pressed="true"]': {
      background: tokens.theme.accentSoft,
      color: tokens.theme.accent,
      borderColor: tokens.theme.accentLine,
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});
