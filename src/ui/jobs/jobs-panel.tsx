import { type Component, For, Show, createSignal } from "solid-js";
import type { TrackedJob } from "~/core/jobs";
import { t } from "~/i18n";
import {
  jobChildren,
  jobNode,
  jobNodeHeader,
  jobReportLine,
  jobStatusBadge,
  jobToggle,
  jobsEmpty,
  jobsTreeRoot,
} from "~/styles/jobs.css";
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
      <div class={jobNodeHeader}>
        <Show when={hasChildren()} fallback={<span class={jobToggle} aria-hidden="true" />}>
          <button
            type="button"
            class={jobToggle}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded()}
            aria-label={expanded() ? t("jobs.collapse") : t("jobs.expand")}
          >
            {expanded() ? "▾" : "▸"}
          </button>
        </Show>
        <span>{props.job.name}</span>
        <span class={jobStatusBadge}>{props.job.status}</span>
        <Show when={props.job.latestReport}>
          {(r) => (
            <span class={jobReportLine}>
              <Show when={r().progress !== undefined}>
                {Math.round((r().progress ?? 0) * 100)}%
              </Show>
              <Show when={r().message}>{` ${r().message}`}</Show>
            </span>
          )}
        </Show>
      </div>
      <Show when={hasChildren() && expanded()}>
        <ol class={jobChildren}>
          <For each={children()}>{(child) => <JobNode job={child} />}</For>
        </ol>
      </Show>
    </li>
  );
};
