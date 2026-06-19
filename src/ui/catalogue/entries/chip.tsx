import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Chip, ChipGroup } from "~/ui/primitives/chip";

type Res = "720p" | "1080p" | "4k" | "square" | "vertical";

const RES_OPTIONS: ReadonlyArray<{ value: Res; label: string }> = [
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
  { value: "4k", label: "4K" },
  { value: "square", label: "Square" },
  { value: "vertical", label: "Vertical" },
];

registerCatalogueEntry({
  id: "chip",
  label: "chip / chip-group",
  render: () => {
    const [res, setRes] = createSignal<Res>("1080p");
    const [solo, setSolo] = createSignal(false);

    return (
      <section>
        <h2>chip / chip-group</h2>
        <p>Standalone toggle chip, or radio-style group.</p>

        <h3 style={{ "font-size": "0.86rem", "margin-block": "1rem 0.4rem" }}>standalone</h3>
        <Chip pressed={solo()} aria-label="solo" onChange={setSolo}>
          solo
        </Chip>

        <h3 style={{ "font-size": "0.86rem", "margin-block": "1rem 0.4rem" }}>radio group</h3>
        <ChipGroup value={res()} options={RES_OPTIONS} aria-label="resolution" onChange={setRes} />
      </section>
    );
  },
});
