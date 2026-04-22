import { onCleanup, onMount } from "solid-js";
import { type AttachOptions, attachToWindow } from "~/core/hotkeys/attach";
import type { HotkeyRegistry } from "~/core/hotkeys/hotkey-registry";

/**
 * Solid-lifecycle wrapper around {@link attachToWindow}. Call once inside a
 * component (typically the root) to bind the registry to `window` keydown/keyup
 * for as long as that component is mounted.
 */
export function mountHotkeys(registry: HotkeyRegistry, options?: AttachOptions): void {
  onMount(() => onCleanup(attachToWindow(registry, options)));
}
