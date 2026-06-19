import { For, type JSX } from "solid-js";
import { segmentedRoot, segmentedTab } from "~/styles/primitives/segmented-control.css";

export interface SegmentedControlProps<T extends string> {
  /** Currently selected value. */
  value: T;

  /** Called with the new value. */
  onChange: (next: T) => void;

  /** Options in display order. */
  options: ReadonlyArray<{ value: T; label: string }>;

  /** Disables every tab. */
  disabled?: boolean;

  /** Required — tablist label. */
  "aria-label"?: string;
}

/**
 * Tab-strip selector. WAI-ARIA tablist semantics; arrow keys cycle through
 * tabs and emit the new value. Used for Inspector Clip/Canvas tabs, Settings
 * Theme triple, and any small enum picker.
 */
export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>): JSX.Element {
  const indexOf = (v: T): number => props.options.findIndex((o) => o.value === v);

  const onKeyDown = (e: KeyboardEvent): void => {
    if (props.disabled) {
      return;
    }
    const i = indexOf(props.value);
    if (i === -1) {
      return;
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = props.options[(i + 1) % props.options.length];
      if (next && next.value !== props.value) {
        props.onChange(next.value);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = props.options[(i - 1 + props.options.length) % props.options.length];
      if (next && next.value !== props.value) {
        props.onChange(next.value);
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = props.options[0];
      if (first && first.value !== props.value) {
        props.onChange(first.value);
      }
    } else if (e.key === "End") {
      e.preventDefault();
      const last = props.options[props.options.length - 1];
      if (last && last.value !== props.value) {
        props.onChange(last.value);
      }
    }
  };

  return (
    <div class={segmentedRoot} role="tablist" aria-label={props["aria-label"]}>
      <For each={props.options}>
        {(opt) => {
          const selected = (): boolean => opt.value === props.value;
          return (
            <button
              type="button"
              role="tab"
              class={segmentedTab}
              aria-selected={selected()}
              tabIndex={selected() ? 0 : -1}
              disabled={props.disabled}
              onClick={() => {
                if (!props.disabled && opt.value !== props.value) {
                  props.onChange(opt.value);
                }
              }}
              onKeyDown={onKeyDown}
            >
              {opt.label}
            </button>
          );
        }}
      </For>
    </div>
  );
}
