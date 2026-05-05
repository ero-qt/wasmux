import { type Component, type JSX, Show } from "solid-js";
import { t } from "~/i18n";
import {
  panel,
  panelBody,
  panelBottomLeft,
  panelBottomRight,
  panelClose,
  panelHeader,
  panelTitle,
  panelTopRight,
} from "~/styles/panel.css";
import { closePanel, isPanelOpen } from "~/ui/panels/panel-store";

export type PanelPosition = "top-right" | "bottom-right" | "bottom-left";

const positionClass: Record<PanelPosition, string> = {
  "top-right": panelTopRight,
  "bottom-right": panelBottomRight,
  "bottom-left": panelBottomLeft,
};

export interface FloatingPanelProps {
  /** Stable id used by the panel store. */
  id: string;

  /** Title rendered in the panel header. */
  title: string;

  /** Default screen position when open. */
  position: PanelPosition;

  children: JSX.Element;
}

/**
 * Non-modal overlay window. Renders nothing while the panel is closed; on
 * open, mounts at the configured corner with a header (title + close button)
 * and a scrollable body. Drag/resize are deliberately absent for v0.
 */
export const FloatingPanel: Component<FloatingPanelProps> = (props) => {
  return (
    <Show when={isPanelOpen(props.id)}>
      <section
        class={`${panel} ${positionClass[props.position]}`}
        role="dialog"
        aria-label={props.title}
      >
        <header class={panelHeader}>
          <h2 class={panelTitle}>{props.title}</h2>
          <button
            type="button"
            class={panelClose}
            onClick={() => closePanel(props.id)}
            aria-label={t("panel.close")}
          >
            ×
          </button>
        </header>
        <div class={panelBody}>{props.children}</div>
      </section>
    </Show>
  );
};
