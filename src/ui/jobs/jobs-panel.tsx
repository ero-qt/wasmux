import { type Component, For, Show, createSignal } from "solid-js";
import type { TrackedJob } from "~/core/jobs";
import { t } from "~/i18n";
import {
  jobChildren,
  jobNode,
  jobReportLine,
  jobRow,
  jobStatusBadge,
  jobToggleIcon,
  jobToggleSlot,
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
      <Show
        when={hasChildren()}
        fallback={
          <div class={jobRow}>
            <span class={jobToggleSlot} aria-hidden="true" />
            <NodeContent job={props.job} />
          </div>
        }
      >
        <button
          type="button"
          class={jobRow}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded()}
          aria-label={expanded() ? t("jobs.collapse") : t("jobs.expand")}
        >
          <span class={jobToggleSlot}>
            <svg
              class={jobToggleIcon}
              viewBox="0 0 12 12"
              width="0.7em"
              height="0.7em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4 2.5 L9 6 L4 9.5 Z" />
            </svg>
          </span>
          <NodeContent job={props.job} />
        </button>
      </Show>
      <Show when={hasChildren() && expanded()}>
        <ol class={jobChildren}>
          <For each={children()}>{(child) => <JobNode job={child} />}</For>
        </ol>
      </Show>
    </li>
  );
};

/** The text columns of a row: name, status badge, latest report progress/message. */
const NodeContent: Component<{ job: TrackedJob }> = (props) => {
  return (
    <>
      <span>{props.job.name}</span>
      <span class={jobStatusBadge}>{props.job.status}</span>
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
