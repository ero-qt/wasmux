import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toggle } from "~/ui/primitives/toggle";

afterEach(cleanup);

describe("<Toggle />", () => {
  it("renders aria-pressed=false when not pressed", () => {
    render(() => (
      <Toggle aria-label="snap" pressed={false} onChange={() => {}}>
        ⌶
      </Toggle>
    ));
    expect(screen.getByRole("button", { name: "snap" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("renders aria-pressed=true when pressed", () => {
    render(() => (
      <Toggle aria-label="snap" pressed onChange={() => {}}>
        ⌶
      </Toggle>
    ));
    expect(screen.getByRole("button", { name: "snap" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("calls onChange with the next value on click", () => {
    const onChange = vi.fn();
    render(() => (
      <Toggle aria-label="snap" pressed={false} onChange={onChange}>
        ⌶
      </Toggle>
    ));
    fireEvent.click(screen.getByRole("button", { name: "snap" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when pressed", () => {
    const onChange = vi.fn();
    render(() => (
      <Toggle aria-label="snap" pressed onChange={onChange}>
        ⌶
      </Toggle>
    ));
    fireEvent.click(screen.getByRole("button", { name: "snap" }));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(() => (
      <Toggle aria-label="snap" pressed={false} disabled onChange={onChange}>
        ⌶
      </Toggle>
    ));
    fireEvent.click(screen.getByRole("button", { name: "snap" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
