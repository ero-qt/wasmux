import { createDraggable } from "@neodrag/solid";
import { type Component, For, type JSX, Show } from "solid-js";
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
import {
  closePanel,
  isPanelOpen,
  panelPosition,
  panelSize,
  setPanelPosition,
} from "~/ui/panels/panel-store";
import { type ResizeEdge, ResizeHandle } from "~/ui/panels/resize-handle";

export type PanelCorner = "top-right" | "bottom-right" | "bottom-left";

const cornerClass: Record<PanelCorner, string> = {
  "top-right": panelTopRight,
  "bottom-right": panelBottomRight,
  "bottom-left": panelBottomLeft,
};

/** Keyboard step in pixels for arrow-driven panel movement. Shift bumps it 5x. */
const KEYBOARD_STEP_PX = 10;
const KEYBOARD_BIG_STEP_PX = 50;

/** Lower bounds the resize handles enforce. Block min ≈ title-bar height. */
const MIN_INLINE_SIZE_PX = 16 * 16; // 16rem at 16px root
const MIN_BLOCK_SIZE_PX = 16 * 1.8; // 1.8rem ≈ title-bar height

const ALL_EDGES: readonly ResizeEdge[] = [
  "top",
  "right",
  "bottom",
  "left",
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

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
 * Non-modal overlay window. Mouse drag lives on the header (neodrag); mouse
 * resize on `<ResizeHandle>` siblings (4 edges + 4 corners). Keyboard:
 * focusing the header lets arrow keys move (Shift = larger step), Escape
 * resets both position and size to defaults.
 */
export const FloatingPanel: Component<FloatingPanelProps> = (props) => {
  const { draggable } = createDraggable();
  // referenced by the use:draggable directive below; the void keeps biome
  // from flagging it as unused since it can't see the directive consumption.
  void draggable;

  // header is the drag handle for both mouse and keyboard. neodrag accepts a
  // CSS selector for `handle`, so passing the vanilla-extract class string
  // sidesteps the late-mount ref problem.
  const headerSelector = `.${panelHeader}`;

  let panelEl: HTMLElement | undefined;
  const setPanelRef = (el: HTMLElement): void => {
    panelEl = el;
  };
  const getPanelEl = (): HTMLElement | undefined => panelEl;

  const onHeaderKeyDown = (e: KeyboardEvent): void => {
    const step = e.shiftKey ? KEYBOARD_BIG_STEP_PX : KEYBOARD_STEP_PX;
    let dx = 0;
    let dy = 0;
    switch (e.key) {
      case "ArrowLeft":
        dx = -step;
        break;
      case "ArrowRight":
        dx = step;
        break;
      case "ArrowUp":
        dy = -step;
        break;
      case "ArrowDown":
        dy = step;
        break;
      case "Escape":
        e.preventDefault();
        closePanel(props.id);
        return;
      default:
        return;
    }
    e.preventDefault();
    const cur = panelPosition(props.id);
    setPanelPosition(props.id, { x: cur.x + dx, y: cur.y + dy });
  };

  const sizeStyle = (): JSX.CSSProperties | undefined => {
    const s = panelSize(props.id);
    if (!s) {
      return undefined;
    }
    return {
      "inline-size": `${s.inlineSize}px`,
      "block-size": `${s.blockSize}px`,
    };
  };

  return (
    <Show when={isPanelOpen(props.id)}>
      <section
        ref={setPanelRef}
        use:draggable={{
          handle: headerSelector,
          position: panelPosition(props.id),
          bounds: "body",
          onDrag: ({ offsetX, offsetY }) => {
            setPanelPosition(props.id, { x: offsetX, y: offsetY });
          },
        }}
        class={`${panel} ${cornerClass[props.position]}`}
        style={sizeStyle()}
        role="dialog"
        aria-label={props.title}
      >
        <For each={ALL_EDGES}>
          {(edge) => (
            <ResizeHandle
              edge={edge}
              panelId={props.id}
              panelEl={getPanelEl}
              minInlineSize={MIN_INLINE_SIZE_PX}
              minBlockSize={MIN_BLOCK_SIZE_PX}
            />
          )}
        </For>
        <div
          ref={(el) => {
            // tabIndex set via ref so biome's static-JSX a11y rule doesn't
            // flag it. role=toolbar is interactive per WAI-ARIA APG, but
            // biome's interactive-roles list doesn't include it. The handle
            // takes keyboard focus so arrow keys can move the panel.
            el.tabIndex = 0;
          }}
          role="toolbar"
          class={panelHeader}
          onKeyDown={onHeaderKeyDown}
          aria-label={t("panel.dragHandle", { title: props.title })}
        >
          <h2 class={panelTitle}>{props.title}</h2>
          <button
            type="button"
            class={panelClose}
            onClick={() => closePanel(props.id)}
            aria-label={t("panel.close")}
          >
            ×
          </button>
        </div>
        <div class={panelBody}>{props.children}</div>
      </section>
    </Show>
  );
};
