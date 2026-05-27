import { createSignal } from "solid-js";

/**
 * Toggleable grid zones in the app shell. Header and status bar are chrome
 * and live outside this enum because they don't make sense to hide.
 */
export type ZoneId = "bin" | "program" | "inspector" | "timeline";

/** Canonical order; views menus and visibility helpers iterate this. */
export const ALL_ZONES: readonly ZoneId[] = ["bin", "program", "inspector", "timeline"];

/**
 * Backing signal stores *hidden* zones (not visible) so the default is "all
 * visible" without seeding every id on init.
 */
const [hidden, setHidden] = createSignal<ReadonlySet<ZoneId>>(new Set());

/** Reactive accessor: `true` when the zone is currently shown in the grid. */
export function isZoneVisible(id: ZoneId): boolean {
  return !hidden().has(id);
}

/** Snapshot of every currently-visible zone, in canonical order. */
export function visibleZones(): readonly ZoneId[] {
  return ALL_ZONES.filter(isZoneVisible);
}

/** Marks a zone visible. No-op if already visible. */
export function showZone(id: ZoneId): void {
  setHidden((prev) => {
    if (!prev.has(id)) {
      return prev;
    }
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
}

/** Marks a zone hidden. No-op if already hidden. */
export function hideZone(id: ZoneId): void {
  setHidden((prev) => {
    if (prev.has(id)) {
      return prev;
    }
    const next = new Set(prev);
    next.add(id);
    return next;
  });
}

/** Flips a zone's visibility. */
export function toggleZone(id: ZoneId): void {
  if (isZoneVisible(id)) {
    hideZone(id);
  } else {
    showZone(id);
  }
}

/** Restores every zone to visible. Useful for test cleanup. */
export function showAllZones(): void {
  setHidden(new Set<ZoneId>());
}
