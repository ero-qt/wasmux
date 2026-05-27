import { createEffect, createSignal } from "solid-js";
import { type LayoutStorage, createOpfsStorage } from "~/ui/layout/layout-storage";
import {
  dfsLeaves,
  findLeaf,
  insertPanelInLeaf,
  removeLeaf,
  replaceNode,
} from "~/ui/layout/layout-tree";
import { getPanel } from "~/ui/layout/panel-registry";
import type {
  LayoutNode,
  LayoutSnapshot,
  LayoutState,
  LeafNode,
  SerializedNode,
} from "~/ui/layout/types";

/** Tolerance for the "sizes sum to 1" check. */
const SIZE_EPS = 1e-6;

/** Debounce window before a pending state change is flushed to storage. */
const SAVE_DEBOUNCE_MS = 200;

export interface LayoutStore {
  /** Reactive accessor — read inside a tracking scope to rerender on change. */
  state(): LayoutState;

  closePanel(panelId: string): void;

  openPanel(panelId: string): void;

  activatePanel(leafId: string, panelId: string): void;

  resizeSplit(splitId: string, sizes: readonly [number, number]): void;

  /** Test-only: drops persistence and reverts to defaults. */
  reset(): void;
}

export interface CreateLayoutStoreOptions {
  readonly storage?: LayoutStorage;
}

/**
 * Default layout tree on first boot — three columns on top, timeline below.
 * IDs are stable strings ("bin", "program", "inspector", "timeline") so they
 * survive code-level changes that don't touch the initial geometry.
 */
export function defaultLayoutState(): LayoutState {
  const root: LayoutNode = {
    kind: "split",
    id: "root",
    orientation: "column",
    sizes: [0.7, 0.3],
    children: [
      {
        kind: "split",
        id: "top-row",
        orientation: "row",
        sizes: [0.25, 0.75],
        children: [
          { kind: "leaf", id: "bin", panelIds: ["bin"], activePanelId: "bin" },
          {
            kind: "split",
            id: "program-inspector",
            orientation: "row",
            sizes: [0.6, 0.4],
            children: [
              { kind: "leaf", id: "program", panelIds: ["program"], activePanelId: "program" },
              { kind: "leaf", id: "inspector", panelIds: ["jobs"], activePanelId: "jobs" },
            ],
          },
        ],
      },
      { kind: "leaf", id: "timeline", panelIds: ["timeline"], activePanelId: "timeline" },
    ],
  };
  return { root, homeMemory: new Map() };
}

/** Walks the tree and returns a wire-format snapshot. */
export function serialize(state: LayoutState): LayoutSnapshot {
  const walk = (n: LayoutNode): SerializedNode =>
    n.kind === "leaf"
      ? {
          kind: "leaf",
          id: n.id,
          panelIds: [...n.panelIds],
          activePanelId: n.activePanelId,
        }
      : {
          kind: "split",
          id: n.id,
          orientation: n.orientation,
          sizes: [n.sizes[0], n.sizes[1]],
          children: [walk(n.children[0]), walk(n.children[1])],
        };
  return {
    version: 1,
    root: state.root === null ? null : walk(state.root),
    homeMemory: Object.fromEntries(state.homeMemory),
  };
}

/**
 * Validates and parses a snapshot string. Returns `null` for anything that
 * fails — the caller then falls back to the default layout.
 */
export function deserialize(raw: string): LayoutState | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isObject(parsed)) {
    return null;
  }
  if (parsed.version !== 1) {
    return null;
  }
  if (!isObject(parsed.homeMemory)) {
    return null;
  }
  const tree = parsed.root === null ? null : validateNode(parsed.root);
  if (parsed.root !== null && tree === null) {
    return null;
  }
  return {
    root: tree,
    homeMemory: new Map(Object.entries(parsed.homeMemory as Record<string, string>)),
  };
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function validateNode(x: unknown): LayoutNode | null {
  if (!isObject(x) || typeof x.id !== "string") {
    return null;
  }
  if (x.kind === "leaf") {
    if (!Array.isArray(x.panelIds) || x.panelIds.length === 0) {
      return null;
    }
    if (!x.panelIds.every((p): p is string => typeof p === "string" && getPanel(p) !== undefined)) {
      return null;
    }
    if (
      x.activePanelId !== null &&
      (typeof x.activePanelId !== "string" || !x.panelIds.includes(x.activePanelId))
    ) {
      return null;
    }
    return { kind: "leaf", id: x.id, panelIds: x.panelIds, activePanelId: x.activePanelId };
  }
  if (x.kind === "split") {
    if (x.orientation !== "row" && x.orientation !== "column") {
      return null;
    }
    if (
      !Array.isArray(x.sizes) ||
      x.sizes.length !== 2 ||
      typeof x.sizes[0] !== "number" ||
      typeof x.sizes[1] !== "number" ||
      x.sizes[0] <= 0 ||
      x.sizes[1] <= 0 ||
      Math.abs(x.sizes[0] + x.sizes[1] - 1) > SIZE_EPS
    ) {
      return null;
    }
    if (!Array.isArray(x.children) || x.children.length !== 2) {
      return null;
    }
    const left = validateNode(x.children[0]);
    const right = validateNode(x.children[1]);
    if (left === null || right === null) {
      return null;
    }
    return {
      kind: "split",
      id: x.id,
      orientation: x.orientation,
      sizes: [x.sizes[0], x.sizes[1]],
      children: [left, right],
    };
  }
  return null;
}

