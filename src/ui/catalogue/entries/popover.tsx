import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Button } from "~/ui/primitives/button";
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
            trigger={<Button onClick={() => setA(!a())}>Bottom</Button>}
            onChange={setA}
          >
            <p>Anchored below.</p>
          </Popover>
          <Popover
            open={b()}
            side="top"
            aria-label="top popover"
            trigger={<Button onClick={() => setB(!b())}>Top</Button>}
            onChange={setB}
          >
            <p>Anchored above.</p>
          </Popover>
          <Popover
            open={c()}
            side="left"
            aria-label="left popover"
            trigger={<Button onClick={() => setC(!c())}>Left</Button>}
            onChange={setC}
          >
            <p>Anchored left.</p>
          </Popover>
          <Popover
            open={d()}
            side="right"
            aria-label="right popover"
            trigger={<Button onClick={() => setD(!d())}>Right</Button>}
            onChange={setD}
          >
            <p>Anchored right.</p>
          </Popover>
        </div>
      </section>
    );
  },
});
