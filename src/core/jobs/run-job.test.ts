import { describe, expect, test, vi } from "vitest";
import { runJob } from "~/core/jobs/run-job";
import type { Job, JobReport } from "~/core/jobs/types";

/** Simple job that yields one report and returns a string result. */
async function* emptyJob(): Job<string> {
  yield { message: "ready" };

  return "finished";
}

/** Job that yields a report and then throws an error. */
async function* failingJob(): Job<never> {
  yield { message: "about to fail" };

  throw new Error("boom");
}

/**
 * Job that yields several reports with progress values, used to verify
 * report ordering and progress tracking.
 */
async function* progressJob(): Job<number> {
  yield { message: "starting" };
  yield { progress: 0.5, message: "halfway" };
  yield { progress: 1 };

  return 42;
}

/**
 * Long-running job that checks the abort signal before each iteration.
 * Used to test mid-run cancellation. It returns early when aborted rather
 * than throwing, so the tracker must treat signal.aborted as the source of
 * truth rather than relying on the generator to error.
 */
async function* slowJob(signal: AbortSignal): Job<string> {
  const total = 100;

  for (let i = 0; i < total; i++) {
    if (signal.aborted) {
      return "cancelled-early";
    }

    yield { progress: i / total };

    // Simulate async work.
    await new Promise((resolve) => setTimeout(resolve, 1));
  }

  return "finished";
}

/**
 * Outer job that delegates to {@link innerJob} via yield*, verifying that
 * reports from nested generators are collected in the right order.
 */
async function* nestedJob(): Job<string> {
  yield { message: "parent start" };
  const inner = yield* innerJob();
  yield { message: "parent end" };

  return `outer(${inner})`;
}

/** Inner job used by {@link nestedJob} to exercise yield* delegation. */
async function* innerJob(): Job<string> {
  yield { message: "child work" };

  return "child-result";
}

describe("runJob", () => {
  // completion

  test("runs a job to completion and returns its result", async () => {
    const result = await runJob("empty", emptyJob());

    expect(result.name).toBe("empty");
    expect(result.status).toBe("completed");
    expect(result.value).toBe("finished");
    expect(result.error).toBeUndefined();
  });

  test("returns value as undefined when job returns void", async () => {
    async function* voidJob(): Job<void> {
      yield { message: "work" };
    }

    const result = await runJob("void", voidJob());
    expect(result.status).toBe("completed");
    expect(result.value).toBeUndefined();
  });

  // reports

  test("collects all yielded reports in order", async () => {
    const result = await runJob("progress", progressJob());

    expect(result.reports).toEqual([
      { message: "starting" },
      { progress: 0.5, message: "halfway" },
      { progress: 1 },
    ]);
  });

  test("has empty reports array when job yields nothing", async () => {
    async function* silent(): Job<void> {
      yield* [] as JobReport[];
    }

    const result = await runJob("silent", silent());
    expect(result.reports).toEqual([]);
  });

  // onReport callback

  test("calls onReport for each yielded report", async () => {
    const onReport = vi.fn<(report: JobReport) => void>();

    await runJob("progress", progressJob(), { onReport });

    expect(onReport).toHaveBeenCalledTimes(3);
    expect(onReport).toHaveBeenNthCalledWith(1, { message: "starting" });
    expect(onReport).toHaveBeenNthCalledWith(2, { progress: 0.5, message: "halfway" });
    expect(onReport).toHaveBeenNthCalledWith(3, { progress: 1 });
  });

  // failure

  test("captures errors and sets status to failed", async () => {
    const result = await runJob("failing", failingJob());

    expect(result.status).toBe("failed");
    expect(result.value).toBeUndefined();
    expect(result.error).toBeInstanceOf(Error);
    expect((result.error as Error).message).toBe("boom");
  });

  test("collects reports yielded before failure", async () => {
    const result = await runJob("failing", failingJob());
    expect(result.reports).toEqual([{ message: "about to fail" }]);
  });

  // cancellation via AbortSignal

  test("sets status to cancelled when signal is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    const result = await runJob("cancelled", emptyJob(), { signal: controller.signal });

    expect(result.status).toBe("cancelled");
    expect(result.value).toBeUndefined();
  });

  test("cancels a running job when signal fires", async () => {
    const controller = new AbortController();

    // abort after a short delay.
    setTimeout(() => controller.abort(), 10);

    const result = await runJob("slow", slowJob(controller.signal), {
      signal: controller.signal,
    });

    // the job should not have run to completion.
    expect(result.status).toBe("cancelled");
  });

  // timing

  test("records startedAt and endedAt timestamps", async () => {
    const before = Date.now();
    const result = await runJob("timed", emptyJob());
    const after = Date.now();

    expect(result.startedAt).toBeGreaterThanOrEqual(before);
    expect(result.endedAt).toBeGreaterThanOrEqual(result.startedAt);
    expect(result.endedAt).toBeLessThanOrEqual(after);
  });

  // nesting via yield*

  test("collects reports from nested generators via yield*", async () => {
    const result = await runJob("nested", nestedJob());

    expect(result.status).toBe("completed");
    expect(result.value).toBe("outer(child-result)");
    expect(result.reports).toEqual([
      { message: "parent start" },
      { message: "child work" },
      { message: "parent end" },
    ]);
  });

  // validation

  test("clamps reported progress to the 0-1 range", async () => {
    async function* badProgress(): Job<void> {
      yield { progress: -0.5 };
      yield { progress: 1.7 };
    }

    const result = await runJob("clamped", badProgress());

    expect(result.reports[0]?.progress).toBe(0);
    expect(result.reports[1]?.progress).toBe(1);
  });
});
