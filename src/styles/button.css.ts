import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

globalStyle("button", {
  fontFamily: "inherit",
  fontSize: "inherit",
  color: tokens.theme.accent,
  background: "transparent",
  border: `1px solid ${tokens.theme.accent}`,
  padding: "0.4em 1em",
  cursor: "pointer",
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
