import { type Component, For, Show, createSignal } from "solid-js";
import type { TrackedJob } from "~/core/jobs";
import { t } from "~/i18n";
import {
  jobChildren,
  jobName,
  jobNode,
  jobReportLine,
  jobRow,
  jobToggleButton,
  jobToggleSlot,
  jobsEmpty,
  jobsTreeRoot,
} from "~/styles/jobs.css";
import { JobStatusIcon } from "~/ui/jobs/job-status-icon";
import { reactiveChildren, reactiveRoots } from "~/ui/jobs/job-tracker";

/** Tree of every job tracked this session. Oldest at the top, collapsible on children. */
export const JobsPanel: Component = () => {
  return (
    <Show when={reactiveRoots().length > 0} fallback={<p class={jobsEmpty}>{t("jobs.empty")}</p>}>
      <ol class={jobsTreeRoot}>
        <For each={reactiveRoots()}>{(job) => <JobNode job={job} />}</For>
      </ol>
    </Show>
  );
};

interface JobNodeProps {
  job: TrackedJob;
}

const JobNode: Component<JobNodeProps> = (props) => {
  const [expanded, setExpanded] = createSignal(true);
  const children = (): readonly TrackedJob[] => reactiveChildren(props.job.id);
  const hasChildren = (): boolean => children().length > 0;

  return (
    <li class={jobNode}>
      <div class={jobRow}>
        <Show when={hasChildren()} fallback={<span class={jobToggleSlot} aria-hidden="true" />}>
          <button
            type="button"
            class={jobToggleButton}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded()}
            aria-label={expanded() ? t("jobs.collapse") : t("jobs.expand")}
          >
            <span aria-hidden="true">{expanded() ? "v" : ">"}</span>
          </button>
        </Show>
        <NodeContent job={props.job} />
      </div>
      <Show when={hasChildren() && expanded()}>
        <ol class={jobChildren}>
          <For each={children()}>{(child) => <JobNode job={child} />}</For>
        </ol>
      </Show>
    </li>
  );
};

/** Status icon, name, and the latest progress/message on a single line. */
const NodeContent: Component<{ job: TrackedJob }> = (props) => {
  return (
    <>
      <JobStatusIcon status={props.job.status} />
      <span class={jobName}>{props.job.name}</span>
      <Show when={props.job.latestReport}>
        {(r) => (
          <span class={jobReportLine}>
            <Show when={r().progress !== undefined}>{Math.round((r().progress ?? 0) * 100)}%</Show>
            <Show when={r().message}>{` ${r().message}`}</Show>
          </span>
        )}
      </Show>
    </>
  );
};
