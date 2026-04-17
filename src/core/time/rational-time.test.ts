import { describe, expect, test } from "vitest";
import {
  type RationalTime,
  type RoundingMode,
  ZERO,
  add,
  compare,
  eq,
  fromFrames,
  fromSeconds,
  gt,
  gte,
  isZero,
  lt,
  lte,
  mul,
  neg,
  rescale,
  sub,
  time,
  toFrames,
  toSeconds,
} from "~/core/time/rational-time";

describe("RationalTime", () => {
  // construction

  test("creates a reduced rational time", () => {
    const t = time(6, 24);
    expect(t.num).toBe(1);
    expect(t.den).toBe(4);
  });

  test("preserves sign in the numerator", () => {
    const t = time(-3, 24);
    expect(t.num).toBe(-1);
    expect(t.den).toBe(8);
  });

  test("normalizes negative denominator to positive", () => {
    const t = time(3, -24);
    expect(t.num).toBe(-1);
    expect(t.den).toBe(8);
  });

  test("normalizes double negative to positive", () => {
    const t = time(-3, -24);
    expect(t.num).toBe(1);
    expect(t.den).toBe(8);
  });

  test("represents zero with denominator 1", () => {
    const t = time(0, 24);
    expect(t.num).toBe(0);
    expect(t.den).toBe(1);
  });

  test("throws on zero denominator", () => {
    expect(() => time(1, 0)).toThrow();
  });

  test("throws on non-integer numerator", () => {
    expect(() => time(1.5, 24)).toThrow();
  });

  test("throws on non-integer denominator", () => {
    expect(() => time(1, 23.976)).toThrow();
  });

  // ZERO

  test("ZERO is 0/1", () => {
    expect(ZERO.num).toBe(0);
    expect(ZERO.den).toBe(1);
  });

  // fromFrames / fromSeconds

  test("creates time from a frame count at a given rate", () => {
    const t = fromFrames(5, 24);
    expect(t.num).toBe(5);
    expect(t.den).toBe(24);
  });

  test("creates time from seconds at a given rate", () => {
    const t = fromSeconds(0.5, 24);
    expect(t.num).toBe(12);
    expect(t.den).toBe(24);
  });

  test("fromSeconds rounds to nearest frame", () => {
    // 1/3 second at 24fps is frame 8, but floating point might
    // not land exactly. fromSeconds should round.
    const t = fromSeconds(1 / 3, 24);
    expect(t.num).toBe(8);
    expect(t.den).toBe(24);
  });

  // toSeconds / toFrames

  test("converts to seconds", () => {
    expect(toSeconds(time(12, 24))).toBe(0.5);
  });

  test("converts to frame count at same rate", () => {
    expect(toFrames(time(5, 24), 24)).toBe(5);
  });

  test("converts to frame count at different rate using floor", () => {
    // 5 frames at 24fps = 5/24s. at 30fps that's 6.25 frames.
    expect(toFrames(time(5, 24), 30, "floor")).toBe(6);
  });

  test("converts to frame count at different rate using ceil", () => {
    expect(toFrames(time(5, 24), 30, "ceil")).toBe(7);
  });

  test("converts to frame count at different rate using round", () => {
    expect(toFrames(time(5, 24), 30, "round")).toBe(6);
  });

  // arithmetic

  test("adds two times with the same denominator", () => {
    const result = add(time(1, 24), time(2, 24));
    expect(result.num).toBe(1);
    expect(result.den).toBe(8);
  });

  test("adds two times with different denominators via LCM", () => {
    // 1/24 + 1/30 = 5/120 + 4/120 = 9/120 = 3/40
    const result = add(time(1, 24), time(1, 30));
    expect(result.num).toBe(3);
    expect(result.den).toBe(40);
  });

  test("subtracts two times", () => {
    const result = sub(time(3, 24), time(1, 24));
    expect(result.num).toBe(1);
    expect(result.den).toBe(12);
  });

  test("subtracting equal times gives zero", () => {
    const result = sub(time(5, 24), time(5, 24));
    expect(isZero(result)).toBe(true);
  });

  test("multiplies by a positive integer", () => {
    const result = mul(time(1, 24), 5);
    expect(result.num).toBe(5);
    expect(result.den).toBe(24);
  });

  test("multiplies by zero", () => {
    const result = mul(time(5, 24), 0);
    expect(isZero(result)).toBe(true);
  });

  test("multiplies by a negative integer", () => {
    const result = mul(time(1, 24), -3);
    expect(result.num).toBe(-1);
    expect(result.den).toBe(8);
  });

  test("negates a time", () => {
    const t = neg(time(5, 24));
    expect(t.num).toBe(-5);
    expect(t.den).toBe(24);
  });

  test("negating zero gives zero", () => {
    const t = neg(ZERO);
    expect(isZero(t)).toBe(true);
  });

  // comparison

  test("compares equal times as 0", () => {
    expect(compare(time(1, 24), time(1, 24))).toBe(0);
  });

  test("compares equal times with different denominators as 0", () => {
    // 3/24 = 5/40
    expect(compare(time(3, 24), time(5, 40))).toBe(0);
  });

  test("compares less-than as -1", () => {
    expect(compare(time(1, 24), time(2, 24))).toBe(-1);
  });

  test("compares greater-than as 1", () => {
    expect(compare(time(2, 24), time(1, 24))).toBe(1);
  });

  test("eq returns true for equal times across rates", () => {
    expect(eq(time(1, 2), time(12, 24))).toBe(true);
  });

  test("lt, lte, gt, gte work correctly", () => {
    const a = time(1, 24);
    const b = time(2, 24);

    expect(lt(a, b)).toBe(true);
    expect(lt(b, a)).toBe(false);
    expect(lte(a, b)).toBe(true);
    expect(lte(a, a)).toBe(true);
    expect(gt(b, a)).toBe(true);
    expect(gt(a, b)).toBe(false);
    expect(gte(b, a)).toBe(true);
    expect(gte(a, a)).toBe(true);
  });

  // rescale

  test("rescales to a new denominator without loss", () => {
    // 1/24 = 5/120
    const result = rescale(time(1, 24), 120);
    expect(result.num).toBe(5);
    expect(result.den).toBe(120);
  });

  test("rescale floors by default when conversion is not exact", () => {
    // 1/24 at 30fps: 1/24 * 30 = 1.25 frames. floor = 1.
    const result = rescale(time(1, 24), 30);
    expect(result.num).toBe(1);
    expect(result.den).toBe(30);
  });

  test("rescale ceils when requested", () => {
    const result = rescale(time(1, 24), 30, "ceil");
    expect(result.num).toBe(2);
    expect(result.den).toBe(30);
  });

  test("rescale rounds when requested", () => {
    // 5/24 at 30fps: 5/24 * 30 = 6.25. round = 6.
    const a = rescale(time(5, 24), 30, "round");
    expect(a.num).toBe(6);
    expect(a.den).toBe(30);

    // 7/24 at 30fps: 7/24 * 30 = 8.75. round = 9.
    const b = rescale(time(7, 24), 30, "round");
    expect(b.num).toBe(9);
    expect(b.den).toBe(30);
  });

  test("rescale preserves exact values", () => {
    // 1/4 at 24fps: 1/4 * 24 = 6 exactly.
    const result = rescale(time(1, 4), 24);
    expect(result.num).toBe(6);
    expect(result.den).toBe(24);
  });

  // isZero

  test("isZero returns true for zero", () => {
    expect(isZero(ZERO)).toBe(true);
    expect(isZero(time(0, 48000))).toBe(true);
  });

  test("isZero returns false for non-zero", () => {
    expect(isZero(time(1, 24))).toBe(false);
  });

  // real-world scenarios

  test("concatenating clip durations does not accumulate error", () => {
    // 1000 clips of 1001/30000 seconds (one frame at 29.97fps).

    const frame = time(1001, 30000);
    let total: RationalTime = ZERO;

    for (let i = 0; i < 1000; i++) {
      total = add(total, frame);
    }

    // should be exactly 1001000/30000 = 1001/30.
    expect(total.num).toBe(1001);
    expect(total.den).toBe(30);
  });

  test("round-trip through rate conversion preserves value", () => {
    const original = time(5, 24);
    const at120 = rescale(original, 120);
    const back = rescale(at120, 24);
    expect(eq(original, back)).toBe(true);
  });

  test("NTSC 29.97fps frame is representable exactly", () => {
    // 29.97fps = 30000/1001. one frame = 1001/30000 seconds.
    const oneFrame = time(1001, 30000);
    expect(toSeconds(oneFrame)).toBe(1001 / 30000);
  });

  test("handles common video rates without overflow", () => {
    const rates = [24, 25, 30, 48, 50, 60];

    for (const rate of rates) {
      // one hour at each rate.
      const oneHour = time(3600 * rate, rate);
      expect(toSeconds(oneHour)).toBe(3600);
    }
  });

  // type-level: RationalTime should be a plain object

  test("is a plain object, not a class instance", () => {
    const t = time(1, 24);
    expect(Object.getPrototypeOf(t)).toBe(Object.prototype);
  });

  // rounding mode type

  test("rescale accepts all rounding modes", () => {
    const t = time(1, 24);
    const modes: RoundingMode[] = ["floor", "ceil", "round"];

    for (const mode of modes) {
      expect(() => rescale(t, 30, mode)).not.toThrow();
    }
  });
});
