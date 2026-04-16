import {
  type RationalTime,
  add,
  compare,
  gt,
  isZero,
  lt,
  lte,
  sub,
} from "~/core/time/rational-time";

/**
 * Represents an interval of time as a start point and a duration.
 * The end is exclusive: the range covers [start, start + duration).
 *
 * Timeline operations — does this clip overlap that one, is the playhead inside
 * this clip — are frequent enough and subtle enough (exclusive end, empty range
 * semantics, cross-rate comparison) that centralizing them prevents every caller
 * from getting the boundary conditions slightly wrong.
 */
export interface TimeRange {
  readonly start: RationalTime;
  readonly duration: RationalTime;
}

/** Creates a {@link TimeRange} from a start time and duration. */
export function range(start: RationalTime, dur: RationalTime): TimeRange {
  return {
    start,
    duration: dur,
  };
}

/**
 * Creates a {@link TimeRange} from a start time and an exclusive end time.
 * The duration is computed as end - start.
 */
export function rangeFromStartEnd(start: RationalTime, end: RationalTime): TimeRange {
  return {
    start,
    duration: sub(end, start),
  };
}

/** Returns the duration of a {@link TimeRange}. */
export function duration(r: TimeRange): RationalTime {
  return r.duration;
}

/** Returns the exclusive end time (start + duration). */
export function endExclusive(r: TimeRange): RationalTime {
  return add(r.start, r.duration);
}

/** Returns true if the range has zero duration. */
export function isEmptyRange(r: TimeRange): boolean {
  return isZero(r.duration);
}

/**
 * Returns true if the time t falls within [start, start + duration).
 * An empty range contains nothing.
 */
export function contains(r: TimeRange, t: RationalTime): boolean {
  if (isEmptyRange(r)) {
    return false;
  }

  const end = endExclusive(r);
  return compare(r.start, t) <= 0 && lt(t, end);
}

/**
 * Returns true if outer fully contains inner.
 * An empty inner range is considered contained if its start is within outer.
 */
export function containsRange(outer: TimeRange, inner: TimeRange): boolean {
  if (isEmptyRange(inner)) {
    return contains(outer, inner.start) || isEmptyRange(outer);
  }

  return lte(outer.start, inner.start) && lte(endExclusive(inner), endExclusive(outer));
}

/**
 * Returns true if the two ranges share any common time.
 * Empty ranges never overlap.
 */
export function overlaps(a: TimeRange, b: TimeRange): boolean {
  if (isEmptyRange(a) || isEmptyRange(b)) {
    return false;
  }

  const aEnd = endExclusive(a);
  const bEnd = endExclusive(b);

  return gt(aEnd, b.start) && gt(bEnd, a.start);
}

/**
 * Clamps a time to the range [start, start + duration].
 * Times before the start are moved to start. Times after the end are
 * moved to the exclusive end.
 */
export function clampTime(r: TimeRange, t: RationalTime): RationalTime {
  const end = endExclusive(r);

  if (lt(t, r.start)) {
    return r.start;
  }

  if (gt(t, end)) {
    return end;
  }

  return t;
}
