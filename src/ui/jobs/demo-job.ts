import type { Job } from "~/core/jobs";
import { runTracked } from "~/core/jobs";
import { jobTracker } from "~/ui/jobs/job-tracker";

/** Generates `steps + 1` progress reports over `intervalMs * steps` total. */
async function* leaf(steps: number, intervalMs: number): Job<void> {
  for (let i = 0; i <= steps; i++) {
    yield { progress: i / steps, message: `step ${i}/${steps}` };
    await new Promise((r) => setTimeout(r, intervalMs));
  }
}

/**
 * Fires a synthetic two-child render-style sequence into the global tracker.
 * Used in dev to populate the jobs panel and chain widget. Safe to remove
 * once a real job consumer (file import, render, etc.) lands.
 */
export async function fireDemoJob(): Promise<void> {
  const parentId = jobTracker.start("Demo render");
  jobTracker.report(parentId, { message: "Spawning subtasks" });

  await runTracked(jobTracker, "Encode video", leaf(20, 200), { parentId });
  await runTracked(jobTracker, "Mux container", leaf(10, 150), { parentId });

  jobTracker.end(parentId, { status: "completed", value: undefined });
}
