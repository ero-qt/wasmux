import { render } from "solid-js/web";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { type HotkeyRegistry, createHotkeyRegistry } from "~/core/hotkeys/hotkey-registry";
import { HotkeyButton } from "~/ui/hotkey-button";

function keydown(code: string, opts?: { ctrl?: boolean; repeat?: boolean }): KeyboardEvent {
  return new KeyboardEvent("keydown", {
    code,
    ctrlKey: opts?.ctrl ?? false,
    repeat: opts?.repeat ?? false,
  });
}

function keyup(code: string): KeyboardEvent {
  return new KeyboardEvent("keyup", { code });
}

describe("HotkeyButton", () => {
  let container: HTMLElement;
  let dispose: (() => void) | null = null;
  let r: HotkeyRegistry;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    r = createHotkeyRegistry();
  });

  afterEach(() => {
    dispose?.();
    dispose = null;
    container.remove();
  });

  function mount(ui: () => ReturnType<typeof HotkeyButton>): HTMLButtonElement {
    dispose = render(ui, container);
    const button = container.querySelector("button");
    if (!button) {
      throw new Error("HotkeyButton did not render a <button>");
    }
    return button;
  }

  test("renders a button with the children", () => {
    const btn = mount(() => (
      <HotkeyButton
        registry={r}
        id="play"
        description="Play / pause"
        keys={["Space"]}
        onClick={() => {}}
      >
        Play
      </HotkeyButton>
    ));
    expect(btn.textContent).toBe("Play");
  });

  test("appends the formatted combo to title and aria-label", () => {
    const btn = mount(() => (
      <HotkeyButton
        registry={r}
        id="save"
        description="Save project"
        keys={["mod+KeyS"]}
        onClick={() => {}}
      >
        Save
      </HotkeyButton>
    ));
    expect(btn.getAttribute("title")).toBe("Save project (Ctrl+S)");
    expect(btn.getAttribute("aria-label")).toBe("Save project (Ctrl+S)");
  });

  test("joins multiple combos with ' / '", () => {
    const btn = mount(() => (
      <HotkeyButton
        registry={r}
        id="play"
        description="Play"
        keys={["Space", "KeyK"]}
        onClick={() => {}}
      >
        Play
      </HotkeyButton>
    ));
    expect(btn.getAttribute("title")).toBe("Play (Space / K)");
  });

  test("omits the combo parenthetical when there are no keys", () => {
    const btn = mount(() => (
      <HotkeyButton registry={r} id="x" description="Just a button" keys={[]} onClick={() => {}}>
        X
      </HotkeyButton>
    ));
    expect(btn.getAttribute("title")).toBe("Just a button");
  });

  test("registers the action on mount and unregisters on dispose", () => {
    mount(() => (
      <HotkeyButton registry={r} id="play" description="Play" keys={["Space"]} onClick={() => {}}>
        Play
      </HotkeyButton>
    ));
    expect(r.list()).toHaveLength(1);
    expect(r.list()[0]?.id).toBe("play");

    dispose?.();
    dispose = null;
    expect(r.list()).toHaveLength(0);
  });

  test("forwards the repeat flag to the registered action", () => {
    mount(() => (
      <HotkeyButton
        registry={r}
        id="next"
        description="Next frame"
        keys={["ArrowRight"]}
        repeat
        onClick={() => {}}
      >
        Next
      </HotkeyButton>
    ));
    expect(r.list()[0]?.repeat).toBe(true);
  });

  test("clicking the button fires onClick", () => {
    const onClick = vi.fn();
    const btn = mount(() => (
      <HotkeyButton registry={r} id="play" description="Play" keys={["Space"]} onClick={onClick}>
        Play
      </HotkeyButton>
    ));

    btn.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("firing the hotkey routes through the button and fires onClick", () => {
    const onClick = vi.fn();
    const btn = mount(() => (
      <HotkeyButton registry={r} id="play" description="Play" keys={["Space"]} onClick={onClick}>
        Play
      </HotkeyButton>
    ));

    r.dispatch(keydown("Space"));

    expect(onClick).toHaveBeenCalledOnce();
    expect(btn.getAttribute("data-pressed")).toBe("true");
  });

  test("releasing the hotkey clears data-pressed", () => {
    const btn = mount(() => (
      <HotkeyButton registry={r} id="play" description="Play" keys={["Space"]} onClick={() => {}}>
        Play
      </HotkeyButton>
    ));

    r.dispatch(keydown("Space"));
    r.release(keyup("Space"));

    expect(btn.hasAttribute("data-pressed")).toBe(false);
  });

  test("held (repeat) keydown does not refire onClick for single-fire actions", () => {
    const onClick = vi.fn();
    mount(() => (
      <HotkeyButton registry={r} id="play" description="Play" keys={["Space"]} onClick={onClick}>
        Play
      </HotkeyButton>
    ));

    r.dispatch(keydown("Space"));
    r.dispatch(keydown("Space", { repeat: true }));
    r.dispatch(keydown("Space", { repeat: true }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
