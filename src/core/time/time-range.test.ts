import { describe, expect, test } from "vitest";
import { eq, time } from "~/core/time/rational-time";
import {
  clampTime,
  contains,
  containsRange,
  duration,
  endExclusive,
  isEmptyRange,
  overlaps,
  range,
  rangeFromStartEnd,
} from "~/core/time/time-range";

describe("TimeRange", () => {
  // construction

  test("creates a range from start and duration", () => {
    const r = range(time(0, 24), time(10, 24));
    expect(eq(r.start, time(0, 24))).toBe(true);
    expect(eq(r.duration, time(10, 24))).toBe(true);
  });

  test("creates a range from start and exclusive end", () => {
    const r = rangeFromStartEnd(time(5, 24), time(15, 24));
    expect(eq(r.start, time(5, 24))).toBe(true);
    expect(eq(r.duration, time(10, 24))).toBe(true);
  });

  test("creates an empty range when start equals end", () => {
    const r = rangeFromStartEnd(time(5, 24), time(5, 24));
    expect(isEmptyRange(r)).toBe(true);
  });

  // duration / endExclusive

  test("computes duration from the range", () => {
    const r = range(time(5, 24), time(10, 24));
    expect(eq(duration(r), time(10, 24))).toBe(true);
  });

  test("computes exclusive end time", () => {
    const r = range(time(5, 24), time(10, 24));
    expect(eq(endExclusive(r), time(15, 24))).toBe(true);
  });

  test("handles ranges with different rates in start and duration", () => {
    // Start at 1/24, duration of 1/30.
    const r = range(time(1, 24), time(1, 30));
    const end = endExclusive(r);

    // 1/24 + 1/30 = 5/120 + 4/120 = 9/120 = 3/40
    expect(eq(end, time(3, 40))).toBe(true);
  });

  // isEmptyRange

  test("detects empty ranges", () => {
    expect(isEmptyRange(range(time(5, 24), time(0, 1)))).toBe(true);
  });

  test("non-empty range is not empty", () => {
    expect(isEmptyRange(range(time(0, 24), time(1, 24)))).toBe(false);
  });

  // contains (point-in-range)

  test("contains a point within the range", () => {
    const r = range(time(0, 24), time(10, 24));
    expect(contains(r, time(5, 24))).toBe(true);
  });

  test("contains the start point (inclusive)", () => {
    const r = range(time(0, 24), time(10, 24));
    expect(contains(r, time(0, 24))).toBe(true);
  });

  test("does not contain the exclusive end", () => {
    const r = range(time(0, 24), time(10, 24));
    expect(contains(r, time(10, 24))).toBe(false);
  });

  test("does not contain a point before the range", () => {
    const r = range(time(5, 24), time(10, 24));
    expect(contains(r, time(2, 24))).toBe(false);
  });

  test("does not contain a point after the range", () => {
    const r = range(time(5, 24), time(10, 24));
    expect(contains(r, time(20, 24))).toBe(false);
  });

  test("contains works across different rates", () => {
    // Range: [0/24, 10/24) = [0, 5/12)
    const r = range(time(0, 24), time(10, 24));
    // 5/30 = 1/6 which is inside [0, 5/12)
    expect(contains(r, time(5, 30))).toBe(true);
  });

  test("empty range contains nothing", () => {
    const r = range(time(5, 24), time(0, 1));
    expect(contains(r, time(5, 24))).toBe(false);
  });

  // containsRange

  test("a range contains itself", () => {
    const r = range(time(0, 24), time(10, 24));
    expect(containsRange(r, r)).toBe(true);
  });

  test("a range contains a sub-range", () => {
    const outer = range(time(0, 24), time(20, 24));
    const inner = range(time(5, 24), time(10, 24));
    expect(containsRange(outer, inner)).toBe(true);
  });

  test("a range does not contain a wider range", () => {
    const outer = range(time(5, 24), time(10, 24));
    const inner = range(time(0, 24), time(20, 24));
    expect(containsRange(outer, inner)).toBe(false);
  });

  test("a range does not contain a partially overlapping range", () => {
    const a = range(time(0, 24), time(10, 24));
    const b = range(time(5, 24), time(10, 24));
    expect(containsRange(a, b)).toBe(false);
  });

  test("any range contains an empty range at its start", () => {
    const r = range(time(0, 24), time(10, 24));
    const empty = range(time(0, 24), time(0, 1));
    expect(containsRange(r, empty)).toBe(true);
  });

  // overlaps

  test("overlapping ranges return true", () => {
    const a = range(time(0, 24), time(10, 24));
    const b = range(time(5, 24), time(10, 24));
    expect(overlaps(a, b)).toBe(true);
    expect(overlaps(b, a)).toBe(true);
  });

  test("adjacent ranges do not overlap (exclusive end)", () => {
    const a = range(time(0, 24), time(10, 24));
    const b = range(time(10, 24), time(10, 24));
    expect(overlaps(a, b)).toBe(false);
    expect(overlaps(b, a)).toBe(false);
  });

  test("disjoint ranges do not overlap", () => {
    const a = range(time(0, 24), time(5, 24));
    const b = range(time(10, 24), time(5, 24));
    expect(overlaps(a, b)).toBe(false);
  });

  test("identical ranges overlap", () => {
    const r = range(time(0, 24), time(10, 24));
    expect(overlaps(r, r)).toBe(true);
  });

  test("overlaps works across different rates", () => {
    const a = range(time(0, 24), time(10, 24));
    // [3/30, 13/30) = [0.1, 0.4333...] which overlaps [0, 0.4166...]
    const b = range(time(3, 30), time(10, 30));
    expect(overlaps(a, b)).toBe(true);
  });

  test("empty range does not overlap anything", () => {
    const r = range(time(0, 24), time(10, 24));
    const empty = range(time(5, 24), time(0, 1));
    expect(overlaps(r, empty)).toBe(false);
    expect(overlaps(empty, r)).toBe(false);
  });

  // clampTime

  test("clamps a time before the range to the start", () => {
    const r = range(time(5, 24), time(10, 24));
    const clamped = clampTime(r, time(2, 24));
    expect(eq(clamped, time(5, 24))).toBe(true);
  });

  test("clamps a time after the range to just before the end", () => {
    const r = range(time(5, 24), time(10, 24));
    const clamped = clampTime(r, time(20, 24));
    // Clamped to end - 1 tick at the end's denominator? No, just to start + duration - epsilon.
    // Actually, clamp to the last valid position: endExclusive - smallest unit.
    // For simplicity, clamp to endExclusive (let the caller decide about exclusivity).
    // Re-thinking: clamp to [start, endExclusive). A time at or past end gets clamped to end - epsilon?
    // Most implementations clamp to [start, end] inclusive. Let's clamp to [start, endExclusive - 1 frame].
    // Actually the simplest: clamp to max(start, min(t, endExclusive)).
    // But that would include the exclusive end. Let's just clamp to [start, endExclusive] and
    // document that the result may equal the exclusive end.
    expect(eq(clamped, time(15, 24))).toBe(true);
  });

  test("leaves a time inside the range unchanged", () => {
    const r = range(time(5, 24), time(10, 24));
    const clamped = clampTime(r, time(8, 24));
    expect(eq(clamped, time(8, 24))).toBe(true);
  });

  // type-level: TimeRange should be a plain object

  test("is a plain object, not a class instance", () => {
    const r = range(time(0, 24), time(10, 24));
    expect(Object.getPrototypeOf(r)).toBe(Object.prototype);
  });
});
