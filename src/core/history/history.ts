import { type Draft, type Patch, applyPatches, enablePatches, produceWithPatches } from "immer";

enablePatches();

interface HistoryEntry {
  readonly patches: Patch[];
  readonly inversePatches: Patch[];
}

/** A mutation operating on a draft of the state. */
export type Recipe<T> = (draft: Draft<T>) => void;

/**
 * Undo/redo history over an immutable state tree. Stores Immer
 * patches (diffs), not full snapshots. State is frozen between
 * mutations.
 */
export interface History<T> {
  /** Current state. Frozen. */
  current(): T;
  /** Applies a mutation and pushes it onto the undo stack. */
  apply(recipe: Recipe<T>): void;
  /** Groups multiple mutations into a single undo step. */
  transaction(fn: (apply: (recipe: Recipe<T>) => void) => void): void;
  /** No-op if the undo stack is empty. */
  undo(): void;
  /** No-op if the redo stack is empty. */
  redo(): void;
  canUndo(): boolean;
  canRedo(): boolean;
}

/** Typed wrapper — Immer's `applyPatches` returns `Objectish` instead of the input type. */
function applyPatchesTyped<T extends object>(state: T, patches: Patch[]): T {
  return applyPatches(state as Record<string, unknown>, patches) as T;
}

export function createHistory<T extends object>(initial: T): History<T> {
  const undoStack: HistoryEntry[] = [];
  const redoStack: HistoryEntry[] = [];

  // no-op produce freezes the initial state, so current() is always frozen.
  let state = produceWithPatches(initial, () => {})[0];

  function pushEntry(entry: HistoryEntry): void {
    undoStack.push(entry);

    // new mutations invalidate the redo stack.
    redoStack.length = 0;
  }

  function applySingle(recipe: Recipe<T>): void {
    const [next, patches, inversePatches] = produceWithPatches(state, recipe);
    state = next;
    pushEntry({ patches, inversePatches });
  }

  return {
    current() {
      return state;
    },

    apply(recipe) {
      applySingle(recipe);
    },

    transaction(fn) {
      const allPatches: Patch[] = [];
      const allInversePatches: Patch[] = [];

      fn((recipe) => {
        const [next, patches, inversePatches] = produceWithPatches(state, recipe);
        state = next;
        allPatches.push(...patches);
        allInversePatches.push(...inversePatches);
      });

      // inverses must be applied in reverse order to undo A → B → C as C⁻¹, B⁻¹, A⁻¹.
      pushEntry({
        patches: allPatches,
        inversePatches: allInversePatches.reverse(),
      });
    },

    undo() {
      const entry = undoStack.pop();
      if (entry === undefined) {
        return;
      }

      state = applyPatchesTyped(state, entry.inversePatches);
      redoStack.push(entry);
    },

    redo() {
      const entry = redoStack.pop();
      if (entry === undefined) {
        return;
      }

      state = applyPatchesTyped(state, entry.patches);
      undoStack.push(entry);
    },

    canUndo() {
      return undoStack.length > 0;
    },

    canRedo() {
      return redoStack.length > 0;
    },
  };
}