/** Picks a leaf that should host a re-opened panel. See spec for the fallback chain. */
function pickHomeLeaf(state: LayoutState, panelId: string): string | null {
  const remembered = state.homeMemory.get(panelId);
  if (remembered !== undefined && findLeaf(state.root, remembered) !== null) {
    return remembered;
  }
  const def = getPanel(panelId);
  if (def !== undefined && findLeaf(state.root, def.defaultCellId) !== null) {
    return def.defaultCellId;
  }
  const first = dfsLeaves(state.root)[0];
  return first?.id ?? null;
}

function rememberHome(
  map: ReadonlyMap<string, string>,
  panelId: string,
  leafId: string,
): Map<string, string> {
  const next = new Map(map);
  next.set(panelId, leafId);
  return next;
}

function forgetHome(map: ReadonlyMap<string, string>, panelId: string): Map<string, string> {
  const next = new Map(map);
  next.delete(panelId);
  return next;
}

/** Choose which tab becomes active after the user closes the current active. */
function pickNextActive(leaf: LeafNode, closedPanelId: string): string | null {
  if (leaf.activePanelId !== closedPanelId) {
    return leaf.activePanelId;
  }
  const remaining = leaf.panelIds.filter((p) => p !== closedPanelId);
  if (remaining.length === 0) {
    return null;
  }
  const idx = leaf.panelIds.indexOf(closedPanelId);
  if (idx + 1 < leaf.panelIds.length) {
    return leaf.panelIds[idx + 1] ?? null;
  }
  return remaining[remaining.length - 1] ?? null;
}

/** Builds the singleton layout store. Only one is created per app session. */
export function createLayoutStore(options: CreateLayoutStoreOptions = {}): LayoutStore {
  const storage = options.storage ?? createOpfsStorage();
  const [state, setState] = createSignal<LayoutState>(defaultLayoutState());

  // async hydrate from persistent storage. fire and forget; the default state
  // is already on screen, so we just replace it when (if) a valid snapshot
  // arrives. errors are non-fatal; we stay on defaults.
  void (async () => {
    const raw = await storage.load();
    if (raw === null) {
      return;
    }
    const loaded = deserialize(raw);
    if (loaded === null) {
      return;
    }
    setState(loaded);
  })();

  // debounced save. the first effect run happens at creation time with the
  // default state; we skip it so we don't write defaults right back to disk.
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  let firstRun = true;
  createEffect(() => {
    const snapshot = serialize(state());
    if (firstRun) {
      firstRun = false;
      return;
    }
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
    }
    pendingTimer = setTimeout(() => {
      void storage.save(JSON.stringify(snapshot));
    }, SAVE_DEBOUNCE_MS);
  });

  const commit = (next: LayoutState): void => {
    setState(next);
  };

  const update = (mutator: (s: LayoutState) => LayoutState): void => {
    commit(mutator(state()));
  };

  return {
    state,

    closePanel(panelId) {
      update((s) => {
        const owningLeaf = dfsLeaves(s.root).find((l) => l.panelIds.includes(panelId));
        if (owningLeaf === undefined) {
          return s;
        }
        const remainingPanels = owningLeaf.panelIds.filter((p) => p !== panelId);
        const newRoot =
          remainingPanels.length === 0
            ? removeLeaf(s.root, owningLeaf.id)
            : replaceNode(s.root, owningLeaf.id, (n) => {
                if (n.kind !== "leaf") {
                  return n;
                }
                return {
                  ...n,
                  panelIds: remainingPanels,
                  activePanelId: pickNextActive(n, panelId),
                };
              });
        return { root: newRoot, homeMemory: rememberHome(s.homeMemory, panelId, owningLeaf.id) };
      });
    },

    openPanel(panelId) {
      update((s) => {
        if (dfsLeaves(s.root).some((l) => l.panelIds.includes(panelId))) {
          return s;
        }
        const leafId = pickHomeLeaf(s, panelId);
        if (leafId === null) {
          const root: LeafNode = {
            kind: "leaf",
            id: `leaf-${panelId}`,
            panelIds: [panelId],
            activePanelId: panelId,
          };
          return { root, homeMemory: forgetHome(s.homeMemory, panelId) };
        }
        return {
          root: insertPanelInLeaf(s.root, leafId, panelId, true),
          homeMemory: forgetHome(s.homeMemory, panelId),
        };
      });
    },

    activatePanel(leafId, panelId) {
      update((s) => ({
        ...s,
        root: replaceNode(s.root, leafId, (n) =>
          n.kind === "leaf" && n.panelIds.includes(panelId) ? { ...n, activePanelId: panelId } : n,
        ),
      }));
    },

    resizeSplit(splitId, sizes) {
      const clamped: [number, number] = [
        Math.max(SIZE_EPS, Math.min(1 - SIZE_EPS, sizes[0])),
        Math.max(SIZE_EPS, Math.min(1 - SIZE_EPS, sizes[1])),
      ];
      const sum = clamped[0] + clamped[1];
      const normalised: [number, number] = [clamped[0] / sum, clamped[1] / sum];
      update((s) => ({
        ...s,
        root: replaceNode(s.root, splitId, (n) =>
          n.kind === "split" ? { ...n, sizes: normalised } : n,
        ),
      }));
    },

    reset() {
      commit(defaultLayoutState());
    },
  };
}
