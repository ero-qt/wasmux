import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const numberInputRoot = style({
  display: "flex",
  alignItems: "center",
  gap: "calc(0.4rem * var(--ui-density))",
});

export const numberInputLabel = style({
  flex: "0 0 auto",
  fontSize: "0.78rem",
  color: tokens.theme.text1,
});

export const numberInputField = style({
  flex: 1,
  background: tokens.theme.bg2,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.3rem",
  paddingBlock: "calc(0.25rem * var(--ui-density))",
  paddingInline: "calc(0.4rem * var(--ui-density))",
  color: tokens.theme.text0,
  fontFamily: "inherit",
  fontSize: "0.78rem",
  fontVariantNumeric: "tabular-nums",
  outline: "none",
  selectors: {
    "&:focus-visible": {
      borderColor: tokens.theme.accentLine,
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});
