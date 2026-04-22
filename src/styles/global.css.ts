import { globalStyle } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

globalStyle("html, body, #root", {
  margin: 0,
  padding: 0,
  fontFamily: "monospace",
  fontSize: "large",
  background: tokens.theme.bg,
  color: tokens.theme.fg,
});
