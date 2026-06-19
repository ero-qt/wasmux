/** Side of the trigger an overlay anchors to. Maps 1:1 to Kobalte's placement primary axis. */
export type OverlaySide = "top" | "right" | "bottom" | "left";

/** Alignment along the trigger's edge. Maps to Kobalte's placement alignment suffix. */
export type OverlayAlign = "start" | "center" | "end";

/** Default pixel gap between trigger and overlay surface. Applied across Popover, Tooltip, and Menu. */
export const OVERLAY_GUTTER = 6;
