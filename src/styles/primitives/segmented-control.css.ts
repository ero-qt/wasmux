import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const segmentedRoot = style({
  display: "inline-flex",
  alignItems: "center",
  background: tokens.theme.bg2,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.4rem",
  padding: "2px",
  gap: "2px",
});

export const segmentedTab = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  paddingBlock: "calc(0.2rem * var(--ui-density))",
  paddingInline: "calc(0.7rem * var(--ui-density))",
  fontFamily: "inherit",
  fontSize: "0.78rem",
  fontWeight: 600,
  color: tokens.theme.text1,
  background: "transparent",
  border: "none",
  borderRadius: "0.3rem",
  cursor: "pointer",
  selectors: {
    "&:hover:not(:disabled)": {
      color: tokens.theme.text0,
    },
    '&[aria-selected="true"]': {
      background: tokens.theme.accent,
      color: tokens.theme.accentFg,
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});
