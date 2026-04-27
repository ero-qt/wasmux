import { type Component, type JSX, Show, createSignal, onCleanup, onMount } from "solid-js";
import { formatCombo } from "~/core/hotkeys/format-combo";
import type { HotkeyRegistry } from "~/core/hotkeys/hotkey-registry";
import { visuallyHidden } from "~/styles/visually-hidden.css";

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
  /**
   * Persistent toggle state. Maps to `aria-pressed` so assistive technology
   * announces "on" / "off". Distinct from the transient `data-pressed` styling
   * hook that mirrors `:active` during a hotkey hold.
   */
  toggled?: boolean;
  /** Fired both on real mouse clicks and on hotkey activation. */
  onClick: () => void;
  /** Visible button label. */
  children: JSX.Element;
}

/**
 * A plain `<button>` bound to one or more hotkeys. The formatted combo is
 * injected into a visually-hidden `<span>` so the accessible name is
 * derived from the button's contents (visible text + hidden combo), which
 * satisfies WCAG 2.5.3 Label in Name without an overriding `aria-label`.
 * Gets `data-pressed="true"` while the hotkey is held so CSS can mirror :active.
 */
export const HotkeyButton: Component<HotkeyButtonProps> = (props) => {
  const [pressed, setPressed] = createSignal(false);
  let buttonRef: HTMLButtonElement | undefined;

  const combos = (): string => props.keys.map((k) => formatCombo(k)).join(" / ");

  const title = (): string => {
    const c = combos();
    return c ? `${props.description} (${c})` : props.description;
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
      title={title()}
      aria-pressed={props.toggled !== undefined ? String(props.toggled) : undefined}
      data-pressed={pressed() ? "true" : undefined}
    >
      {props.children}
      <Show when={combos()}>
        {(c) => <span class={visuallyHidden}> ({c()})</span>}
      </Show>
    </button>
  );
};
