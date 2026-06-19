import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "~/ui/primitives/segmented-control";

afterEach(cleanup);

type Theme = "auto" | "light" | "dark";

const OPTIONS: ReadonlyArray<{ value: Theme; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

describe("<SegmentedControl />", () => {
  it("renders a tablist with one selected tab", () => {
    render(() => (
      <SegmentedControl value="light" options={OPTIONS} aria-label="theme" onChange={() => {}} />
    ));
    expect(screen.getByRole("tablist", { name: "theme" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Light" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Auto" }).getAttribute("aria-selected")).toBe("false");
  });

  it("emits the clicked tab's value", () => {
    const onChange = vi.fn();
    render(() => (
      <SegmentedControl value="auto" options={OPTIONS} aria-label="theme" onChange={onChange} />
    ));
    fireEvent.click(screen.getByRole("tab", { name: "Dark" }));
    expect(onChange).toHaveBeenCalledWith("dark");
  });

  it("clicking the selected tab is a no-op", () => {
    const onChange = vi.fn();
    render(() => (
      <SegmentedControl value="light" options={OPTIONS} aria-label="theme" onChange={onChange} />
    ));
    fireEvent.click(screen.getByRole("tab", { name: "Light" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ArrowRight selects the next tab", () => {
    const onChange = vi.fn();
    render(() => (
      <SegmentedControl value="light" options={OPTIONS} aria-label="theme" onChange={onChange} />
    ));
    fireEvent.keyDown(screen.getByRole("tab", { name: "Light" }), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("dark");
  });

  it("ArrowLeft selects the previous tab", () => {
    const onChange = vi.fn();
    render(() => (
      <SegmentedControl value="light" options={OPTIONS} aria-label="theme" onChange={onChange} />
    ));
    fireEvent.keyDown(screen.getByRole("tab", { name: "Light" }), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith("auto");
  });

  it("ArrowRight on the last tab wraps to the first", () => {
    const onChange = vi.fn();
    render(() => (
      <SegmentedControl value="dark" options={OPTIONS} aria-label="theme" onChange={onChange} />
    ));
    fireEvent.keyDown(screen.getByRole("tab", { name: "Dark" }), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("auto");
  });
});
