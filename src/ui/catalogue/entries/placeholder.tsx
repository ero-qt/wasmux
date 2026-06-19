import { registerCatalogueEntry } from "~/ui/catalogue/registry";

registerCatalogueEntry({
  id: "placeholder",
  label: "placeholder",
  render: () => (
    <section>
      <h2>placeholder</h2>
      <p>Catalogue is live. Primitives will land here.</p>
    </section>
  ),
});
