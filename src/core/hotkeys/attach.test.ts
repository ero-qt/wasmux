import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { attachToWindow } from "~/core/hotkeys/attach";
import { createHotkeyRegistry } from "~/core/hotkeys/hotkey-registry";

function keydown(
  code: string,
  opts?: { target?: EventTarget; ctrl?: boolean; shift?: boolean },
): KeyboardEvent {
  const e = new KeyboardEvent("keydown", {
    code,
    ctrlKey: opts?.ctrl ?? false,
    shiftKey: opts?.shift ?? false,
    bubbles: true,
    cancelable: true,
  });
  (opts?.target ?? window).dispatchEvent(e);
  return e;
}

describe("attachToWindow", () => {
  let r: ReturnType<typeof createHotkeyRegistry>;
  let detach: () => void;

  beforeEach(() => {
    r = createHotkeyRegistry();
    detach = () => {};
  });

  afterEach(() => {
    detach();
    document.body.innerHTML = "";
  });

  test("dispatches keydown events through the registry", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    detach = attachToWindow(r);
    keydown("Space");

    expect(handler).toHaveBeenCalledOnce();
  });

  test("the returned unsubscribe stops further dispatch", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    detach = attachToWindow(r);
    detach();
    keydown("Space");

    expect(handler).not.toHaveBeenCalled();
  });

  test("calls preventDefault on match by default", () => {
    r.register({ id: "save", description: "Save", keys: ["ctrl+KeyS"], handler: () => {} });

    detach = attachToWindow(r);
    const e = keydown("KeyS", { ctrl: true });

    expect(e.defaultPrevented).toBe(true);
  });

  test("does not call preventDefault when there is no match", () => {
    r.register({ id: "save", description: "Save", keys: ["ctrl+KeyS"], handler: () => {} });

    detach = attachToWindow(r);
    const e = keydown("KeyZ");

    expect(e.defaultPrevented).toBe(false);
  });

  test("preventDefault can be disabled via option", () => {
    r.register({ id: "save", description: "Save", keys: ["ctrl+KeyS"], handler: () => {} });

    detach = attachToWindow(r, { preventDefault: false });
    const e = keydown("KeyS", { ctrl: true });

    expect(e.defaultPrevented).toBe(false);
  });

  test("does not call preventDefault for a bare-key match by default", () => {
    r.register({ id: "play", description: "Play", keys: ["Space"], handler: () => {} });

    detach = attachToWindow(r);
    const e = keydown("Space");

    expect(e.defaultPrevented).toBe(false);
  });

  test("calls preventDefault for a bare-key match when action opts in", () => {
    r.register({
      id: "play",
      description: "Play",
      keys: ["Space"],
      handler: () => {},
      preventDefault: true,
    });

    detach = attachToWindow(r);
    const e = keydown("Space");

    expect(e.defaultPrevented).toBe(true);
  });

  // input focus handling

  test("ignores events while focus is in <input>", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    detach = attachToWindow(r);
    keydown("Space", { target: input });

    expect(handler).not.toHaveBeenCalled();
  });

  test("ignores events while focus is in <textarea>", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    ta.focus();

    detach = attachToWindow(r);
    keydown("Space", { target: ta });

    expect(handler).not.toHaveBeenCalled();
  });

  test("ignores events while focus is in [contenteditable]", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    document.body.appendChild(div);
    div.focus();

    detach = attachToWindow(r);
    keydown("Space", { target: div });

    expect(handler).not.toHaveBeenCalled();
  });

  test("ignoreInputs: false lets input focus through", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    detach = attachToWindow(r, { ignoreInputs: false });
    keydown("Space", { target: input });

    expect(handler).toHaveBeenCalledOnce();
  });
});
