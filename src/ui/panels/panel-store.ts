import { createSignal } from "solid-js";

/**
 * Tracks which floating panels are currently open. Module-level so any
 * component (header buttons, status-bar widgets, hotkeys) can toggle
 * without threading context. Persistence is intentionally absent for now;
 * comes back when there's a settings store on disk.
 */
const [openIds, setOpenIds] = createSignal<ReadonlySet<string>>(new Set());

/** Reactive accessor: `true` while the panel with `id` is open. */
export function isPanelOpen(id: string): boolean {
  return openIds().has(id);
}

/** Returns a snapshot of every currently-open panel id. */
export function openPanels(): readonly string[] {
  return [...openIds()];
}

/** Marks a panel open. No-op if already open. */
export function openPanel(id: string): void {
  setOpenIds((prev) => {
    if (prev.has(id)) {
      return prev;
    }
    const next = new Set(prev);
    next.add(id);
    return next;
  });
}

/** Marks a panel closed. No-op if already closed. */
export function closePanel(id: string): void {
  setOpenIds((prev) => {
    if (!prev.has(id)) {
      return prev;
    }
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
}

/** Flips a panel's open state. */
export function togglePanel(id: string): void {
  if (isPanelOpen(id)) {
    closePanel(id);
  } else {
    openPanel(id);
  }
}

/** Closes every open panel. */
export function closeAllPanels(): void {
  setOpenIds(new Set<string>());
}
