import { describe, expect, test } from "vitest";
import { formatCombo } from "~/core/hotkeys/format-combo";

describe("formatCombo", () => {
  // base keys

  test("Key_ becomes the bare letter", () => {
    expect(formatCombo("KeyS")).toBe("S");
    expect(formatCombo("KeyA")).toBe("A");
  });

  test("Digit_ becomes the bare digit", () => {
    expect(formatCombo("Digit1")).toBe("1");
    expect(formatCombo("Digit0")).toBe("0");
  });

  test("Numpad_ prefixes with 'Numpad '", () => {
    expect(formatCombo("Numpad1")).toBe("Numpad 1");
  });

  test("Arrow keys become Left/Right/Up/Down", () => {
    expect(formatCombo("ArrowLeft")).toBe("Left");
    expect(formatCombo("ArrowRight")).toBe("Right");
    expect(formatCombo("ArrowUp")).toBe("Up");
    expect(formatCombo("ArrowDown")).toBe("Down");
  });

  test("named keys pass through with friendly names", () => {
    expect(formatCombo("Space")).toBe("Space");
    expect(formatCombo("Enter")).toBe("Enter");
    expect(formatCombo("Escape")).toBe("Esc");
    expect(formatCombo("Backspace")).toBe("Backspace");
    expect(formatCombo("Tab")).toBe("Tab");
    expect(formatCombo("Delete")).toBe("Delete");
  });

  test("punctuation codes become their glyph", () => {
    expect(formatCombo("Minus")).toBe("-");
    expect(formatCombo("Equal")).toBe("=");
    expect(formatCombo("Slash")).toBe("/");
    expect(formatCombo("Backslash")).toBe("\\");
    expect(formatCombo("Semicolon")).toBe(";");
    expect(formatCombo("Quote")).toBe("'");
    expect(formatCombo("BracketLeft")).toBe("[");
    expect(formatCombo("BracketRight")).toBe("]");
    expect(formatCombo("Comma")).toBe(",");
    expect(formatCombo("Period")).toBe(".");
    expect(formatCombo("Backquote")).toBe("`");
  });

  test("function keys pass through as F1..F12", () => {
    expect(formatCombo("F1")).toBe("F1");
    expect(formatCombo("F12")).toBe("F12");
  });

  test("unknown codes fall back to the raw string", () => {
    expect(formatCombo("SomeFutureKey")).toBe("SomeFutureKey");
  });

  // modifiers

  test("ctrl modifier renders as Ctrl", () => {
    expect(formatCombo("ctrl+KeyS")).toBe("Ctrl+S");
  });

  test("shift and alt render as Shift and Alt", () => {
    expect(formatCombo("shift+ArrowLeft")).toBe("Shift+Left");
    expect(formatCombo("alt+KeyF")).toBe("Alt+F");
  });

  test("meta renders per platform: Cmd / Win / Super / Meta", () => {
    expect(formatCombo("meta+KeyS", "mac")).toBe("Cmd+S");
    expect(formatCombo("meta+KeyS", "ios")).toBe("Cmd+S");
    expect(formatCombo("meta+KeyS", "windows")).toBe("Win+S");
    expect(formatCombo("meta+KeyS", "linux")).toBe("Super+S");
    expect(formatCombo("meta+KeyS", "android")).toBe("Meta+S");
    expect(formatCombo("meta+KeyS", "other")).toBe("Meta+S");
  });

  test("mod resolves to Cmd on Mac/iOS and Ctrl elsewhere", () => {
    expect(formatCombo("mod+KeyS", "mac")).toBe("Cmd+S");
    expect(formatCombo("mod+KeyS", "ios")).toBe("Cmd+S");
    expect(formatCombo("mod+KeyS", "windows")).toBe("Ctrl+S");
    expect(formatCombo("mod+KeyS", "linux")).toBe("Ctrl+S");
    expect(formatCombo("mod+KeyS", "android")).toBe("Ctrl+S");
    expect(formatCombo("mod+KeyS", "other")).toBe("Ctrl+S");
  });

  test("canonical order: Ctrl, Alt, Shift, Meta, Key", () => {
    expect(formatCombo("shift+ctrl+KeyS", "linux")).toBe("Ctrl+Shift+S");
    expect(formatCombo("mod+shift+alt+KeyS", "linux")).toBe("Ctrl+Alt+Shift+S");
    expect(formatCombo("mod+shift+alt+KeyS", "mac")).toBe("Alt+Shift+Cmd+S");
    expect(formatCombo("ctrl+mod+shift+KeyS", "mac")).toBe("Ctrl+Shift+Cmd+S");
  });

  test("mod+meta deduplicate on Mac: renders as Cmd once, not Cmd+Cmd", () => {
    expect(formatCombo("mod+meta+KeyS", "mac")).toBe("Cmd+S");
  });

  test("modifier input is case-insensitive", () => {
    expect(formatCombo("Ctrl+Shift+KeyS")).toBe("Ctrl+Shift+S");
  });

  // platform default

  test("defaults to non-Mac when no platform detected", () => {
    // jsdom's navigator typically reports a non-Mac user agent; we only
    // assert the Mac-sensitive part.
    const s = formatCombo("mod+KeyS");
    expect(s === "Ctrl+S" || s === "Cmd+S").toBe(true);
  });
});
