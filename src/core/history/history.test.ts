import { describe, expect, test } from "vitest";
import { createHistory } from "~/core/history/history";

interface Counter {
  value: number;
  label: string;
}

function makeCounter(value = 0, label = "default"): Counter {
  return { value, label };
}

describe("history", () => {
  // basic mutations

  test("applies a mutation and returns the new state", () => {
    const h = createHistory(makeCounter());

    h.apply((draft) => {
      draft.value = 5;
    });

    expect(h.current().value).toBe(5);
  });

  test("preserves fields not touched by the mutation", () => {
    const h = createHistory(makeCounter(0, "test"));

    h.apply((draft) => {
      draft.value = 10;
    });

    expect(h.current().label).toBe("test");
  });

  // undo

  test("undoes a mutation", () => {
    const h = createHistory(makeCounter());

    h.apply((draft) => {
      draft.value = 5;
    });
    h.undo();

    expect(h.current().value).toBe(0);
  });

  test("undo does nothing when there is no history", () => {
    const h = createHistory(makeCounter(42));

    h.undo();

    expect(h.current().value).toBe(42);
  });

  test("multiple undos walk back through history", () => {
    const h = createHistory(makeCounter());

    h.apply((draft) => {
      draft.value = 1;
    });
    h.apply((draft) => {
      draft.value = 2;
    });
    h.apply((draft) => {
      draft.value = 3;
    });

    h.undo();
    expect(h.current().value).toBe(2);

    h.undo();
    expect(h.current().value).toBe(1);

    h.undo();
    expect(h.current().value).toBe(0);
  });

  // redo

  test("redoes an undone mutation", () => {
    const h = createHistory(makeCounter());

    h.apply((draft) => {
      draft.value = 5;
    });
    h.undo();
    h.redo();

    expect(h.current().value).toBe(5);
  });

  test("redo does nothing when there is nothing to redo", () => {
    const h = createHistory(makeCounter(42));

    h.redo();

    expect(h.current().value).toBe(42);
  });

  test("a new mutation clears the redo stack", () => {
    const h = createHistory(makeCounter());

    h.apply((draft) => {
      draft.value = 1;
    });
    h.undo();
    h.apply((draft) => {
      draft.value = 99;
    });
    h.redo();

    // redo should have nothing to do since the new mutation cleared it.
    expect(h.current().value).toBe(99);
  });

  // canUndo / canRedo

  test("canUndo and canRedo reflect the stack state", () => {
    const h = createHistory(makeCounter());

    expect(h.canUndo()).toBe(false);
    expect(h.canRedo()).toBe(false);

    h.apply((draft) => {
      draft.value = 1;
    });
    expect(h.canUndo()).toBe(true);
    expect(h.canRedo()).toBe(false);

    h.undo();
    expect(h.canUndo()).toBe(false);
    expect(h.canRedo()).toBe(true);

    h.redo();
    expect(h.canUndo()).toBe(true);
    expect(h.canRedo()).toBe(false);
  });

  // transactions (batching)

  test("batches multiple mutations into one undo step", () => {
    const h = createHistory(makeCounter());

    h.transaction((apply) => {
      apply((draft) => {
        draft.value = 1;
      });
      apply((draft) => {
        draft.value = 2;
      });
      apply((draft) => {
        draft.label = "updated";
      });
    });

    expect(h.current().value).toBe(2);
    expect(h.current().label).toBe("updated");

    // one undo should revert all three changes.
    h.undo();
    expect(h.current().value).toBe(0);
    expect(h.current().label).toBe("default");
  });

  test("transaction with a single mutation behaves like apply", () => {
    const h = createHistory(makeCounter());

    h.transaction((apply) => {
      apply((draft) => {
        draft.value = 42;
      });
    });

    h.undo();
    expect(h.current().value).toBe(0);
  });

  // nested objects

  test("tracks changes in nested objects", () => {
    interface Nested {
      outer: { inner: number };
    }

    const h = createHistory<Nested>({ outer: { inner: 0 } });

    h.apply((draft) => {
      draft.outer.inner = 42;
    });
    expect(h.current().outer.inner).toBe(42);

    h.undo();
    expect(h.current().outer.inner).toBe(0);

    h.redo();
    expect(h.current().outer.inner).toBe(42);
  });

  // arrays

  test("tracks array mutations", () => {
    interface WithArray {
      items: number[];
    }

    const h = createHistory<WithArray>({ items: [1, 2, 3] });

    h.apply((draft) => {
      draft.items.push(4);
    });
    expect(h.current().items).toEqual([1, 2, 3, 4]);

    h.undo();
    expect(h.current().items).toEqual([1, 2, 3]);
  });

  // immutability

  test("current state is frozen", () => {
    const h = createHistory(makeCounter());
    const state = h.current();

    expect(Object.isFrozen(state)).toBe(true);
  });

  // no-op mutations

  test("a mutation that changes nothing still pushes to undo stack", () => {
    const h = createHistory(makeCounter(5));

    h.apply((draft) => {
      draft.value = 5;
    });

    // immer's behavior: even no-op produces patches. we don't optimize this
    // away; the user expects undo to work.
    expect(h.canUndo()).toBe(true);
  });
});
