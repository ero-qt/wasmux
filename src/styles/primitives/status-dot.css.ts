import { keyframes, style, styleVariants } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

const pulseKeyframes = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.3 },
});

const base = style({
  display: "inline-block",
  inlineSize: "0.5rem",
  blockSize: "0.5rem",
  borderRadius: "50%",
  flexShrink: 0,
});

export const statusDotTone = styleVariants({
  neutral: [base, { background: tokens.theme.text2 }],
  accent: [base, { background: tokens.theme.accent }],
  audio: [base, { background: tokens.theme.cAudio }],
});

export const statusDotpulse = style({
  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      animation: `${pulseKeyframes} 2.6s ease-in-out infinite`,
    },
  },
});
