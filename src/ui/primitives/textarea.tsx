import { type JSX, Show, createUniqueId, splitProps } from "solid-js";
import {
  textareaDescription,
  textareaField,
  textareaLabel,
  textareaRoot,
} from "~/styles/primitives/textarea.css";
import { createImeGuard } from "~/ui/primitives/_ime";

export type TextareaResize = "none" | "block" | "inline" | "both";

export interface TextareaProps
  extends Omit<
    JSX.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "onInput" | "value" | "disabled" | "readOnly" | "maxLength" | "autocomplete"
  > {
  /** Controlled value. */
  value: string;

  /** Emitted on user input, gated by IME composition and value-equality. */
  onChange: (next: string) => void;

  /** Optional visible label rendered above the field. */
  label?: string;

  /** Grows the field to fit content via CSS `field-sizing: content`. Default true. */
  autoGrow?: boolean;

  /** Minimum visible rows. Also drives the `rows` fallback. Default 3. */
  minRows?: number;

  /** Maximum rows before the field scrolls. Default 10. */
  maxRows?: number;

  /** User-resize affordance. Default "none" when autoGrow, "block" otherwise. */
  resize?: TextareaResize;

  /** Marks the field invalid; sets aria-invalid. */
  invalid?: boolean;

  /** Disabled state. */
  disabled?: boolean;

  /** Read-only state. */
  readOnly?: boolean;

  /** Maximum character length. */
  maxLength?: number;

  /** Native autocomplete hint. Defaults to "off". */
  autocomplete?: string;

  /**
   * Optional help / error text rendered below the field and wired via
   * aria-describedby for screen readers.
   */
  description?: string;

  /** Required when label is absent. */
  "aria-label"?: string;
}

/**
 * Multi-line text input. CSS `field-sizing: content` for auto-grow with a `rows`
 * fallback. IME-safe via `createImeGuard()`. Matches TextField's structural
 * shape (div root + sibling label + standalone textarea).
 */
export function Textarea(props: TextareaProps): JSX.Element {
  const [local, rest] = splitProps(props, [
    "value",
    "onChange",
    "label",
    "autoGrow",
    "minRows",
    "maxRows",
    "resize",
    "invalid",
    "disabled",
    "readOnly",
    "maxLength",
    "autocomplete",
    "description",
  ]);

  const inputId = createUniqueId();
  const descId = createUniqueId();
  const minRows = (): number => local.minRows ?? 3;
  const maxRows = (): number => local.maxRows ?? 10;
  const autoGrow = (): boolean => local.autoGrow !== false;
  const resizeMode = (): TextareaResize => local.resize ?? (autoGrow() ? "none" : "block");

  const ime = createImeGuard({
    current: () => local.value,
    commit: (next) => local.onChange(next),
  });

  return (
    <div
      class={textareaRoot}
      data-invalid={local.invalid ? "true" : undefined}
      data-disabled={local.disabled ? "true" : undefined}
      data-readonly={local.readOnly ? "true" : undefined}
      data-no-grow={autoGrow() ? undefined : "true"}
      style={{
        "--textarea-min-rows": String(minRows()),
        "--textarea-max-rows": String(maxRows()),
      }}
    >
      <Show when={local.label}>
        <label class={textareaLabel} for={inputId}>
          {local.label}
        </label>
      </Show>
      <textarea
        {...rest}
        id={inputId}
        class={textareaField}
        value={local.value}
        rows={minRows()}
        disabled={local.disabled}
        readOnly={local.readOnly}
        maxLength={local.maxLength}
        autocomplete={local.autocomplete ?? "off"}
        aria-invalid={local.invalid ? "true" : undefined}
        aria-describedby={local.description ? descId : undefined}
        data-resize={resizeMode()}
        onCompositionStart={ime.onCompositionStart}
        onCompositionEnd={ime.onCompositionEnd}
        onInput={ime.onInput}
      />
      <Show when={local.description}>
        <span id={descId} class={textareaDescription}>
          {local.description}
        </span>
      </Show>
    </div>
  );
}
