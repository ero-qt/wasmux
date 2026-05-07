import { createDraggable } from "@neodrag/solid";
import { type Component, type JSX, Show, onCleanup } from "solid-js";
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
  resetPanelPosition,
  setPanelPosition,
  setPanelSize,
} from "~/ui/panels/panel-store";

export type PanelCorner = "top-right" | "bottom-right" | "bottom-left";

const cornerClass: Record<PanelCorner, string> = {
  "top-right": panelTopRight,
  "bottom-right": panelBottomRight,
  "bottom-left": panelBottomLeft,
};

/** Threshold (px from the bottom-right corner) for treating a pointerdown as a resize start. */
const RESIZE_HANDLE_PX = 24;

/** Keyboard step in pixels for arrow-driven panel movement. Shift bumps it 5x. */
const KEYBOARD_STEP_PX = 10;
const KEYBOARD_BIG_STEP_PX = 50;

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
 * Non-modal overlay window. Mouse drag lives on the header (neodrag);
 * keyboard drag on the focused header (arrow keys move, shift+arrow steps
 * larger, Escape resets to the default corner). Mouse resize is the native
 * `resize: both` handle; a `ResizeObserver` writes user-driven changes back
 * to the panel store so size survives close/reopen.
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
  // CSS `resize: both` doesn't expose drag-start events, so we treat any
  // pointerdown landing in the bottom-right ~24px square as the start of a
  // user resize. The ResizeObserver below then only persists size while this
  // flag is set, so layout-driven size changes (content growth) don't pin
  // the panel at an accidental size.
  let userResizing = false;

  const onPanelPointerDown = (e: PointerEvent): void => {
    if (!panelEl) {
      return;
    }
    const rect = panelEl.getBoundingClientRect();
    if (rect.right - e.clientX < RESIZE_HANDLE_PX && rect.bottom - e.clientY < RESIZE_HANDLE_PX) {
      userResizing = true;
    }
  };

  const onWindowPointerUp = (): void => {
    userResizing = false;
  };

  const setupResize = (el: HTMLElement): void => {
    panelEl = el;
    el.addEventListener("pointerdown", onPanelPointerDown);
    window.addEventListener("pointerup", onWindowPointerUp);

    // ResizeObserver is missing in jsdom. Skipping the persistence wiring
    // there is harmless: the test environment never user-resizes anything.
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver((entries) => {
            if (!userResizing) {
              return;
            }
            const entry = entries[0];
            if (!entry) {
              return;
            }
            const box = entry.borderBoxSize[0];
            if (!box) {
              return;
            }
            setPanelSize(props.id, { inlineSize: box.inlineSize, blockSize: box.blockSize });
          })
        : undefined;
    observer?.observe(el);

    onCleanup(() => {
      observer?.disconnect();
      el.removeEventListener("pointerdown", onPanelPointerDown);
      window.removeEventListener("pointerup", onWindowPointerUp);
    });
  };

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
        resetPanelPosition(props.id);
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
        ref={setupResize}
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
