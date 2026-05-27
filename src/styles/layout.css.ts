import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

/** Full-viewport grid that centers its child on both axes. */
export const center = style({
  minBlockSize: "100dvb",
  display: "grid",
  placeContent: "center",
});

/**
 * Named-area grid that is the top-level chrome. Regions: header / bin / program
 * / inspector / timeline / status. Header and status stay always-visible chrome;
 * the four content zones (bin / program / inspector / timeline) are toggleable
 * and collapse out of the grid when hidden. Gap + outer padding render zones
 * as separated cards.
 */
export const appShell = style({
  minBlockSize: "100dvb",
  display: "grid",
  gridTemplateColumns: "auto 1fr auto",
  gridTemplateRows: "auto 1fr auto auto",
  gridTemplateAreas: `
    "header   header    header"
    "bin      program   inspector"
    "timeline timeline  timeline"
    "status   status    status"
  `,
  gap: "0.3rem",
  paddingBlock: "0",
  paddingInline: "0.3rem",
  paddingBlockEnd: "0.3rem",
});

/** Header grid area; the content (icon buttons) sits inside. */
export const headerArea = style({
  gridArea: "header",
});

/** Status grid area; thin strip with the job chain widget. */
export const statusArea = style({
  gridArea: "status",
  paddingBlock: "0.25rem",
  paddingInline: "0.4rem",
  fontSize: "0.82em",
  display: "flex",
  alignItems: "center",
  gap: "0.8rem",
  borderBlockStart: `1px solid color-mix(in oklab, ${tokens.theme.fg} 10%, transparent)`,
  marginBlockStart: "0.1rem",
});

/**
 * A docked zone card. Border + radius make it read as a distinct rectangle;
 * the header strip + body split mirrors the panel chrome we used to ship
 * floating, just docked now.
 */
const zoneFrame = style({
  border: `1px solid color-mix(in oklab, ${tokens.theme.fg} 18%, transparent)`,
  borderRadius: "0.4rem",
  background: tokens.theme.bg,
  display: "flex",
  flexDirection: "column",
  // grid items need explicit min sizes to honor parent track height/width
  // (default min-content can blow the layout if children are larger than the track).
  minInlineSize: 0,
  minBlockSize: 0,
  overflow: "hidden",
});

export const binFrame = style([zoneFrame, { gridArea: "bin" }]);
export const programFrame = style([zoneFrame, { gridArea: "program" }]);
export const inspectorFrame = style([zoneFrame, { gridArea: "inspector" }]);
export const timelineFrame = style([zoneFrame, { gridArea: "timeline" }]);

/** Compact title strip at the top of every zone. Future tab bar replaces it. */
export const zoneHeader = style({
  paddingBlock: "0.15rem",
  paddingInline: "0.5rem",
  fontSize: "0.72em",
  letterSpacing: "0.04em",
  opacity: 0.75,
  background: `color-mix(in oklab, ${tokens.theme.fg} 6%, transparent)`,
  flexShrink: 0,
});

/** Scrollable content area inside a zone. */
export const zoneBody = style({
  flex: 1,
  overflow: "auto",
  padding: "0.4rem 0.5rem",
  minBlockSize: 0,
  minInlineSize: 0,
});

/** Visually de-emphasised text used in placeholder regions. */
export const placeholderText = style({
  opacity: 0.5,
  fontStyle: "italic",
});

/** Hides an element from visual presentation while keeping it in the accessibility tree. */
export const visuallyHidden = style({
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
});
