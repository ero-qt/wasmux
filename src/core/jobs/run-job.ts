import type { Job, JobReport, JobResult, JobStatus } from "~/core/jobs/types";

/** Options for {@link runJob}. */
export interface RunJobOptions {
  signal?: AbortSignal | undefined;
  onReport?: ((report: JobReport) => void) | undefined;
}

/** Clamps progress to `[0, 1]` so consumers can trust the range. */
function clampProgress(report: JobReport): JobReport {
  if (report.progress === undefined) {
    return report;
  }

  const clamped = Math.max(0, Math.min(1, report.progress));
  if (clamped === report.progress) {
    return report;
  }

  return {
    ...report,
    progress: clamped,
  };
}

/** Drives a {@link Job} to completion, collecting reports and timing. */
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

  // on abort, return() the generator so its finally blocks run and
  // iteration stops.
  let onAbort: (() => void) | undefined;
  if (options?.signal) {
    onAbort = () => job.return(undefined as T);
    options.signal.addEventListener("abort", onAbort, { once: true });
  }

  try {
    let next = await job.next();

    while (!next.done) {
      if (options?.signal?.aborted) {
        status = "cancelled";
        break;
      }

      const report = clampProgress(next.value);
      reports.push(report);
      options?.onReport?.(report);

      next = await job.next();
    }

    // the signal is the source of truth for cancellation, even if the
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
