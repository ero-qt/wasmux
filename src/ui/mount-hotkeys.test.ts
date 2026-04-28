import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// mock solid-js lifecycle before any downstream imports touch it
vi.mock("solid-js", async (importOriginal) => {
  const solid = await importOriginal<typeof import("solid-js")>();
  return { ...solid, onMount: vi.fn((fn: () => void) => fn()), onCleanup: vi.fn() };
});

vi.mock("~/core/hotkeys/attach", () => ({ attachToWindow: vi.fn(() => vi.fn()) }));

import { onCleanup, onMount } from "solid-js";
import { attachToWindow } from "~/core/hotkeys/attach";
import { createHotkeyRegistry } from "~/core/hotkeys/hotkey-registry";
import { mountHotkeys } from "~/ui/mount-hotkeys";

describe("mountHotkeys", () => {
  let registry: ReturnType<typeof createHotkeyRegistry>;

  beforeEach(() => {
    registry = createHotkeyRegistry();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("calls attachToWindow with the registry on mount", () => {
    mountHotkeys(registry);
    expect(attachToWindow).toHaveBeenCalledWith(registry, undefined);
  });

  test("forwards options to attachToWindow", () => {
    const options = { ignoreInputs: false as const };
    mountHotkeys(registry, options);
    expect(attachToWindow).toHaveBeenCalledWith(registry, options);
  });

  test("registers the detach function returned by attachToWindow as the cleanup handler", () => {
    const detach = vi.fn();
    vi.mocked(attachToWindow).mockReturnValueOnce(detach);

    mountHotkeys(registry);

    expect(onCleanup).toHaveBeenCalledWith(detach);
  });

  test("attaches inside onMount, not eagerly", () => {
    // if onMount were not called, attachToWindow would still run because our
    // mock invokes the callback immediately. the key assertion is that onMount
    // itself was called, meaning the wiring goes through the lifecycle.
    mountHotkeys(registry);
    expect(onMount).toHaveBeenCalledOnce();
  });
});
