import type { HotkeyRegistry } from "~/core/hotkeys/hotkey-registry";

export interface AttachOptions {
  /**
   * Skip dispatch when focus is in an `<input>`, `<textarea>`, or `[contenteditable]`.
   * Defaults to `true`.
   */
  ignoreInputs?: boolean;
  /**
   * Call {@link KeyboardEvent.preventDefault()} when a hotkey matches.
   * Defaults to `true`.
   */
  preventDefault?: boolean;
}

/**
 * Wires `window` keydown/keyup to `registry.dispatch` / `registry.release`.
 * Returns an unsubscribe.
 */
export function attachToWindow(registry: HotkeyRegistry, options?: AttachOptions): () => void {
  const ignoreInputs = options?.ignoreInputs ?? true;
  const preventDefault = options?.preventDefault ?? true;

  const onKeydown = (e: KeyboardEvent): void => {
    if (ignoreInputs && isTypableTarget(e.target)) {
      return;
    }

    if (registry.dispatch(e) && preventDefault) {
      e.preventDefault();
    }
  };

  const onKeyup = (e: KeyboardEvent): void => {
    registry.release(e);
  };

  window.addEventListener("keydown", onKeydown);
  window.addEventListener("keyup", onKeyup);

  return () => {
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("keyup", onKeyup);
  };
}

/**
 * True if a keystroke on `target` should be treated as text entry rather than a hotkey.
 */
function isTypableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  // catches both direct contenteditable and inherited (nested child inside a contenteditable
  // parent). isContentEditable would be ideal but jsdom doesn't compute it.
  return target.closest('[contenteditable=""], [contenteditable="true"]') !== null;
}
