import { type ComponentProps, For, type JSX, splitProps } from "solid-js";
import { chip, chipGroupRoot } from "~/styles/primitives/chip.css";

export interface ChipProps
  extends Omit<ComponentProps<"button">, "type" | "aria-label" | "onClick" | "onChange"> {
  /** Required — chips are typically icon + short label. */
  "aria-label"?: string;

  /** Controlled state. */
  pressed: boolean;

  /** Called with the next value when the chip is activated. */
  onChange: (next: boolean) => void;

  children: JSX.Element;
}

/** Pill-shaped toggle. Used standalone or composed inside ChipGroup. */
export function Chip(props: ChipProps): JSX.Element {
  const [local, rest] = splitProps(props, ["pressed", "onChange", "children"]);
  return (
    <button
      {...rest}
      type="button"
      class={chip}
      aria-pressed={local.pressed}
      onClick={() => {
        if (rest.disabled) {
          return;
        }
        local.onChange(!local.pressed);
      }}
    >
      {local.children}
    </button>
  );
}

export interface ChipGroupProps<T extends string> {
  /** Currently selected value. */
  value: T;

  /** Called with the new value. */
  onChange: (next: T) => void;

  /** Options in display order. */
  options: ReadonlyArray<{ value: T; label: string }>;

  /** Disables every chip. */
  disabled?: boolean;

  /** Required — radiogroup name. */
  "aria-label"?: string;
}

/** Radio-style chip group. Exactly one chip is pressed at a time. */
export function ChipGroup<T extends string>(props: ChipGroupProps<T>): JSX.Element {
  return (
    <div class={chipGroupRoot} role="radiogroup" aria-label={props["aria-label"]}>
      <For each={props.options}>
        {(opt) => (
          <Chip
            pressed={opt.value === props.value}
            disabled={props.disabled}
            aria-label={opt.label}
            onChange={(next) => {
              if (next && opt.value !== props.value) {
                props.onChange(opt.value);
              }
            }}
          >
            {opt.label}
          </Chip>
        )}
      </For>
    </div>
  );
}
