import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const menuContent = style({
  background: tokens.theme.bg0,
  border: `1px solid ${tokens.theme.border}`,
  borderRadius: "0.4rem",
  boxShadow: tokens.theme.shadow,
  padding: "calc(0.25rem * var(--ui-density))",
  minInlineSize: "12rem",
  outline: "none",
  zIndex: 2000,
  selectors: {
    "&[data-expanded]": {
      opacity: 1,
      transform: "translateY(0)",
    },
    "&[data-closed]": {
      opacity: 0,
      transform: "translateY(2px)",
    },
  },
  "@media": {
    "(prefers-reduced-motion: no-preference)": {
      transition: "opacity 120ms ease-out, transform 120ms ease-out",
    },
  },
});

export const menuItem = style({
  display: "grid",
  gridTemplateColumns: "1em 1em 1fr auto",
  alignItems: "center",
  gap: "calc(0.4rem * var(--ui-density))",
  paddingBlock: "calc(0.3rem * var(--ui-density))",
  paddingInline: "calc(0.5rem * var(--ui-density))",
  borderRadius: "0.3rem",
  cursor: "pointer",
  outline: "none",
  fontSize: "0.86rem",
  color: tokens.theme.text0,
  selectors: {
    "&[data-highlighted]": {
      background: tokens.theme.bgHover,
    },
    "&[data-disabled]": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});

export const menuItemIndicatorSlot = style({
  inlineSize: "1em",
  blockSize: "1em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

export const menuItemGlyphSlot = style({
  inlineSize: "1em",
  blockSize: "1em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: tokens.theme.text1,
});

export const menuItemLabel = style({
  whiteSpace: "nowrap",
});

export const menuItemHotkey = style({
  marginInlineStart: "calc(0.8rem * var(--ui-density))",
  color: tokens.theme.text2,
});

export const menuSeparator = style({
  blockSize: "1px",
  background: tokens.theme.border,
  border: "none",
  marginBlock: "calc(0.25rem * var(--ui-density))",
  marginInline: "calc(0.5rem * var(--ui-density))",
});

export const menuLabel = style({
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: tokens.theme.text2,
  paddingBlock: "calc(0.3rem * var(--ui-density))",
  paddingInline: "calc(0.5rem * var(--ui-density))",
});

export const menuSubTriggerChevron = style({
  fontSize: "0.8em",
  color: tokens.theme.text2,
});
