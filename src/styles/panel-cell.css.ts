import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

/** Leaf shell. Border + radius matches the previous zone cards. */
export const panelCell = style({
  border: `1px solid color-mix(in oklab, ${tokens.theme.text0} 18%, transparent)`,
  borderRadius: "0.4rem",
  background: tokens.theme.bg0,
  display: "flex",
  flexDirection: "column",
  minInlineSize: "min-content",
  minBlockSize: "min-content",
  overflow: "hidden",
});

/** Tab strip across the top of every leaf. */
export const panelTabBar = style({
  display: "flex",
  alignItems: "stretch",
  background: `color-mix(in oklab, ${tokens.theme.text0} 6%, transparent)`,
  flexShrink: 0,
  overflowX: "auto",
});

/** One tab — visual unit pairing the trigger and the × close button. */
export const panelTab = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.2rem",
  paddingBlock: "0.15rem",
  paddingInline: "0.4rem 0.25rem",
  borderInlineEnd: `1px solid color-mix(in oklab, ${tokens.theme.text0} 10%, transparent)`,
  selectors: {
    "&:has([data-selected]):hover, &:has([data-selected])": {
      background: tokens.theme.bg0,
    },
  },
});

/** Trigger inside a tab. Overrides the global button rule. */
export const panelTabTrigger = style({
  fontSize: "0.78em",
  letterSpacing: "0.04em",
  opacity: 0.75,
  background: "transparent",
  border: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  color: "inherit",
  minBlockSize: "auto",
  minInlineSize: "auto",
  selectors: {
    "&[data-selected]": {
      opacity: 1,
    },
    "&:focus-visible": {
      outline: `2px solid ${tokens.theme.accent}`,
      outlineOffset: "2px",
      borderRadius: "0.2rem",
    },
  },
});

/** Tiny × button that closes the panel. */
export const panelTabClose = style({
  fontSize: "0.85em",
  lineHeight: 1,
  opacity: 0.5,
  background: "transparent",
  border: "none",
  padding: "0.05rem 0.2rem",
  margin: 0,
  cursor: "pointer",
  color: "inherit",
  minBlockSize: "auto",
  minInlineSize: "auto",
  borderRadius: "0.2rem",
  selectors: {
    "&:hover": {
      opacity: 1,
      background: `color-mix(in oklab, ${tokens.theme.text0} 15%, transparent)`,
    },
    "&:focus-visible": {
      outline: `2px solid ${tokens.theme.accent}`,
      outlineOffset: "1px",
    },
  },
});

/** Active panel body — the actual content area below the tabs. */
export const panelBody = style({
  flex: 1,
  overflow: "auto",
  padding: "0.4rem 0.5rem",
  minBlockSize: 0,
  minInlineSize: 0,
});

/** Centred placeholder rendered when every panel is closed. */
export const emptyLayout = style({
  minBlockSize: "100%",
  display: "grid",
  placeContent: "center",
  opacity: 0.6,
  fontStyle: "italic",
  textAlign: "center",
});
