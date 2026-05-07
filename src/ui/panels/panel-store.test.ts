import { afterEach, describe, expect, test } from "vitest";
import {
  closeAllPanels,
  closePanel,
  isPanelOpen,
  openPanel,
  openPanels,
  panelPosition,
  panelSize,
  resetAllPanelPositions,
  resetAllPanelSizes,
  resetPanelPosition,
  resetPanelSize,
  setPanelPosition,
  setPanelSize,
  togglePanel,
} from "~/ui/panels/panel-store";

afterEach(() => {
  closeAllPanels();
  resetAllPanelPositions();
  resetAllPanelSizes();
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

  test("panelSize is undefined until first set", () => {
    expect(panelSize("jobs")).toBeUndefined();
  });

  test("setPanelSize stores the dimensions", () => {
    setPanelSize("jobs", { inlineSize: 320, blockSize: 480 });
    expect(panelSize("jobs")).toEqual({ inlineSize: 320, blockSize: 480 });
  });

  test("resetPanelSize falls back to CSS default (undefined)", () => {
    setPanelSize("jobs", { inlineSize: 320, blockSize: 480 });
    resetPanelSize("jobs");
    expect(panelSize("jobs")).toBeUndefined();
  });

  test("sizes are independent across panel ids", () => {
    setPanelSize("jobs", { inlineSize: 200, blockSize: 300 });
    setPanelSize("perf", { inlineSize: 400, blockSize: 500 });
    expect(panelSize("jobs")).toEqual({ inlineSize: 200, blockSize: 300 });
    expect(panelSize("perf")).toEqual({ inlineSize: 400, blockSize: 500 });
  });

  test("size survives close and reopen", () => {
    openPanel("jobs");
    setPanelSize("jobs", { inlineSize: 400, blockSize: 500 });
    closePanel("jobs");
    openPanel("jobs");
    expect(panelSize("jobs")).toEqual({ inlineSize: 400, blockSize: 500 });
  });

  test("resetAllPanelSizes drops every stored size", () => {
    setPanelSize("jobs", { inlineSize: 200, blockSize: 300 });
    setPanelSize("perf", { inlineSize: 400, blockSize: 500 });
    resetAllPanelSizes();
    expect(panelSize("jobs")).toBeUndefined();
    expect(panelSize("perf")).toBeUndefined();
  });
});
