import { type RationalTime, toSeconds } from "~/core/time/rational-time";

/**
 * Formats a duration in seconds for display. Defers to the browser's locale
 * (`Intl.NumberFormat` with no explicit locale) when `locale` is omitted, so
 * decimal separator and grouping follow the user's environment.
 */
export function formatSeconds(
  seconds: number,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
    ...options,
  }).format(seconds);
}

/**
 * Formats an integer frame count with locale-aware thousands grouping
 * (`12,345` in en-US, `12.345` in de-DE).
 */
export function formatFrames(count: number, locale?: string): string {
  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(count);
}

/**
 * Formats a {@link RationalTime} as a decimal number of seconds. Convenience
 * wrapper around {@link formatSeconds} that does the rational → float
 * conversion for the caller.
 */
export function formatRationalTime(
  t: RationalTime,
  locale?: string,
  options?: Intl.NumberFormatOptions,
): string {
  return formatSeconds(toSeconds(t), locale, options);
}
