import { type Flatten, flatten, resolveTemplate, translator } from "@solid-primitives/i18n";
import { type Messages, en } from "~/i18n/messages/en";

/** All locales currently shipped. Add new entries as their catalogs land. */
const dictionaries = { en } as const satisfies Record<string, Messages>;

export type Locale = keyof typeof dictionaries;

type FlatMessages = Flatten<Messages>;

const initialFlat = flatten(en) as FlatMessages;
let activeLocale: Locale = "en";
let activeFlat: FlatMessages = initialFlat;

/**
 * Translate a message key. The factory closure means subsequent {@link setLocale}
 * calls are picked up by future invocations without re-importing.
 */
export const t = translator<FlatMessages>(() => activeFlat, resolveTemplate);

/** Returns the currently active locale tag. */
export function getLocale(): Locale {
  return activeLocale;
}

/** Locales whose default writing direction is right-to-left (BCP 47 base subtags). */
const RTL_BASE_LANGS = new Set(["ar", "he", "fa", "ur", "ps", "sd", "yi"]);

/** Returns `true` when `tag`'s base language is canonically RTL. */
export function isRtl(tag: string): boolean {
  return RTL_BASE_LANGS.has(tag.split("-")[0] ?? "");
}

/** Resolves `tag` to a supported locale, preferring exact match then base-language match. */
function matchSupportedLocale(tag: string): Locale {
  const supported = Object.keys(dictionaries) as Locale[];
  const exact = supported.find((s) => s.toLowerCase() === tag.toLowerCase());
  if (exact) {
    return exact;
  }

  const base = tag.split("-")[0]?.toLowerCase() ?? "";
  const baseMatch = supported.find((s) => s.split("-")[0]?.toLowerCase() === base);
  return baseMatch ?? "en";
}

/**
 * Activates `locale` for subsequent {@link t} calls and writes `lang`/`dir` onto
 * `<html>`. No-op outside a DOM (SSR, workers).
 */
export function setLocale(locale: string): void {
  const resolved = matchSupportedLocale(locale);
  activeLocale = resolved;
  activeFlat = flatten(dictionaries[resolved]) as FlatMessages;

  if (typeof document !== "undefined") {
    document.documentElement.lang = resolved;
    document.documentElement.dir = isRtl(resolved) ? "rtl" : "ltr";
  }
}

/**
 * Picks the best supported locale from a preference list (e.g. `navigator.languages`).
 * Falls back to `"en"` when nothing matches.
 */
export function negotiateLocale(preferred: readonly string[]): Locale {
  for (const tag of preferred) {
    const supported = Object.keys(dictionaries) as Locale[];
    const exact = supported.find((s) => s.toLowerCase() === tag.toLowerCase());
    if (exact) {
      return exact;
    }

    const base = tag.split("-")[0]?.toLowerCase() ?? "";
    const baseMatch = supported.find((s) => s.split("-")[0]?.toLowerCase() === base);
    if (baseMatch) {
      return baseMatch;
    }
  }

  return "en";
}
