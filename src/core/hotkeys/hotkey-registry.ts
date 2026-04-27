import { type Platform, detectPlatform, usesCmd } from "~/core/hotkeys/platform";

export type { Platform };

/**
 * A bindable unit. Handlers self-gate (e.g. `if (!hasSelection()) return;`).
 * If two actions share a combo, both fire.
 */
export interface Action {
  readonly id: string;

  /** Short human-readable sentence, shown in help overlays and tooltips. */
  readonly description: string;

  /**
   * Combos using `event.code` for the base key (`"Space"`, `"KeyS"`,
   * `"ArrowLeft"`) and `ctrl` / `shift` / `alt` / `meta` modifiers.
   * `mod` resolves to Ctrl on non-Mac, Cmd on Mac.
   */
  readonly keys: readonly string[];

  /** Optional grouping label for help overlays (e.g. "Playback", "Editing"). */
  readonly category?: string;

  /**
   * When `true`, fires `handler` on OS-level key-repeat keydown events too.
   * @defaultValue false
   */
  readonly repeat?: boolean;

  /**
   * Guard predicate evaluated on every keydown. The action is skipped entirely
   * (handler not called, not included in the matched set) when this returns
   * `false`. Use to satisfy WCAG 2.1.4: bare-key shortcuts should be scoped
   * to a focused region, e.g. `() => timeline.contains(document.activeElement)`.
   */
  readonly when?: () => boolean;

  /**
   * When `true`, calls `e.preventDefault()` for any keydown matching this
   * action. When `false`, never calls it. When absent, modifier-combo keydowns
   * call it and bare-key keydowns do not (preserves native browser behaviour).
   */
  readonly preventDefault?: boolean;

  /** Fired on keydown when any of `keys` matches. */
  readonly handler: () => void;

  /** Called on keyup whose `event.code` matches the keydown that fired `handler`. */
  readonly onRelease?: () => void;
}

export interface HotkeyRegistry {
  /**
   * Adds `a` to the registry.
   * @throws if `a.id` is already registered.
   */
  register(a: Action): void;

  /** Removes the action with `id`. No-op for unknown ids. */
  unregister(id: string): void;

  /** Returns all registered actions in registration order. */
  list(): readonly Action[];

  /**
   * Dispatches a keydown event. Returns all matched actions (empty if none).
   * An action is included when its combo matches and its `when` predicate (if
   * present) returns `true`, even when the handler is skipped due to key-repeat.
   */
  dispatch(e: KeyboardEvent): readonly Action[];

  /** Fires `onRelease` for every held action whose base key matches `e.code`. */
  release(e: KeyboardEvent): void;
}

/** Creates an empty in-memory registry. One registry usually lives for the app's lifetime. */
export function createHotkeyRegistry(): HotkeyRegistry {
  const platform = detectPlatform();
  const actions: Action[] = [];
  const byId = new Map<string, Action>();
  // action id → the event.code that most recently fired it, used by release()
  // so we can fire onRelease for the matching keyup.
  const held = new Map<string, string>();

  return {
    register(a) {
      if (byId.has(a.id)) {
        throw new Error(`Hotkey action already registered: ${a.id}`);
      }

      byId.set(a.id, a);
      actions.push(a);
    },

    unregister(id) {
      if (!byId.delete(id)) {
        return;
      }

      held.delete(id);
      const idx = actions.findIndex((a) => a.id === id);
      if (idx >= 0) {
        actions.splice(idx, 1);
      }
    },

    list() {
      return actions;
    },

    dispatch(e) {
      const target = eventToCombo(e);
      const matched: Action[] = [];

      for (const a of actions) {
        if (a.when && !a.when()) {
          continue;
        }

        for (const k of a.keys) {
          if (normalizeCombo(k, platform) === target) {
            matched.push(a);

            if (!(e.repeat && !a.repeat)) {
              a.handler();

              if (!e.repeat) {
                held.set(a.id, e.code);
              }
            }

            break;
          }
        }
      }

      return matched;
    },

    release(e) {
      const toRelease: string[] = [];

      for (const [id, code] of held) {
        if (code === e.code) {
          toRelease.push(id);
        }
      }

      for (const id of toRelease) {
        held.delete(id);
        byId.get(id)?.onRelease?.();
      }
    },
  };
}

/** Canonical modifier names sorted alphabetically so combos compare as strings. */
const MODIFIERS_BY_FLAG = ["alt", "ctrl", "meta", "shift"] as const;

/** Builds a canonical `"ctrl+alt+KeyS"`-style combo string from a live `KeyboardEvent`. */
function eventToCombo(e: KeyboardEvent): string {
  const mods: string[] = [];

  if (e.altKey) {
    mods.push("alt");
  }

  if (e.ctrlKey) {
    mods.push("ctrl");
  }

  if (e.metaKey) {
    mods.push("meta");
  }

  if (e.shiftKey) {
    mods.push("shift");
  }

  return [...mods, e.code].join("+");
}

/**
 * Normalises a user-supplied combo to the same canonical form `eventToCombo`
 * produces: modifiers lower-cased, de-duplicated, alphabetised, with `mod`
 * resolved to the platform's primary modifier.
 */
function normalizeCombo(combo: string, platform: Platform): string {
  const parts = combo.split("+");
  const code = parts[parts.length - 1] ?? "";
  const rawMods = parts.slice(0, -1).map((m) => m.toLowerCase());

  const resolved = rawMods.map((m) => (m === "mod" ? (usesCmd(platform) ? "meta" : "ctrl") : m));
  const unique = Array.from(new Set(resolved))
    .filter((m): m is (typeof MODIFIERS_BY_FLAG)[number] =>
      (MODIFIERS_BY_FLAG as readonly string[]).includes(m),
    )
    .sort();

  return [...unique, code].join("+");
}
