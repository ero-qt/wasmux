import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

export const jobsEmpty = style({
  margin: 0,
  opacity: 0.5,
  fontStyle: "italic",
});

export const jobsTreeRoot = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const jobNode = style({});

export const jobNodeHeader = style({
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
});

/** Disclosure button. Borderless, padded to keep the icon centered. */
export const jobToggle = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  inlineSize: "1.4em",
  blockSize: "1.4em",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "inherit",
  font: "inherit",
  padding: 0,
  minBlockSize: "auto",
  minInlineSize: "auto",
  borderRadius: "0.3rem",
  flexShrink: 0,
});

/** Triangle SVG inside {@link jobToggle}. Rotates 90° when the parent is expanded. */
export const jobToggleIcon = style({
  transition: "transform 120ms ease",
  selectors: {
    'button[aria-expanded="true"] &': {
      transform: "rotate(90deg)",
    },
  },
});

export const jobStatusBadge = style({
  fontSize: "0.8em",
  opacity: 0.6,
});

export const jobReportLine = style({
  fontSize: "0.85em",
  opacity: 0.7,
});

export const jobChainWidget = style({
  display: "inline-flex",
  alignItems: "baseline",
  gap: "0.3rem",
});

export const jobChainSeparator = style({
  opacity: 0.5,
});

export const jobChildren = style({
  listStyle: "none",
  margin: 0,
  paddingInlineStart: "1.2rem",
  borderInlineStart: `1px solid ${tokens.theme.accent}`,
  marginInlineStart: "0.4em",
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});
