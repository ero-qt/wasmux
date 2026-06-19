import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { IconButton } from "~/ui/primitives/icon-button";

registerCatalogueEntry({
  id: "icon-button",
  label: "icon-button",
  render: () => (
    <section>
      <h2>icon-button</h2>
      <p>Square 1.75rem. `aria-label` required. `pressed` flips `aria-pressed`.</p>
      <div style={{ display: "flex", gap: "0.4rem", "flex-wrap": "wrap" }}>
        <IconButton aria-label="settings">⚙</IconButton>
        <IconButton aria-label="snap" pressed>
          ⌶
        </IconButton>
        <IconButton aria-label="disabled" disabled>
          ✕
        </IconButton>
      </div>
    </section>
  ),
});
