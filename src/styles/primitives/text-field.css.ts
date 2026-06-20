import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const textFieldRoot = style({
  display: "flex",
  alignItems: "center",
  gap: "calc(0.4rem * var(--ui-density))",
});

export const textFieldLabel = style({
  flex: "0 0 auto",
  fontSize: "0.78rem",
  color: tokens.theme.text1,
});

export const textFieldInput = style({
  flex: 1,
  minInlineSize: 0,
  background: tokens.theme.bg2,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.3rem",
  paddingBlock: "calc(0.25rem * var(--ui-density))",
  paddingInline: "calc(0.4rem * var(--ui-density))",
  color: tokens.theme.text0,
  fontFamily: "inherit",
  fontSize: "0.78rem",
  outline: "none",
  selectors: {
    "&::placeholder": {
      color: tokens.theme.text2,
    },
    "&:focus-visible": {
      borderColor: tokens.theme.accentLine,
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    [`${textFieldRoot}[data-invalid="true"] &`]: {
      borderColor: tokens.theme.cDanger,
    },
  },
});
