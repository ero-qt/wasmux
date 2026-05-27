import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test } from "vitest";
import { ViewsMenu } from "~/ui/header/views-menu";
import { ALL_ZONES, hideZone, isZoneVisible, showAllZones } from "~/ui/layout/zone-store";

afterEach(() => {
  showAllZones();
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

  test("menu surfaces one menuitemcheckbox per zone", () => {
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    const items = screen.getAllByRole("menuitemcheckbox");
    expect(items.length).toBe(ALL_ZONES.length);
  });

  test("all zones start checked because all are visible", () => {
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    for (const item of screen.getAllByRole("menuitemcheckbox")) {
      expect(item.getAttribute("aria-checked")).toBe("true");
    }
  });

  test("aria-checked mirrors the zone's hidden state", () => {
    hideZone("bin");
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    const bin = screen.getByRole("menuitemcheckbox", { name: /project bin/i });
    expect(bin.getAttribute("aria-checked")).toBe("false");
  });

  test("activating a checked item hides the zone", () => {
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    press(screen.getByRole("menuitemcheckbox", { name: /inspector/i }));

    expect(isZoneVisible("inspector")).toBe(false);
  });

  test("activating an unchecked item shows the zone again", () => {
    hideZone("timeline");
    render(() => <ViewsMenu />);
    press(screen.getByRole("button", { name: /views/i }));

    press(screen.getByRole("menuitemcheckbox", { name: /timeline/i }));

    expect(isZoneVisible("timeline")).toBe(true);
  });
});
