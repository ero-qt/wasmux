import { style, styleVariants } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

const base = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "calc(0.35rem * var(--ui-density))",
  paddingBlock: "calc(0.15rem * var(--ui-density))",
  paddingInline: "calc(0.5rem * var(--ui-density))",
  borderRadius: "9999px",
  border: `1px solid ${tokens.theme.border2}`,
  fontSize: "0.78rem",
  letterSpacing: "0.02em",
  color: tokens.theme.text1,
  background: "transparent",
});

export const pillTone = styleVariants({
  neutral: [base, {}],
  accent: [
    base,
    {
      borderColor: tokens.theme.accentLine,
      color: tokens.theme.accent,
    },
  ],
  audio: [
    base,
    {
      borderColor: tokens.theme.cAudio,
      color: tokens.theme.cAudio,
    },
  ],
});

export const pillDot = style({
  display: "inline-block",
  inlineSize: "0.45rem",
  blockSize: "0.45rem",
  borderRadius: "50%",
  background: "currentColor",
});
