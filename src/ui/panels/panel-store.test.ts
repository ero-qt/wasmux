import { afterEach, describe, expect, test } from "vitest";
import {
  closeAllPanels,
  closePanel,
  isPanelOpen,
  openPanel,
  openPanels,
  panelPosition,
  resetAllPanelPositions,
  resetPanelPosition,
  setPanelPosition,
  togglePanel,
} from "~/ui/panels/panel-store";

afterEach(() => {
  closeAllPanels();
  resetAllPanelPositions();
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

  test("panelPosition defaults to the origin when never set", () => {
    expect(panelPosition("jobs")).toEqual({ x: 0, y: 0 });
  });

  test("setPanelPosition stores the offset", () => {
    setPanelPosition("jobs", { x: 42, y: -10 });
    expect(panelPosition("jobs")).toEqual({ x: 42, y: -10 });
  });

  test("position survives close and reopen", () => {
    openPanel("jobs");
    setPanelPosition("jobs", { x: 50, y: 50 });
    closePanel("jobs");
    openPanel("jobs");
    expect(panelPosition("jobs")).toEqual({ x: 50, y: 50 });
  });

  test("resetPanelPosition returns the panel to the origin", () => {
    setPanelPosition("jobs", { x: 50, y: 50 });
    resetPanelPosition("jobs");
    expect(panelPosition("jobs")).toEqual({ x: 0, y: 0 });
  });

  test("resetting a never-set panel is a no-op", () => {
    resetPanelPosition("jobs");
    expect(panelPosition("jobs")).toEqual({ x: 0, y: 0 });
  });

  test("positions are independent across panel ids", () => {
    setPanelPosition("jobs", { x: 10, y: 10 });
    setPanelPosition("perf", { x: 20, y: 20 });
    expect(panelPosition("jobs")).toEqual({ x: 10, y: 10 });
    expect(panelPosition("perf")).toEqual({ x: 20, y: 20 });
  });

  test("resetAllPanelPositions drops every stored offset", () => {
    setPanelPosition("jobs", { x: 10, y: 10 });
    setPanelPosition("perf", { x: 20, y: 20 });
    resetAllPanelPositions();
    expect(panelPosition("jobs")).toEqual({ x: 0, y: 0 });
    expect(panelPosition("perf")).toEqual({ x: 0, y: 0 });
  });
});
