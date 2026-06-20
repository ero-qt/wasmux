import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Tooltip } from "~/ui/primitives/tooltip";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

beforeEach(() => {
  vi.useFakeTimers();
});

describe("<Tooltip />", () => {
  it("renders trigger child without tooltip content initially", () => {
    render(() => (
      <Tooltip label="Mute">
        <button type="button">M</button>
      </Tooltip>
    ));
    expect(screen.getByRole("button", { name: "M" })).toBeTruthy();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("controlled open=true mounts role=tooltip with the label text", () => {
    render(() => (
      <Tooltip label="Mute" open>
        <button type="button">M</button>
      </Tooltip>
    ));
    const tip = screen.getByRole("tooltip");
    expect(tip.textContent).toContain("Mute");
  });

  it("trigger receives aria-describedby when open", () => {
    render(() => (
      <Tooltip label="Mute" open>
        <button type="button">M</button>
      </Tooltip>
    ));
    // Kobalte stamps aria-describedby on the trigger wrapper div (display:contents),
    // which AT traverses transparently — the child button is still the announced element.
    const button = screen.getByRole("button", { name: "M" });
    const wrapper = button.parentElement as HTMLElement;
    const id = wrapper.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id ?? "")?.textContent).toContain("Mute");
  });

  it("controlled onChange fires on focus (immediate) and blur after closeDelay", () => {
    const onChange = vi.fn();
    render(() => (
      <Tooltip label="Mute" onChange={onChange} openDelay={500} closeDelay={150}>
        <button type="button">M</button>
      </Tooltip>
    ));
    // Kobalte's trigger listens for non-bubbling focus/blur on the wrapper div.
    // Focus bypasses openDelay and opens immediately (Kobalte native behaviour).
    const button = screen.getByRole("button", { name: "M" });
    const wrapper = button.parentElement as HTMLElement;
    fireEvent.focus(wrapper);
    expect(onChange).toHaveBeenCalledWith(true);
    fireEvent.blur(wrapper);
    vi.advanceTimersByTime(150);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("Escape closes an open tooltip", () => {
    const onChange = vi.fn();
    render(() => (
      <Tooltip label="Mute" open onChange={onChange}>
        <button type="button">M</button>
      </Tooltip>
    ));
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("disabled suppresses tooltip entirely", () => {
    render(() => (
      <Tooltip label="Mute" disabled open>
        <button type="button">M</button>
      </Tooltip>
    ));
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(screen.getByRole("button", { name: "M" }).getAttribute("aria-describedby")).toBeNull();
  });

  it("asLabel applies aria-label and skips the surface", () => {
    render(() => (
      <Tooltip label="Mute" asLabel open>
        <button type="button">M</button>
      </Tooltip>
    ));
    expect(screen.queryByRole("tooltip")).toBeNull();
    const trigger = screen.getByRole("button");
    expect(trigger.getAttribute("aria-label")).toBe("Mute");
    expect(trigger.getAttribute("aria-describedby")).toBeNull();
  });

  it("renders on hover", async () => {
    render(() => (
      <Tooltip label="Mute" openDelay={0} closeDelay={0}>
        <button type="button">M</button>
      </Tooltip>
    ));
    // Kobalte listens to non-bubbling pointerenter on the trigger wrapper div.
    const wrapper = screen.getByRole("button", { name: "M" }).parentElement as HTMLElement;
    fireEvent.pointerEnter(wrapper);
    vi.advanceTimersByTime(0);
    expect(screen.getByRole("tooltip").textContent).toContain("Mute");
  });

  it("hides on un-hover", async () => {
    render(() => (
      <Tooltip label="Mute" openDelay={0} closeDelay={0}>
        <button type="button">M</button>
      </Tooltip>
    ));
    const wrapper = screen.getByRole("button", { name: "M" }).parentElement as HTMLElement;
    fireEvent.pointerEnter(wrapper);
    vi.advanceTimersByTime(0);
    expect(screen.getByRole("tooltip")).toBeTruthy();
    fireEvent.pointerLeave(wrapper);
    vi.advanceTimersByTime(0);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("placement prop forwards to a data-placement attribute", () => {
    render(() => (
      <Tooltip label="Mute" open placement="bottom">
        <button type="button">M</button>
      </Tooltip>
    ));
    const tip = screen.getByRole("tooltip");
    const placement = tip.getAttribute("data-placement") ?? "";
    expect(placement).toContain("bottom");
  });
});
