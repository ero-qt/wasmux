import { style } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

/** Full-viewport grid that centers its child on both axes. */
export const center = style({
  minBlockSize: "100dvb",
  display: "grid",
  placeContent: "center",
});

/**
 * Named-area grid that is the top-level chrome. Regions: header / bin / program /
 * inspector / timeline / status. Only the program column and the editing row
 * scale; everything else hugs its content. Floating panels (perf, jobs) live
 * in a sibling overlay layer rather than a region.
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
});

/** Header brand mark; matches the body font size rather than browser-default `<h1>`. */
export const brandMark = style({
  margin: 0,
  fontSize: "1rem",
});

const region = style({
  borderInlineStart: `1px solid ${tokens.theme.accent}`,
  borderBlockStart: `1px solid ${tokens.theme.accent}`,
  padding: "0.75rem 1rem",
  overflow: "auto",
});

export const headerRegion = style([
  region,
  {
    gridArea: "header",
    borderInlineStart: "none",
    borderBlockStart: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
]);

export const binRegion = style([region, { gridArea: "bin", borderInlineStart: "none" }]);
export const programRegion = style([region, { gridArea: "program" }]);
export const inspectorRegion = style([region, { gridArea: "inspector" }]);
export const timelineRegion = style([region, { gridArea: "timeline", borderInlineStart: "none" }]);

export const statusRegion = style([
  region,
  {
    gridArea: "status",
    borderInlineStart: "none",
    paddingBlock: "0.4rem",
    fontSize: "0.85em",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
]);

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
