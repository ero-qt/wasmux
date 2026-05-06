import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";
import { closeAllPanels, isPanelOpen, openPanel } from "~/ui/panels/panel-store";
import { PanelToggle } from "~/ui/panels/panel-toggle";

afterEach(() => {
  closeAllPanels();
  cleanup();
});

describe("PanelToggle", () => {
  test("renders the label as the button text by default", () => {
    render(() => <PanelToggle id="jobs" label="Jobs" />);

    const btn = screen.getByRole("button", { name: "Jobs" });
    expect(btn.textContent).toBe("Jobs");
  });

  test("renders custom children when provided", () => {
    render(() => (
      <PanelToggle id="jobs" label="Jobs">
        ▼
      </PanelToggle>
    ));

    const btn = screen.getByRole("button", { name: "Jobs" });
    expect(btn.textContent).toBe("▼");
  });

  test("aria-pressed is false while the panel is closed", () => {
    render(() => <PanelToggle id="jobs" label="Jobs" />);

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");
  });

  test("aria-pressed is true while the panel is open", () => {
    openPanel("jobs");
    render(() => <PanelToggle id="jobs" label="Jobs" />);

    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  test("aria-pressed updates reactively when the panel opens elsewhere", () => {
    render(() => <PanelToggle id="jobs" label="Jobs" />);
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("false");

    openPanel("jobs");
    expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
  });

  test("clicking the button opens the panel", () => {
    render(() => <PanelToggle id="jobs" label="Jobs" />);

    fireEvent.click(screen.getByRole("button"));
    expect(isPanelOpen("jobs")).toBe(true);
  });

  test("clicking the button again closes the panel", () => {
    render(() => <PanelToggle id="jobs" label="Jobs" />);

    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(isPanelOpen("jobs")).toBe(false);
  });

  test("title attribute matches the label so hover reveals it", () => {
    render(() => <PanelToggle id="jobs" label="Jobs" />);

    expect(screen.getByRole("button").getAttribute("title")).toBe("Jobs");
  });
});
