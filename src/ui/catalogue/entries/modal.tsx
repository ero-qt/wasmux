import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Button } from "~/ui/primitives/button";
import { Modal } from "~/ui/primitives/modal";

registerCatalogueEntry({
  id: "modal",
  label: "modal",
  render: () => {
    const [a, setA] = createSignal(false);
    const [b, setB] = createSignal(false);
    const [c, setC] = createSignal(false);

    return (
      <section>
        <h2>modal</h2>
        <p>Native &lt;dialog&gt; + showModal. Backdrop blur. Esc + backdrop dismiss.</p>
        <div style={{ display: "flex", gap: "0.5rem", "flex-wrap": "wrap" }}>
          <Button onClick={() => setA(true)}>Open small</Button>
          <Button onClick={() => setB(true)}>Open medium with description</Button>
          <Button onClick={() => setC(true)}>Open large; no backdrop dismiss</Button>
        </div>

        <Modal open={a()} size="sm" title="Discard changes?" onChange={setA}>
          <p>Your edits will be lost. This action cannot be undone.</p>
          <div
            style={{
              display: "flex",
              "justify-content": "end",
              gap: "0.4rem",
              "margin-top": "1rem",
            }}
          >
            <Button onClick={() => setA(false)}>Cancel</Button>
            <Button variant="accent" onClick={() => setA(false)}>
              Discard
            </Button>
          </div>
        </Modal>

        <Modal
          open={b()}
          size="md"
          title="Settings"
          description="Configure render and playback defaults"
          onChange={setB}
        >
          <p>Modal body content. Press Esc, click the backdrop, or use the close button.</p>
        </Modal>

        <Modal open={c()} size="lg" title="Export" dismissOnBackdrop={false} onChange={setC}>
          <p>Export is mid-flight; backdrop is sticky. Esc still closes.</p>
          <div style={{ display: "flex", "justify-content": "end", "margin-top": "1rem" }}>
            <Button onClick={() => setC(false)}>Done</Button>
          </div>
        </Modal>
      </section>
    );
  },
});
