import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Splitter } from "~/ui/layout/splitter";

afterEach(() => cleanup());

describe("<Splitter> ARIA", () => {
  test("row orientation renders a vertical separator", () => {
    render(() => (
      <Splitter orientation="row" sizes={[0.6, 0.4]} container={() => null} onResize={() => {}} />
    ));
    const sep = screen.getByRole("separator");
    expect(sep.getAttribute("aria-orientation")).toBe("vertical");
    expect(sep.getAttribute("aria-valuenow")).toBe("60");
    expect(sep.getAttribute("aria-valuemin")).toBe("0");
    expect(sep.getAttribute("aria-valuemax")).toBe("100");
    expect(sep.getAttribute("tabindex")).toBe("0");
  });

  test("column orientation renders a horizontal separator", () => {
    render(() => (
      <Splitter
        orientation="column"
        sizes={[0.3, 0.7]}
        container={() => null}
        onResize={() => {}}
      />
    ));
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("horizontal");
  });

  test("aria-label is sourced from the i18n catalog", () => {
    render(() => (
      <Splitter orientation="row" sizes={[0.5, 0.5]} container={() => null} onResize={() => {}} />
    ));
    expect(screen.getByRole("separator").getAttribute("aria-label")).toBe("resize split");
  });
});

describe("<Splitter> keyboard", () => {
  test("ArrowRight increases the leading weight by 5%", () => {
    const onResize = vi.fn();
    render(() => (
      <Splitter orientation="row" sizes={[0.5, 0.5]} container={() => null} onResize={onResize} />
    ));
    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
    expect(onResize).toHaveBeenCalledWith([0.55, 0.45]);
  });

  test("ArrowLeft decreases the leading weight by 5%", () => {
    const onResize = vi.fn();
    render(() => (
      <Splitter orientation="row" sizes={[0.5, 0.5]} container={() => null} onResize={onResize} />
    ));
    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });
    expect(onResize).toHaveBeenCalledWith([0.45, 0.55]);
  });

  test("Shift + Arrow uses the coarse step", () => {
    const onResize = vi.fn();
    render(() => (
      <Splitter orientation="row" sizes={[0.5, 0.5]} container={() => null} onResize={onResize} />
    ));
    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight", shiftKey: true });
    expect(onResize).toHaveBeenCalledWith([0.7, 0.3]);
  });

  test("clamps at 0.01/0.99 floor/ceiling", () => {
    const onResize = vi.fn();
    render(() => (
      <Splitter orientation="row" sizes={[0.97, 0.03]} container={() => null} onResize={onResize} />
    ));
    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
    // 0.97 + 0.05 = 1.02 → clamp ceiling is 0.99
    const call = onResize.mock.calls[0]?.[0] as readonly [number, number];
    expect(call[0]).toBeCloseTo(0.99, 5);
    expect(call[1]).toBeCloseTo(0.01, 5);
  });
});
