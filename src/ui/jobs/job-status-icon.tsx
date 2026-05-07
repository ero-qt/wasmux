import { type Component, Match, Switch } from "solid-js";
import type { JobStatus } from "~/core/jobs";
import { t } from "~/i18n";
import {
  jobStatusCancelled,
  jobStatusCompleted,
  jobStatusFailed,
  jobStatusIcon,
  jobStatusRunning,
} from "~/styles/jobs.css";

const statusClass: Record<JobStatus, string> = {
  running: jobStatusRunning,
  completed: jobStatusCompleted,
  failed: jobStatusFailed,
  cancelled: jobStatusCancelled,
};

const statusLabel = (status: JobStatus): string => {
  switch (status) {
    case "running":
      return t("jobs.status.running");
    case "completed":
      return t("jobs.status.completed");
    case "failed":
      return t("jobs.status.failed");
    case "cancelled":
      return t("jobs.status.cancelled");
  }
};

/**
 * Compact glyph that conveys job status without taking up a text column.
 * Filled circle for running, check for completed, ✕ for failed, dash for
 * cancelled. The accessible name comes from the catalog, so screen readers
 * announce "Running" / "Completed" etc. instead of the SVG.
 */
export const JobStatusIcon: Component<{ status: JobStatus }> = (props) => {
  return (
    <span
      class={`${jobStatusIcon} ${statusClass[props.status]}`}
      role="img"
      aria-label={statusLabel(props.status)}
    >
      <Switch>
        <Match when={props.status === "running"}>
          <svg viewBox="0 0 12 12" width="0.85em" height="0.85em" aria-hidden="true">
            <circle cx="6" cy="6" r="3" fill="currentColor" />
          </svg>
        </Match>
        <Match when={props.status === "completed"}>
          <svg
            viewBox="0 0 12 12"
            width="0.85em"
            height="0.85em"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M2.5 6.2 L5 8.5 L9.5 3.7" />
          </svg>
        </Match>
        <Match when={props.status === "failed"}>
          <svg
            viewBox="0 0 12 12"
            width="0.85em"
            height="0.85em"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M3 3 L9 9 M9 3 L3 9" />
          </svg>
        </Match>
        <Match when={props.status === "cancelled"}>
          <svg
            viewBox="0 0 12 12"
            width="0.85em"
            height="0.85em"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M3 6 L9 6" />
          </svg>
        </Match>
      </Switch>
    </span>
  );
};
