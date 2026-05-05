import type { Component, JSX } from "solid-js";
import { panelOverlay } from "~/styles/panel.css";

export interface PanelOverlayProps {
  children: JSX.Element;
}

/**
 * Top-level container for every {@link FloatingPanel}. Sits above the app
 * shell and pipes pointer events through the empty space so the editor stays
 * interactive while panels are open.
 */
export const PanelOverlay: Component<PanelOverlayProps> = (props) => {
  return <div class={panelOverlay}>{props.children}</div>;
};
