import { describe, expect, test } from "vitest";
import { runTracked } from "~/core/jobs/run-tracked";
import { createJobTracker } from "~/core/jobs/tracker";
import type { Job } from "~/core/jobs/types";

async function* simple(): Job<string> {
  yield { message: "starting" };
  yield { progress: 0.5 };
  return "done";
}

async function* failing(): Job<never> {
  yield { message: "about to fail" };
  throw new Error("boom");
}

describe("runTracked", () => {
  test("registers the job, forwards reports, and ends with completed", async () => {
    const tracker = createJobTracker();
    const result = await runTracked(tracker, "import", simple());

    expect(result.value).toBe("done");
    expect(tracker.roots()).toHaveLength(1);

    const tracked = tracker.roots()[0];
    expect(tracked?.name).toBe("import");
    expect(tracked?.status).toBe("completed");
    expect(tracked?.reports).toEqual([{ message: "starting" }, { progress: 0.5 }]);
    expect(tracked?.value).toBe("done");
  });

  test("links to a parent when parentId is supplied", async () => {
    const tracker = createJobTracker();
    const parentId = tracker.start("parent");

    await runTracked(tracker, "child", simple(), { parentId });

    expect(tracker.children(parentId)).toHaveLength(1);
    expect(tracker.children(parentId)[0]?.name).toBe("child");
  });

  test("records failure with the thrown error", async () => {
    const tracker = createJobTracker();
    await runTracked(tracker, "boomer", failing());

    const tracked = tracker.roots()[0];
    expect(tracked?.status).toBe("failed");
    expect((tracked?.error as Error).message).toBe("boom");
  });

  test("records cancellation when the abort signal fires", async () => {
    const controller = new AbortController();
    controller.abort();
    const tracker = createJobTracker();

    await runTracked(tracker, "cancelled-early", simple(), { signal: controller.signal });

    expect(tracker.roots()[0]?.status).toBe("cancelled");
  });

  test("forwards onReport to the caller's callback as well as the tracker", async () => {
    const tracker = createJobTracker();
    const seen: string[] = [];

    await runTracked(tracker, "x", simple(), {
      onReport: (r) => {
        if (r.message) {
          seen.push(r.message);
        }
      },
    });

    expect(seen).toEqual(["starting"]);
    expect(tracker.roots()[0]?.reports).toHaveLength(2);
  });
});
