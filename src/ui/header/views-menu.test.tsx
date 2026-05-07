import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";
import { ViewsMenu } from "~/ui/header/views-menu";
import { closeAllPanels, isPanelOpen, openPanel } from "~/ui/panels/panel-store";

afterEach(() => {
  closeAllPanels();
  cleanup();
  // Kobalte's Portal mounts content into document.body; clean up stragglers.
  document.body.innerHTML = "";
});

/**
 * Kobalte trigger components listen on the full pointer-down → pointer-up →
 * click cycle. fireEvent.click alone doesn't fire pointer events, so we
 * synthesize the sequence here to mirror a real press.
 */
function press(el: Element): void {
  fireEvent.pointerDown(el, { pointerType: "mouse" });
  fireEvent.pointerUp(el, { pointerType: "mouse" });
  fireEvent.click(el);
}

describe("ViewsMenu", () => {
  test("renders a trigger button labelled 'views'", () => {
    render(() => <ViewsMenu />);
    expect(screen.getByRole("button", { name: /views/i })).toBeTruthy();
  });

  test("trigger advertises a popup and starts collapsed", () => {
    render(() => <ViewsMenu />);
    const trigger = screen.getByRole("button", { name: /views/i });
    expect(trigger.hasAttribute("aria-haspopup")).toBe(true);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  test("pressing the trigger expands the menu", () => {
    render(() => <ViewsMenu />);
    const trigger = screen.getByRole("button", { name: /views/i });

    press(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("menu")).toBeTruthy();
  });

  test("menu surfaces one menuitemcheckbox per registered view", () => {
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    const items = screen.getAllByRole("menuitemcheckbox");
    expect(items.length).toBe(1);
    expect(items[0]?.textContent).toMatch(/jobs/i);
  });

  test("aria-checked mirrors the panel's open state when the menu opens", () => {
    openPanel("jobs");
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    expect(
      screen.getByRole("menuitemcheckbox", { name: /jobs/i }).getAttribute("aria-checked"),
    ).toBe("true");
  });

  test("activating a closed item opens the panel", () => {
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    press(screen.getByRole("menuitemcheckbox", { name: /jobs/i }));

    expect(isPanelOpen("jobs")).toBe(true);
  });

  test("activating an open item closes the panel", () => {
    openPanel("jobs");
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    press(screen.getByRole("menuitemcheckbox", { name: /jobs/i }));

    expect(isPanelOpen("jobs")).toBe(false);
  });
});
