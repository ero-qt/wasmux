import { For, type JSX, Show } from "solid-js";
import { selectField, selectLabel, selectRoot } from "~/styles/primitives/select.css";

export interface SelectOption<T extends string> {
  /** The submitted value. Native `<select>` is string-typed. */
  value: T;

  /** Visible label. */
  label: string;
}

export interface SelectProps<T extends string> {
  /** Controlled value. */
  value: T;

  /** Called with the new selected value. */
  onChange: (next: T) => void;

  /** Options in display order. */
  options: ReadonlyArray<SelectOption<T>>;

  /** Disabled state. */
  disabled?: boolean;

  /** Optional visible label. */
  label?: string;

  /** Required when label is absent. */
  "aria-label"?: string;
}

/** Styled native select. Generic over string-literal option values. */
export function Select<T extends string>(props: SelectProps<T>): JSX.Element {
  return (
    <div class={selectRoot}>
      <Show when={props.label}>
        <span class={selectLabel}>{props.label}</span>
      </Show>
      <select
        class={selectField}
        value={props.value}
        disabled={props.disabled}
        aria-label={props["aria-label"]}
        onChange={(e) => props.onChange((e.currentTarget as HTMLSelectElement).value as T)}
      >
        <For each={props.options}>{(opt) => <option value={opt.value}>{opt.label}</option>}</For>
      </select>
    </div>
  );
}
