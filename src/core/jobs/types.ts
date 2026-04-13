/**
 * Represents a unit of work that can be run to completion,
 * yielding zero or more progress reports along the way.
 */
export type Job<T> = AsyncGenerator<JobReport, T, undefined>;

/**
 * Represents a progress update emitted while a job is running.
 *
 * Reports are optional and may be emitted zero or more times by a {@link Job}.
 */
export interface JobReport {
  /** User-facing description of the step. */
  message?: string | undefined;

  /** Optional progress indicator from 0 to 1. */
  progress?: number | undefined;
}

/**
 * Current status of a given {@link Job}.
 *
 * - "running": the job is currently executing.
 * - "completed": the job finished successfully and returned a value.
 * - "failed": the job threw an error during execution.
 * - "cancelled": the job was cancelled before completion.
 */
export type JobStatus = "running" | "completed" | "failed" | "cancelled";

/**
 * Represents the final outcome of a {@link Job} after its execution has settled.
 */
export interface JobResult<T> {
  /** Name passed to runJob. Used to identify the job in logs and UI. */
  readonly name: string;

  /** The exit status of the job. */
  readonly status: JobStatus;

  /** The return value. Present when status is "completed". */
  readonly value: T | undefined;

  /** The error. Present when status is "failed". */
  readonly error: unknown;

  /** Every report yielded during execution, in order. */
  readonly reports: readonly JobReport[];

  /** Time at which the job was started. */
  readonly startedAt: number;

  /** Time at which the job finished. */
  readonly endedAt: number;
}
