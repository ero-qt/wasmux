import { type Accessor, createSignal } from "solid-js";

/**
 * Classic 10-frame braille spinner. Every glyph is in the Braille Patterns
 * block (U+2800–U+28FF) and renders consistently in every modern monospace
 * font, so no SVG or webfont is needed.
 */
export const LOADING_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"] as const;

/** Milliseconds between frames. ~80ms gives a smooth-but-not-frantic spin. */
const FRAME_INTERVAL_MS = 80;

const [index, setIndex] = createSignal(0);

// Singleton ticker — one interval drives every running indicator on the page.
let started = false;

function prefersReducedMotion(): boolean {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Starts the shared ticker on first read. Idempotent. Reduced-motion users
 * keep the static first frame.
 */
function ensureStarted(): void {
  if (started) {
    return;
  }
  started = true;
  if (prefersReducedMotion() || typeof setInterval === "undefined") {
    return;
  }
  setInterval(() => {
    setIndex((i) => (i + 1) % LOADING_FRAMES.length);
  }, FRAME_INTERVAL_MS);
}

/**
 * Reactive accessor that yields the current braille spinner glyph. All
 * consumers share the same ticker; read it inside a tracking scope to
 * rerender on every frame.
 */
export const loadingFrame: Accessor<string> = () => {
  ensureStarted();
  return LOADING_FRAMES[index()] ?? LOADING_FRAMES[0];
};
