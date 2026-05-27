import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

/**
 * Dropdown content surface. Mirrors the zone card styling so menus and zones
 * feel like one visual family.
 */
export const viewsMenuContent = style({
  background: tokens.theme.bg,
  border: `1px solid color-mix(in oklab, ${tokens.theme.accent} 30%, transparent)`,
  borderRadius: "0.5rem",
  boxShadow: `0 0.5rem 1.5rem color-mix(in oklab, ${tokens.theme.accent} 15%, transparent)`,
  padding: "0.25rem",
  minInlineSize: "10rem",
  outline: "none",
  zIndex: 2000,
});

/** One menu item. Hover/keyboard highlight comes from Kobalte's `data-highlighted` attr. */
export const viewsMenuItem = style({
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  paddingBlock: "0.3rem",
  paddingInline: "0.5rem",
  borderRadius: "0.3rem",
  cursor: "pointer",
  outline: "none",
  fontSize: "0.9em",
  selectors: {
    "&[data-highlighted]": {
      background: `color-mix(in oklab, ${tokens.theme.fg} 10%, transparent)`,
    },
  },
});

/** Fixed-width slot at the start of every item; the check renders inside when checked. */
export const viewsMenuItemIndicatorSlot = style({
  inlineSize: "1em",
  blockSize: "1em",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});
