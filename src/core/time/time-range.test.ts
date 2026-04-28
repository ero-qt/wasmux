import { describe, expect, test } from "vitest";
import { createTime, eq } from "~/core/time/rational-time";
import {
  clampTime,
  contains,
  containsRange,
  createRange,
  createRangeFromStartEnd,
  duration,
  endExclusive,
  isEmptyRange,
  overlaps,
} from "~/core/time/time-range";

describe("TimeRange", () => {
  // construction

  test("creates a range from start and duration", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    expect(eq(r.start, createTime(0, 24))).toBe(true);
    expect(eq(r.duration, createTime(10, 24))).toBe(true);
  });

  test("creates a range from start and exclusive end", () => {
    const r = createRangeFromStartEnd(createTime(5, 24), createTime(15, 24));
    expect(eq(r.start, createTime(5, 24))).toBe(true);
    expect(eq(r.duration, createTime(10, 24))).toBe(true);
  });

  test("creates an empty range when start equals end", () => {
    const r = createRangeFromStartEnd(createTime(5, 24), createTime(5, 24));
    expect(isEmptyRange(r)).toBe(true);
  });

  // duration / endExclusive

  test("computes duration from the range", () => {
    const r = createRange(createTime(5, 24), createTime(10, 24));
    expect(eq(duration(r), createTime(10, 24))).toBe(true);
  });

  test("computes exclusive end time", () => {
    const r = createRange(createTime(5, 24), createTime(10, 24));
    expect(eq(endExclusive(r), createTime(15, 24))).toBe(true);
  });

  test("handles ranges with different rates in start and duration", () => {
    // start at 1/24, duration of 1/30.
    const r = createRange(createTime(1, 24), createTime(1, 30));
    const end = endExclusive(r);

    // 1/24 + 1/30 = 5/120 + 4/120 = 9/120 = 3/40
    expect(eq(end, createTime(3, 40))).toBe(true);
  });

  // isEmptyRange

  test("detects empty ranges", () => {
    expect(isEmptyRange(createRange(createTime(5, 24), createTime(0, 1)))).toBe(true);
  });

  test("non-empty range is not empty", () => {
    expect(isEmptyRange(createRange(createTime(0, 24), createTime(1, 24)))).toBe(false);
  });

  // contains (point-in-range)

  test("contains a point within the range", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    expect(contains(r, createTime(5, 24))).toBe(true);
  });

  test("contains the start point (inclusive)", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    expect(contains(r, createTime(0, 24))).toBe(true);
  });

  test("does not contain the exclusive end", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    expect(contains(r, createTime(10, 24))).toBe(false);
  });

  test("does not contain a point before the range", () => {
    const r = createRange(createTime(5, 24), createTime(10, 24));
    expect(contains(r, createTime(2, 24))).toBe(false);
  });

  test("does not contain a point after the range", () => {
    const r = createRange(createTime(5, 24), createTime(10, 24));
    expect(contains(r, createTime(20, 24))).toBe(false);
  });

  test("contains works across different rates", () => {
    // range: [0/24, 10/24) = [0, 5/12)
    const r = createRange(createTime(0, 24), createTime(10, 24));
    // 5/30 = 1/6 which is inside [0, 5/12)
    expect(contains(r, createTime(5, 30))).toBe(true);
  });

  test("empty range contains nothing", () => {
    const r = createRange(createTime(5, 24), createTime(0, 1));
    expect(contains(r, createTime(5, 24))).toBe(false);
  });

  // containsRange

  test("a range contains itself", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    expect(containsRange(r, r)).toBe(true);
  });

  test("a range contains a sub-range", () => {
    const outer = createRange(createTime(0, 24), createTime(20, 24));
    const inner = createRange(createTime(5, 24), createTime(10, 24));
    expect(containsRange(outer, inner)).toBe(true);
  });

  test("a range does not contain a wider range", () => {
    const outer = createRange(createTime(5, 24), createTime(10, 24));
    const inner = createRange(createTime(0, 24), createTime(20, 24));
    expect(containsRange(outer, inner)).toBe(false);
  });

  test("a range does not contain a partially overlapping range", () => {
    const a = createRange(createTime(0, 24), createTime(10, 24));
    const b = createRange(createTime(5, 24), createTime(10, 24));
    expect(containsRange(a, b)).toBe(false);
  });

  test("any range contains an empty range at its start", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    const empty = createRange(createTime(0, 24), createTime(0, 1));
    expect(containsRange(r, empty)).toBe(true);
  });

  // overlaps

  test("overlapping ranges return true", () => {
    const a = createRange(createTime(0, 24), createTime(10, 24));
    const b = createRange(createTime(5, 24), createTime(10, 24));
    expect(overlaps(a, b)).toBe(true);
    expect(overlaps(b, a)).toBe(true);
  });

  test("adjacent ranges do not overlap (exclusive end)", () => {
    const a = createRange(createTime(0, 24), createTime(10, 24));
    const b = createRange(createTime(10, 24), createTime(10, 24));
    expect(overlaps(a, b)).toBe(false);
    expect(overlaps(b, a)).toBe(false);
  });

  test("disjoint ranges do not overlap", () => {
    const a = createRange(createTime(0, 24), createTime(5, 24));
    const b = createRange(createTime(10, 24), createTime(5, 24));
    expect(overlaps(a, b)).toBe(false);
  });

  test("identical ranges overlap", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    expect(overlaps(r, r)).toBe(true);
  });

  test("overlaps works across different rates", () => {
    const a = createRange(createTime(0, 24), createTime(10, 24));
    // [3/30, 13/30) = [0.1, 0.4333...] which overlaps [0, 0.4166...]
    const b = createRange(createTime(3, 30), createTime(10, 30));
    expect(overlaps(a, b)).toBe(true);
  });

  test("empty range does not overlap anything", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    const empty = createRange(createTime(5, 24), createTime(0, 1));
    expect(overlaps(r, empty)).toBe(false);
    expect(overlaps(empty, r)).toBe(false);
  });

  test("two empty ranges do not overlap each other", () => {
    const empty = createRange(createTime(5, 24), createTime(0, 1));
    expect(overlaps(empty, empty)).toBe(false);
  });

  test("adjacent cross-rate ranges do not overlap", () => {
    // [0, 12/24) = [0, 0.5s) and [15/30, ...) starts exactly at 0.5, no shared instant
    const a = createRangeFromStartEnd(createTime(0, 24), createTime(12, 24));
    const b = createRange(createTime(15, 30), createTime(15, 30));
    expect(overlaps(a, b)).toBe(false);
    expect(overlaps(b, a)).toBe(false);
  });

  // clampTime

  test("clamps a time before the range to the start", () => {
    const r = createRangeFromStartEnd(createTime(5, 24), createTime(15, 24));
    const clamped = clampTime(r, createTime(2, 24));
    expect(eq(clamped, createTime(5, 24))).toBe(true);
  });

  test("clamps a time after the range to the exclusive end", () => {
    const r = createRangeFromStartEnd(createTime(5, 24), createTime(15, 24));
    // clamps to endExclusive (may equal the exclusive end; caller decides).
    const clamped = clampTime(r, createTime(20, 24));
    expect(eq(clamped, createTime(15, 24))).toBe(true);
  });

  test("leaves a time inside the range unchanged", () => {
    const r = createRangeFromStartEnd(createTime(5, 24), createTime(15, 24));
    const clamped = clampTime(r, createTime(8, 24));
    expect(eq(clamped, createTime(8, 24))).toBe(true);
  });

  // type-level: TimeRange should be a plain object

  test("is a plain object, not a class instance", () => {
    const r = createRange(createTime(0, 24), createTime(10, 24));
    expect(Object.getPrototypeOf(r)).toBe(Object.prototype);
  });
});
