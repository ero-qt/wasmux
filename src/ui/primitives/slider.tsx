import { type JSX, Show, createSignal, onCleanup, splitProps } from "solid-js";
import {
  sliderBipolar,
  sliderFill,
  sliderLabel,
  sliderRail,
  sliderRoot,
  sliderThumb,
  sliderTrack,
  sliderValue,
} from "~/styles/primitives/slider.css";

export interface SliderProps {
  /** Controlled value. */
  value: number;

  /** Called with the next clamped value. */
  onChange: (next: number) => void;

  /** Lower bound (inclusive). */
  min: number;

  /** Upper bound (inclusive). */
  max: number;

  /** Keyboard step. Defaults to 1. */
  step?: number;

  /** Fill from 50% centre instead of from 0. Used for Exposure / Contrast / Pan. */
  bipolar?: boolean;

  /** Custom CSS background expression for the track. Suppresses the fill rect. */
  trackBackground?: string;

  /** Optional visible label (74px reserved column). */
  label?: string;

  /** Custom value formatter for `aria-valuetext` and the value column. */
  valueLabel?: (v: number) => string;

  /** Disabled state — suppresses keyboard + pointer input. */
  disabled?: boolean;

  /** Required when `label` is absent. */
  "aria-label"?: string;

  /** Alternative to `aria-label`. */
  "aria-labelledby"?: string;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function quantize(v: number, step: number, min: number): number {
  const stepped = Math.round((v - min) / step) * step + min;
  return stepped;
}

/**
 * Continuous slider primitive. Supports linear fill, bipolar (centre-fill),
 * and custom-track-background variants via props. Keyboard nav follows the
 * WAI-ARIA Slider pattern; pointer drag maps clientX linearly to value.
 */
export function Slider(props: SliderProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "value",
    "onChange",
    "min",
    "max",
    "step",
    "bipolar",
    "trackBackground",
    "label",
    "valueLabel",
    "disabled",
  ]);

  const step = (): number => local.step ?? 1;
  const valueText = (): string =>
    local.valueLabel ? local.valueLabel(local.value) : String(local.value);

  const pct = (): number => {
    const range = local.max - local.min;
    if (range <= 0) {
      return 0;
    }
    return ((local.value - local.min) / range) * 100;
  };

  const fillStyle = (): { left: string; width: string } | undefined => {
    if (local.trackBackground) {
      return undefined;
    }
    if (!local.bipolar) {
      return { left: "0", width: `${pct()}%` };
    }
    const p = pct();
    if (p >= 50) {
      return { left: "50%", width: `${p - 50}%` };
    }
    return { left: `${p}%`, width: `${50 - p}%` };
  };

  const emit = (next: number): void => {
    const clamped = clamp(next, local.min, local.max);
    if (clamped !== local.value) {
      local.onChange(clamped);
    }
  };

  const onKeyDown = (e: KeyboardEvent): void => {
    if (local.disabled) {
      return;
    }
    const big = e.shiftKey ? step() * 10 : step();
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        emit(local.value - big);
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        emit(local.value + big);
        break;
      case "PageDown":
        e.preventDefault();
        emit(local.value - step() * 10);
        break;
      case "PageUp":
        e.preventDefault();
        emit(local.value + step() * 10);
        break;
      case "Home":
        e.preventDefault();
        emit(local.min);
        break;
      case "End":
        e.preventDefault();
        emit(local.max);
        break;
    }
  };

  // pointer drag — captures clientX, maps to value linearly, releases on up.
  const [dragging, setDragging] = createSignal(false);
  let trackEl: HTMLDivElement | undefined;

  const valueFromClientX = (clientX: number): number => {
    if (!trackEl) {
      return local.value;
    }
    const rect = trackEl.getBoundingClientRect();
    if (rect.width === 0) {
      return local.value;
    }
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    const raw = local.min + ratio * (local.max - local.min);
    return quantize(raw, step(), local.min);
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (!dragging()) {
      return;
    }
    emit(valueFromClientX(e.clientX));
  };

  const onPointerUp = (): void => {
    setDragging(false);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  };

  const onPointerDown = (e: PointerEvent): void => {
    if (local.disabled) {
      return;
    }
    e.preventDefault();
    setDragging(true);
    emit(valueFromClientX(e.clientX));
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    trackEl?.focus();
  };

  onCleanup(() => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
  });

  const trackClass = (): string =>
    local.bipolar ? `${sliderTrack} ${sliderBipolar}` : sliderTrack;

  return (
    <div class={sliderRoot} aria-disabled={local.disabled ? "true" : undefined}>
      <Show when={local.label}>
        <span class={sliderLabel}>{local.label}</span>
      </Show>
      <div
        ref={trackEl}
        class={trackClass()}
        data-testid="slider-track"
        data-disabled={local.disabled ? "true" : undefined}
        role="slider"
        aria-valuemin={local.min}
        aria-valuemax={local.max}
        aria-valuenow={local.value}
        aria-valuetext={valueText()}
        aria-orientation="horizontal"
        aria-disabled={local.disabled ? "true" : undefined}
        aria-label={rest["aria-label"]}
        aria-labelledby={rest["aria-labelledby"]}
        tabIndex={local.disabled ? -1 : 0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        style={local.trackBackground ? { background: local.trackBackground } : undefined}
      >
        <Show when={!local.trackBackground}>
          <div class={sliderRail} aria-hidden="true" />
          <div class={sliderFill} style={fillStyle()} aria-hidden="true" />
        </Show>
        <div class={sliderThumb} style={{ left: `${pct()}%` }} aria-hidden="true" />
      </div>
      <span class={sliderValue}>{valueText()}</span>
    </div>
  );
}
