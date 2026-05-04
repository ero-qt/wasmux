import type { JobReport, JobStatus } from "~/core/jobs/types";

/** Snapshot of a single tracked job. Read-only from the consumer side. */
export interface TrackedJob {
  readonly id: string;
  readonly name: string;

  /** `null` for top-level jobs; the parent's id when nested. */
  readonly parentId: string | null;

  readonly startedAt: number;

  /** `null` while the job is still running. */
  readonly endedAt: number | null;

  readonly status: JobStatus;

  /** Most recently yielded report; `null` until the first yield arrives. */
  readonly latestReport: JobReport | null;

  /** Every report yielded so far, oldest first. */
  readonly reports: readonly JobReport[];

  /** Set when `status === "completed"`. */
  readonly value: unknown;

  /** Set when `status === "failed"`. */
  readonly error: unknown;
}

/** Outcome union passed to {@link JobTracker.end}. */
export type EndOutcome =
  | { readonly status: "completed"; readonly value: unknown }
  | { readonly status: "failed"; readonly error: unknown }
  | { readonly status: "cancelled" };

/**
 * Live tree of jobs tracked over the current session. Pure: no Solid imports;
 * UI wraps this in a reactive store so re-renders happen on `subscribe`.
 */
export interface JobTracker {
  /**
   * Records a newly started job and returns the id assigned to it. Pass
   * `parentId` when the job is spawned by another tracked job.
   */
  start(name: string, parentId?: string | null): string;

  /** Appends a report to a running job and updates its latest snapshot. */
  report(id: string, report: JobReport): void;

  /** Transitions a job to a terminal status and stamps `endedAt`. */
  end(id: string, outcome: EndOutcome): void;

  /** Snapshot of every tracked job in start order. */
  all(): readonly TrackedJob[];

  /** Snapshot of top-level jobs (`parentId === null`) in start order. */
  roots(): readonly TrackedJob[];

  /** Direct children of `id`, in start order. */
  children(id: string): readonly TrackedJob[];

  /** Single job by id, or `undefined` when unknown. */
  get(id: string): TrackedJob | undefined;

  /**
   * Returns the chain from the deepest currently-running leaf back to its
   * root, leaf-last. Empty when nothing is running. Useful for status-bar
   * "Render › Encode › Frame 42/100" displays.
   */
  runningChain(): readonly TrackedJob[];

  /** Subscribes to any mutation. Returns an unsubscribe fn. */
  subscribe(callback: () => void): () => void;

  /** Drops every tracked job. Subscribers fire once. */
  clear(): void;
}

/** Generates a unique job id. Falls back to a counter when `crypto.randomUUID` is missing. */
function makeIdGenerator(): () => string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return () => crypto.randomUUID();
  }

  let seq = 0;
  return () => `job-${++seq}`;
}

/** Creates an empty tracker. One per app session is the common case. */
export function createJobTracker(): JobTracker {
  const nextId = makeIdGenerator();
  const order: string[] = [];
  const byId = new Map<string, TrackedJob>();
  const subscribers = new Set<() => void>();

  const notify = (): void => {
    for (const cb of subscribers) {
      cb();
    }
  };

  const replace = (id: string, patch: Partial<TrackedJob>): void => {
    const existing = byId.get(id);
    if (!existing) {
      return;
    }
    byId.set(id, { ...existing, ...patch });
  };

  return {
    start(name, parentId) {
      const id = nextId();
      const job: TrackedJob = {
        id,
        name,
        parentId: parentId ?? null,
        startedAt: performance.now(),
        endedAt: null,
        status: "running",
        latestReport: null,
        reports: [],
        value: undefined,
        error: undefined,
      };
      byId.set(id, job);
      order.push(id);
      notify();
      return id;
    },

    report(id, report) {
      const existing = byId.get(id);
      if (!existing || existing.status !== "running") {
        return;
      }
      replace(id, {
        latestReport: report,
        reports: [...existing.reports, report],
      });
      notify();
    },

    end(id, outcome) {
      const existing = byId.get(id);
      if (!existing || existing.status !== "running") {
        return;
      }
      replace(id, {
        endedAt: performance.now(),
        status: outcome.status,
        ...(outcome.status === "completed" ? { value: outcome.value } : {}),
        ...(outcome.status === "failed" ? { error: outcome.error } : {}),
      });
      notify();
    },

    all() {
      return order.map((id) => byId.get(id)) as TrackedJob[];
    },

    roots() {
      return order
        .map((id) => byId.get(id))
        .filter((j): j is TrackedJob => j !== undefined && j.parentId === null);
    },

    children(parentId) {
      return order
        .map((id) => byId.get(id))
        .filter((j): j is TrackedJob => j !== undefined && j.parentId === parentId);
    },

    get(id) {
      return byId.get(id);
    },

    runningChain() {
      // walk roots → deepest running child, picking the most recently started
      // running child at each level so the chain reflects the live leaf.
      const isRunning = (j: TrackedJob): boolean => j.status === "running";
      const runningRoots = order
        .map((id) => byId.get(id))
        .filter((j): j is TrackedJob => j !== undefined && j.parentId === null && isRunning(j));

      const root = runningRoots[runningRoots.length - 1];
      if (!root) {
        return [];
      }

      const chain: TrackedJob[] = [root];
      let current = root;

      // step down through running children until none remain.
      while (true) {
        const runningChildren = order
          .map((id) => byId.get(id))
          .filter(
            (j): j is TrackedJob => j !== undefined && j.parentId === current.id && isRunning(j),
          );
        const next = runningChildren[runningChildren.length - 1];
        if (!next) {
          break;
        }
        chain.push(next);
        current = next;
      }

      return chain;
    },

    subscribe(callback) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    clear() {
      order.length = 0;
      byId.clear();
      notify();
    },
  };
}
