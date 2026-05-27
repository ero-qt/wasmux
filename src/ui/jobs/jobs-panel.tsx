import { type Component, For, Show, createSignal } from "solid-js";
import type { TrackedJob } from "~/core/jobs";
import { t } from "~/i18n";
import {
  jobChildren,
  jobName,
  jobNode,
  jobReportLine,
  jobRow,
  jobToggleIcon,
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

  const toggle = (): void => {
    setExpanded((v) => !v);
  };

  // Skip toggle when the user is mid-text-selection — clicking inside an
  // active selection should not collapse the row out from under them.
  const onRowClick = (): void => {
    const sel = typeof window !== "undefined" ? window.getSelection() : null;
    if (sel && !sel.isCollapsed && sel.toString().length > 0) {
      return;
    }
    toggle();
  };

  const onRowKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  };

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
        {/* biome-ignore lint/a11y/useSemanticElements: a native <button> blocks drag-select in Chrome/Safari, and the user-facing requirement is that the job name stays selectable. role="button" + tabindex + keydown gives the same a11y semantics without that side effect. */}
        <div
          class={jobRow}
          role="button"
          tabIndex={0}
          aria-expanded={expanded()}
          onClick={onRowClick}
          onKeyDown={onRowKeyDown}
        >
          <span class={jobToggleSlot} aria-hidden="true">
            <span class={jobToggleIcon}>›</span>
          </span>
          <NodeContent job={props.job} />
        </div>
      </Show>
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
