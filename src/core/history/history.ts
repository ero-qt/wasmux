import { type Draft, type Patches, apply, create } from "mutative";

/** Mutative patch pair representing a single mutation step. */
interface HistoryEntry {
  readonly patches: Patches;
  readonly inversePatches: Patches;
}

/** A mutation operating on a draft of the state. */
export type Recipe<T> = (draft: Draft<T>) => void;

/**
 * Undo/redo history over an immutable state tree. Stores Mutative
 * patches (diffs), not full snapshots. State is frozen between mutations.
 */
export interface History<T> {
  /** Returns the current frozen state. */
  current(): T;

  /** Applies a mutation and pushes it onto the undo stack. */
  apply(recipe: Recipe<T>): void;

  /** Groups multiple mutations into a single undo step. */
  transaction(fn: (apply: (recipe: Recipe<T>) => void) => void): void;

  /** Reverts the last mutation. No-op if the undo stack is empty. */
  undo(): void;

  /** Reapplies the last undone mutation. No-op if the redo stack is empty. */
  redo(): void;

  /** Returns `true` when there is a mutation to undo. */
  canUndo(): boolean;

  /** Returns `true` when there is a mutation to redo. */
  canRedo(): boolean;
}

// shared options: patches enabled, output frozen.
const CREATE_OPTS = { enablePatches: true, enableAutoFreeze: true } as const;

/** Creates a new history starting from `initial`. */
export function createHistory<T extends object>(initial: T): History<T> {
  const undoStack: HistoryEntry[] = [];
  const redoStack: HistoryEntry[] = [];

  // no-op create freezes the initial state so current() is always frozen.
  let state = create(initial, () => {}, CREATE_OPTS)[0] as T;

  function pushEntry(entry: HistoryEntry): void {
    undoStack.push(entry);
    // new mutations invalidate the redo stack.
    redoStack.length = 0;
  }

  function applySingle(recipe: Recipe<T>): void {
    const [next, patches, inversePatches] = create(state, recipe, CREATE_OPTS);
    state = next as T;
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
      const allPatches: Patches = [];
      const allInversePatches: Patches = [];

      fn((recipe) => {
        const [next, patches, inversePatches] = create(state, recipe, CREATE_OPTS);
        state = next as T;
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

      state = apply(state, entry.inversePatches) as T;
      redoStack.push(entry);
    },

    redo() {
      const entry = redoStack.pop();
      if (entry === undefined) {
        return;
      }

      state = apply(state, entry.patches) as T;
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
