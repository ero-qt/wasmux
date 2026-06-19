import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NumberInput } from "~/ui/primitives/number-input";

afterEach(cleanup);

describe("<NumberInput />", () => {
  it("renders the current value", () => {
    render(() => <NumberInput value={42} aria-label="x" onChange={() => {}} />);
    expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe("42");
  });

  it("emits parsed number on input", () => {
    const onChange = vi.fn();
    render(() => <NumberInput value={0} aria-label="x" onChange={onChange} />);
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    fireEvent.input(input, { target: { value: "17" } });
    expect(onChange).toHaveBeenCalledWith(17);
  });

  it("clamps to min on blur when below range", () => {
    const onChange = vi.fn();
    render(() => <NumberInput value={-50} min={0} max={100} aria-label="x" onChange={onChange} />);
    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it("clamps to max on blur when above range", () => {
    const onChange = vi.fn();
    render(() => <NumberInput value={200} min={0} max={100} aria-label="x" onChange={onChange} />);
    fireEvent.blur(screen.getByRole("spinbutton"));
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("uses precision for display formatting", () => {
    render(() => <NumberInput value={1.23456} precision={2} aria-label="x" onChange={() => {}} />);
    expect((screen.getByRole("spinbutton") as HTMLInputElement).value).toBe("1.23");
  });

  it("disabled blocks editing", () => {
    render(() => <NumberInput value={5} aria-label="x" disabled onChange={() => {}} />);
    expect((screen.getByRole("spinbutton") as HTMLInputElement).disabled).toBe(true);
  });

  it("renders label when provided", () => {
    render(() => <NumberInput value={5} label="X" aria-label="x" onChange={() => {}} />);
    expect(screen.getByText("X")).toBeTruthy();
  });

  it("forwards step to the input", () => {
    render(() => <NumberInput value={5} step={0.5} aria-label="x" onChange={() => {}} />);
    expect(screen.getByRole("spinbutton").getAttribute("step")).toBe("0.5");
  });
});
