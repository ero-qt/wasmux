import { createSignal } from "solid-js";

/** Pixel delta from a panel's default corner position. `{ x: 0, y: 0 }` = unmoved. */
export interface PanelPosition {
  readonly x: number;
  readonly y: number;
}

const ORIGIN: PanelPosition = { x: 0, y: 0 };

/**
 * Tracks which floating panels are currently open. Module-level so any
 * component (header buttons, status-bar widgets, hotkeys) can toggle
 * without threading context. Persistence is intentionally absent for now;
 * comes back when there's a settings store on disk.
 */
const [openIds, setOpenIds] = createSignal<ReadonlySet<string>>(new Set());

/**
 * Drag offset from each panel's default corner. Keyed by panel id so position
 * survives close/reopen, since users expect a panel to stay where they put it.
 */
const [positions, setPositions] = createSignal<ReadonlyMap<string, PanelPosition>>(new Map());

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

/** Reactive accessor: the panel's current drag offset, or `{x:0, y:0}` when never moved. */
export function panelPosition(id: string): PanelPosition {
  return positions().get(id) ?? ORIGIN;
}

/** Stores `pos` as the panel's drag offset. */
export function setPanelPosition(id: string, pos: PanelPosition): void {
  setPositions((prev) => {
    const next = new Map(prev);
    next.set(id, pos);
    return next;
  });
}

/** Drops the panel's drag offset so it returns to its default corner. */
export function resetPanelPosition(id: string): void {
  setPositions((prev) => {
    if (!prev.has(id)) {
      return prev;
    }
    const next = new Map(prev);
    next.delete(id);
    return next;
  });
}

/** Drops every stored drag offset. Useful for test cleanup. */
export function resetAllPanelPositions(): void {
  setPositions(new Map<string, PanelPosition>());
}
