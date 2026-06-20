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
      <Tooltip message="Mute">
        <button type="button">M</button>
      </Tooltip>
    ));
    expect(screen.getByRole("button", { name: "M" })).toBeTruthy();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("controlled open=true mounts role=tooltip with the message text", () => {
    render(() => (
      <Tooltip message="Mute" open>
        <button type="button">M</button>
      </Tooltip>
    ));
    const tip = screen.getByRole("tooltip");
    expect(tip.textContent).toContain("Mute");
  });

  it("trigger receives aria-describedby when open", () => {
    render(() => (
      <Tooltip message="Mute" open>
        <button type="button">M</button>
      </Tooltip>
    ));
    // Kobalte stamps aria-describedby on the trigger wrapper (display:contents
    // span), which AT traverses transparently — the child button is still the
    // announced element.
    const button = screen.getByRole("button", { name: "M" });
    const wrapper = button.parentElement as HTMLElement;
    const id = wrapper.getAttribute("aria-describedby");
    expect(id).toBeTruthy();
    expect(document.getElementById(id ?? "")?.textContent).toContain("Mute");
  });

  it("controlled onChange fires on focus (immediate) and blur after closeDelay", () => {
    const onChange = vi.fn();
    render(() => (
      <Tooltip message="Mute" onChange={onChange} openDelay={500} closeDelay={150}>
        <button type="button">M</button>
      </Tooltip>
    ));
    // Kobalte's trigger listens for non-bubbling focus/blur on the wrapper span.
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
      <Tooltip message="Mute" open onChange={onChange}>
        <button type="button">M</button>
      </Tooltip>
    ));
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("disabled suppresses tooltip entirely", () => {
    render(() => (
      <Tooltip message="Mute" disabled open>
        <button type="button">M</button>
      </Tooltip>
    ));
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(screen.getByRole("button", { name: "M" }).getAttribute("aria-describedby")).toBeNull();
  });

  it("auto-suppresses surface when message matches trigger text and no hotkey", () => {
    render(() => (
      <Tooltip message="Save" open>
        <button type="button">Save</button>
      </Tooltip>
    ));
    expect(screen.queryByRole("tooltip")).toBeNull();
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.getAttribute("aria-describedby")).toBeNull();
  });

  it("redundancy match is case- and whitespace-insensitive", () => {
    render(() => (
      <Tooltip message="  save  " open>
        <button type="button">SAVE</button>
      </Tooltip>
    ));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows only the hotkey when message matches trigger text and hotkey is set", () => {
    render(() => (
      <Tooltip message="Save" hotkey="Ctrl+S" open>
        <button type="button">Save</button>
      </Tooltip>
    ));
    const tip = screen.getByRole("tooltip");
    expect(tip.textContent).toContain("Ctrl+S");
    // The redundant message is NOT in the surface.
    expect(tip.textContent).not.toContain("Save");
  });

  it("shows message and hotkey side by side when both differ from trigger text", () => {
    render(() => (
      <Tooltip message="Toggle playback" hotkey="Space" open>
        <button type="button" aria-label="play-pause">
          ⏯
        </button>
      </Tooltip>
    ));
    const tip = screen.getByRole("tooltip");
    expect(tip.textContent).toContain("Toggle playback");
    expect(tip.textContent).toContain("Space");
  });

  it("renders nothing when neither message nor hotkey is provided", () => {
    render(() => (
      <Tooltip open>
        <button type="button">M</button>
      </Tooltip>
    ));
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(screen.getByRole("button", { name: "M" }).getAttribute("aria-describedby")).toBeNull();
  });

  it("renders on hover", async () => {
    render(() => (
      <Tooltip message="Mute" openDelay={0} closeDelay={0}>
        <button type="button">M</button>
      </Tooltip>
    ));
    // Kobalte listens to non-bubbling pointerenter on the trigger wrapper span.
    const wrapper = screen.getByRole("button", { name: "M" }).parentElement as HTMLElement;
    fireEvent.pointerEnter(wrapper);
    vi.advanceTimersByTime(0);
    expect(screen.getByRole("tooltip").textContent).toContain("Mute");
  });

  it("hides on un-hover", async () => {
    render(() => (
      <Tooltip message="Mute" openDelay={0} closeDelay={0}>
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
      <Tooltip message="Mute" open placement="bottom">
        <button type="button">M</button>
      </Tooltip>
    ));
    const tip = screen.getByRole("tooltip");
    const placement = tip.getAttribute("data-placement") ?? "";
    expect(placement).toContain("bottom");
  });
});
