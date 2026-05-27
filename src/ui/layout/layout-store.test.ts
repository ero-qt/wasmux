import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createMemoryStorage } from "~/ui/layout/layout-storage";
import {
  createLayoutStore,
  defaultLayoutState,
  deserialize,
  serialize,
} from "~/ui/layout/layout-store";
import { clearPanelRegistry, registerPanel } from "~/ui/layout/panel-registry";
import type { LayoutSnapshot } from "~/ui/layout/types";

const stubComponent = () => null;

beforeEach(() => {
  clearPanelRegistry();
  registerPanel({
    id: "bin",
    titleKey: "panel.bin.title",
    Component: stubComponent,
    defaultCellId: "bin",
  });
  registerPanel({
    id: "program",
    titleKey: "panel.program.title",
    Component: stubComponent,
    defaultCellId: "program",
  });
  registerPanel({
    id: "jobs",
    titleKey: "panel.jobs.title",
    Component: stubComponent,
    defaultCellId: "inspector",
  });
  registerPanel({
    id: "timeline",
    titleKey: "panel.timeline.title",
    Component: stubComponent,
    defaultCellId: "timeline",
  });
  registerPanel({
    id: "asset",
    titleKey: "panel.asset.title",
    Component: stubComponent,
    defaultCellId: "inspector",
  });
});

afterEach(() => {
  clearPanelRegistry();
});

describe("defaultLayoutState", () => {
  test("contains the documented initial tree", () => {
    const root = defaultLayoutState().root;
    expect(root?.kind).toBe("split");
    if (root?.kind === "split") {
      expect(root.orientation).toBe("column");
      const [_top, timeline] = root.children;
      expect(timeline.kind === "leaf" && timeline.panelIds).toEqual(["timeline"]);
    }
  });
});

describe("serialize/deserialize round-trip", () => {
  test("default state round-trips to itself", () => {
    const state = defaultLayoutState();
    const restored = deserialize(JSON.stringify(serialize(state)));
    expect(restored).not.toBeNull();
    expect(restored).toEqual(state);
  });

  test("rejects snapshots referencing unregistered panel ids", () => {
    const snap: LayoutSnapshot = {
      version: 1,
      root: { kind: "leaf", id: "x", panelIds: ["ghost-panel"], activePanelId: "ghost-panel" },
      homeMemory: {},
    };
    expect(deserialize(JSON.stringify(snap))).toBeNull();
  });

  test("rejects wrong-version snapshots", () => {
    expect(deserialize(JSON.stringify({ version: 999, root: null, homeMemory: {} }))).toBeNull();
  });

  test("rejects leaves with empty panelIds", () => {
    const snap: LayoutSnapshot = {
      version: 1,
      root: { kind: "leaf", id: "x", panelIds: [], activePanelId: null },
      homeMemory: {},
    };
    expect(deserialize(JSON.stringify(snap))).toBeNull();
  });

  test("rejects splits whose sizes don't sum to ~1", () => {
    const snap: LayoutSnapshot = {
      version: 1,
      root: {
        kind: "split",
        id: "s1",
        orientation: "row",
        sizes: [0.3, 0.3],
        children: [
          { kind: "leaf", id: "a", panelIds: ["bin"], activePanelId: "bin" },
          { kind: "leaf", id: "b", panelIds: ["program"], activePanelId: "program" },
        ],
      },
      homeMemory: {},
    };
    expect(deserialize(JSON.stringify(snap))).toBeNull();
  });

  test("rejects malformed JSON", () => {
    expect(deserialize("not json")).toBeNull();
  });

  test("rejects splits whose sizes are outside (0, 1)", () => {
    const snap: LayoutSnapshot = {
      version: 1,
      root: {
        kind: "split",
        id: "s1",
        orientation: "row",
        sizes: [0, 1],
        children: [
          { kind: "leaf", id: "a", panelIds: ["bin"], activePanelId: "bin" },
          { kind: "leaf", id: "b", panelIds: ["program"], activePanelId: "program" },
        ],
      },
      homeMemory: {},
    };
    expect(deserialize(JSON.stringify(snap))).toBeNull();
  });
});

