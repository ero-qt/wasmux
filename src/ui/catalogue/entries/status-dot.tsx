import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { StatusDot } from "~/ui/primitives/status-dot";

registerCatalogueEntry({
  id: "status-dot",
  label: "status-dot",
  render: () => (
    <section>
      <h2>status-dot</h2>
      <p>Tones: neutral / accent / audio. Optional pulse (honours prefers-reduced-motion).</p>
      <div style={{ display: "flex", gap: "0.8rem", "align-items": "center" }}>
        <StatusDot />
        <StatusDot tone="accent" />
        <StatusDot tone="audio" pulse aria-label="running" />
      </div>
    </section>
  ),
});
