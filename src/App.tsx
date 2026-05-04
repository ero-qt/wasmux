import type { Component } from "solid-js";
import { createHotkeyRegistry } from "~/core/hotkeys";
import { AppShell } from "~/ui/layout/app-shell";
import { mountHotkeys } from "~/ui/mount-hotkeys";

const hotkeys = createHotkeyRegistry();

export const App: Component = () => {
  mountHotkeys(hotkeys);

  return <AppShell registry={hotkeys} />;
};
