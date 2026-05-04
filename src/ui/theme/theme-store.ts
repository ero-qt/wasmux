import { createEffect, createRoot, createSignal } from "solid-js";
import { defaultDark } from "~/styles/themes/default-dark.css";
import { defaultLight } from "~/styles/themes/default-light.css";

export type ThemeName = "dark" | "light";

const themeClass: Record<ThemeName, string> = {
  dark: defaultDark,
  light: defaultLight,
};

/** Reads the OS-level color-scheme preference. Returns `"dark"` when no `matchMedia`. */
function detectSystemTheme(): ThemeName {
  if (typeof matchMedia === "undefined") {
    return "dark";
  }
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

const [theme, setTheme] = createSignal<ThemeName>(detectSystemTheme());

/** Reactive accessor for the active theme name. */
export { theme };

/** Sets the active theme explicitly. */
export function setActiveTheme(next: ThemeName): void {
  setTheme(next);
}

/** Flips between dark and light. */
export function toggleTheme(): void {
  setTheme((t) => (t === "dark" ? "light" : "dark"));
}

// keep <html>'s class in sync with the signal. createRoot gives the effect an
// owner so Solid doesn't warn; the root lives for the lifetime of the module
// (i.e. the app), so we never dispose it.
let lastApplied: string | undefined;
createRoot(() => {
  createEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const next = themeClass[theme()];
    if (lastApplied !== undefined && lastApplied !== next) {
      document.documentElement.classList.remove(lastApplied);
    }
    document.documentElement.classList.add(next);
    lastApplied = next;
  });
});
