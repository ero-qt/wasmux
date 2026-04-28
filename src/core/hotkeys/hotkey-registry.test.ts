import { beforeEach, describe, expect, test, vi } from "vitest";
import { type HotkeyRegistry, createHotkeyRegistry } from "~/core/hotkeys/hotkey-registry";

function keyEvent(
  code: string,
  modifiers?: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean; repeat?: boolean },
): KeyboardEvent {
  return new KeyboardEvent("keydown", {
    code,
    ctrlKey: modifiers?.ctrl ?? false,
    shiftKey: modifiers?.shift ?? false,
    altKey: modifiers?.alt ?? false,
    metaKey: modifiers?.meta ?? false,
    repeat: modifiers?.repeat ?? false,
  });
}

function keyUp(code: string): KeyboardEvent {
  return new KeyboardEvent("keyup", { code });
}

describe("hotkey registry", () => {
  let r: HotkeyRegistry;

  beforeEach(() => {
    r = createHotkeyRegistry();
  });

  // registration

  test("starts empty", () => {
    expect(r.list()).toEqual([]);
  });

  test("registers an action and lists it", () => {
    const a = { id: "play", description: "Play/pause", keys: ["Space"], handler: () => {} };
    r.register(a);
    expect(r.list()).toHaveLength(1);
    expect(r.list()[0]).toBe(a);
  });

  test("throws on duplicate id", () => {
    r.register({ id: "play", description: "Play", keys: ["Space"], handler: () => {} });
    expect(() =>
      r.register({ id: "play", description: "Other", keys: ["KeyP"], handler: () => {} }),
    ).toThrow(/play/);
  });

  test("unregister removes an action", () => {
    r.register({ id: "play", description: "Play", keys: ["Space"], handler: () => {} });
    r.unregister("play");
    expect(r.list()).toEqual([]);
  });

  test("unregister is a no-op for unknown ids", () => {
    expect(() => r.unregister("nope")).not.toThrow();
  });

  test("preserves registration order in list()", () => {
    r.register({ id: "a", description: "A", keys: ["KeyA"], handler: () => {} });
    r.register({ id: "b", description: "B", keys: ["KeyB"], handler: () => {} });
    r.register({ id: "c", description: "C", keys: ["KeyC"], handler: () => {} });
    expect(r.list().map((a) => a.id)).toEqual(["a", "b", "c"]);
  });

  // dispatch: single binding

  test("dispatches to a matching action and reports match", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    const matched = r.dispatch(keyEvent("Space"));
    expect(matched).toHaveLength(1);
    expect(handler).toHaveBeenCalledOnce();
  });

  test("reports no match for unbound keys", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    const matched = r.dispatch(keyEvent("KeyZ"));
    expect(matched).toHaveLength(0);
    expect(handler).not.toHaveBeenCalled();
  });

  // dispatch: multiple bindings on one action

  test("any of an action's keys fires it", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space", "KeyK"], handler });

    r.dispatch(keyEvent("Space"));
    r.dispatch(keyEvent("KeyK"));
    expect(handler).toHaveBeenCalledTimes(2);
  });

  // dispatch: modifier matching

  test("matches modifiers exactly (ctrl+KeyS does not fire on bare KeyS)", () => {
    const handler = vi.fn();
    r.register({ id: "save", description: "Save", keys: ["ctrl+KeyS"], handler });

    r.dispatch(keyEvent("KeyS"));
    expect(handler).not.toHaveBeenCalled();

    r.dispatch(keyEvent("KeyS", { ctrl: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  test("modifier prefix is case-insensitive", () => {
    const handler = vi.fn();
    r.register({ id: "save", description: "Save", keys: ["Ctrl+Shift+KeyS"], handler });

    r.dispatch(keyEvent("KeyS", { ctrl: true, shift: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  test("modifier order in the string does not matter", () => {
    const handler = vi.fn();
    r.register({ id: "x", description: "x", keys: ["shift+ctrl+KeyS"], handler });

    r.dispatch(keyEvent("KeyS", { ctrl: true, shift: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  test("extra modifiers held mean no match", () => {
    const handler = vi.fn();
    r.register({ id: "save", description: "Save", keys: ["ctrl+KeyS"], handler });

    r.dispatch(keyEvent("KeyS", { ctrl: true, shift: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  // dispatch: multiple matching actions

  test("fires all actions matching the same combo", () => {
    const a = vi.fn();
    const b = vi.fn();
    r.register({ id: "a", description: "A", keys: ["Space"], handler: a });
    r.register({ id: "b", description: "B", keys: ["Space"], handler: b });

    const matched = r.dispatch(keyEvent("Space"));
    expect(matched).toHaveLength(2);
    expect(a).toHaveBeenCalledOnce();
    expect(b).toHaveBeenCalledOnce();
  });

  // real-world: play/pause bound to both Space and K

  test("real-world: play/pause on Space or K", () => {
    const togglePlay = vi.fn();
    r.register({
      id: "playPause",
      description: "Play / pause",
      category: "playback",
      keys: ["Space", "KeyK"],
      handler: togglePlay,
    });

    r.dispatch(keyEvent("Space"));
    r.dispatch(keyEvent("KeyK"));
    r.dispatch(keyEvent("KeyJ"));

    expect(togglePlay).toHaveBeenCalledTimes(2);
  });

  // dispatch: key-repeat behavior

  test("skips handler on repeat keydown when action.repeat is false", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler });

    r.dispatch(keyEvent("Space"));
    r.dispatch(keyEvent("Space", { repeat: true }));
    r.dispatch(keyEvent("Space", { repeat: true }));
    expect(handler).toHaveBeenCalledOnce();
  });

  test("fires handler on repeat keydown when action.repeat is true", () => {
    const handler = vi.fn();
    r.register({ id: "next", description: "Next", keys: ["ArrowRight"], handler, repeat: true });

    r.dispatch(keyEvent("ArrowRight"));
    r.dispatch(keyEvent("ArrowRight", { repeat: true }));
    r.dispatch(keyEvent("ArrowRight", { repeat: true }));
    expect(handler).toHaveBeenCalledTimes(3);
  });

  test("still reports match on skipped repeat so preventDefault runs", () => {
    r.register({ id: "play", description: "Play", keys: ["Space"], handler: () => {} });

    expect(r.dispatch(keyEvent("Space", { repeat: true }))).toHaveLength(1);
  });

  // when predicate (WCAG 2.1.4 scope)

  test("when: false blocks dispatch, action not fired (not in matched set)", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler, when: () => false });

    const matched = r.dispatch(keyEvent("Space"));
    expect(matched).toHaveLength(0);
    expect(handler).not.toHaveBeenCalled();
  });

  test("when: true allows dispatch normally", () => {
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler, when: () => true });

    const matched = r.dispatch(keyEvent("Space"));
    expect(matched).toHaveLength(1);
    expect(handler).toHaveBeenCalledOnce();
  });

  test("when predicate is re-evaluated on each keydown", () => {
    let active = false;
    const handler = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler, when: () => active });

    r.dispatch(keyEvent("Space"));
    expect(handler).not.toHaveBeenCalled();

    active = true;
    r.dispatch(keyEvent("Space"));
    expect(handler).toHaveBeenCalledOnce();
  });

  // release: held-state tracking

  test("release fires onRelease for the action whose keydown code matches", () => {
    const onRelease = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler: () => {}, onRelease });

    r.dispatch(keyEvent("Space"));
    r.release(keyUp("Space"));
    expect(onRelease).toHaveBeenCalledOnce();
  });

  test("release is a no-op when nothing is held", () => {
    const onRelease = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler: () => {}, onRelease });

    r.release(keyUp("Space"));
    expect(onRelease).not.toHaveBeenCalled();
  });

  test("release ignores keyups that don't match the keydown code", () => {
    const onRelease = vi.fn();
    r.register({
      id: "save",
      description: "Save",
      keys: ["ctrl+KeyS"],
      handler: () => {},
      onRelease,
    });

    r.dispatch(keyEvent("KeyS", { ctrl: true }));
    r.release(keyUp("ControlLeft"));
    expect(onRelease).not.toHaveBeenCalled();

    r.release(keyUp("KeyS"));
    expect(onRelease).toHaveBeenCalledOnce();
  });

  test("a second release for the same key is a no-op", () => {
    const onRelease = vi.fn();
    r.register({ id: "play", description: "Play", keys: ["Space"], handler: () => {}, onRelease });

    r.dispatch(keyEvent("Space"));
    r.release(keyUp("Space"));
    r.release(keyUp("Space"));
    expect(onRelease).toHaveBeenCalledOnce();
  });

  test("release fires onRelease for all actions held by the same code", () => {
    const onRelease1 = vi.fn();
    const onRelease2 = vi.fn();
    r.register({
      id: "a",
      description: "A",
      keys: ["Space"],
      handler: () => {},
      onRelease: onRelease1,
    });
    r.register({
      id: "b",
      description: "B",
      keys: ["Space"],
      handler: () => {},
      onRelease: onRelease2,
    });

    r.dispatch(keyEvent("Space"));
    r.release(keyUp("Space"));

    expect(onRelease1).toHaveBeenCalledOnce();
    expect(onRelease2).toHaveBeenCalledOnce();
  });
});
