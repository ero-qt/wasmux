import { type Draft, type Patch, applyPatches, enablePatches, produceWithPatches } from "immer";

enablePatches();

/** Configuration for {@link createHistory}. */
export interface HistoryOptions {
  /**
   * Maximum number of undo entries to keep. Oldest entries are
   * discarded when the limit is exceeded. Defaults to 200.
   */
  maxHistory?: number | undefined;
}

/** A single undo/redo entry storing forward and inverse patches. */
interface HistoryEntry {
  readonly patches: Patch[];
  readonly inversePatches: Patch[];
}

/** A mutation function that operates on a draft of the state. */
export type Recipe<T> = (draft: Draft<T>) => void;

/**
 * Represents an undo/redo history for an immutable state tree.
 *
 * Uses Immer patches internally so only diffs are stored, not full
 * snapshots. The state is always frozen (immutable) between mutations.
 */
export interface History<T> {
  /** Returns the current state. The returned object is frozen. */
  current(): T;

  /** Applies a mutation and pushes it onto the undo stack. */
  apply(recipe: Recipe<T>): void;

  /**
   * Groups multiple mutations into a single undo step. The callback
   * receives an apply function that works like {@link apply} but
   * collects all patches into one entry.
   */
  transaction(fn: (apply: (recipe: Recipe<T>) => void) => void): void;

  /** Undoes the last mutation. Does nothing if the undo stack is empty. */
  undo(): void;

  /** Redoes the last undone mutation. Does nothing if the redo stack is empty. */
  redo(): void;

  /** Returns true if there are mutations that can be undone. */
  canUndo(): boolean;

  /** Returns true if there are mutations that can be redone. */
  canRedo(): boolean;
}

/**
 * Typed wrapper around Immer's {@link applyPatches}, which returns
 * `Objectish` instead of the input type.
 */
function applyPatchesTyped<T extends object>(state: T, patches: Patch[]): T {
  return applyPatches(state as Record<string, unknown>, patches) as T;
}

/** Creates a new {@link History} with the given initial state. */
export function createHistory<T extends object>(initial: T, options?: HistoryOptions): History<T> {
  const maxHistory = options?.maxHistory ?? 200;
  const undoStack: HistoryEntry[] = [];
  const redoStack: HistoryEntry[] = [];

  // Freeze the initial state so current() is always frozen.
  let state = produceWithPatches(initial, () => {})[0];

  function pushEntry(entry: HistoryEntry): void {
    undoStack.push(entry);

    if (undoStack.length > maxHistory) {
      undoStack.shift();
    }

    // Any new mutation invalidates the redo stack.
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

      // Inverse patches must be applied in reverse order to correctly
      // undo a sequence of mutations (C⁻¹, B⁻¹, A⁻¹).
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
