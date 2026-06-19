import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Slider } from "~/ui/primitives/slider";

registerCatalogueEntry({
  id: "slider",
  label: "slider",
  render: () => {
    const [scale, setScale] = createSignal(100);
    const [exposure, setExposure] = createSignal(0);
    const [temp, setTemp] = createSignal(0);

    return (
      <section>
        <h2>slider</h2>
        <p>Linear, bipolar, and custom-track variants. Keyboard + pointer drag.</p>
        <div style={{ display: "flex", "flex-direction": "column", gap: "0.6rem" }}>
          <Slider
            label="Scale"
            value={scale()}
            min={10}
            max={300}
            valueLabel={(v) => `${v}%`}
            onChange={setScale}
          />
          <Slider
            label="Exposure"
            value={exposure()}
            min={-100}
            max={100}
            bipolar
            valueLabel={(v) => (v > 0 ? `+${v}` : String(v))}
            onChange={setExposure}
          />
          <Slider
            label="Temp"
            value={temp()}
            min={-100}
            max={100}
            trackBackground="linear-gradient(90deg, oklch(0.7 0.12 250), oklch(0.95 0 0), oklch(0.78 0.12 70))"
            valueLabel={(v) => (v > 0 ? `+${v}` : String(v))}
            onChange={setTemp}
          />
          <Slider label="Disabled" value={50} min={0} max={100} disabled onChange={() => {}} />
        </div>
      </section>
    );
  },
});
