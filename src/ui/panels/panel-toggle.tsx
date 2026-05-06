import type { Component, JSX } from "solid-js";
import { isPanelOpen, togglePanel } from "~/ui/panels/panel-store";

export interface PanelToggleProps {
  /** Stable id of the panel to toggle. */
  id: string;

  /** Accessible name (and tooltip). */
  label: string;

  /**
   * Visible button content. Defaults to {@link PanelToggleProps.label} so
   * callers can use the toggle without supplying an icon, and override with
   * an icon or shorter glyph once those exist.
   */
  children?: JSX.Element;
}

/**
 * Plain `<button>` that toggles a floating panel's open state. `aria-pressed`
 * reflects the *current* state so assistive tech announces "pressed" while
 * the panel is open. Hotkey bindings are registered separately in `App.tsx`;
 * this component is the click path.
 */
export const PanelToggle: Component<PanelToggleProps> = (props) => {
  return (
    <button
      type="button"
      onClick={() => togglePanel(props.id)}
      aria-pressed={isPanelOpen(props.id)}
      aria-label={props.label}
      title={props.label}
    >
      {props.children ?? props.label}
    </button>
  );
};
