/**
 * A unit of work that can be run to completion, yielding zero or
 * more progress reports along the way.
 */
export type Job<T> = AsyncGenerator<JobReport, T, undefined>;

/** A progress update emitted while a {@link Job} is running. */
export interface JobReport {
  /** User-facing description of the step. */
  message?: string | undefined;
  /** 0 to 1. */
  progress?: number | undefined;
}

/**
 * - `running`: currently executing.
 * - `completed`: finished successfully with a value.
 * - `failed`: threw during execution.
 * - `cancelled`: aborted before completion.
 */
export type JobStatus = "running" | "completed" | "failed" | "cancelled";

/** The final outcome of a {@link Job} after its execution has settled. */
export interface JobResult<T> {
  /** Name passed to `runJob`. Used to identify the job in logs and UI. */
  readonly name: string;
  readonly status: JobStatus;
  /** Present when `status === "completed"`. */
  readonly value: T | undefined;
  /** Present when `status === "failed"`. */
  readonly error: unknown;
  /** Every report yielded during execution, in order. */
  readonly reports: readonly JobReport[];
  readonly startedAt: number;
  readonly endedAt: number;
}
