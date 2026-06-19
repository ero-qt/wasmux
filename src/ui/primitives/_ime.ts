import { createSignal } from "solid-js";

/** Shared IME-safe input gate for TextField and Textarea. */
export interface ImeGuard {
  /** Returns `true` while the user is mid-composition. */
  isComposing: () => boolean;

  /** Wire onto the host input/textarea's onCompositionStart. */
  onCompositionStart: () => void;

  /** Wire onto the host input/textarea's onCompositionEnd. Commits the final composed value. */
  onCompositionEnd: (e: CompositionEvent) => void;

  /**
   * Wire onto the host input/textarea's onInput. Calls `commit(next)` only when:
   * (a) the user is not mid-composition, AND
   * (b) `next !== current()`.
   */
  onInput: (e: InputEvent) => void;
}

/** Options for {@link createImeGuard}. */
export interface ImeGuardOptions {
  /** Returns the currently-rendered controlled value (props.value). */
  current: () => string;

  /** Called with each non-composition, non-no-op edit. */
  commit: (next: string) => void;
}

/**
 * Returns a guard that suppresses `commit` while the user is composing (CJK/Korean IME)
 * and skips no-op edits where the next value equals the current controlled value.
 */
export function createImeGuard(opts: ImeGuardOptions): ImeGuard {
  const [composing, setComposing] = createSignal(false);

  const readValue = (e: Event): string => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | null;
    return target?.value ?? "";
  };

  return {
    isComposing: composing,
    onCompositionStart: () => setComposing(true),
    onCompositionEnd: (e) => {
      setComposing(false);
      const next = readValue(e);
      if (next !== opts.current()) {
        opts.commit(next);
      }
    },
    onInput: (e) => {
      if (composing()) {
        return;
      }
      const next = readValue(e);
      if (next !== opts.current()) {
        opts.commit(next);
      }
    },
  };
}
