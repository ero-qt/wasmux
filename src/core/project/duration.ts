import type { Clip, Project } from "~/core/project/types";
import { type RationalTime, ZERO, add, gt } from "~/core/time/rational-time";

/**
 * How long the clip occupies on the project timeline. Video/audio
 * use the trimmed source segment; images use their `duration`.
 */
export function clipDuration(c: Clip): RationalTime {
  return c.kind === "image" ? c.duration : c.sourceDuration;
}

/** Exclusive end of a clip on the project timeline. */
export function clipEndTime(c: Clip): RationalTime {
  return add(c.startTime, clipDuration(c));
}

/** Latest clip end across all tracks. */
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
