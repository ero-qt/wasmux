import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

globalStyle("button", {
  fontFamily: "inherit",
  fontSize: "inherit",
  color: tokens.theme.accent,
  background: "transparent",
  border: `1px solid color-mix(in oklab, ${tokens.theme.accent} 40%, transparent)`,
  borderRadius: "0.4rem",
  paddingBlock: "0.4em",
  paddingInline: "1em",
  // both axes ≥ WCAG 2.5.8 AA target size; inline-size guards single-character
  // labels (icon buttons) where padding alone wouldn't reach 24px.
  minBlockSize: "24px",
  minInlineSize: "24px",
  cursor: "pointer",
  transition: "background-color 120ms ease, border-color 120ms ease",
});

globalStyle("button:focus-visible", {
  outline: `2px solid ${tokens.theme.accent}`,
  outlineOffset: "2px",
});

globalStyle("button:hover", {
  background: tokens.theme.accentSoft,
});

// `[data-pressed="true"]` mirrors :active for hotkey-driven presses, where
// the synthetic .click() never triggers the native pseudo-class.
globalStyle('button:active, button[data-pressed="true"]', {
  background: tokens.theme.accent,
  color: tokens.theme.bg,
});
