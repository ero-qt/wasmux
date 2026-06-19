import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { SegmentedControl } from "~/ui/primitives/segmented-control";

type Theme = "auto" | "light" | "dark";
type InspTab = "clip" | "canvas";

const THEMES: ReadonlyArray<{ value: Theme; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const INSP: ReadonlyArray<{ value: InspTab; label: string }> = [
  { value: "clip", label: "Clip" },
  { value: "canvas", label: "Canvas" },
];

registerCatalogueEntry({
  id: "segmented-control",
  label: "segmented",
  render: () => {
    const [theme, setTheme] = createSignal<Theme>("auto");
    const [tab, setTab] = createSignal<InspTab>("clip");

    return (
      <section>
        <h2>segmented-control</h2>
        <p>Tab-strip enum picker. Arrow keys cycle, Home/End jump to ends.</p>
        <div style={{ display: "flex", "flex-direction": "column", gap: "0.6rem" }}>
          <SegmentedControl
            value={theme()}
            options={THEMES}
            aria-label="theme"
            onChange={setTheme}
          />
          <SegmentedControl
            value={tab()}
            options={INSP}
            aria-label="inspector tab"
            onChange={setTab}
          />
          <SegmentedControl
            value="clip"
            options={INSP}
            aria-label="disabled"
            disabled
            onChange={() => {}}
          />
        </div>
      </section>
    );
  },
});
