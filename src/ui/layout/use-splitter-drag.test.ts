import { describe, expect, test } from "vitest";
import { clampDelta, weightsFromPixels } from "~/ui/layout/use-splitter-drag";

describe("clampDelta", () => {
  test("returns delta unchanged when both sides have headroom", () => {
    expect(clampDelta({ aPx: 200, bPx: 200, aMin: 50, bMin: 50, delta: 30 })).toBe(30);
  });

  test("clamps when the proposed move would shrink A below aMin", () => {
    expect(clampDelta({ aPx: 100, bPx: 300, aMin: 80, bMin: 50, delta: -50 })).toBe(-20);
  });

  test("clamps when the proposed move would shrink B below bMin", () => {
    expect(clampDelta({ aPx: 300, bPx: 100, aMin: 50, bMin: 80, delta: 50 })).toBe(20);
  });

  test("returns 0 when already at the boundary on the requested side", () => {
    expect(clampDelta({ aPx: 80, bPx: 300, aMin: 80, bMin: 50, delta: -10 })).toBe(0);
  });
});

describe("weightsFromPixels", () => {
  test("equal pixel sizes yield equal weights", () => {
    expect(weightsFromPixels(200, 200)).toEqual([0.5, 0.5]);
  });

  test("weights sum to 1 within float tolerance", () => {
    const [a, b] = weightsFromPixels(123, 456);
    expect(a + b).toBeCloseTo(1, 10);
  });

  test("returns 50/50 when both sides are zero (degenerate, prevents NaN)", () => {
    expect(weightsFromPixels(0, 0)).toEqual([0.5, 0.5]);
  });
});
