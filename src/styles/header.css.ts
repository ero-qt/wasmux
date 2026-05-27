import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

/**
 * Header chrome strip. Compact (lower padding than a content region), no
 * border, lives above the gap-padded grid.
 */
export const headerStrip = style({
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  paddingBlock: "0.3rem",
  paddingInline: "0.4rem",
});

/**
 * Single source of truth for header buttons. Anything that lives in the
 * top-bar (views menu trigger, theme toggle, future settings cog, etc.)
 * uses this. Square, icon-sized, no border, soft hover wash — the typical
 * desktop-app top-bar button.
 *
 * Overrides the global `<button>` rule that gives bordered text buttons.
 */
export const headerIconButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1.75rem",
  blockSize: "1.75rem",
  padding: 0,
  border: "none",
  borderRadius: "0.3rem",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  fontSize: "inherit",
  minInlineSize: "1.75rem",
  minBlockSize: "1.75rem",
  selectors: {
    "&:hover": {
      background: `color-mix(in oklab, ${tokens.theme.fg} 10%, transparent)`,
    },
    '&[aria-pressed="true"]': {
      background: `color-mix(in oklab, ${tokens.theme.accent} 25%, transparent)`,
    },
  },
});

/** SVG inside a {@link headerIconButton}. Sized once so every icon matches. */
export const headerIcon = style({
  inlineSize: "1rem",
  blockSize: "1rem",
});
