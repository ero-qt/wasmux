import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Chip, ChipGroup } from "~/ui/primitives/chip";

afterEach(cleanup);

describe("<Chip />", () => {
  it("renders aria-pressed=false when not pressed", () => {
    render(() => (
      <Chip pressed={false} aria-label="1080p" onChange={() => {}}>
        1080p
      </Chip>
    ));
    expect(screen.getByRole("button", { name: "1080p" }).getAttribute("aria-pressed")).toBe(
      "false",
    );
  });

  it("renders aria-pressed=true when pressed", () => {
    render(() => (
      <Chip pressed aria-label="1080p" onChange={() => {}}>
        1080p
      </Chip>
    ));
    expect(screen.getByRole("button", { name: "1080p" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("calls onChange(true) when clicked while off", () => {
    const onChange = vi.fn();
    render(() => (
      <Chip pressed={false} aria-label="1080p" onChange={onChange}>
        1080p
      </Chip>
    ));
    fireEvent.click(screen.getByRole("button", { name: "1080p" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(() => (
      <Chip pressed={false} disabled aria-label="1080p" onChange={onChange}>
        1080p
      </Chip>
    ));
    fireEvent.click(screen.getByRole("button", { name: "1080p" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("<ChipGroup />", () => {
  type Res = "720p" | "1080p" | "4k";
  const OPTIONS: ReadonlyArray<{ value: Res; label: string }> = [
    { value: "720p", label: "720p" },
    { value: "1080p", label: "1080p" },
    { value: "4k", label: "4K" },
  ];

  it("renders all options as chips with one pressed", () => {
    render(() => (
      <ChipGroup value="1080p" options={OPTIONS} aria-label="resolution" onChange={() => {}} />
    ));
    expect(screen.getByRole("radiogroup", { name: "resolution" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "1080p" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "720p" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("emits the clicked option's value", () => {
    const onChange = vi.fn();
    render(() => (
      <ChipGroup value="1080p" options={OPTIONS} aria-label="resolution" onChange={onChange} />
    ));
    fireEvent.click(screen.getByRole("button", { name: "4K" }));
    expect(onChange).toHaveBeenCalledWith("4k");
  });

  it("clicking the already-pressed chip is a no-op", () => {
    const onChange = vi.fn();
    render(() => (
      <ChipGroup value="1080p" options={OPTIONS} aria-label="resolution" onChange={onChange} />
    ));
    fireEvent.click(screen.getByRole("button", { name: "1080p" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
