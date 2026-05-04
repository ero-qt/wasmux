# wasmux <img src="assets/logo-monochrome.svg" alt="wasmux logo" align="right" style="height: 1em;" />

an in-browser, privacy-first, wasm-powered video editor.
work in progress!

## requirements

- bun `>=1.1.0`
- node `>=20.11.0`

## quick start

```bash
bun install
bun run serve:dev
```

then open the local vite url shown in your terminal.

## scripts

- `bun run serve:dev` start local dev server
- `bun run serve:preview` preview production build
- `bun run build` build the app
- `bun run check` run typecheck, lint, and tests
- `bun run check:types` run typescript checks
- `bun run check:lint` run biome checks
- `bun run check:test` run vitest test suite
- `bun run check:test:coverage` run tests with coverage
- `bun run fix` apply lint autofixes

---

[architecture](docs/architecture.md)
[changelog.md](changelog.md)
[contributing.md](contributing.md)
[license.md](license.md)
[security.md](security.md)
