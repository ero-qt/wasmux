import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Keycap } from "~/ui/primitives/keycap";

registerCatalogueEntry({
  id: "keycap",
  label: "keycap",
  render: () => (
    <section>
      <h2>keycap</h2>
      <p>Display-only kbd badge for hotkey hints.</p>
      <div style={{ display: "flex", gap: "0.4rem", "align-items": "baseline" }}>
        <Keycap>⌘S</Keycap>
        <Keycap>⇧⌘Z</Keycap>
        <Keycap>Space</Keycap>
        <span>save · undo redo · play</span>
      </div>
    </section>
  ),
});
