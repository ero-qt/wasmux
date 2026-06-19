import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const catalogueShell = style({
  display: "grid",
  gridTemplateColumns: "minmax(120px, 160px) 1fr",
  blockSize: "100dvb",
  background: tokens.theme.bg0,
  color: tokens.theme.text0,
});

export const catalogueSidebar = style({
  borderInlineEnd: `1px solid ${tokens.theme.border}`,
  background: tokens.theme.bg1,
  overflowY: "auto",
  padding: "calc(0.6rem * var(--ui-density))",
});

export const catalogueList = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "calc(0.2rem * var(--ui-density))",
});

export const catalogueItem = style({
  cursor: "pointer",
  padding: "calc(0.3rem * var(--ui-density)) calc(0.5rem * var(--ui-density))",
  borderRadius: "0.3rem",
  fontSize: "0.875rem",
  color: tokens.theme.text1,
  selectors: {
    "&[aria-current='true']": {
      background: tokens.theme.accentSoft,
      color: tokens.theme.text0,
    },
    "&:hover": {
      background: tokens.theme.bgHover,
    },
  },
});

export const cataloguePanel = style({
  overflowY: "auto",
  padding: "calc(1.2rem * var(--ui-density))",
});