describe("layout store mutators", () => {
  test("closePanel records homeMemory and removes from the leaf", () => {
    const store = createLayoutStore({ storage: createMemoryStorage() });
    store.closePanel("jobs");
    expect(store.state().homeMemory.get("jobs")).toBe("inspector");
  });

  test("closing the last panel in a leaf collapses the leaf", () => {
    const store = createLayoutStore({ storage: createMemoryStorage() });
    store.closePanel("timeline");
    expect(JSON.stringify(store.state().root)).not.toContain('"id":"timeline"');
  });

  test("openPanel restores to the panel's last home when it still exists", () => {
    const store = createLayoutStore({ storage: createMemoryStorage() });
    store.closePanel("jobs");
    store.openPanel("jobs");
    expect(JSON.stringify(store.state().root)).toContain('"jobs"');
  });

  test("openPanel falls back when the last home leaf no longer exists", () => {
    const store = createLayoutStore({ storage: createMemoryStorage() });
    store.closePanel("asset"); // homeMemory.asset = "inspector"
    store.closePanel("jobs"); // collapses inspector
    store.openPanel("asset"); // asset must land somewhere
    expect(JSON.stringify(store.state().root)).toContain("asset");
  });

  test("activatePanel sets the active tab on a leaf that already hosts the panel", () => {
    // The default tree has inspector → ["jobs"]; we add asset to that same leaf
    // so the leaf has two panels with jobs active. Then we call activatePanel
    // directly to switch.
    const store = createLayoutStore({ storage: createMemoryStorage() });
    store.openPanel("asset"); // adds asset to the inspector leaf
    // The inspector leaf is the one that currently hosts jobs + asset.
    // Confirm activatePanel switches the active tab without rearranging panels.
    store.activatePanel("inspector", "jobs"); // back to jobs
    expect(JSON.stringify(store.state().root)).toContain('"activePanelId":"jobs"');
    store.activatePanel("inspector", "asset"); // and now asset
    expect(JSON.stringify(store.state().root)).toContain('"activePanelId":"asset"');
  });

  test("activatePanel is a no-op when the panel is not in the named leaf", () => {
    // Try to activate a panel in a leaf that doesn't host it. State must not
    // change.
    const store = createLayoutStore({ storage: createMemoryStorage() });
    const before = JSON.stringify(store.state().root);
    store.activatePanel("inspector", "program"); // program lives in its own leaf, not inspector
    expect(JSON.stringify(store.state().root)).toBe(before);
  });

  test("resizeSplit updates a split's weights", () => {
    const store = createLayoutStore({ storage: createMemoryStorage() });
    const root = store.state().root;
    if (!root || root.kind !== "split") {
      throw new Error("expected split root");
    }
    store.resizeSplit(root.id, [0.3, 0.7]);
    const updated = store.state().root;
    if (updated?.kind !== "split") {
      throw new Error("root still split");
    }
    expect(updated.sizes).toEqual([0.3, 0.7]);
  });
});

describe("layout store persistence", () => {
  test("mutations write the snapshot via storage.save (after debounce)", async () => {
    vi.useFakeTimers();
    try {
      const storage = createMemoryStorage();
      const saveSpy = vi.spyOn(storage, "save");
      const store = createLayoutStore({ storage });
      const root = store.state().root;
      if (!root || root.kind !== "split") {
        throw new Error("expected split root");
      }
      store.resizeSplit(root.id, [0.4, 0.6]);
      await vi.advanceTimersByTimeAsync(250);
      expect(saveSpy).toHaveBeenCalled();
      const written = saveSpy.mock.calls[0]?.[0];
      expect(typeof written).toBe("string");
      expect(written).toContain('"version":1');
    } finally {
      vi.useRealTimers();
    }
  });

  test("a fresh store hydrates from a previously saved snapshot", async () => {
    vi.useFakeTimers();
    try {
      const storage = createMemoryStorage();
      const a = createLayoutStore({ storage });
      a.closePanel("timeline");
      await vi.advanceTimersByTimeAsync(250);
      const expectedRootJson = JSON.stringify(a.state().root);

      const b = createLayoutStore({ storage });
      // The async load resolves on a microtask after construction.
      await vi.runAllTimersAsync();
      expect(JSON.stringify(b.state().root)).toBe(expectedRootJson);
    } finally {
      vi.useRealTimers();
    }
  });

  test("a corrupt snapshot in storage falls back to the default layout", async () => {
    vi.useFakeTimers();
    try {
      const storage = createMemoryStorage("{not json");
      const store = createLayoutStore({ storage });
      await vi.runAllTimersAsync();
      expect(store.state().root).toEqual(defaultLayoutState().root);
    } finally {
      vi.useRealTimers();
    }
  });
});
