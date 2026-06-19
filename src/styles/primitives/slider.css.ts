import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const sliderRoot = style({
  display: "flex",
  alignItems: "center",
  gap: "calc(0.5rem * var(--ui-density))",
  paddingBlock: "calc(0.2rem * var(--ui-density))",
  selectors: {
    '&[aria-disabled="true"]': {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});

export const sliderLabel = style({
  flex: "0 0 74px",
  fontSize: "0.78rem",
  color: tokens.theme.text1,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const sliderTrack = style({
  flex: 1,
  position: "relative",
  blockSize: "18px",
  display: "flex",
  alignItems: "center",
  cursor: "ew-resize",
  // focus ring lives here so the thumb visual is what gets outlined.
  selectors: {
    '&[data-disabled="true"]': {
      cursor: "not-allowed",
    },
  },
});

export const sliderRail = style({
  position: "absolute",
  insetInline: 0,
  blockSize: "4px",
  background: tokens.theme.bg3,
  borderRadius: "2px",
});

export const sliderFill = style({
  position: "absolute",
  blockSize: "4px",
  background: tokens.theme.accent,
  borderRadius: "2px",
});

export const sliderBipolar = style({});

export const sliderThumb = style({
  position: "absolute",
  inlineSize: "11px",
  blockSize: "11px",
  marginInlineStart: "-5px",
  background: tokens.theme.text0,
  border: `2px solid ${tokens.theme.accent}`,
  borderRadius: "50%",
  pointerEvents: "none",
  selectors: {
    [`${sliderTrack}:focus-visible &`]: {
      boxShadow: `0 0 0 2px ${tokens.theme.accentLine}`,
    },
  },
});

export const sliderValue = style({
  flex: "0 0 48px",
  textAlign: "end",
  fontSize: "0.78rem",
  fontVariantNumeric: "tabular-nums",
  color: tokens.theme.text0,
});
