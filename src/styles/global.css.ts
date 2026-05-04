import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

globalStyle("html, body, #root", {
  margin: 0,
  padding: 0,
  fontFamily: "monospace",
  // 1.125rem matches the previous `large` keyword on every browser default,
  // but scales predictably with the user's root font-size preference.
  fontSize: "1.125rem",
  background: tokens.theme.bg,
  color: tokens.theme.fg,
});

// honor display cutouts / rounded corners declared via viewport-fit=cover.
globalStyle("body", {
  paddingBlockStart: "env(safe-area-inset-top)",
  paddingBlockEnd: "env(safe-area-inset-bottom)",
  paddingInlineStart: "env(safe-area-inset-left)",
  paddingInlineEnd: "env(safe-area-inset-right)",
});

// WCAG 2.3.3 / vestibular-safety baseline. per-component animations can opt
// back in by gating their own rule on (prefers-reduced-motion: no-preference).
// scroll-behavior is intentionally left to per-component opt-in rather than
// reset here so we never `!important`-cast a non-string-typed property.
globalStyle("*, ::before, ::after", {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
    },
  },
});
