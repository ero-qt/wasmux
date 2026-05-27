import type { Component } from "solid-js";
import { t } from "~/i18n";
import { splitterColumn, splitterRow } from "~/styles/splitter.css";
import { useSplitterDrag } from "~/ui/layout/use-splitter-drag";

export interface SplitterProps {
  readonly orientation: "row" | "column";
  readonly sizes: readonly [number, number];
  readonly container: () => HTMLElement | null;
  readonly onResize: (sizes: readonly [number, number]) => void;
}

const FINE_STEP = 0.05;
const COARSE_STEP = 0.2;
const MIN = 0.01;
const MAX = 0.99;

/**
 * Splitter between two siblings. Pointer-drags trigger {@link useSplitterDrag};
 * keyboard arrows nudge the leading weight in {@link FINE_STEP} (or
 * {@link COARSE_STEP} with Shift), clamped so neither side reaches zero.
 */
export const Splitter: Component<SplitterProps> = (props) => {
  const attachDrag = useSplitterDrag({
    orientation: props.orientation,
    container: props.container,
    onResize: props.onResize,
  });

  const onKeyDown = (event: KeyboardEvent): void => {
    const step = event.shiftKey ? COARSE_STEP : FINE_STEP;
    const inc =
      props.orientation === "row" ? ["ArrowRight", "ArrowDown"] : ["ArrowDown", "ArrowRight"];
    const dec = props.orientation === "row" ? ["ArrowLeft", "ArrowUp"] : ["ArrowUp", "ArrowLeft"];
    if (event.key === "Home") {
      props.onResize([MAX, 1 - MAX]);
      event.preventDefault();
      return;
    }
    if (event.key === "End") {
      props.onResize([MIN, 1 - MIN]);
      event.preventDefault();
      return;
    }
    let delta = 0;
    if (inc.includes(event.key)) {
      delta = step;
    } else if (dec.includes(event.key)) {
      delta = -step;
    } else {
      return;
    }

    const aRaw = props.sizes[0] + delta;
    // Round to 10 significant decimal places to avoid floating-point drift
    // (e.g. 0.5 + 0.05 = 0.55, so complement is exactly 0.45 not 0.44999…).
    const a = Math.round(Math.max(MIN, Math.min(MAX, aRaw)) * 1e10) / 1e10;
    props.onResize([a, Math.round((1 - a) * 1e10) / 1e10]);
    event.preventDefault();
  };

  return (
    <hr
      ref={attachDrag}
      class={props.orientation === "row" ? splitterRow : splitterColumn}
      aria-orientation={props.orientation === "row" ? "vertical" : "horizontal"}
      aria-valuenow={Math.round(props.sizes[0] * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t("layout.splitter.resize")}
      tabindex={0}
      onKeyDown={onKeyDown}
    />
  );
};
