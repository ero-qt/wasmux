import { type RunJobOptions, runJob } from "~/core/jobs/run-job";
import type { JobTracker } from "~/core/jobs/tracker";
import type { Job, JobResult } from "~/core/jobs/types";

/** Options for {@link runTracked}. Adds parent linkage on top of {@link RunJobOptions}. */
export interface RunTrackedOptions extends RunJobOptions {
  /** Parent job id, or `null`/omitted for a top-level entry. */
  parentId?: string | null;
}

/**
 * Runs `job` and records every report into `tracker`. Returns the same
 * {@link JobResult} `runJob` would have produced; the tracker is a side
 * channel for UI consumption, not a replacement for the result.
 */
export async function runTracked<T>(
  tracker: JobTracker,
  name: string,
  job: Job<T>,
  options?: RunTrackedOptions,
): Promise<JobResult<T>> {
  const id = tracker.start(name, options?.parentId ?? null);

  const result = await runJob(name, job, {
    ...options,
    onReport: (report) => {
      tracker.report(id, report);
      options?.onReport?.(report);
    },
  });

  if (result.status === "completed") {
    tracker.end(id, { status: "completed", value: result.value });
  } else if (result.status === "failed") {
    tracker.end(id, { status: "failed", error: result.error });
  } else if (result.status === "cancelled") {
    tracker.end(id, { status: "cancelled" });
  }

  return result;
}
