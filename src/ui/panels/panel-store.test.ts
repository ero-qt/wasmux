import { afterEach, describe, expect, test } from "vitest";
import {
  closeAllPanels,
  closePanel,
  isPanelOpen,
  openPanel,
  openPanels,
  togglePanel,
} from "~/ui/panels/panel-store";

afterEach(() => {
  closeAllPanels();
});

describe("panel store", () => {
  test("starts with no open panels", () => {
    expect(openPanels()).toEqual([]);
    expect(isPanelOpen("jobs")).toBe(false);
  });

  test("openPanel marks the panel open", () => {
    openPanel("jobs");
    expect(isPanelOpen("jobs")).toBe(true);
    expect(openPanels()).toEqual(["jobs"]);
  });

  test("opening an already-open panel is a no-op", () => {
    openPanel("jobs");
    openPanel("jobs");
    expect(openPanels()).toEqual(["jobs"]);
  });

  test("closePanel marks the panel closed", () => {
    openPanel("jobs");
    closePanel("jobs");
    expect(isPanelOpen("jobs")).toBe(false);
  });

  test("closing a closed panel is a no-op", () => {
    closePanel("jobs");
    expect(openPanels()).toEqual([]);
  });

  test("togglePanel flips state", () => {
    togglePanel("jobs");
    expect(isPanelOpen("jobs")).toBe(true);
    togglePanel("jobs");
    expect(isPanelOpen("jobs")).toBe(false);
  });

  test("multiple panels can be open at once", () => {
    openPanel("jobs");
    openPanel("perf");
    expect(new Set(openPanels())).toEqual(new Set(["jobs", "perf"]));
  });

  test("closeAllPanels clears every open panel", () => {
    openPanel("jobs");
    openPanel("perf");
    closeAllPanels();
    expect(openPanels()).toEqual([]);
  });
});
