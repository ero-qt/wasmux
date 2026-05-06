import { createDraggable } from "@neodrag/solid";
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
import { closePanel, isPanelOpen, panelPosition, setPanelPosition } from "~/ui/panels/panel-store";

export type PanelCorner = "top-right" | "bottom-right" | "bottom-left";

const cornerClass: Record<PanelCorner, string> = {
  "top-right": panelTopRight,
  "bottom-right": panelBottomRight,
  "bottom-left": panelBottomLeft,
};

export interface FloatingPanelProps {
  /** Stable id used by the panel store. */
  id: string;

  /** Title rendered in the panel header. */
  title: string;

  /** Default screen corner when first opened, before any drag. */
  position: PanelCorner;

  children: JSX.Element;
}

/**
 * Non-modal overlay window. Mounts at the configured corner; the user can
 * drag it by the header to reposition. Drag offset persists per panel id in
 * the panel store, so closing and reopening returns the panel to wherever the
 * user last left it. Resize and snap are deferred to follow-up commits.
 */
export const FloatingPanel: Component<FloatingPanelProps> = (props) => {
  const { draggable } = createDraggable();
  // referenced by the use:draggable directive below; the void keeps biome
  // from flagging it as unused since it can't see the directive consumption.
  void draggable;

  // header is the drag handle, identified by its vanilla-extract class.
  // neodrag treats `handle` as a CSS selector when given a string, which
  // sidesteps the late-mount ref problem.
  const headerSelector = `.${panelHeader}`;

  return (
    <Show when={isPanelOpen(props.id)}>
      <section
        use:draggable={{
          handle: headerSelector,
          position: panelPosition(props.id),
          bounds: "body",
          onDrag: ({ offsetX, offsetY }) => {
            setPanelPosition(props.id, { x: offsetX, y: offsetY });
          },
        }}
        class={`${panel} ${cornerClass[props.position]}`}
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
