# changelog

all notable changes to this project will be documented in this file.  
it follows [keep a changelog](https://keepachangelog.com) principles and wasmux adheres to [semantic versioning](https://semver.org).

## [Unreleased]

### Added

- project scaffolding
- repo metadata (changelog, readme)
- logo
- basic check workflow
- hotkey registry with `event.code`-based combos and platform-aware `mod` resolution
- theme contract, default-dark theme, and WCAG contrast tests
- `App` mounted from `src/ui`, plus `HotkeyButton` and `mountHotkeys` lifecycle helper
- reactive project store, `ProjectContext` + `useProject` hook, editor undo/redo hotkey helper
- privacy gate: test-time bans on network/storage/sensor APIs in production source, CSP-shape assertions, type-level restriction of `AssetSource.url` to `blob:` and `data:`, deny-by-default `Permissions-Policy` header, hidden production source maps
- default-light theme with AAA-compliant accent (`#2c4d7e`); WCAG tests extended with non-text border contrast and pressed-state text assertions; button `min-block-size: 24px` and `:focus-visible` outline
- hotkey `Action.when` predicate for focus-scoped shortcuts (WCAG 2.1.4); `Action.preventDefault` per-action override; bare-key combos no longer call `preventDefault` by default; `dispatch` returns matched actions
- `HotkeyButton`: drop `aria-label`, inject combo into a visually-hidden `<span>` so accessible name is derived from contents (WCAG 2.5.3); add `toggled` prop mapping to `aria-pressed` (WAI-ARIA 1.2)
- i18n scaffold: `@solid-primitives/i18n` catalog at `src/i18n/`, locale negotiated from `navigator.languages` at boot, `<html lang>`/`<html dir>` written from the resolved tag, RTL detection for `ar`/`he`/`fa`/`ur`/`ps`/`sd`/`yi`; existing `Undo`/`Redo` strings routed through the catalog
- hotkey modifier and named-key labels routed through the i18n catalog (`Ctrl`/`Alt`/`Shift`/per-platform Meta, `Space`/`Enter`/`Esc`/arrows/etc.); punctuation glyphs and `KeyX`/`DigitX`/`FN` derivations stay literal
- locale-aware time formatters under `src/core/time/format.ts`: `formatSeconds`, `formatFrames`, `formatRationalTime`, all backed by `Intl.NumberFormat`
- IME composition guard in `attachToWindow`: keydowns flagged `isComposing` (or the legacy `keyCode === 229` sentinel) no longer fire hotkeys, preventing CJK / Korean / Vietnamese users from triggering shortcuts mid-composition (I18N-011)
- mobile baseline: button `min-inline-size: 24px` (WCAG 2.5.8 AA on both axes), `body` honors `env(safe-area-inset-*)` for notched / rounded-corner devices, global `prefers-reduced-motion: reduce` reset, body `font-size` switched from the `large` keyword to `1.125rem` for predictable user-zoom scaling
- PWA: `public/manifest.webmanifest` with 192/512/maskable icons, `<link rel="manifest">` + `apple-touch-icon` + `theme-color` in `index.html`; hand-rolled service worker at `public/sw.js` (precache app shell, cache-first runtime, version-bumped cache cleanup); registration gated to production builds in `main.tsx`
