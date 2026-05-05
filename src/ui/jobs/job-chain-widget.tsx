import { type Component, Show } from "solid-js";
import type { TrackedJob } from "~/core/jobs";
import { jobChainSeparator, jobChainWidget } from "~/styles/jobs.css";
import { reactiveChain } from "~/ui/jobs/job-tracker";

/**
 * Status-bar widget that renders the deepest currently-running chain as
 * `Render › Encode › Frame 42%`. Collapses to nothing when no job is running
 * so the bar stays quiet.
 */
export const JobChainWidget: Component = () => {
  return (
    <Show when={reactiveChain().length > 0}>
      <span class={jobChainWidget}>
        {reactiveChain().map((job, idx) => (
          <>
            {idx > 0 && <span class={jobChainSeparator}>›</span>}
            <span>{formatLeg(job, idx === reactiveChain().length - 1)}</span>
          </>
        ))}
      </span>
    </Show>
  );
};

/** Renders one leg of the chain. The leaf carries the progress/message; ancestors are name-only. */
function formatLeg(job: TrackedJob, isLeaf: boolean): string {
  if (!isLeaf) {
    return job.name;
  }

  const r = job.latestReport;
  if (!r) {
    return job.name;
  }

  const parts: string[] = [job.name];
  if (r.progress !== undefined) {
    parts.push(`${Math.round(r.progress * 100)}%`);
  }
  if (r.message) {
    parts.push(r.message);
  }
  return parts.join(" ");
}
