import { afterEach, describe, expect, it, vi } from "vitest";
import { createImeGuard } from "~/ui/primitives/_ime";

function makeInputEvent(value: string): InputEvent {
  const input = document.createElement("input");
  input.value = value;
  const e = new Event("input", { bubbles: true }) as InputEvent;
  Object.defineProperty(e, "target", { value: input, configurable: true });
  Object.defineProperty(e, "currentTarget", { value: input, configurable: true });
  return e;
}

function makeCompositionEvent(value: string): CompositionEvent {
  const input = document.createElement("input");
  input.value = value;
  const e = new Event("compositionend", { bubbles: true }) as CompositionEvent;
  Object.defineProperty(e, "target", { value: input, configurable: true });
  Object.defineProperty(e, "currentTarget", { value: input, configurable: true });
  return e;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createImeGuard", () => {
  it("commits on plain input outside composition", () => {
    const commit = vi.fn();
    const guard = createImeGuard({ current: () => "", commit });
    guard.onInput(makeInputEvent("hello"));
    expect(commit).toHaveBeenCalledWith("hello");
  });

  it("suppresses commit while composing and emits once on compositionend", () => {
    const commit = vi.fn();
    let v = "";
    const guard = createImeGuard({ current: () => v, commit });
    guard.onCompositionStart();
    guard.onInput(makeInputEvent("か"));
    guard.onInput(makeInputEvent("かい"));
    expect(commit).not.toHaveBeenCalled();
    guard.onCompositionEnd(makeCompositionEvent("漢字"));
    expect(commit).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledWith("漢字");
    v = "漢字";
    // post-composition input proceeds normally:
    guard.onInput(makeInputEvent("漢字!"));
    expect(commit).toHaveBeenCalledTimes(2);
    expect(commit).toHaveBeenLastCalledWith("漢字!");
  });

  it("skips no-op input when next equals current", () => {
    const commit = vi.fn();
    const guard = createImeGuard({ current: () => "hello", commit });
    guard.onInput(makeInputEvent("hello"));
    expect(commit).not.toHaveBeenCalled();
  });

  it("exposes isComposing() reactively", () => {
    const guard = createImeGuard({ current: () => "", commit: () => {} });
    expect(guard.isComposing()).toBe(false);
    guard.onCompositionStart();
    expect(guard.isComposing()).toBe(true);
    guard.onCompositionEnd(makeCompositionEvent(""));
    expect(guard.isComposing()).toBe(false);
  });
});
