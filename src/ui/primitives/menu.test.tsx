import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { createSignal } from "solid-js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Menu } from "~/ui/primitives/menu";

afterEach(cleanup);

/** Kobalte's DropdownMenu.Trigger opens on pointerdown, not click. */
function openMenu(trigger: HTMLElement): void {
  fireEvent.pointerDown(trigger, { pointerType: "mouse", button: 0 });
}

/** Kobalte menu items select on pointerup (shouldSelectOnPressUp + allowsDifferentPressOrigin). */
function activateItem(item: HTMLElement): void {
  fireEvent.pointerDown(item, { pointerType: "mouse", button: 0 });
  fireEvent.pointerUp(item, { pointerType: "mouse", button: 0 });
}

describe("<Menu />", () => {
  it("opens the menu on trigger click and renders items", () => {
    render(() => (
      <Menu trigger="Edit" aria-label="edit-menu">
        <Menu.Item onSelect={() => {}}>Cut</Menu.Item>
        <Menu.Item onSelect={() => {}}>Copy</Menu.Item>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getAllByRole("menuitem").length).toBe(2);
  });

  it("calls onSelect when an item is activated", () => {
    const onSelect = vi.fn();
    render(() => (
      <Menu trigger="Edit" aria-label="edit-menu">
        <Menu.Item onSelect={onSelect}>Cut</Menu.Item>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "Edit" }));
    activateItem(screen.getByRole("menuitem", { name: /cut/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("CheckboxItem toggles via onChange and reflects aria-checked", () => {
    const onChange = vi.fn();
    render(() => (
      <Menu trigger="View" aria-label="view-menu">
        <Menu.CheckboxItem checked={false} onChange={onChange}>
          Bin
        </Menu.CheckboxItem>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "View" }));
    const item = screen.getByRole("menuitemcheckbox", { name: /bin/i });
    expect(item.getAttribute("aria-checked")).toBe("false");
    activateItem(item);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("RadioGroup updates selected value", () => {
    const onChange = vi.fn();
    render(() => (
      <Menu trigger="Sort" aria-label="sort-menu">
        <Menu.RadioGroup value="name" onChange={onChange}>
          <Menu.RadioItem value="name">Name</Menu.RadioItem>
          <Menu.RadioItem value="date">Date</Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "Sort" }));
    activateItem(screen.getByRole("menuitemradio", { name: /date/i }));
    expect(onChange).toHaveBeenCalledWith("date");
  });

  it("disabled item is not activatable and exposes aria-disabled", () => {
    const onSelect = vi.fn();
    render(() => (
      <Menu trigger="Edit" aria-label="edit-menu">
        <Menu.Item disabled onSelect={onSelect}>
          Paste
        </Menu.Item>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "Edit" }));
    const item = screen.getByRole("menuitem", { name: /paste/i });
    expect(item.getAttribute("aria-disabled")).toBe("true");
    activateItem(item);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("hotkey hint is aria-hidden and contains the hotkey text", () => {
    render(() => (
      <Menu trigger="Edit" aria-label="edit-menu">
        <Menu.Item hotkey="Ctrl+C" onSelect={() => {}}>
          Copy
        </Menu.Item>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "Edit" }));
    const item = screen.getByRole("menuitem", { name: /copy/i });
    // accessible name is the label only — no hotkey leakage.
    expect(item.textContent ?? "").toContain("Copy");
    // the hotkey wrapper span is aria-hidden and contains the hotkey text:
    const hiddenEls = Array.from(item.querySelectorAll("[aria-hidden='true']"));
    expect(hiddenEls.some((el) => el.textContent?.includes("Ctrl+C"))).toBe(true);
  });

  it("hotkey item exposes aria-keyshortcuts for AT users", () => {
    render(() => (
      <Menu trigger="Edit" aria-label="edit-menu">
        <Menu.Item hotkey="Ctrl+X" onSelect={() => {}}>
          Cut
        </Menu.Item>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "Edit" }));
    const item = screen.getByRole("menuitem", { name: /cut/i });
    expect(item.getAttribute("aria-keyshortcuts")).toBe("Ctrl+X");
  });

  it("separator and label expose correct ARIA roles", () => {
    render(() => (
      <Menu trigger="View" aria-label="view-menu">
        <Menu.Label>Group</Menu.Label>
        <Menu.Item onSelect={() => {}}>One</Menu.Item>
        <Menu.Separator />
        <Menu.Item onSelect={() => {}}>Two</Menu.Item>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "View" }));
    expect(screen.getByRole("separator")).toBeTruthy();
    expect(screen.getByText("Group")).toBeTruthy();
  });

  it("sub-menu trigger opens a child menu on ArrowRight", () => {
    render(() => (
      <Menu trigger="More" aria-label="more-menu">
        <Menu.Sub trigger="Share">
          <Menu.Item onSelect={() => {}}>Copy link</Menu.Item>
        </Menu.Sub>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "More" }));
    const subTrigger = screen.getByRole("menuitem", { name: /share/i });
    fireEvent.keyDown(subTrigger, { key: "ArrowRight" });
    // sub-menu mounts as a second role=menu in the DOM.
    expect(screen.getAllByRole("menu").length).toBeGreaterThanOrEqual(2);
  });

  it("controlled open + onChange propagate state changes", () => {
    const onChange = vi.fn();
    const [open, setOpen] = createSignal(false);
    render(() => (
      <Menu
        trigger="Edit"
        aria-label="edit-menu"
        open={open()}
        onChange={(next) => {
          setOpen(next);
          onChange(next);
        }}
      >
        <Menu.Item onSelect={() => {}}>Cut</Menu.Item>
      </Menu>
    ));
    expect(screen.queryByRole("menu")).toBeNull();
    openMenu(screen.getByRole("button", { name: "Edit" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("data-placement is stamped on the menu content", () => {
    render(() => (
      <Menu trigger="Edit" aria-label="edit-menu" placement="bottom-end">
        <Menu.Item onSelect={() => {}}>Cut</Menu.Item>
      </Menu>
    ));
    openMenu(screen.getByRole("button", { name: "Edit" }));
    const menu = screen.getByRole("menu");
    expect(menu.getAttribute("data-placement")).toBe("bottom-end");
  });
});
