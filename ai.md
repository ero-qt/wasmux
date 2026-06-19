# ai.md

## How wasmux is built

Claude (Anthropic) is in the loop for planning, implementation, and code
review. Every commit is human-authored or human-reviewed before it lands.

## What's verified

- Unit + property tests run on every push (CI: `.github/workflows/ci.yml`).
- Type checks via `tsc --noEmit`, lint via Biome — strict error policy.
- Coverage available via `bun run check:test:coverage`; the CI run uploads the
  report as a build artefact.

## Privacy posture

- No network after initial bundle load.
- CSP `connect-src 'self' blob:` plus a strict default. Cross-Origin-Opener
  and Cross-Origin-Embedder headers are set so SharedArrayBuffer is
  available without third-party leakage.
- Storage local-only (OPFS + IndexedDB). No telemetry, no remote sync.
- Build is reproducible from the pinned lockfile.

The privacy story is exercised by `src/privacy.test.ts`, which runs in every
CI build.

## Why no AI-generated docs in this repo

Planning notes, research briefs, and synthesis docs are produced by Claude
and kept outside the tracked tree (gitignored under `docs/research/` and
`docs/superpowers/`). Authorship in git history is intentionally clear about
who wrote what.

We're transparent that AI is in the loop. We're equally transparent that
nothing AI-generated is presented as human work.
