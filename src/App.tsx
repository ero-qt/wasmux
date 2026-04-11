import type { Component } from "solid-js";
import { center } from "~/styles/layout.css";
import { tokens } from "~/styles/tokens.css";

export const App: Component = () => (
  <main class={center}>
    <span style={{ color: tokens.color.accent }}>wasmux</span>
  </main>
);
