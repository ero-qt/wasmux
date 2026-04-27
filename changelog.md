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
