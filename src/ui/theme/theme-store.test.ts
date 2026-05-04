import { afterEach, describe, expect, test } from "vitest";
import { defaultDark } from "~/styles/themes/default-dark.css";
import { defaultLight } from "~/styles/themes/default-light.css";
import { setActiveTheme, theme, toggleTheme } from "~/ui/theme/theme-store";

afterEach(() => {
  // reset back to dark so tests don't leak state.
  setActiveTheme("dark");
});

describe("theme store", () => {
  test("defaults to dark when matchMedia is unavailable (jsdom default)", () => {
    expect(theme()).toBe("dark");
  });

  test("toggleTheme flips between dark and light", () => {
    expect(theme()).toBe("dark");
    toggleTheme();
    expect(theme()).toBe("light");
    toggleTheme();
    expect(theme()).toBe("dark");
  });

  test("setActiveTheme sets the explicit theme", () => {
    setActiveTheme("light");
    expect(theme()).toBe("light");
    setActiveTheme("dark");
    expect(theme()).toBe("dark");
  });

  test("active theme class is applied to documentElement", () => {
    setActiveTheme("dark");
    expect(document.documentElement.classList.contains(defaultDark)).toBe(true);
    expect(document.documentElement.classList.contains(defaultLight)).toBe(false);

    setActiveTheme("light");
    expect(document.documentElement.classList.contains(defaultLight)).toBe(true);
    expect(document.documentElement.classList.contains(defaultDark)).toBe(false);
  });
});
