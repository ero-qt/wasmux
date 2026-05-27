import { onCleanup } from "solid-js";

export interface SplitterDragOptions {
  readonly orientation: "row" | "column";
  /** Reads the splitter's container; siblings are the splitter's previous/next element siblings. */
  readonly container: () => HTMLElement | null;
  /** Called on every move with the new sibling weights (sum to 1). */
  readonly onResize: (sizes: readonly [number, number]) => void;
  /** Optional override; tests inject a stub since jsdom has no real layout. */
  readonly measureMinContent?: (el: HTMLElement, axis: "inline" | "block") => number;
}

interface DragState {
  pointerId: number;
  splitter: HTMLElement;
  leftSibling: HTMLElement;
  rightSibling: HTMLElement;
  axis: "inline" | "block";
  containerPx: number;
  aPx0: number;
  bPx0: number;
  aMin: number;
  bMin: number;
  startCoord: number;
  previousBodyCursor: string;
}

/** Default measurer: temporarily sets the axis size to min-content and reads back. */
function domMeasureMinContent(el: HTMLElement, axis: "inline" | "block"): number {
  const prop = axis === "inline" ? "width" : "height";
  const prev = el.style.getPropertyValue(prop);
  el.style.setProperty(prop, "min-content");
  const rect = el.getBoundingClientRect();
  el.style.setProperty(prop, prev);
  return axis === "inline" ? rect.width : rect.height;
}

/** Numeric clamp helper — exported for tests; pure. */
export function clampDelta(p: {
  aPx: number;
  bPx: number;
  aMin: number;
  bMin: number;
  delta: number;
}): number {
  const aProposed = p.aPx + p.delta;
  const lowerAllowed = p.aMin;
  const upperAllowed = p.aPx + p.bPx - p.bMin;
  if (aProposed < lowerAllowed) {
    return lowerAllowed - p.aPx;
  }
  if (aProposed > upperAllowed) {
    return upperAllowed - p.aPx;
  }
  return p.delta;
}

/** Convert two px sizes into weights summing to 1. 50/50 for the degenerate zero case. */
export function weightsFromPixels(aPx: number, bPx: number): readonly [number, number] {
  const total = aPx + bPx;
  if (total <= 0) {
    return [0.5, 0.5];
  }
  return [aPx / total, bPx / total];
}

/**
 * Attaches pointer-drag behaviour to a splitter `<div>`. Returns a callback
 * that takes the splitter element; pass it as the `ref` prop. Cleans up
 * automatically when the owning component unmounts.
 */
export function useSplitterDrag(opts: SplitterDragOptions): (el: HTMLElement) => void {
  const measure = opts.measureMinContent ?? domMeasureMinContent;
  const axis: "inline" | "block" = opts.orientation === "row" ? "inline" : "block";
  const coordKey = opts.orientation === "row" ? "clientX" : "clientY";

  let drag: DragState | null = null;

  const onPointerDown = (e: PointerEvent): void => {
    const splitter = e.currentTarget;
    if (!(splitter instanceof HTMLElement)) {
      return;
    }
    const left = splitter.previousElementSibling;
    const right = splitter.nextElementSibling;
    const parent = opts.container();
    if (!(left instanceof HTMLElement) || !(right instanceof HTMLElement) || parent === null) {
      return;
    }
    const leftRect = left.getBoundingClientRect();
    const rightRect = right.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const dim = axis === "inline" ? "width" : "height";
    drag = {
      pointerId: e.pointerId,
      splitter,
      leftSibling: left,
      rightSibling: right,
      axis,
      containerPx: parentRect[dim],
      aPx0: leftRect[dim],
      bPx0: rightRect[dim],
      aMin: measure(left, axis),
      bMin: measure(right, axis),
      startCoord: e[coordKey],
      previousBodyCursor: document.body.style.cursor,
    };
    splitter.setPointerCapture(e.pointerId);
    splitter.dataset.dragging = "true";
    document.body.style.cursor = axis === "inline" ? "col-resize" : "row-resize";
    e.preventDefault();
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (drag === null || e.pointerId !== drag.pointerId) {
      return;
    }
    const rawDelta = e[coordKey] - drag.startCoord;
    const delta = clampDelta({
      aPx: drag.aPx0,
      bPx: drag.bPx0,
      aMin: drag.aMin,
      bMin: drag.bMin,
      delta: rawDelta,
    });
    const aNew = drag.aPx0 + delta;
    const bNew = drag.aPx0 + drag.bPx0 - aNew;
    opts.onResize(weightsFromPixels(aNew, bNew));
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (drag === null || e.pointerId !== drag.pointerId) {
      return;
    }
    drag.splitter.releasePointerCapture(drag.pointerId);
    drag.splitter.dataset.dragging = "false";
    document.body.style.cursor = drag.previousBodyCursor;
    drag = null;
  };

  const attach = (el: HTMLElement): void => {
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    onCleanup(() => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    });
  };

  return attach;
}
