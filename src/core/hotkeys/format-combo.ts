import { type Platform, detectPlatform, parseCombo } from "~/core/hotkeys/platform";

/**
 * Renders a combo string like `"ctrl+KeyS"` into a human-readable label like
 * `"Ctrl+S"` suitable for help tables and tooltips.
 *
 * `"mod"` resolves to the platform's primary modifier: Cmd on mac/iOS, Ctrl
 * elsewhere. `"meta"` renders as Cmd on mac/iOS, Win on Windows, Super on
 * Linux, and "Meta" everywhere else.
 */
export function formatCombo(combo: string, platform?: Platform): string {
  const p = platform ?? detectPlatform();
  const { mods, code } = parseCombo(combo, p);
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const name of MODIFIER_ORDER) {
    if (mods.includes(name) && !seen.has(name)) {
      seen.add(name);
      ordered.push(formatModifier(name, p));
    }
  }

  return [...ordered, formatKey(code)].join("+");
}

/** Display order for modifier keys, following the OS convention (Ctrl first, Cmd last). */
const MODIFIER_ORDER = ["ctrl", "alt", "shift", "meta"] as const;

/** Turns an internal modifier name into its on-screen label for the current platform. */
function formatModifier(mod: string, platform: Platform): string {
  switch (mod) {
    case "ctrl":
      return "Ctrl";
    case "alt":
      return "Alt";
    case "shift":
      return "Shift";
    case "meta":
      return formatMeta(platform);
    default:
      return mod;
  }
}

/** Per-OS display label for the meta key (Cmd / Win / Super / Meta). */
function formatMeta(platform: Platform): string {
  switch (platform) {
    case "mac":
    case "ios":
      return "Cmd";
    case "windows":
      return "Win";
    case "linux":
      return "Super";
    default:
      return "Meta";
  }
}

/** `event.code` → display label for keys that don't follow the `KeyX` / `DigitX` / `FN` patterns. */
const NAMED_KEYS: Readonly<Record<string, string>> = {
  Space: "Space",
  Enter: "Enter",
  Escape: "Esc",
  Backspace: "Backspace",
  Tab: "Tab",
  Delete: "Delete",
  Home: "Home",
  End: "End",
  PageUp: "Page Up",
  PageDown: "Page Down",
  Insert: "Insert",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  ArrowUp: "Up",
  ArrowDown: "Down",
  Minus: "-",
  Equal: "=",
  Slash: "/",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  BracketLeft: "[",
  BracketRight: "]",
  Comma: ",",
  Period: ".",
  Backquote: "`",
};

/** Turns a bare `event.code` into its on-screen label (`"KeyS"` → `"S"`, `"ArrowUp"` → `"Up"`). */
function formatKey(code: string): string {
  if (code.startsWith("Key") && code.length === 4) {
    return code.slice(3);
  }

  if (code.startsWith("Digit") && code.length === 6) {
    return code.slice(5);
  }

  if (code.startsWith("Numpad")) {
    return `Numpad ${code.slice(6)}`;
  }

  if (/^F\d{1,2}$/.test(code)) {
    return code;
  }

  return NAMED_KEYS[code] ?? code;
}
