import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Select } from "~/ui/primitives/select";

type Blend = "normal" | "multiply" | "screen" | "overlay" | "add" | "difference";

const BLENDS: ReadonlyArray<{ value: Blend; label: string }> = [
  { value: "normal", label: "Normal" },
  { value: "multiply", label: "Multiply" },
  { value: "screen", label: "Screen" },
  { value: "overlay", label: "Overlay" },
  { value: "add", label: "Add" },
  { value: "difference", label: "Difference" },
];

type Fps = "24" | "25" | "30" | "50" | "60";

const FPS: ReadonlyArray<{ value: Fps; label: string }> = [
  { value: "24", label: "24" },
  { value: "25", label: "25" },
  { value: "30", label: "30" },
  { value: "50", label: "50" },
  { value: "60", label: "60" },
];

registerCatalogueEntry({
  id: "select",
  label: "select",
  render: () => {
    const [blend, setBlend] = createSignal<Blend>("normal");
    const [fps, setFps] = createSignal<Fps>("30");

    return (
      <section>
        <h2>select</h2>
        <p>Styled native select. Generic over string-literal option values.</p>
        <div style={{ display: "flex", "flex-direction": "column", gap: "0.4rem" }}>
          <Select label="Blend" value={blend()} options={BLENDS} onChange={setBlend} />
          <Select label="Frame rate" value={fps()} options={FPS} onChange={setFps} />
          <Select label="Disabled" value="30" options={FPS} disabled onChange={() => {}} />
        </div>
      </section>
    );
  },
});
