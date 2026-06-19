import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const keycap = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minInlineSize: "1.4rem",
  paddingBlock: "0.05rem",
  paddingInline: "0.35rem",
  borderRadius: "0.25rem",
  border: `1px solid ${tokens.theme.border2}`,
  background: tokens.theme.bg2,
  color: tokens.theme.text1,
  fontFamily: "inherit",
  fontSize: "0.72rem",
  letterSpacing: "0.02em",
  // baseline so adjacent text + keycap align on the same line.
  verticalAlign: "baseline",
});
