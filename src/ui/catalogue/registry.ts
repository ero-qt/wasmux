import type { JSX } from "solid-js";

/** A single primitive's catalogue entry — renders in the main panel when selected. */
export interface CatalogueEntry {
  /** Stable id; deduplicates entries (last write wins). */
  id: string;

  /** Human-readable label shown in the sidebar. */
  label: string;

  /** Returns the JSX for the entry's main-panel section. */
  render: () => JSX.Element;
}

const entries: CatalogueEntry[] = [];

/** Adds a catalogue entry. Idempotent on `id` — last write wins. */
export function registerCatalogueEntry(entry: CatalogueEntry): void {
  const index = entries.findIndex((e) => e.id === entry.id);
  if (index === -1) {
    entries.push(entry);
  } else {
    entries[index] = entry;
  }
}

/** Returns every registered catalogue entry in insertion order. */
export function catalogueEntries(): readonly CatalogueEntry[] {
  return entries;
}
