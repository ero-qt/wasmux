import { afterEach, describe, expect, test } from "vitest";
import {
  type PanelDefinition,
  allPanels,
  clearPanelRegistry,
  getPanel,
  registerPanel,
} from "~/ui/layout/panel-registry";

const stub: PanelDefinition = {
  id: "stub",
  titleKey: "stub.title",
  Component: () => null,
  defaultCellId: "leaf-a",
};

afterEach(() => {
  clearPanelRegistry();
});

describe("panel registry", () => {
  test("getPanel returns undefined for an unknown id", () => {
    expect(getPanel("missing")).toBeUndefined();
  });

  test("registered panels are retrievable by id", () => {
    registerPanel(stub);
    expect(getPanel("stub")).toBe(stub);
  });

  test("allPanels returns definitions in registration order", () => {
    registerPanel(stub);
    const second: PanelDefinition = { ...stub, id: "two" };
    registerPanel(second);
    expect(allPanels()).toEqual([stub, second]);
  });

  test("re-registering the same id throws", () => {
    registerPanel(stub);
    expect(() => registerPanel(stub)).toThrow(/already registered/);
  });

  test("clearPanelRegistry empties the store", () => {
    registerPanel(stub);
    clearPanelRegistry();
    expect(allPanels()).toEqual([]);
  });
});
