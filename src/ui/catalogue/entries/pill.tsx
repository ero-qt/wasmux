import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Pill } from "~/ui/primitives/pill";

registerCatalogueEntry({
  id: "pill",
  label: "pill",
  render: () => (
    <section>
      <h2>pill</h2>
      <p>Tones: neutral / accent / audio. Optional leading dot.</p>
      <div style={{ display: "flex", gap: "0.6rem", "flex-wrap": "wrap" }}>
        <Pill>neutral</Pill>
        <Pill tone="accent">accent</Pill>
        <Pill tone="audio" dot>
          audio
        </Pill>
        <Pill dot>with dot</Pill>
      </div>
    </section>
  ),
});
