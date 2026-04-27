import type { HotkeyRegistry } from "~/core/hotkeys/hotkey-registry";

export interface AttachOptions {
  /**
   * When `true`, skips hotkey dispatch if focus is inside an `<input>`,
   * `<textarea>`, `<select>`, or `[contenteditable]` element.
   * @defaultValue true
   */
  ignoreInputs?: boolean;

  /**
   * When `false`, suppresses `e.preventDefault()` for all matched actions
   * regardless of per-action settings. When absent or `true`, each matched
   * action's own `preventDefault` field controls the call; modifier-combo
   * keydowns call it by default, bare-key keydowns do not.
   */
  preventDefault?: boolean;
}

/**
 * Wires `window` keydown/keyup to `registry.dispatch` / `registry.release`.
 * Returns an unsubscribe function.
 */
export function attachToWindow(registry: HotkeyRegistry, options?: AttachOptions): () => void {
  const ignoreInputs = options?.ignoreInputs ?? true;

  const onKeydown = (e: KeyboardEvent): void => {
    if (ignoreInputs && isTypableTarget(e.target)) {
      return;
    }

    const matched = registry.dispatch(e);

    if (matched.length === 0 || options?.preventDefault === false) {
      return;
    }

    const hasMod = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    const shouldPrevent = matched.some((a) =>
      a.preventDefault !== undefined ? a.preventDefault : hasMod,
    );

    if (shouldPrevent) {
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

/** Returns `true` when keystrokes targeting `target` should be treated as text entry rather than hotkey input. */
function isTypableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
    return true;
  }

  // catches both direct contenteditable and inherited (nested child inside a
  // contenteditable parent). isContentEditable would be ideal but jsdom doesn't compute it.
  return target.closest('[contenteditable=""], [contenteditable="true"]') !== null;
}
