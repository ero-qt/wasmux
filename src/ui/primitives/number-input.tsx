import { type JSX, Show, splitProps } from "solid-js";
import {
  numberInputField,
  numberInputLabel,
  numberInputRoot,
} from "~/styles/primitives/number-input.css";

export interface NumberInputProps {
  /** Controlled value. */
  value: number;

  /** Called with the parsed number. Clamping only happens on blur. */
  onChange: (next: number) => void;

  /** Lower bound (inclusive). Used on blur to clamp. */
  min?: number;

  /** Upper bound (inclusive). Used on blur to clamp. */
  max?: number;

  /** Keyboard step forwarded to the native input. Defaults to 1. */
  step?: number;

  /** Decimal places shown in the input. Defaults to 0. */
  precision?: number;

  /** Disabled state. */
  disabled?: boolean;

  /** Optional visible label. */
  label?: string;

  /** Required when label is absent. */
  "aria-label"?: string;
}

function clamp(v: number, min: number | undefined, max: number | undefined): number {
  let out = v;
  if (min !== undefined) {
    out = Math.max(min, out);
  }
  if (max !== undefined) {
    out = Math.min(max, out);
  }
  return out;
}

/** Styled numeric input with tabular nums. Native spinbutton semantics. */
export function NumberInput(props: NumberInputProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "value",
    "onChange",
    "min",
    "max",
    "step",
    "precision",
    "disabled",
    "label",
  ]);

  const display = (): string => {
    const p = local.precision ?? 0;
    return p > 0 ? local.value.toFixed(p) : String(local.value);
  };

  return (
    <div class={numberInputRoot}>
      <Show when={local.label}>
        <span class={numberInputLabel}>{local.label}</span>
      </Show>
      <input
        class={numberInputField}
        type="number"
        value={display()}
        min={local.min}
        max={local.max}
        step={local.step ?? 1}
        disabled={local.disabled}
        aria-label={rest["aria-label"]}
        onInput={(e) => {
          const v = Number.parseFloat((e.currentTarget as HTMLInputElement).value);
          if (!Number.isNaN(v)) {
            local.onChange(v);
          }
        }}
        onBlur={() => {
          const clamped = clamp(local.value, local.min, local.max);
          if (clamped !== local.value) {
            local.onChange(clamped);
          }
        }}
      />
    </div>
  );
}
