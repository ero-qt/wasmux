/**
 * Represents a point in time as an exact rational number (num/den seconds).
 *
 * Video frame rates like 29.97fps are in reality a fraction: 30000/1001.
 * Storing timestamps as floats would lose precision. With integer numerator
 * and denominator, arithmetic is exact and JSON serialization is lossless.
 */
export interface RationalTime {
  readonly num: number;
  readonly den: number;
}

/** Rounding strategy. */
export type RoundingMode = "floor" | "ceil" | "round";

/** Greatest common divisor. */
function gcd(x: number, y: number): number {
  let a = Math.abs(x);
  let b = Math.abs(y);

  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
}

/** Least common multiple. */
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return 0;
  }

  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Creates a {@link RationalTime} from an integer numerator and denominator,
 * automatically reducing to canonical form.
 *
 * @throws if den is zero or either argument is not an integer.
 */
export function time(num: number, den: number): RationalTime {
  if (den === 0) {
    throw new RangeError("Denominator must not be zero.");
  }

  if (!Number.isInteger(num)) {
    throw new TypeError("Numerator must be an integer.");
  }

  if (!Number.isInteger(den)) {
    throw new TypeError("Denominator must be an integer.");
  }

  // Normalize sign: denominator is always positive.
  const n = den < 0 ? -num : num;
  const d = Math.abs(den);

  // Zero is always 0/1.
  if (n === 0) {
    return {
      num: 0,
      den: 1,
    };
  }

  const g = gcd(Math.abs(n), d);
  return {
    num: n / g,
    den: d / g,
  };
}

/** Zero time (0/1). */
export const ZERO: RationalTime = { num: 0, den: 1 };

/**
 * Creates a {@link RationalTime} from a frame count at a given rate.
 * For example, `fromFrames(5, 24)` means frame 5 at 24fps (5/24 seconds).
 *
 * Unlike {@link time}, the result is not reduced so the rate is preserved
 * as the denominator.
 */
export function fromFrames(frames: number, rate: number): RationalTime {
  if (!Number.isInteger(frames) || !Number.isInteger(rate) || rate <= 0) {
    throw new RangeError("Frames must be an integer and rate a positive integer.");
  }

  return {
    num: frames,
    den: rate,
  };
}

/**
 * Creates a {@link RationalTime} from a floating-point seconds value,
 * quantized to the nearest frame at the given rate. The rate is preserved
 * as the denominator.
 */
export function fromSeconds(seconds: number, rate: number): RationalTime {
  if (!Number.isInteger(rate) || rate <= 0) {
    throw new RangeError("Rate must be a positive integer.");
  }

  const frames = Math.round(seconds * rate);
  return {
    num: frames,
    den: rate,
  };
}

/** Converts a {@link RationalTime} to seconds as a floating-point number. */
export function toSeconds(t: RationalTime): number {
  return t.num / t.den;
}

/**
 * Converts a {@link RationalTime} to a frame count at the given rate.
 * When the conversion is not exact, the rounding mode determines the
 * result (defaults to "floor").
 */
export function toFrames(t: RationalTime, rate: number, rounding: RoundingMode = "floor"): number {
  const exact = (t.num * rate) / t.den;
  return applyRounding(exact, rounding);
}

/** Adds two {@link RationalTime} values using LCM for a common denominator. */
export function add(a: RationalTime, b: RationalTime): RationalTime {
  if (a.den === b.den) {
    return time(a.num + b.num, a.den);
  }

  const commonDen = lcm(a.den, b.den);
  const aNum = a.num * (commonDen / a.den);
  const bNum = b.num * (commonDen / b.den);
  return time(aNum + bNum, commonDen);
}

/** Subtracts b from a. */
export function sub(a: RationalTime, b: RationalTime): RationalTime {
  return add(a, neg(b));
}

/** Multiplies a {@link RationalTime} by an integer scalar. */
export function mul(t: RationalTime, scalar: number): RationalTime {
  return time(t.num * scalar, t.den);
}

/** Negates a {@link RationalTime}. */
export function neg(t: RationalTime): RationalTime {
  return time(-t.num, t.den);
}

/**
 * Compares two {@link RationalTime} values.
 *
 * @returns -1 if a < b, 0 if equal, 1 if a > b.
 */
export function compare(a: RationalTime, b: RationalTime): -1 | 0 | 1 {
  // Cross-multiply to avoid computing a common denominator.
  const lhs = a.num * b.den;
  const rhs = b.num * a.den;

  if (lhs < rhs) {
    return -1;
  }

  if (lhs > rhs) {
    return 1;
  }

  return 0;
}

export function eq(a: RationalTime, b: RationalTime): boolean {
  return compare(a, b) === 0;
}

export function lt(a: RationalTime, b: RationalTime): boolean {
  return compare(a, b) === -1;
}

export function lte(a: RationalTime, b: RationalTime): boolean {
  return compare(a, b) !== 1;
}

export function gt(a: RationalTime, b: RationalTime): boolean {
  return compare(a, b) === 1;
}

export function gte(a: RationalTime, b: RationalTime): boolean {
  return compare(a, b) !== -1;
}

/**
 * Rescales a {@link RationalTime} to a new denominator. When the
 * conversion is not exact, the rounding mode determines the numerator
 * (defaults to "floor").
 *
 * Unlike {@link time}, the result is not GCD-reduced, preserving the
 * requested denominator so callers can reason about frame boundaries.
 */
export function rescale(
  t: RationalTime,
  newDen: number,
  rounding: RoundingMode = "floor",
): RationalTime {
  const exactNum = (t.num * newDen) / t.den;
  const roundedNum = applyRounding(exactNum, rounding);
  return {
    num: roundedNum,
    den: newDen,
  };
}

/** Returns true if the time is zero. */
export function isZero(t: RationalTime): boolean {
  return t.num === 0;
}

function applyRounding(value: number, mode: RoundingMode): number {
  switch (mode) {
    case "floor":
      return Math.floor(value);
    case "ceil":
      return Math.ceil(value);
    case "round":
      return Math.round(value);
  }
}
