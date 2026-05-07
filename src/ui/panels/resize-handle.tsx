import type { Component } from "solid-js";
import {
  handleBottom,
  handleBottomLeft,
  handleBottomRight,
  handleLeft,
  handleRight,
  handleTop,
  handleTopLeft,
  handleTopRight,
} from "~/styles/panel.css";
import {
  type PanelPosition,
  panelPosition,
  resetPanelSize,
  setPanelPosition,
  setPanelSize,
} from "~/ui/panels/panel-store";

export type ResizeEdge =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

const edgeClass: Record<ResizeEdge, string> = {
  top: handleTop,
  right: handleRight,
  bottom: handleBottom,
  left: handleLeft,
  "top-left": handleTopLeft,
  "top-right": handleTopRight,
  "bottom-left": handleBottomLeft,
  "bottom-right": handleBottomRight,
};

export interface ResizeHandleProps {
  edge: ResizeEdge;
  panelId: string;
  panelEl: () => HTMLElement | undefined;

  /** Lower bound on inline-size in pixels. Resize won't go below. */
  minInlineSize: number;

  /** Lower bound on block-size in pixels. */
  minBlockSize: number;
}

/**
 * One pointer-driven resize handle. Tracks the panel's starting size and
 * position on `pointerdown`, then updates them on each `pointermove` until
 * `pointerup`. Edges that grow toward the inline-end / block-end (right,
 * bottom) just adjust size; edges anchored at the start (top, left) adjust
 * both size and position so the opposite edge stays put.
 */
export const ResizeHandle: Component<ResizeHandleProps> = (props) => {
  const onPointerDown = (e: PointerEvent): void => {
    const el = props.panelEl();
    if (!el) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const handle = e.currentTarget as HTMLElement;
    handle.setPointerCapture(e.pointerId);

    const rect = el.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startInline = rect.width;
    const startBlock = rect.height;
    const startPos = panelPosition(props.panelId);
    const edge = props.edge;
    const movesLeft = edge === "left" || edge === "top-left" || edge === "bottom-left";
    const movesTop = edge === "top" || edge === "top-left" || edge === "top-right";
    const movesRight = edge === "right" || edge === "top-right" || edge === "bottom-right";
    const movesBottom = edge === "bottom" || edge === "bottom-left" || edge === "bottom-right";

    const onMove = (ev: PointerEvent): void => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      let inline = startInline;
      let block = startBlock;
      let posX = startPos.x;
      let posY = startPos.y;

      if (movesRight) {
        inline = startInline + dx;
      }
      if (movesLeft) {
        inline = startInline - dx;
        posX = startPos.x + dx;
      }
      if (movesBottom) {
        block = startBlock + dy;
      }
      if (movesTop) {
        block = startBlock - dy;
        posY = startPos.y + dy;
      }

      // clamp to mins; when we'd cross the floor on a left/top edge, the
      // position has to stop tracking too so the opposite edge doesn't drift.
      if (inline < props.minInlineSize) {
        if (movesLeft) {
          posX = startPos.x + (startInline - props.minInlineSize);
        }
        inline = props.minInlineSize;
      }
      if (block < props.minBlockSize) {
        if (movesTop) {
          posY = startPos.y + (startBlock - props.minBlockSize);
        }
        block = props.minBlockSize;
      }

      setPanelSize(props.panelId, { inlineSize: inline, blockSize: block });
      const nextPos: PanelPosition = { x: posX, y: posY };
      if (nextPos.x !== startPos.x || nextPos.y !== startPos.y) {
        setPanelPosition(props.panelId, nextPos);
      }
    };

    const onUp = (): void => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  // double-clicking the right or bottom edge resets the panel to auto sizing.
  // top/left/corners would be ambiguous (which edge stays put?), so they don't
  // get this affordance.
  const onDblClick = (): void => {
    if (props.edge === "right" || props.edge === "bottom") {
      resetPanelSize(props.panelId);
    }
  };

  return (
    <div
      class={edgeClass[props.edge]}
      onPointerDown={onPointerDown}
      onDblClick={onDblClick}
      aria-hidden="true"
    />
  );
};
