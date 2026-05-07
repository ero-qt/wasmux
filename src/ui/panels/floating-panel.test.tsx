import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";
import { FloatingPanel } from "~/ui/panels/floating-panel";
import {
  closeAllPanels,
  isPanelOpen,
  openPanel,
  panelPosition,
  panelSize,
  resetAllPanelPositions,
  resetAllPanelSizes,
  setPanelPosition,
  setPanelSize,
} from "~/ui/panels/panel-store";

afterEach(() => {
  closeAllPanels();
  resetAllPanelPositions();
  resetAllPanelSizes();
  cleanup();
});

describe("FloatingPanel", () => {
  test("renders nothing while the panel id is closed", () => {
    render(() => (
      <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
        <p>body</p>
      </FloatingPanel>
    ));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("renders body and header when open", () => {
    openPanel("jobs");
    render(() => (
      <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
        <p>body</p>
      </FloatingPanel>
    ));

    expect(screen.getByRole("dialog", { name: "Jobs" })).not.toBeNull();
    expect(screen.getByText("body")).not.toBeNull();
  });

  test("close button calls closePanel", () => {
    openPanel("jobs");
    render(() => (
      <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
        <p>body</p>
      </FloatingPanel>
    ));

    fireEvent.click(screen.getByRole("button"));
    expect(isPanelOpen("jobs")).toBe(false);
  });

  describe("keyboard drag", () => {
    test("ArrowRight nudges position by 10px on the inline axis", () => {
      openPanel("jobs");
      render(() => (
        <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
          <p>body</p>
        </FloatingPanel>
      ));
      const handle = screen.getByRole("toolbar");

      fireEvent.keyDown(handle, { key: "ArrowRight" });
      expect(panelPosition("jobs")).toEqual({ x: 10, y: 0 });
    });

    test("ArrowDown nudges position by 10px on the block axis", () => {
      openPanel("jobs");
      render(() => (
        <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
          <p>body</p>
        </FloatingPanel>
      ));
      const handle = screen.getByRole("toolbar");

      fireEvent.keyDown(handle, { key: "ArrowDown" });
      expect(panelPosition("jobs")).toEqual({ x: 0, y: 10 });
    });

    test("Shift+Arrow uses the larger 50px step", () => {
      openPanel("jobs");
      render(() => (
        <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
          <p>body</p>
        </FloatingPanel>
      ));
      const handle = screen.getByRole("toolbar");

      fireEvent.keyDown(handle, { key: "ArrowLeft", shiftKey: true });
      expect(panelPosition("jobs")).toEqual({ x: -50, y: 0 });
    });

    test("Escape closes the panel and leaves stored position/size intact", () => {
      openPanel("jobs");
      setPanelPosition("jobs", { x: 100, y: 100 });
      setPanelSize("jobs", { inlineSize: 400, blockSize: 500 });
      render(() => (
        <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
          <p>body</p>
        </FloatingPanel>
      ));
      const handle = screen.getByRole("toolbar");

      fireEvent.keyDown(handle, { key: "Escape" });
      expect(isPanelOpen("jobs")).toBe(false);
      expect(panelPosition("jobs")).toEqual({ x: 100, y: 100 });
      expect(panelSize("jobs")).toEqual({ inlineSize: 400, blockSize: 500 });
    });

    test("non-arrow keys are ignored", () => {
      openPanel("jobs");
      render(() => (
        <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
          <p>body</p>
        </FloatingPanel>
      ));
      const handle = screen.getByRole("toolbar");

      fireEvent.keyDown(handle, { key: "Enter" });
      fireEvent.keyDown(handle, { key: "a" });
      expect(panelPosition("jobs")).toEqual({ x: 0, y: 0 });
    });

    test("successive arrow presses accumulate", () => {
      openPanel("jobs");
      render(() => (
        <FloatingPanel id="jobs" title="Jobs" position="bottom-right">
          <p>body</p>
        </FloatingPanel>
      ));
      const handle = screen.getByRole("toolbar");

      fireEvent.keyDown(handle, { key: "ArrowRight" });
      fireEvent.keyDown(handle, { key: "ArrowRight" });
      fireEvent.keyDown(handle, { key: "ArrowDown" });
      expect(panelPosition("jobs")).toEqual({ x: 20, y: 10 });
    });
  });
});
