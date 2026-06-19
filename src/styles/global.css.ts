import { globalLayer, globalStyle } from "@vanilla-extract/css";
import { tokens } from "~/styles/tokens.css";

// cascade layers, ordered low → high precedence. components that need to win
// over base styles declare their rules inside the components layer.
globalLayer("reset");
globalLayer("tokens");
globalLayer("base");
globalLayer("components");
globalLayer("utilities");

// customisation root vars. set on :root so they cascade everywhere; user
// overrides flip these via Settings → Appearance.
globalStyle(":root", {
  vars: {
    "--ui-scale": "1",
    "--ui-density": "1",
  },
  // honour OS light/dark choice; data-theme attribute overrides if present.
  colorScheme: "light dark",
});

globalStyle("html, body, #root", {
  margin: 0,
  padding: 0,
  fontFamily:
    'ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", Menlo, Consolas, monospace',
  // base 12.5px × --ui-scale. all per-element font-sizes inherit and scale.
  fontSize: "calc(12.5px * var(--ui-scale))",
  fontVariantNumeric: "tabular-nums",
  background: tokens.theme.bg0,
  color: tokens.theme.text0,
});

// honour display cutouts / rounded corners declared via viewport-fit=cover.
globalStyle("body", {
  paddingBlockStart: "env(safe-area-inset-top)",
  paddingBlockEnd: "env(safe-area-inset-bottom)",
  paddingInlineStart: "env(safe-area-inset-left)",
  paddingInlineEnd: "env(safe-area-inset-right)",
});

// WCAG 2.3.3 / vestibular-safety baseline. per-component animations can opt
// back in by gating their own rule on (prefers-reduced-motion: no-preference).
globalStyle("*, ::before, ::after", {
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
    },
  },
});

// :focus-visible default. components may override but the baseline is
// 2px solid accent at 1px offset, per the design spec.
globalStyle(":focus-visible", {
  outline: `2px solid ${tokens.theme.accent}`,
  outlineOffset: "1px",
  borderRadius: "3px",
});
