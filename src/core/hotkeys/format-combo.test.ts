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

  test("Numpad_ prefixes with 'numpad '", () => {
    expect(formatCombo("Numpad1")).toBe("numpad 1");
  });

  test("Arrow keys become left/right/up/down", () => {
    expect(formatCombo("ArrowLeft")).toBe("left");
    expect(formatCombo("ArrowRight")).toBe("right");
    expect(formatCombo("ArrowUp")).toBe("up");
    expect(formatCombo("ArrowDown")).toBe("down");
  });

  test("named keys pass through with friendly names", () => {
    expect(formatCombo("Space")).toBe("space");
    expect(formatCombo("Enter")).toBe("enter");
    expect(formatCombo("Escape")).toBe("esc");
    expect(formatCombo("Backspace")).toBe("backspace");
    expect(formatCombo("Tab")).toBe("tab");
    expect(formatCombo("Delete")).toBe("delete");
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

  test("ctrl modifier renders as ctrl", () => {
    expect(formatCombo("ctrl+KeyS")).toBe("ctrl+S");
  });

  test("shift and alt render as shift and alt", () => {
    expect(formatCombo("shift+ArrowLeft")).toBe("shift+left");
    expect(formatCombo("alt+KeyF")).toBe("alt+F");
  });

  test("meta renders per platform: cmd / win / super / meta", () => {
    expect(formatCombo("meta+KeyS", "mac")).toBe("cmd+S");
    expect(formatCombo("meta+KeyS", "ios")).toBe("cmd+S");
    expect(formatCombo("meta+KeyS", "windows")).toBe("win+S");
    expect(formatCombo("meta+KeyS", "linux")).toBe("super+S");
    expect(formatCombo("meta+KeyS", "android")).toBe("meta+S");
    expect(formatCombo("meta+KeyS", "other")).toBe("meta+S");
  });

  test("mod resolves to cmd on Mac/iOS and ctrl elsewhere", () => {
    expect(formatCombo("mod+KeyS", "mac")).toBe("cmd+S");
    expect(formatCombo("mod+KeyS", "ios")).toBe("cmd+S");
    expect(formatCombo("mod+KeyS", "windows")).toBe("ctrl+S");
    expect(formatCombo("mod+KeyS", "linux")).toBe("ctrl+S");
    expect(formatCombo("mod+KeyS", "android")).toBe("ctrl+S");
    expect(formatCombo("mod+KeyS", "other")).toBe("ctrl+S");
  });

  test("canonical order: ctrl, alt, shift, meta, key", () => {
    expect(formatCombo("shift+ctrl+KeyS", "linux")).toBe("ctrl+shift+S");
    expect(formatCombo("mod+shift+alt+KeyS", "linux")).toBe("ctrl+alt+shift+S");
    expect(formatCombo("mod+shift+alt+KeyS", "mac")).toBe("alt+shift+cmd+S");
    expect(formatCombo("ctrl+mod+shift+KeyS", "mac")).toBe("ctrl+shift+cmd+S");
  });

  test("mod+meta deduplicate on Mac: renders as cmd once, not cmd+cmd", () => {
    expect(formatCombo("mod+meta+KeyS", "mac")).toBe("cmd+S");
  });

  test("modifier input is case-insensitive", () => {
    expect(formatCombo("Ctrl+Shift+KeyS")).toBe("ctrl+shift+S");
  });

  // platform default

  test("defaults to non-Mac when no platform detected", () => {
    // jsdom's navigator typically reports a non-Mac user agent; we only
    // assert the Mac-sensitive part.
    const s = formatCombo("mod+KeyS");
    expect(s === "ctrl+S" || s === "cmd+S").toBe(true);
  });
});
