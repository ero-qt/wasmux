import { createSignal } from "solid-js";
import { type History, type Recipe, createHistory } from "~/core/history";
import type { Project } from "~/core/project";

export interface ProjectStore {
  /** Reactive accessor: current project state. */
  project(): Project;

  /** Reactive accessor: whether there is something to undo. */
  canUndo(): boolean;

  /** Reactive accessor: whether there is something to redo. */
  canRedo(): boolean;

  /** Applies a mutation and pushes it onto the undo stack. */
  apply(recipe: Recipe<Project>): void;

  /** Groups multiple mutations into a single undo step. */
  transaction(fn: (apply: (recipe: Recipe<Project>) => void) => void): void;

  /** Reverts the last mutation. No-op when there is nothing to undo. */
  undo(): void;

  /** Reapplies the next undone mutation. No-op when there is nothing to redo. */
  redo(): void;
}

/**
 * Solid-reactive wrapper around {@link createHistory}. Each mutation re-emits
 * the project signal and resyncs the canUndo/canRedo booleans, so subscribers
 * re-run only when the value they read actually changes.
 */
export function createProjectStore(initial: Project): ProjectStore {
  const history: History<Project> = createHistory(initial);

  const [projectSig, setProject] = createSignal(history.current());
  const [canUndoSig, setCanUndo] = createSignal(false);
  const [canRedoSig, setCanRedo] = createSignal(false);

  const sync = (): void => {
    setProject(history.current());
    setCanUndo(history.canUndo());
    setCanRedo(history.canRedo());
  };

  return {
    project: projectSig,
    canUndo: canUndoSig,
    canRedo: canRedoSig,

    apply(recipe) {
      history.apply(recipe);
      sync();
    },

    transaction(fn) {
      history.transaction(fn);
      sync();
    },

    undo() {
      if (history.canUndo()) {
        history.undo();
        sync();
      }
    },

    redo() {
      if (history.canRedo()) {
        history.redo();
        sync();
      }
    },
  };
}
