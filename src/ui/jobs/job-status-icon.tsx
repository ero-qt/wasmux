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
import { loadingFrame } from "~/ui/jobs/loading-frame";

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
 * Plain unicode — braille spinner while running, `✓` completed, `✕` failed,
 * `−` cancelled. The accessible name comes from the catalog so screen
 * readers announce "running" / "completed" etc. instead of the glyph.
 */
export const JobStatusIcon: Component<{ status: JobStatus }> = (props) => {
  return (
    <span
      class={`${jobStatusIcon} ${statusClass[props.status]}`}
      role="img"
      aria-label={statusLabel(props.status)}
    >
      <Switch>
        <Match when={props.status === "running"}>{loadingFrame()}</Match>
        <Match when={props.status === "completed"}>✓</Match>
        <Match when={props.status === "failed"}>✕</Match>
        <Match when={props.status === "cancelled"}>−</Match>
      </Switch>
    </span>
  );
};
