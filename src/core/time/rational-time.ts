/**
 * A point in time as an exact rational (num/den seconds). Video frame
 * rates like 29.97fps are really 30000/1001; floats drift, integer
 * rationals stay exact and round-trip through JSON.
 */
export interface RationalTime {
  readonly num: number;
  readonly den: number;
}

export type RoundingMode = "floor" | "ceil" | "round";

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

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) {
    return 0;
  }

  return Math.abs(a * b) / gcd(a, b);
}

/**
 * Creates a {@link RationalTime}, reducing to canonical form.
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

  // normalize sign: denominator is always positive.
  const n = den < 0 ? -num : num;
  const d = Math.abs(den);

  // zero is always 0/1.
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

export const ZERO: RationalTime = { num: 0, den: 1 };

/**
 * Frame `n` at `rate` fps as `n/rate` seconds. Unlike {@link time}, the
 * result is not reduced — the rate is preserved as the denominator.
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

/** Quantizes `seconds` to the nearest frame at `rate` fps. */
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

export function toSeconds(t: RationalTime): number {
  return t.num / t.den;
}

/** Frame count at `rate` fps. Inexact conversions use `rounding` (default `"floor"`). */
export function toFrames(t: RationalTime, rate: number, rounding: RoundingMode = "floor"): number {
  const exact = (t.num * rate) / t.den;
  return applyRounding(exact, rounding);
}

export function add(a: RationalTime, b: RationalTime): RationalTime {
  if (a.den === b.den) {
    return time(a.num + b.num, a.den);
  }

  const commonDen = lcm(a.den, b.den);
  const aNum = a.num * (commonDen / a.den);
  const bNum = b.num * (commonDen / b.den);
  return time(aNum + bNum, commonDen);
}

export function sub(a: RationalTime, b: RationalTime): RationalTime {
  return add(a, neg(b));
}

export function mul(t: RationalTime, scalar: number): RationalTime {
  return time(t.num * scalar, t.den);
}

export function neg(t: RationalTime): RationalTime {
  return time(-t.num, t.den);
}

/** Returns -1 if a < b, 0 if equal, 1 if a > b. */
export function compare(a: RationalTime, b: RationalTime): -1 | 0 | 1 {
  // cross-multiply to avoid computing a common denominator.
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
 * Rescales to a new denominator. Inexact conversions use `rounding`
 * (default `"floor"`). The result is not GCD-reduced, so callers can
 * reason about frame boundaries at the requested rate.
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
