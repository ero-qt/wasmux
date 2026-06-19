import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Toggle } from "~/ui/primitives/toggle";

registerCatalogueEntry({
  id: "toggle",
  label: "toggle",
  render: () => {
    const [snap, setSnap] = createSignal(false);
    const [loop, setLoop] = createSignal(true);
    return (
      <section>
        <h2>toggle</h2>
        <p>Controlled. Same shell as IconButton + aria-pressed.</p>
        <div style={{ display: "flex", gap: "0.4rem", "flex-wrap": "wrap" }}>
          <Toggle aria-label="snap" pressed={snap()} onChange={setSnap}>
            ⌶
          </Toggle>
          <Toggle aria-label="loop" pressed={loop()} onChange={setLoop}>
            ↻
          </Toggle>
          <Toggle aria-label="disabled" pressed={false} disabled onChange={() => {}}>
            ✕
          </Toggle>
        </div>
      </section>
    );
  },
});
