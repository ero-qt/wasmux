import { cleanup, fireEvent, render, screen } from "@solidjs/testing-library";
import * as fc from "fast-check";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Slider } from "~/ui/primitives/slider";

afterEach(cleanup);

describe("<Slider />", () => {
  it("renders aria roles and values", () => {
    render(() => <Slider value={50} min={0} max={100} aria-label="scale" onChange={() => {}} />);
    const s = screen.getByRole("slider", { name: "scale" });
    expect(s.getAttribute("aria-valuemin")).toBe("0");
    expect(s.getAttribute("aria-valuemax")).toBe("100");
    expect(s.getAttribute("aria-valuenow")).toBe("50");
  });

  it("uses valueLabel for aria-valuetext", () => {
    render(() => (
      <Slider
        value={42}
        min={0}
        max={100}
        aria-label="scale"
        onChange={() => {}}
        valueLabel={(v) => `${v}%`}
      />
    ));
    expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe("42%");
  });

  it("decrements by step on ArrowLeft", () => {
    const onChange = vi.fn();
    render(() => (
      <Slider value={50} min={0} max={100} step={5} aria-label="s" onChange={onChange} />
    ));
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledWith(45);
  });

  it("increments by step on ArrowRight", () => {
    const onChange = vi.fn();
    render(() => (
      <Slider value={50} min={0} max={100} step={5} aria-label="s" onChange={onChange} />
    ));
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith(55);
  });

  it("uses 10x step with Shift", () => {
    const onChange = vi.fn();
    render(() => (
      <Slider value={50} min={0} max={100} step={2} aria-label="s" onChange={onChange} />
    ));
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight", shiftKey: true });
    expect(onChange).toHaveBeenCalledWith(70);
  });

  it("Home jumps to min, End jumps to max", () => {
    const onChange = vi.fn();
    render(() => <Slider value={50} min={5} max={95} aria-label="s" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith(5);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "End" });
    expect(onChange).toHaveBeenLastCalledWith(95);
  });

  it("clamps to [min, max] on keyboard", () => {
    const onChange = vi.fn();
    render(() => <Slider value={2} min={0} max={10} step={5} aria-label="s" onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith(0);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight", shiftKey: true });
    // value prop is still 2 (controlled), 2 + 5*10 = 52 → clamped to 10
    expect(onChange).toHaveBeenLastCalledWith(10);
  });

  it("ignores keyboard when disabled", () => {
    const onChange = vi.fn();
    render(() => (
      <Slider value={50} min={0} max={100} aria-label="s" disabled onChange={onChange} />
    ));
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("aria-disabled is true when disabled", () => {
    render(() => (
      <Slider value={50} min={0} max={100} aria-label="s" disabled onChange={() => {}} />
    ));
    expect(screen.getByRole("slider").getAttribute("aria-disabled")).toBe("true");
  });

  it("applies bipolar class when bipolar is true", () => {
    render(() => (
      <Slider value={0} min={-100} max={100} aria-label="s" bipolar onChange={() => {}} />
    ));
    expect(screen.getByTestId("slider-track").className).toMatch(/bipolar/i);
  });

  it("renders custom track background when trackBackground is set", () => {
    render(() => (
      <Slider
        value={50}
        min={0}
        max={100}
        aria-label="s"
        trackBackground="linear-gradient(90deg, blue, red)"
        onChange={() => {}}
      />
    ));
    const track = screen.getByTestId("slider-track");
    // browser may serialize the background — check it contains the expression.
    expect(track.style.background).toContain("linear-gradient");
  });

  it("property: clamp(value) ∈ [min, max] for any value/min/max", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: -1000, max: 1000 }),
        (a, b, value) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          if (min === max) {
            return;
          }
          const onChange = vi.fn();
          const { unmount } = render(() => (
            <Slider value={value} min={min} max={max} aria-label="s" onChange={onChange} />
          ));
          fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" });
          // controlled component: onChange may be skipped if already at max.
          if (onChange.mock.calls.length === 0) {
            unmount();
            return;
          }
          const next = onChange.mock.calls.at(-1)?.[0] as number;
          expect(next).toBeGreaterThanOrEqual(min);
          expect(next).toBeLessThanOrEqual(max);
          unmount();
        },
      ),
      { numRuns: 50 },
    );
  });
});
