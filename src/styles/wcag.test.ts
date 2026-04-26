import { describe, expect, test } from "vitest";
import { type AppTheme, themeContract, themes } from "~/styles/themes";

// WCAG 2.1 contrast thresholds.
// 1.4.3 Contrast (Minimum) AA:   4.5:1 normal text, 3:1 large/non-text.
// 1.4.6 Contrast (Enhanced) AAA: 7:1 normal text, 4.5:1 large text.
// 1.4.11 Non-text Contrast AA:   3:1 for UI component boundaries and states.
const AAA_NORMAL = 7;
const AA_NORMAL = 4.5;

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

function parse(input: string): Color {
  const hex = input.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    const h = hex[1] ?? "";

    // expand 3- or 4-digit hex to 6- or 8-digit (#rgba to #rrggbbaa)
    const full = h.length <= 4 ? h.replace(/(.)/g, "$1$1") : h;

    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
      a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
    };
  }

  const rgba = input.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (rgba) {
    return {
      r: Number(rgba[1]),
      g: Number(rgba[2]),
      b: Number(rgba[3]),
      a: rgba[4] === undefined ? 1 : Number(rgba[4]),
    };
  }

  throw new Error(`unsupported color: ${input}`);
}

function compositeOver(fg: Color, bg: Color): Color {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

function stringify(c: Color): string {
  return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${c.a})`;
}

function linearize(channel: number): number {
  const s = channel / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(c: Color): number {
  return 0.2126 * linearize(c.r) + 0.7152 * linearize(c.g) + 0.0722 * linearize(c.b);
}

function contrast(fg: string, bg: string): number {
  const bgc = parse(bg);
  const fgc = compositeOver(parse(fg), bgc);
  const L1 = luminance(fgc);
  const L2 = luminance(bgc);
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

function flatten(layer: string, base: string): string {
  return stringify(compositeOver(parse(layer), parse(base)));
}

describe.each(Object.entries(themes))("%s theme WCAG contrast", (_, p) => {
  test("1.4.6 AAA: body text on bg (7:1)", () => {
    expect(contrast(p.fg, p.bg)).toBeGreaterThanOrEqual(AAA_NORMAL);
  });

  test("1.4.6 AAA: accent text on bg (7:1)", () => {
    expect(contrast(p.accent, p.bg)).toBeGreaterThanOrEqual(AAA_NORMAL);
  });

  test("1.4.3 AA: body text on hover wash — accentSoft composited over bg (4.5:1)", () => {
    expect(contrast(p.fg, flatten(p.accentSoft, p.bg))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  // fail when a new AppTheme color is added without a contrast test
  test("every theme key is covered by an assertion", () => {
    const tested = new Set<keyof AppTheme>(["bg", "fg", "accent", "accentSoft"]);
    expect(tested).toEqual(new Set(Object.keys(themeContract)));
  });
});
