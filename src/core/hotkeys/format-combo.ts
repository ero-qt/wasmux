import { type Platform, detectPlatform, parseCombo } from "~/core/hotkeys/platform";
import { t } from "~/i18n";

/**
 * Renders a combo string like `"ctrl+KeyS"` into a human-readable label like
 * `"Ctrl+S"` suitable for help tables and tooltips. Modifier and named-key
 * labels come from the active locale via the i18n catalog.
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
      return t("hotkey.modifier.ctrl");
    case "alt":
      return t("hotkey.modifier.alt");
    case "shift":
      return t("hotkey.modifier.shift");
    case "meta":
      return formatMeta(platform);
    default:
      return mod;
  }
}

/** Per-OS display label for the meta key. */
function formatMeta(platform: Platform): string {
  switch (platform) {
    case "mac":
    case "ios":
      return t("hotkey.modifier.meta.mac");
    case "windows":
      return t("hotkey.modifier.meta.windows");
    case "linux":
      return t("hotkey.modifier.meta.linux");
    default:
      return t("hotkey.modifier.meta.other");
  }
}

/**
 * `event.code` → catalog key for keys that don't follow the `KeyX` / `DigitX`
 * / `FN` patterns and aren't punctuation glyphs.
 */
const NAMED_KEY_CATALOG: Readonly<Record<string, Parameters<typeof t>[0]>> = {
  Space: "hotkey.key.space",
  Enter: "hotkey.key.enter",
  Escape: "hotkey.key.escape",
  Backspace: "hotkey.key.backspace",
  Tab: "hotkey.key.tab",
  Delete: "hotkey.key.delete",
  Home: "hotkey.key.home",
  End: "hotkey.key.end",
  PageUp: "hotkey.key.pageUp",
  PageDown: "hotkey.key.pageDown",
  Insert: "hotkey.key.insert",
  ArrowLeft: "hotkey.key.arrowLeft",
  ArrowRight: "hotkey.key.arrowRight",
  ArrowUp: "hotkey.key.arrowUp",
  ArrowDown: "hotkey.key.arrowDown",
};

/** Punctuation glyphs are the same in every locale, so they bypass the catalog. */
const PUNCTUATION_GLYPHS: Readonly<Record<string, string>> = {
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
    return t("hotkey.key.numpad", { suffix: code.slice(6) });
  }

  if (/^F\d{1,2}$/.test(code)) {
    return code;
  }

  const catalogKey = NAMED_KEY_CATALOG[code];
  if (catalogKey) {
    return t(catalogKey) as string;
  }

  return PUNCTUATION_GLYPHS[code] ?? code;
}
