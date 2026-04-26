import { describe, expect, test, vi } from "vitest";
import { createHotkeyRegistry } from "~/core/hotkeys";
import { createProject } from "~/core/project";
import { registerEditorHotkeys } from "~/ui/editor-hotkeys";
import type { ProjectStore } from "~/ui/project-store";

function fakeStore() {
  const undo = vi.fn<() => void>();
  const redo = vi.fn<() => void>();
  const store: ProjectStore = {
    project: () => createProject(),
    canUndo: () => false,
    canRedo: () => false,
    apply: () => {},
    transaction: () => {},
    undo,
    redo,
  };
  return { store, undo, redo };
}

function keydown(code: string, mods?: { ctrl?: boolean; shift?: boolean }): KeyboardEvent {
  return new KeyboardEvent("keydown", {
    code,
    ctrlKey: mods?.ctrl ?? false,
    shiftKey: mods?.shift ?? false,
  });
}

describe("registerEditorHotkeys", () => {
  test("registers an undo action", () => {
    const r = createHotkeyRegistry();
    registerEditorHotkeys(r, fakeStore().store);
    expect(r.list().some((a) => a.id === "undo")).toBe(true);
  });

  test("registers a redo action", () => {
    const r = createHotkeyRegistry();
    registerEditorHotkeys(r, fakeStore().store);
    expect(r.list().some((a) => a.id === "redo")).toBe(true);
  });

  test("mod+Z routes to store.undo()", () => {
    const r = createHotkeyRegistry();
    const { store, undo } = fakeStore();
    registerEditorHotkeys(r, store);

    r.dispatch(keydown("KeyZ", { ctrl: true }));
    expect(undo).toHaveBeenCalledOnce();
  });

  test("mod+shift+Z routes to store.redo()", () => {
    const r = createHotkeyRegistry();
    const { store, redo } = fakeStore();
    registerEditorHotkeys(r, store);

    r.dispatch(keydown("KeyZ", { ctrl: true, shift: true }));
    expect(redo).toHaveBeenCalledOnce();
  });

  test("mod+Y also routes to store.redo()", () => {
    const r = createHotkeyRegistry();
    const { store, redo } = fakeStore();
    registerEditorHotkeys(r, store);

    r.dispatch(keydown("KeyY", { ctrl: true }));
    expect(redo).toHaveBeenCalledOnce();
  });

  test("bare Z does not trigger undo", () => {
    const r = createHotkeyRegistry();
    const { store, undo } = fakeStore();
    registerEditorHotkeys(r, store);

    r.dispatch(keydown("KeyZ"));
    expect(undo).not.toHaveBeenCalled();
  });
});
