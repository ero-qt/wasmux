import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Swatch, SwatchRow } from "~/ui/primitives/swatch";

afterEach(cleanup);

describe("<Swatch />", () => {
  it("renders aria-pressed=false when not pressed", () => {
    render(() => <Swatch color="#ff0000" aria-label="red" pressed={false} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "red" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("emits onChange when clicked", () => {
    const onChange = vi.fn();
    render(() => <Swatch color="#ff0000" aria-label="red" pressed={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "red" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("checker tone renders a class flag", () => {
    render(() => <Swatch color="checker" aria-label="checker" />);
    expect(screen.getByRole("button", { name: "checker" }).className).toMatch(/checker/i);
  });

  it("ignores click when disabled", () => {
    const onChange = vi.fn();
    render(() => (
      <Swatch color="#ff0000" aria-label="red" disabled pressed={false} onChange={onChange} />
    ));
    fireEvent.click(screen.getByRole("button", { name: "red" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("<SwatchRow />", () => {
  type Bg = "black" | "white" | "checker" | "accent";
  const OPTIONS: ReadonlyArray<{ value: Bg; color: string; label: string }> = [
    { value: "black", color: "#000000", label: "Black" },
    { value: "white", color: "#ffffff", label: "White" },
    { value: "checker", color: "checker", label: "Transparent" },
    { value: "accent", color: "var(--accent)", label: "Accent" },
  ];

  it("renders a radiogroup with one pressed swatch", () => {
    render(() => (
      <SwatchRow value="checker" options={OPTIONS} aria-label="background" onChange={() => {}} />
    ));
    expect(screen.getByRole("radiogroup", { name: "background" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Transparent" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
  });

  it("emits the clicked swatch's value", () => {
    const onChange = vi.fn();
    render(() => (
      <SwatchRow value="black" options={OPTIONS} aria-label="background" onChange={onChange} />
    ));
    fireEvent.click(screen.getByRole("button", { name: "Accent" }));
    expect(onChange).toHaveBeenCalledWith("accent");
  });
});
