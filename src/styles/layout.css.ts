import { style } from "@vanilla-extract/css";

/** Full-viewport grid that centers its child on both axes. */
export const center = style({
  minBlockSize: "100dvb",
  display: "grid",
  placeContent: "center",
});
