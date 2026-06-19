import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select } from "~/ui/primitives/select";

afterEach(cleanup);

type Blend = "normal" | "multiply" | "screen";

const OPTIONS: ReadonlyArray<{ value: Blend; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
];

describe("<Select />", () => {
  it("renders the current value", () => {
    render(() => (
      <Select value="multiply" options={OPTIONS} aria-label="blend" onChange={() => {}} />
    ));
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("multiply");
  });

  it("emits the chosen value on change", () => {
    const onChange = vi.fn();
    render(() => (
      <Select value="normal" options={OPTIONS} aria-label="blend" onChange={onChange} />
    ));
    const sel = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(sel, { target: { value: "screen" } });
    expect(onChange).toHaveBeenCalledWith("screen");
  });

  it("renders every option", () => {
    render(() => (
      <Select value="normal" options={OPTIONS} aria-label="blend" onChange={() => {}} />
    ));
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("disabled blocks editing", () => {
    render(() => (
      <Select value="normal" options={OPTIONS} aria-label="blend" disabled onChange={() => {}} />
    ));
    expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(true);
  });

  it("renders label when provided", () => {
    render(() => <Select value="normal" options={OPTIONS} label="Blend" onChange={() => {}} />);
    expect(screen.getByText("Blend")).toBeTruthy();
  });
});
