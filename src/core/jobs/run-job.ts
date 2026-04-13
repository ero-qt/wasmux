import type { Job, JobReport, JobResult, JobStatus } from "~/core/jobs/types";

/** Optional configuration for {@link runJob}. */
export interface RunJobOptions {
  /** Abort signal used for cancellation. */
  signal?: AbortSignal | undefined;

  /** Callback for each {@link JobReport} the job yields. */
  onReport?: ((report: JobReport) => void) | undefined;
}

/**
 * Clamps {@link JobReport.progress} to [0, 1] so consumers can
 * trust the range. Returns the original object unchanged when
 * progress is absent or already in range.
 */
function clampProgress(report: JobReport): JobReport {
  if (report.progress === undefined) {
    return report;
  }

  const clamped = Math.max(0, Math.min(1, report.progress));
  if (clamped === report.progress) {
    return report;
  }

  return { ...report, progress: clamped };
}

/**
 * Drives a {@link Job} generator to completion, collecting reports
 * and timing along the way.
 */
export async function runJob<T>(
  name: string,
  job: Job<T>,
  options?: RunJobOptions,
): Promise<JobResult<T>> {
  const startedAt = Date.now();
  const reports: JobReport[] = [];

  let status: JobStatus = "running";
  let value: T | undefined;
  let error: unknown;

  if (options?.signal?.aborted) {
    status = "cancelled";
    return {
      name,
      status,
      value: undefined,
      error: undefined,
      reports,
      startedAt,
      endedAt: Date.now(),
    };
  }

  // Wire up cancellation; when the signal fires, return() the generator
  // to trigger its finally blocks and stop iteration.
  let onAbort: (() => void) | undefined;
  if (options?.signal) {
    onAbort = () => job.return(undefined as T);
    options.signal.addEventListener("abort", onAbort, { once: true });
  }

  try {
    let next = await job.next();

    while (!next.done) {
      // Check cancellation between iterations.
      if (options?.signal?.aborted) {
        status = "cancelled";
        break;
      }

      const report = clampProgress(next.value);
      reports.push(report);
      options?.onReport?.(report);

      next = await job.next();
    }

    // The signal is the source of truth for cancellation, even if the
    // generator handled the abort internally and returned a value.
    if (status === "running" && options?.signal?.aborted) {
      status = "cancelled";
    } else if (status === "running" && next.done) {
      status = "completed";
      value = next.value;
    }
  } catch (e: unknown) {
    status = "failed";
    error = e;
  } finally {
    // Clean up cancellation listener.
    if (onAbort && options?.signal) {
      options.signal.removeEventListener("abort", onAbort);
    }
  }

  return {
    name,
    status,
    value,
    error,
    reports,
    startedAt,
    endedAt: Date.now(),
  };
}
