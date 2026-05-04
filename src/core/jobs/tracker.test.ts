import { describe, expect, test, vi } from "vitest";
import { createJobTracker } from "~/core/jobs/tracker";

describe("createJobTracker", () => {
  // start / get / all / roots / children

  test("start adds a job and returns an id", () => {
    const tracker = createJobTracker();
    const id = tracker.start("import");

    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
    expect(tracker.get(id)?.name).toBe("import");
    expect(tracker.get(id)?.status).toBe("running");
    expect(tracker.get(id)?.parentId).toBeNull();
  });

  test("all returns jobs in start order", () => {
    const tracker = createJobTracker();
    const a = tracker.start("a");
    const b = tracker.start("b");
    const c = tracker.start("c");

    expect(tracker.all().map((j) => j.id)).toEqual([a, b, c]);
  });

  test("roots includes only top-level jobs", () => {
    const tracker = createJobTracker();
    const root = tracker.start("root");
    tracker.start("child", root);
    const sibling = tracker.start("sibling");

    expect(tracker.roots().map((j) => j.id)).toEqual([root, sibling]);
  });

  test("children returns direct descendants in start order", () => {
    const tracker = createJobTracker();
    const root = tracker.start("root");
    const child1 = tracker.start("child1", root);
    tracker.start("grandchild", child1);
    const child2 = tracker.start("child2", root);

    expect(tracker.children(root).map((j) => j.id)).toEqual([child1, child2]);
  });

  test("get returns undefined for unknown ids", () => {
    const tracker = createJobTracker();
    expect(tracker.get("nope")).toBeUndefined();
  });

  // report

  test("report appends to reports and updates latestReport", () => {
    const tracker = createJobTracker();
    const id = tracker.start("import");

    tracker.report(id, { message: "starting" });
    tracker.report(id, { progress: 0.5, message: "halfway" });

    const job = tracker.get(id);
    expect(job?.reports).toEqual([{ message: "starting" }, { progress: 0.5, message: "halfway" }]);
    expect(job?.latestReport).toEqual({ progress: 0.5, message: "halfway" });
  });

  test("report on a non-running job is ignored", () => {
    const tracker = createJobTracker();
    const id = tracker.start("import");
    tracker.end(id, { status: "completed", value: undefined });

    tracker.report(id, { message: "too late" });
    expect(tracker.get(id)?.reports).toEqual([]);
  });

  // end

  test("end with completed sets value, status, endedAt", () => {
    const tracker = createJobTracker();
    const id = tracker.start("import");
    tracker.end(id, { status: "completed", value: 42 });

    const job = tracker.get(id);
    expect(job?.status).toBe("completed");
    expect(job?.value).toBe(42);
    expect(job?.endedAt).toBeGreaterThanOrEqual(job?.startedAt ?? 0);
  });

  test("end with failed sets error and status", () => {
    const tracker = createJobTracker();
    const id = tracker.start("import");
    const error = new Error("boom");
    tracker.end(id, { status: "failed", error });

    const job = tracker.get(id);
    expect(job?.status).toBe("failed");
    expect(job?.error).toBe(error);
  });

  test("end with cancelled sets status without value or error", () => {
    const tracker = createJobTracker();
    const id = tracker.start("import");
    tracker.end(id, { status: "cancelled" });

    const job = tracker.get(id);
    expect(job?.status).toBe("cancelled");
    expect(job?.value).toBeUndefined();
    expect(job?.error).toBeUndefined();
  });

  test("end on an already-ended job is a no-op", () => {
    const tracker = createJobTracker();
    const id = tracker.start("import");
    tracker.end(id, { status: "completed", value: "first" });
    tracker.end(id, { status: "failed", error: "second" });

    const job = tracker.get(id);
    expect(job?.status).toBe("completed");
    expect(job?.value).toBe("first");
    expect(job?.error).toBeUndefined();
  });

  // runningChain

  test("runningChain returns empty when nothing is running", () => {
    const tracker = createJobTracker();
    expect(tracker.runningChain()).toEqual([]);
  });

  test("runningChain follows the deepest running leaf", () => {
    const tracker = createJobTracker();
    const root = tracker.start("render");
    const child = tracker.start("encode", root);
    const leaf = tracker.start("frame", child);

    const chain = tracker.runningChain();
    expect(chain.map((j) => j.name)).toEqual(["render", "encode", "frame"]);
    expect(chain.map((j) => j.id)).toEqual([root, child, leaf]);
  });

  test("runningChain ignores ended jobs", () => {
    const tracker = createJobTracker();
    const root = tracker.start("render");
    const child = tracker.start("encode", root);
    tracker.end(child, { status: "completed", value: undefined });

    const chain = tracker.runningChain();
    expect(chain.map((j) => j.name)).toEqual(["render"]);
  });

  test("runningChain prefers the most recently started running sibling at each level", () => {
    const tracker = createJobTracker();
    const root = tracker.start("root");
    tracker.start("first-child", root);
    const second = tracker.start("second-child", root);

    expect(tracker.runningChain().map((j) => j.id)).toEqual([root, second]);
  });

  // subscribe

  test("subscribe fires on start, report, end, and clear", () => {
    const tracker = createJobTracker();
    const cb = vi.fn();
    tracker.subscribe(cb);

    const id = tracker.start("a");
    tracker.report(id, { message: "x" });
    tracker.end(id, { status: "completed", value: undefined });
    tracker.clear();

    expect(cb).toHaveBeenCalledTimes(4);
  });

  test("unsubscribe stops further notifications", () => {
    const tracker = createJobTracker();
    const cb = vi.fn();
    const unsub = tracker.subscribe(cb);

    tracker.start("a");
    unsub();
    tracker.start("b");

    expect(cb).toHaveBeenCalledTimes(1);
  });

  // clear

  test("clear removes every job", () => {
    const tracker = createJobTracker();
    tracker.start("a");
    tracker.start("b");
    tracker.clear();

    expect(tracker.all()).toEqual([]);
    expect(tracker.roots()).toEqual([]);
  });
});
