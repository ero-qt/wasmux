import type { Clip, Project } from "~/core/project/types";
import { type RationalTime, ZERO, add, gt } from "~/core/time/rational-time";

/**
 * How long the clip occupies on the project timeline. For video and
 * audio this is the trimmed source segment; for images it is how long
 * the image is shown.
 */
export function clipDuration(c: Clip): RationalTime {
  return c.kind === "image" ? c.duration : c.sourceDuration;
}

/** The exclusive end time of a clip on the project timeline. */
export function clipEndTime(c: Clip): RationalTime {
  return add(c.startTime, clipDuration(c));
}

/**
 * The total duration of a {@link Project}, determined by the
 * latest-ending clip across all tracks.
 */
export function projectDuration(p: Project): RationalTime {
  let max = ZERO;

  for (const track of p.tracks) {
    const end = clipEndTime(track.item);

    if (gt(end, max)) {
      max = end;
    }
  }

  return max;
}
