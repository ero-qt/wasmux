/** Public API for the time system. */

export {
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
  ZERO,
} from "~/core/time/rational-time";
export type { RationalTime, RoundingMode } from "~/core/time/rational-time";

export {
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
export type { TimeRange } from "~/core/time/time-range";
