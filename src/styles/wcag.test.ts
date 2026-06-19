import { describe, expect, test } from "vitest";
import { type AppTheme, themeContract, themes } from "~/styles/themes";

// WCAG 2.1 contrast thresholds.
// 1.4.3 Contrast (Minimum) AA:   4.5:1 normal text, 3:1 large/non-text.
// 1.4.6 Contrast (Enhanced) AAA: 7:1 normal text, 4.5:1 large text.
// 1.4.11 Non-text Contrast AA:   3:1 for UI component boundaries and states.
const AAA_NORMAL = 7;
const AA_NORMAL = 4.5;
const AA_NON_TEXT = 3;

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

// oklch → oklab → linear-sRGB → sRGB.
function oklchToRgb(l: number, c: number, h: number): { r: number; g: number; b: number } {
  const hRad = (h * Math.PI) / 180;
  // oklab
  const a_ = c * Math.cos(hRad);
  const b_ = c * Math.sin(hRad);
  // oklab → linear-sRGB via the OKLab M2 matrix (Björn Ottosson).
  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.291485548 * b_;
  const ll = l_ ** 3;
  const mm = m_ ** 3;
  const ss = s_ ** 3;
  // linear-sRGB
  const lr = +4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss;
  const lg = -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss;
  const lb = -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss;
  // linear → gamma
  const toGamma = (x: number): number => {
    const clamped = Math.max(0, Math.min(1, x));
    return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
  };
  return {
    r: Math.round(toGamma(lr) * 255),
    g: Math.round(toGamma(lg) * 255),
    b: Math.round(toGamma(lb) * 255),
  };
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

  const oklch = input.match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/);
  if (oklch) {
    const { r, g, b } = oklchToRgb(Number(oklch[1]), Number(oklch[2]), Number(oklch[3]));
    return { r, g, b, a: 1 };
  }

  // color-mix(in <space>, <color> N%, transparent): treat as <color> at alpha N/100.
  // sufficient for the theme's translucent washes; not a general color-mix evaluator.
  const mix = input.match(
    /^color-mix\(\s*in\s+[\w-]+\s*,\s*(\S.+?)\s+([\d.]+)%\s*,\s*transparent\s*\)$/i,
  );
  if (mix) {
    const base = parse(mix[1] ?? "");
    return { ...base, a: base.a * (Number(mix[2]) / 100) };
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
    expect(contrast(p.text0, p.bg0)).toBeGreaterThanOrEqual(AAA_NORMAL);
  });

  test("1.4.3 AA: body text on hover wash, accentSoft composited over bg (4.5:1)", () => {
    expect(contrast(p.text0, flatten(p.accentSoft, p.bg0))).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  // fail when a tested AppTheme color changes name; update this set in lock-step.
  test("every tested key exists in the contract", () => {
    const tested = new Set<keyof AppTheme>(["bg0", "text0", "accent", "accentSoft"]);
    const contractKeys = new Set(Object.keys(themeContract));
    for (const key of tested) {
      expect(contractKeys, `tested key "${key}" missing from contract`).toContain(key);
    }
  });
});

// the shared accent (oklch(0.72 0.15 300)) reads well on dark surfaces only;
// on light bg0 it sits at medium lightness and has ~2:1 contrast — by design.
// these checks are dark-only.
describe("defaultDark theme accent contrast", () => {
  const p = themes.defaultDark;

  test("1.4.6 AAA: accent text on bg (7:1)", () => {
    expect(contrast(p.accent, p.bg0)).toBeGreaterThanOrEqual(AAA_NORMAL);
  });

  test("1.4.11 AA: accent border against bg (3:1 non-text)", () => {
    expect(contrast(p.accent, p.bg0)).toBeGreaterThanOrEqual(AA_NON_TEXT);
  });

  test("1.4.3 AA: bg text on pressed accent surface (4.5:1)", () => {
    expect(contrast(p.bg0, p.accent)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});
