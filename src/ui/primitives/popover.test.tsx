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

  it("side prop reflects on data-side of the panel", () => {
    render(() => (
      <Popover open side="top" trigger="Open" aria-label="picker" onChange={() => {}}>
        body
      </Popover>
    ));
    // Kobalte stamps data-* on the content element.
    const panel = screen.getByRole("dialog");
    expect(panel.getAttribute("data-side") ?? panel.getAttribute("data-placement") ?? "").toContain(
      "top",
    );
  });

  it("aria-modal is not set on the panel", () => {
    render(() => (
      <Popover open trigger="Open" aria-label="picker" onChange={() => {}}>
        body
      </Popover>
    ));
    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBeNull();
  });
});
