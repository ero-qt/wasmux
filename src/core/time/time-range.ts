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
 * An interval `[start, start + duration)` — end is exclusive.
 *
 * Timeline queries (does this clip overlap that one, is the playhead
 * inside this clip) are frequent and subtle enough (exclusive end,
 * empty range semantics, cross-rate comparison) that centralizing
 * them prevents every caller from getting boundary conditions wrong.
 */
export interface TimeRange {
  readonly start: RationalTime;
  readonly duration: RationalTime;
}

export function range(start: RationalTime, dur: RationalTime): TimeRange {
  return {
    start,
    duration: dur,
  };
}

/** Builds a range from start and exclusive end. */
export function rangeFromStartEnd(start: RationalTime, end: RationalTime): TimeRange {
  return {
    start,
    duration: sub(end, start),
  };
}

export function duration(r: TimeRange): RationalTime {
  return r.duration;
}

/** Exclusive end (start + duration). */
export function endExclusive(r: TimeRange): RationalTime {
  return add(r.start, r.duration);
}

export function isEmptyRange(r: TimeRange): boolean {
  return isZero(r.duration);
}

/** Whether `t` falls within `[start, start + duration)`. Empty ranges contain nothing. */
export function contains(r: TimeRange, t: RationalTime): boolean {
  if (isEmptyRange(r)) {
    return false;
  }

  const end = endExclusive(r);
  return compare(r.start, t) <= 0 && lt(t, end);
}

/** Whether `outer` fully contains `inner`. An empty inner is contained if its start is in outer. */
export function containsRange(outer: TimeRange, inner: TimeRange): boolean {
  if (isEmptyRange(inner)) {
    return contains(outer, inner.start) || isEmptyRange(outer);
  }

  return lte(outer.start, inner.start) && lte(endExclusive(inner), endExclusive(outer));
}

/** Whether two ranges share any common time. Empty ranges never overlap. */
export function overlaps(a: TimeRange, b: TimeRange): boolean {
  if (isEmptyRange(a) || isEmptyRange(b)) {
    return false;
  }

  const aEnd = endExclusive(a);
  const bEnd = endExclusive(b);

  return gt(aEnd, b.start) && gt(bEnd, a.start);
}

/** Clamps `t` to `[start, endExclusive]`. */
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
