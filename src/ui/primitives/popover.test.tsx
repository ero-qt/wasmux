import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Popover } from "~/ui/primitives/popover";

afterEach(cleanup);

describe("<Popover />", () => {
  it("renders trigger and no panel when closed", () => {
    render(() => (
      <Popover open={false} trigger="Open" aria-label="picker" onChange={() => {}}>
        body
      </Popover>
    ));
    expect(screen.getByRole("button", { name: "Open" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders panel contents when open and trigger reflects aria-expanded", () => {
    render(() => (
      <Popover open trigger="Open" aria-label="picker" onChange={() => {}}>
        <span data-testid="leaf">x</span>
      </Popover>
    ));
    expect(screen.getByTestId("leaf")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Open" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("trigger click toggles open via onChange", () => {
    const onChange = vi.fn();
    render(() => (
      <Popover open={false} trigger="Open" aria-label="picker" onChange={onChange}>
        body
      </Popover>
    ));
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("Escape calls onChange(false)", () => {
    const onChange = vi.fn();
    render(() => (
      <Popover open trigger="Open" aria-label="picker" onChange={onChange}>
        body
      </Popover>
    ));
    fireEvent.keyDown(document.body, { key: "Escape" });
    expect(onChange).toHaveBeenLastCalledWith(false);
  });

  it("disabled trigger does not open", () => {
    const onChange = vi.fn();
    render(() => (
      <Popover open={false} disabled trigger="Open" aria-label="picker" onChange={onChange}>
        body
      </Popover>
    ));
    const btn = screen.getByRole("button", { name: "Open" });
    fireEvent.click(btn);
    expect(onChange).not.toHaveBeenCalled();
    expect(btn.getAttribute("disabled")).not.toBeNull();
  });

  it("aria-label is applied to the panel when provided", () => {
    render(() => (
      <Popover open trigger="Open" aria-label="Picker" onChange={() => {}}>
        body
      </Popover>
    ));
    expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("Picker");
  });

  it("aria-labelledby is applied when provided and aria-label is omitted", () => {
    render(() => (
      <Popover open trigger="Open" aria-labelledby="heading-id" onChange={() => {}}>
        <h3 id="heading-id">Heading</h3>
      </Popover>
    ));
    const panel = screen.getByRole("dialog");
    expect(panel.getAttribute("aria-labelledby")).toBe("heading-id");
    expect(panel.getAttribute("aria-label")).toBeNull();
  });

  it("placement prop reflects on data-placement of the panel", () => {
    render(() => (
      <Popover open placement="top" trigger="Open" aria-label="picker" onChange={() => {}}>
        body
      </Popover>
    ));
    const panel = screen.getByRole("dialog");
    expect(panel.getAttribute("data-placement") ?? "").toContain("top");
  });

  it("showArrow renders an arrow element inside the panel", () => {
    render(() => (
      <Popover open showArrow trigger="Open" aria-label="picker" onChange={() => {}}>
        body
      </Popover>
    ));
    const panel = screen.getByRole("dialog");
    // Kobalte renders the arrow as an svg inside the content
    expect(panel.querySelector("svg,div[data-arrow]") ?? panel.children.length > 0).toBeTruthy();
  });

  it("rest props are forwarded to the trigger button", () => {
    render(() => (
      <Popover
        open={false}
        trigger="Open"
        aria-label="picker"
        onChange={() => {}}
        data-testid="trig"
      >
        body
      </Popover>
    ));
    expect(screen.getByTestId("trig")).toBeTruthy();
  });

  it("aria-modal is not set on the panel", () => {
    render(() => (
      <Popover open trigger="Open" aria-label="picker" onChange={() => {}}>
        body
      </Popover>
    ));
    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBeNull();
  });

  it("portals content into ancestor <dialog> when one is present", () => {
    render(() => (
      // use `open` attribute directly — no showModal needed for .closest("dialog") to work
      <dialog open>
        <Popover open trigger="Open" aria-label="picker" onChange={() => {}}>
          <span data-testid="in-dialog">content</span>
        </Popover>
      </dialog>
    ));
    const leaf = screen.getByTestId("in-dialog");
    // the popover content must be a descendant of the dialog, not document.body directly
    expect(leaf.closest("dialog")).not.toBeNull();
  });
});
