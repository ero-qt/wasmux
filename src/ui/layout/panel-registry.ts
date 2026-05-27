import type { Component } from "solid-js";

/** Static metadata for a panel that can be hosted by the layout. */
export interface PanelDefinition {
  readonly id: string;
  /** i18n catalog key for the visible title (e.g. "panel.jobs.title"). */
  readonly titleKey: string;
  readonly Component: Component;
  /** Initial leaf id this panel lives in on first boot. */
  readonly defaultCellId: string;
}

const definitions = new Map<string, PanelDefinition>();

/**
 * Adds a panel to the global registry. Each id may only be registered once;
 * a duplicate registration throws so collisions surface at module-load time.
 */
export function registerPanel(def: PanelDefinition): void {
  if (definitions.has(def.id)) {
    throw new Error(`panel "${def.id}" already registered`);
  }
  definitions.set(def.id, def);
}

/** Reads a panel definition. Returns `undefined` when the id is unknown. */
export function getPanel(id: string): PanelDefinition | undefined {
  return definitions.get(id);
}

/** Every registered panel, in insertion order. */
export function allPanels(): readonly PanelDefinition[] {
  return [...definitions.values()];
}

/** Test-only: drops every registration so each test starts clean. */
export function clearPanelRegistry(): void {
  definitions.clear();
}
