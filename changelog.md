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
