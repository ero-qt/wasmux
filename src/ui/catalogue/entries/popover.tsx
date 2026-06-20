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
    const [e, setE] = createSignal(false);

    return (
      <section>
        <h2>popover</h2>
        <p>Non-modal floating surface anchored to a trigger. Four sides.</p>

        <div
          style={{ display: "flex", gap: "0.6rem", "flex-wrap": "wrap", "margin-block": "1rem" }}
        >
          <Popover
            open={a()}
            placement="bottom"
            aria-label="bottom popover"
            trigger="bottom ▾"
            onChange={setA}
          >
            <p>Anchored below.</p>
          </Popover>
          <Popover
            open={b()}
            placement="top"
            aria-label="top popover"
            trigger="top ▴"
            onChange={setB}
          >
            <p>Anchored above.</p>
          </Popover>
          <Popover
            open={c()}
            placement="left"
            aria-label="left popover"
            trigger="left ◂"
            onChange={setC}
          >
            <p>Anchored left.</p>
          </Popover>
          <Popover
            open={d()}
            placement="right"
            aria-label="right popover"
            trigger="right ▸"
            onChange={setD}
          >
            <p>Anchored right.</p>
          </Popover>
          <Popover
            open={e()}
            placement="bottom"
            showArrow
            aria-label="arrow popover"
            trigger="arrow ▾"
            onChange={setE}
          >
            <p>With arrow.</p>
          </Popover>
        </div>
      </section>
    );
  },
});
