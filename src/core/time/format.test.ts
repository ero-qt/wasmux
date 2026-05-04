import { describe, expect, test } from "vitest";
import { formatFrames, formatRationalTime, formatSeconds } from "~/core/time/format";
import { createTime } from "~/core/time/rational-time";

describe("formatSeconds", () => {
  test("en-US uses period as decimal separator", () => {
    expect(formatSeconds(1.5, "en-US")).toBe("1.5");
  });

  test("de-DE uses comma as decimal separator", () => {
    expect(formatSeconds(1.5, "de-DE")).toBe("1,5");
  });

  test("trims trailing zeros within the default 3-digit fraction limit", () => {
    expect(formatSeconds(1.2, "en-US")).toBe("1.2");
    expect(formatSeconds(1, "en-US")).toBe("1");
  });

  test("rounds beyond 3 fractional digits by default", () => {
    expect(formatSeconds(1.23456, "en-US")).toBe("1.235");
  });

  test("respects an explicit fraction-digit override", () => {
    expect(formatSeconds(1.5, "en-US", { minimumFractionDigits: 3 })).toBe("1.500");
  });
});

describe("formatFrames", () => {
  test("en-US groups thousands with comma", () => {
    expect(formatFrames(12345, "en-US")).toBe("12,345");
  });

  test("de-DE groups thousands with period", () => {
    expect(formatFrames(12345, "de-DE")).toBe("12.345");
  });

  test("small counts have no grouping", () => {
    expect(formatFrames(42, "en-US")).toBe("42");
  });

  test("rounds non-integer inputs", () => {
    expect(formatFrames(1.7, "en-US")).toBe("2");
  });
});

describe("formatRationalTime", () => {
  test("converts to seconds and applies locale formatting", () => {
    const t = createTime(3, 2);
    expect(formatRationalTime(t, "en-US")).toBe("1.5");
    expect(formatRationalTime(t, "de-DE")).toBe("1,5");
  });

  test("ZERO formats as 0", () => {
    expect(formatRationalTime(createTime(0, 1), "en-US")).toBe("0");
  });

  test("forwards options through to Intl.NumberFormat", () => {
    const t = createTime(1, 2);
    expect(formatRationalTime(t, "en-US", { minimumFractionDigits: 2 })).toBe("0.50");
  });
});
