import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Button } from "~/ui/primitives/button";

registerCatalogueEntry({
  id: "button",
  label: "button",
  render: () => (
    <section>
      <h2>button</h2>
      <p>Variants: accent / danger / ghost / icon. States: rest, hover, focus-visible, disabled.</p>
      <div style={{ display: "flex", gap: "0.6rem", "flex-wrap": "wrap" }}>
        <Button>accent</Button>
        <Button variant="danger">delete</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="icon" aria-label="icon">
          ▦
        </Button>
        <Button disabled>disabled</Button>
        <Button variant="ghost" disabled>
          disabled ghost
        </Button>
      </div>
    </section>
  ),
});
