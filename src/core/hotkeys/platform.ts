/**
 * Operating systems we adapt hotkey behaviour and display labels for.
 * `"other"` is the catch-all for SSR, ChromeOS, BSDs, and anything we can't
 * confidently identify.
 */
export type Platform = "mac" | "windows" | "linux" | "ios" | "android" | "other";

/** Subset of the User-Agent Client Hints shape we actually read. */
interface NavigatorUAData {
  readonly platform: string;
}

/**
 * Best-effort OS detection.
 *
 * Prefers `navigator.userAgentData` (reduced-entropy Client Hints, Chromium)
 * and falls back to the deprecated but stable `navigator.platform` on
 * Firefox/Safari, with `userAgent` as a last resort for mobile sniffing.
 *
 * Returns `"other"` when there's no `navigator` (SSR, Workers) or nothing matches.
 */
export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") {
    return "other";
  }

  const nav = navigator as { userAgentData?: NavigatorUAData };
  const raw = (
    nav.userAgentData?.platform ??
    navigator.platform ??
    navigator.userAgent ??
    ""
  ).toLowerCase();

  // iPadOS reports as "MacIntel" via navigator.platform, so check iOS markers
  // (which only show up in the userAgent on iPad) before falling through to mac.
  if (/iphone|ipad|ipod/.test(raw)) {
    return "ios";
  }

  if (/android/.test(raw)) {
    return "android";
  }

  if (/mac/.test(raw)) {
    return "mac";
  }

  if (/win/.test(raw)) {
    return "windows";
  }

  if (/linux|x11/.test(raw)) {
    return "linux";
  }

  return "other";
}

/**
 * Whether the platform's primary modifier is Cmd (meta) rather than Ctrl.
 * Drives `mod` resolution in combos.
 */
export function usesCmd(platform: Platform): boolean {
  return platform === "mac" || platform === "ios";
}

/** Parsed combo: lowercased modifiers with `mod` resolved to `meta`/`ctrl`, plus the base `event.code`. */
export interface ParsedCombo {
  readonly mods: readonly string[];
  readonly code: string;
}

/**
 * Splits a `"mod+shift+KeyZ"`-style combo into its lowercased modifiers and
 * base code, resolving `"mod"` to the platform's primary modifier. Modifiers
 * are returned in the order they appear; deduplication and ordering are left
 * to the caller (canonical sort vs display order).
 */
export function parseCombo(combo: string, platform: Platform): ParsedCombo {
  const parts = combo.split("+");
  const code = parts[parts.length - 1] ?? "";
  const mods = parts
    .slice(0, -1)
    .map((m) => m.toLowerCase())
    .map((m) => (m === "mod" ? (usesCmd(platform) ? "meta" : "ctrl") : m));

  return { mods, code };
}
