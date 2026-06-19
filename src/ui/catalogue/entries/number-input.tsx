import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { NumberInput } from "~/ui/primitives/number-input";

registerCatalogueEntry({
  id: "number-input",
  label: "number-input",
  render: () => {
    const [x, setX] = createSignal(0);
    const [width, setWidth] = createSignal(1920);

    return (
      <section>
        <h2>number-input</h2>
        <p>Tabular nums. Clamps on blur. Native spinbutton semantics.</p>
        <div style={{ display: "flex", "flex-direction": "column", gap: "0.4rem" }}>
          <NumberInput label="X" value={x()} onChange={setX} min={-9999} max={9999} />
          <NumberInput label="Width" value={width()} onChange={setWidth} min={1} max={7680} />
          <NumberInput label="Disabled" value={42} disabled onChange={() => {}} />
        </div>
      </section>
    );
  },
});
