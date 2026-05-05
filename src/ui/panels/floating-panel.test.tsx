import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";
import { FloatingPanel } from "~/ui/panels/floating-panel";
import { closeAllPanels, isPanelOpen, openPanel } from "~/ui/panels/panel-store";

afterEach(() => {
  closeAllPanels();
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
});
