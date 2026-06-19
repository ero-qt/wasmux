import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Popover } from "~/ui/primitives/popover";

registerCatalogueEntry({
  id: "popover",
  label: "popover",
  render: () => {
    const [a, setA] = createSignal(false);
    const [b, setB] = createSignal(false);
    const [c, setC] = createSignal(false);
    const [d, setD] = createSignal(false);

    return (
      <section>
        <h2>popover</h2>
        <p>Non-modal floating surface anchored to a trigger. Four sides.</p>

        <div
          style={{ display: "flex", gap: "0.6rem", "flex-wrap": "wrap", "margin-block": "1rem" }}
        >
          <Popover
            open={a()}
            side="bottom"
            aria-label="bottom popover"
            trigger="bottom ▾"
            onChange={setA}
          >
            <p>Anchored below.</p>
          </Popover>
          <Popover open={b()} side="top" aria-label="top popover" trigger="top ▴" onChange={setB}>
            <p>Anchored above.</p>
          </Popover>
          <Popover
            open={c()}
            side="left"
            aria-label="left popover"
            trigger="left ◂"
            onChange={setC}
          >
            <p>Anchored left.</p>
          </Popover>
          <Popover
            open={d()}
            side="right"
            aria-label="right popover"
            trigger="right ▸"
            onChange={setD}
          >
            <p>Anchored right.</p>
          </Popover>
        </div>
      </section>
    );
  },
});
