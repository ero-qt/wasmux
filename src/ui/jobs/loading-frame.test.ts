import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

describe("loadingFrame", () => {
  beforeEach(() => {
    // Singleton state lives at module scope, so each test gets a fresh import
    // (and therefore a fresh ticker) under fake timers.
    vi.resetModules();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("starts on the first frame", async () => {
    const { loadingFrame, LOADING_FRAMES } = await import("~/ui/jobs/loading-frame");

    expect(loadingFrame()).toBe(LOADING_FRAMES[0]);
  });

  test("advances to the next frame after the tick interval", async () => {
    const { loadingFrame, LOADING_FRAMES } = await import("~/ui/jobs/loading-frame");

    loadingFrame(); // first read primes the ticker
    vi.advanceTimersByTime(80);

    expect(loadingFrame()).toBe(LOADING_FRAMES[1]);
  });

  test("cycles through every frame and wraps to the first", async () => {
    const { loadingFrame, LOADING_FRAMES } = await import("~/ui/jobs/loading-frame");

    const seen: string[] = [loadingFrame()];
    for (let i = 0; i < LOADING_FRAMES.length; i++) {
      vi.advanceTimersByTime(80);
      seen.push(loadingFrame());
    }

    // The first and last reads should be equal (we advanced by exactly one full cycle).
    expect(seen[0]).toBe(seen[LOADING_FRAMES.length]);
    // And every frame in between must be distinct.
    expect(new Set(seen.slice(0, LOADING_FRAMES.length)).size).toBe(LOADING_FRAMES.length);
  });

  test("stays on the first frame when the user prefers reduced motion", async () => {
    const originalMatchMedia = globalThis.matchMedia;
    globalThis.matchMedia = ((query: string) =>
      ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList) as typeof globalThis.matchMedia;

    try {
      const { loadingFrame, LOADING_FRAMES } = await import("~/ui/jobs/loading-frame");

      loadingFrame();
      vi.advanceTimersByTime(1_000);

      expect(loadingFrame()).toBe(LOADING_FRAMES[0]);
    } finally {
      globalThis.matchMedia = originalMatchMedia;
    }
  });
});
