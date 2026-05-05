import { createSignal } from "solid-js";
import { type JobTracker, type TrackedJob, createJobTracker } from "~/core/jobs";

/** Singleton tracker for the app session. Plain core data; not Solid-aware. */
export const jobTracker: JobTracker = createJobTracker();

/**
 * Single Solid signal that bumps every time `jobTracker` mutates. Reactive
 * accessors below read it before delegating to the tracker, so any consumer
 * that reads (e.g.) `roots()` inside a tracking scope rerenders on change.
 *
 * Lives at module level on purpose; the subscribe lasts for the app's
 * lifetime, no cleanup needed.
 */
const [version, bump] = createSignal(0);
jobTracker.subscribe(() => bump((v) => v + 1));

/** Reactive snapshot of the tracker's top-level jobs. */
export function reactiveRoots(): readonly TrackedJob[] {
  version();
  return jobTracker.roots();
}

/** Reactive snapshot of one job's direct children. */
export function reactiveChildren(parentId: string): readonly TrackedJob[] {
  version();
  return jobTracker.children(parentId);
}

/** Reactive snapshot of the deepest currently-running chain. */
export function reactiveChain(): readonly TrackedJob[] {
  version();
  return jobTracker.runningChain();
}
