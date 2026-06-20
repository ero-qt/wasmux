import { type ComponentProps, type JSX, Show, createUniqueId, splitProps } from "solid-js";
import { textFieldInput, textFieldLabel, textFieldRoot } from "~/styles/primitives/text-field.css";
import { createImeGuard } from "~/ui/primitives/_ime";

export interface TextFieldProps
  extends Omit<
    ComponentProps<"input">,
    | "value"
    | "onInput"
    | "onChange"
    | "type"
    | "disabled"
    | "readOnly"
    | "maxLength"
    | "autocomplete"
  > {
  /** Controlled value. */
  value: string;

  /** Emitted on user input, gated by IME composition and value-equality. */
  onChange: (next: string) => void;

  /** Optional visible label rendered before the field. */
  label?: string;

  /** Placeholder shown when the value is empty. Not a substitute for label. */
  placeholder?: string;

  /** Disabled state. */
  disabled?: boolean;

  /** Read-only state. Field remains focusable and selectable. */
  readOnly?: boolean;

  /** Maximum length forwarded to the native input. */
  maxLength?: number;

  /** Native autocomplete hint. Defaults to "off". */
  autocomplete?: string;

  /** Marks the field invalid; sets aria-invalid only when true. */
  invalid?: boolean;

  /** Required when label is absent. */
  "aria-label"?: string;
}

/**
 * Single-line text input. Mirrors NumberInput's structural shape (div + label
 * + standalone input). IME-safe via `createImeGuard()` — see `_ime.ts`. State
 * markers `data-invalid` / `data-disabled` / `data-readonly` live on the root so
 * styling and tests key off attributes, not class flags.
 */
export function TextField(props: TextFieldProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "value",
    "onChange",
    "label",
    "placeholder",
    "disabled",
    "readOnly",
    "maxLength",
    "autocomplete",
    "invalid",
    "class",
  ]);

  const inputId = createUniqueId();
  const ime = createImeGuard({
    current: () => local.value,
    commit: (next) => local.onChange(next),
  });

  return (
    <div
      class={textFieldRoot}
      data-invalid={local.invalid ? "true" : undefined}
      data-disabled={local.disabled ? "true" : undefined}
      data-readonly={local.readOnly ? "true" : undefined}
    >
      <Show when={local.label}>
        <label class={textFieldLabel} for={inputId}>
          {local.label}
        </label>
      </Show>
      <input
        {...rest}
        id={inputId}
        class={textFieldInput}
        type="text"
        value={local.value}
        placeholder={local.placeholder}
        disabled={local.disabled}
        readOnly={local.readOnly}
        maxLength={local.maxLength}
        autocomplete={local.autocomplete ?? "off"}
        aria-invalid={local.invalid ? "true" : undefined}
        onCompositionStart={ime.onCompositionStart}
        onCompositionEnd={ime.onCompositionEnd}
        onInput={ime.onInput}
      />
    </div>
  );
}
