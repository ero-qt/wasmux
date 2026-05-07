import { afterEach, describe, expect, test } from "vitest";
import { getLocale, isRtl, negotiateLocale, setLocale, t } from "~/i18n";

afterEach(() => {
  // reset to the default locale so tests don't leak state.
  setLocale("en");
});

describe("t", () => {
  test("resolves a flat key to its English string", () => {
    expect(t("editor.history.undo")).toBe("undo");
    expect(t("editor.history.redo")).toBe("redo");
  });

  test("resolves the brand string", () => {
    expect(t("brand")).toBe("wasmux");
  });
});

describe("negotiateLocale", () => {
  test("returns the first preferred tag that has a dictionary", () => {
    expect(negotiateLocale(["fr-FR", "en-US"])).toBe("en");
  });

  test("matches by base subtag when the exact tag is not shipped", () => {
    expect(negotiateLocale(["en-GB"])).toBe("en");
  });

  test("falls back to en when nothing matches", () => {
    expect(negotiateLocale(["xx-XX", "yy"])).toBe("en");
  });

  test("falls back to en for an empty preference list", () => {
    expect(negotiateLocale([])).toBe("en");
  });
});

describe("setLocale", () => {
  test("updates getLocale to the resolved tag", () => {
    setLocale("en-US");
    expect(getLocale()).toBe("en");
  });

  test("writes lang and dir onto documentElement", () => {
    setLocale("en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.documentElement.dir).toBe("ltr");
  });

  test("falls back to en for unsupported tags", () => {
    setLocale("xx-XX");
    expect(getLocale()).toBe("en");
  });
});

describe("isRtl", () => {
  test.each([
    ["ar", true],
    ["ar-EG", true],
    ["he", true],
    ["fa-IR", true],
    ["ur", true],
    ["en", false],
    ["en-US", false],
    ["de", false],
    ["ja", false],
  ])("isRtl(%s) === %s", (tag, expected) => {
    expect(isRtl(tag)).toBe(expected);
  });
});
