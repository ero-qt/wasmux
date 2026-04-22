import type { Component } from "solid-js";
import { createHotkeyRegistry } from "~/core/hotkeys";
import { center } from "~/styles/layout.css";
import { tokens } from "~/styles/tokens.css";
import { mountHotkeys } from "~/ui/mount-hotkeys";

const hotkeys = createHotkeyRegistry();

export const App: Component = () => {
  mountHotkeys(hotkeys);

  return (
    <main class={center}>
      <div>
        <h1 style={{ color: tokens.theme.accent }}>wasmux</h1>
      </div>
    </main>
  );
};
