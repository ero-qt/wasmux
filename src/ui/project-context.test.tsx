import { type Component, createComputed } from "solid-js";
import { render } from "solid-js/web";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { createProject } from "~/core/project";
import { ProjectContext, useProject } from "~/ui/project-context";
import { type ProjectStore, createProjectStore } from "~/ui/project-store";

describe("useProject", () => {
  let container: HTMLElement;
  let dispose: (() => void) | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    dispose?.();
    dispose = null;
    container.remove();
  });

  test("throws when used outside a Provider", () => {
    const Bad: Component = () => {
      useProject();
      return null;
    };

    expect(() => {
      dispose = render(() => <Bad />, container);
    }).toThrow(/useProject/);
  });

  test("returns the provided store", () => {
    const store = createProjectStore(createProject());
    let observed: ProjectStore | null = null;

    const Spy: Component = () => {
      observed = useProject();
      return null;
    };

    dispose = render(
      () => (
        <ProjectContext.Provider value={store}>
          <Spy />
        </ProjectContext.Provider>
      ),
      container,
    );

    expect(observed).toBe(store);
  });

  test("multiple consumers receive the same store", () => {
    const store = createProjectStore(createProject());
    const observed: ProjectStore[] = [];

    const Spy: Component = () => {
      observed.push(useProject());
      return null;
    };

    dispose = render(
      () => (
        <ProjectContext.Provider value={store}>
          <Spy />
          <Spy />
        </ProjectContext.Provider>
      ),
      container,
    );

    expect(observed).toHaveLength(2);
    expect(observed[0]).toBe(store);
    expect(observed[1]).toBe(store);
  });

  test("a child's reactive read updates when the store mutates", () => {
    const initial = createProject({ resolution: { width: 100, height: 100 } });
    const store = createProjectStore(initial);
    let observedWidth = 0;

    const Child: Component = () => {
      const p = useProject();
      createComputed(() => {
        observedWidth = p.project().resolution.width;
      });
      return null;
    };

    dispose = render(
      () => (
        <ProjectContext.Provider value={store}>
          <Child />
        </ProjectContext.Provider>
      ),
      container,
    );

    expect(observedWidth).toBe(100);
    store.apply((draft) => {
      draft.resolution = { width: 999, height: 999 };
    });
    expect(observedWidth).toBe(999);
  });
});
