import { type ComponentProps, For, type JSX, splitProps } from "solid-js";
import { swatch, swatchChecker, swatchRowRoot } from "~/styles/primitives/swatch.css";

export interface SwatchProps
  extends Omit<ComponentProps<"button">, "type" | "aria-label" | "onClick" | "onChange"> {
  /** Any CSS color expression, OR the literal string `"checker"` for a transparency checkerboard. */
  color: string;

  /** Optional controlled pressed state. */
  pressed?: boolean;

  /** Called with the next pressed value when clicked. */
  onChange?: (next: boolean) => void;

  /** Required. */
  "aria-label": string;
}

/** Square colour chip. Optional toggle behaviour via `pressed` + `onChange`. */
export function Swatch(props: SwatchProps): JSX.Element {
  const [local, rest] = splitProps(props, ["color", "pressed", "onChange"]);
  const isChecker = (): boolean => local.color === "checker";
  const cls = (): string => (isChecker() ? `${swatch} ${swatchChecker}` : swatch);
  return (
    <button
      {...rest}
      type="button"
      class={cls()}
      style={isChecker() ? undefined : { background: local.color }}
      aria-pressed={local.pressed === undefined ? undefined : local.pressed}
      onClick={() => {
        if (rest.disabled || !local.onChange) {
          return;
        }
        local.onChange(!(local.pressed ?? false));
      }}
    />
  );
}

export interface SwatchRowProps<T extends string> {
  /** Currently selected value. */
  value: T;

  /** Called with the new value. */
  onChange: (next: T) => void;

  /** Options in display order. */
  options: ReadonlyArray<{ value: T; color: string; label: string }>;

  /** Disables every swatch. */
  disabled?: boolean;

  /** Radiogroup label. */
  "aria-label"?: string;
}

/** Radio-style row of swatches. Exactly one pressed at a time. */
export function SwatchRow<T extends string>(props: SwatchRowProps<T>): JSX.Element {
  return (
    <div class={swatchRowRoot} role="radiogroup" aria-label={props["aria-label"]}>
      <For each={props.options}>
        {(opt) => (
          <Swatch
            color={opt.color}
            aria-label={opt.label}
            disabled={props.disabled}
            pressed={opt.value === props.value}
            onChange={(next) => {
              if (next && opt.value !== props.value) {
                props.onChange(opt.value);
              }
            }}
          />
        )}
      </For>
    </div>
  );
}
