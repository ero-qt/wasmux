import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const textareaRoot = style({
  display: "flex",
  flexDirection: "column",
  gap: "calc(0.25rem * var(--ui-density))",
  vars: {
    "--textarea-line-height": "1.4em",
  },
});

export const textareaLabel = style({
  fontSize: "0.78rem",
  color: tokens.theme.text1,
});

export const textareaField = style({
  background: tokens.theme.bg2,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.3rem",
  paddingBlock: "calc(0.35rem * var(--ui-density))",
  paddingInline: "calc(0.5rem * var(--ui-density))",
  color: tokens.theme.text0,
  fontFamily: "inherit",
  fontSize: "0.86rem",
  lineHeight: "var(--textarea-line-height)",
  outline: "none",
  fieldSizing: "content",
  minBlockSize: "calc(var(--textarea-line-height) * var(--textarea-min-rows, 3))",
  maxBlockSize: "calc(var(--textarea-line-height) * var(--textarea-max-rows, 10))",
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
    // resize driven by data-resize attribute so consumer `style` isn't clobbered.
    '&[data-resize="none"]': { resize: "none" },
    '&[data-resize="block"]': { resize: "block" },
    '&[data-resize="inline"]': { resize: "inline" },
    '&[data-resize="both"]': { resize: "both" },
    [`${textareaRoot}[data-invalid="true"] &`]: {
      borderColor: tokens.theme.cDanger,
    },
    [`${textareaRoot}[data-no-grow="true"] &`]: {
      fieldSizing: "fixed",
    },
  },
});

export const textareaDescription = style({
  fontSize: "0.72rem",
  color: tokens.theme.text2,
  selectors: {
    [`${textareaRoot}[data-invalid="true"] &`]: {
      color: tokens.theme.cDanger,
    },
  },
});
