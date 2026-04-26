import { createComputed, createRoot } from "solid-js";
import { describe, expect, test } from "vitest";
import { createProject } from "~/core/project";
import { createProjectStore } from "~/ui/project-store";

describe("createProjectStore", () => {
  // initial state

  test("project() returns the initial project", () => {
    const p = createProject();
    const store = createProjectStore(p);
    expect(store.project()).toEqual(p);
  });

  test("canUndo() and canRedo() start false", () => {
    const store = createProjectStore(createProject());
    expect(store.canUndo()).toBe(false);
    expect(store.canRedo()).toBe(false);
  });

  // apply

  test("apply mutates via recipe", () => {
    const store = createProjectStore(createProject({ resolution: { width: 100, height: 100 } }));

    store.apply((draft) => {
      draft.resolution = { width: 200, height: 200 };
    });

    expect(store.project().resolution).toEqual({ width: 200, height: 200 });
  });

  test("apply sets canUndo to true", () => {
    const store = createProjectStore(createProject());
    store.apply((draft) => {
      draft.resolution = { width: 1, height: 1 };
    });
    expect(store.canUndo()).toBe(true);
  });

  test("apply notifies effects reading project()", () => {
    createRoot((dispose) => {
      const store = createProjectStore(createProject());
      let runs = 0;
      createComputed(() => {
        store.project();
        runs++;
      });
      expect(runs).toBe(1);

      store.apply((draft) => {
        draft.resolution = { width: 500, height: 500 };
      });
      expect(runs).toBe(2);
      dispose();
    });
  });

  test("apply notifies effects reading canUndo() only when it flips", () => {
    createRoot((dispose) => {
      const store = createProjectStore(createProject());
      const observed: boolean[] = [];
      createComputed(() => {
        observed.push(store.canUndo());
      });
      expect(observed).toEqual([false]);

      store.apply((draft) => {
        draft.resolution = { width: 1, height: 1 };
      });
      expect(observed).toEqual([false, true]);

      // a second apply doesn't flip canUndo — effect should not re-run.
      store.apply((draft) => {
        draft.resolution = { width: 2, height: 2 };
      });
      expect(observed).toEqual([false, true]);
      dispose();
    });
  });

  // undo

  test("undo reverts the last apply", () => {
    const store = createProjectStore(createProject({ resolution: { width: 100, height: 100 } }));
    store.apply((draft) => {
      draft.resolution = { width: 200, height: 200 };
    });
    store.undo();
    expect(store.project().resolution).toEqual({ width: 100, height: 100 });
  });

  test("undo flips canUndo to false and canRedo to true", () => {
    const store = createProjectStore(createProject());
    store.apply((draft) => {
      draft.resolution = { width: 1, height: 1 };
    });
    store.undo();
    expect(store.canUndo()).toBe(false);
    expect(store.canRedo()).toBe(true);
  });

  test("undo notifies effects reading project()", () => {
    createRoot((dispose) => {
      const store = createProjectStore(createProject());
      store.apply((draft) => {
        draft.resolution = { width: 1, height: 1 };
      });

      let runs = 0;
      createComputed(() => {
        store.project();
        runs++;
      });
      expect(runs).toBe(1);

      store.undo();
      expect(runs).toBe(2);
      dispose();
    });
  });

  test("undo with empty stack is a no-op and does not notify effects", () => {
    createRoot((dispose) => {
      const initial = createProject();
      const store = createProjectStore(initial);
      let runs = 0;
      createComputed(() => {
        store.project();
        runs++;
      });
      expect(runs).toBe(1);

      store.undo();
      expect(store.project()).toEqual(initial);
      expect(runs).toBe(1);
      dispose();
    });
  });

  // redo

  test("redo reapplies an undone change", () => {
    const store = createProjectStore(createProject({ resolution: { width: 100, height: 100 } }));
    store.apply((draft) => {
      draft.resolution = { width: 200, height: 200 };
    });
    store.undo();
    store.redo();
    expect(store.project().resolution).toEqual({ width: 200, height: 200 });
  });

  test("redo notifies effects", () => {
    createRoot((dispose) => {
      const store = createProjectStore(createProject());
      store.apply((draft) => {
        draft.resolution = { width: 1, height: 1 };
      });
      store.undo();

      let runs = 0;
      createComputed(() => {
        store.project();
        runs++;
      });
      expect(runs).toBe(1);

      store.redo();
      expect(runs).toBe(2);
      dispose();
    });
  });

  test("redo with empty stack is a no-op and does not notify effects", () => {
    createRoot((dispose) => {
      const initial = createProject();
      const store = createProjectStore(initial);
      let runs = 0;
      createComputed(() => {
        store.project();
        runs++;
      });
      expect(runs).toBe(1);

      store.redo();
      expect(store.project()).toEqual(initial);
      expect(runs).toBe(1);
      dispose();
    });
  });

  test("a new apply clears the redo stack", () => {
    const store = createProjectStore(createProject());
    store.apply((draft) => {
      draft.resolution = { width: 1, height: 1 };
    });
    store.undo();
    expect(store.canRedo()).toBe(true);

    store.apply((draft) => {
      draft.resolution = { width: 2, height: 2 };
    });
    expect(store.canRedo()).toBe(false);
  });

  // transaction

  test("transaction batches mutations into a single undo step", () => {
    const store = createProjectStore(createProject({ resolution: { width: 100, height: 100 } }));

    store.transaction((apply) => {
      apply((draft) => {
        draft.resolution = { width: 200, height: 200 };
      });
      apply((draft) => {
        draft.resolution = { width: 300, height: 300 };
      });
    });

    expect(store.project().resolution.width).toBe(300);
    store.undo();
    expect(store.project().resolution.width).toBe(100);
  });

  test("transaction notifies effects only once on completion", () => {
    createRoot((dispose) => {
      const store = createProjectStore(createProject());
      let runs = 0;
      createComputed(() => {
        store.project();
        runs++;
      });
      expect(runs).toBe(1);

      store.transaction((apply) => {
        apply((draft) => {
          draft.resolution = { width: 1, height: 1 };
        });
        apply((draft) => {
          draft.resolution = { width: 2, height: 2 };
        });
        apply((draft) => {
          draft.resolution = { width: 3, height: 3 };
        });
      });
      expect(runs).toBe(2);
      dispose();
    });
  });
});
