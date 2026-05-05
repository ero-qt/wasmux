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
  alignItems: "baseline",
  gap: "0.4rem",
});

/** Triangle that toggles a node. Reserves layout space even on leaf nodes. */
export const jobToggle = style({
  display: "inline-block",
  inlineSize: "1em",
  textAlign: "center",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "inherit",
  font: "inherit",
  padding: 0,
  minBlockSize: "auto",
  minInlineSize: "auto",
});

export const jobStatusBadge = style({
  fontSize: "0.8em",
  opacity: 0.7,
  textTransform: "uppercase",
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
