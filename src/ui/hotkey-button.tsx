import { type Component, type JSX, createSignal, onCleanup, onMount } from "solid-js";
import { formatCombo } from "~/core/hotkeys/format-combo";
import type { HotkeyRegistry } from "~/core/hotkeys/hotkey-registry";

export interface HotkeyButtonProps {
  /** Registry the action will be added to on mount and removed from on cleanup. */
  registry: HotkeyRegistry;
  id: string;
  /** Sentence shown in tooltips and help overlays (e.g. "Play / pause"). */
  description: string;
  /** Hotkey combos as accepted by the registry (e.g. `["Space", "mod+KeyK"]`). */
  keys: string[];
  /** Fire on OS-level key-repeat (e.g. prev/next frame). Defaults to `false`. */
  repeat?: boolean;
  /** Fired both on real mouse clicks and on hotkey activation. */
  onClick: () => void;
  /** Visible button label. */
  children: JSX.Element;
}

/**
 * A plain `<button>` bound to one or more hotkeys. The combo is appended to the
 * `title` / `aria-label` tooltip; we don't render a visible kbd hint.
 * Gets `data-pressed="true"` while the hotkey is held, so CSS can mirror :active.
 */
export const HotkeyButton: Component<HotkeyButtonProps> = (props) => {
  const [pressed, setPressed] = createSignal(false);
  let buttonRef: HTMLButtonElement | undefined;

  const label = (): string => {
    const combos = props.keys.map((k) => formatCombo(k)).join(" / ");
    return combos ? `${props.description} (${combos})` : props.description;
  };

  onMount(() => {
    props.registry.register({
      id: props.id,
      description: props.description,
      keys: props.keys,
      repeat: props.repeat ?? false,
      handler: () => {
        setPressed(true);
        // Route through .click() so the hotkey path and a real mouse press
        // hit the exact same onClick.
        buttonRef?.click();
      },
      onRelease: () => setPressed(false),
    });

    onCleanup(() => props.registry.unregister(props.id));
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={props.onClick}
      title={label()}
      aria-label={label()}
      data-pressed={pressed() ? "true" : undefined}
    >
      {props.children}
    </button>
  );
};
