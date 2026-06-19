import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { SwatchRow } from "~/ui/primitives/swatch";

type Bg = "black" | "white" | "checker" | "accent";
type Accent = "violet" | "blue" | "green" | "amber" | "red";

const BG: ReadonlyArray<{ value: Bg; color: string; label: string }> = [
  { value: "black", color: "#000000", label: "Black" },
  { value: "white", color: "#ffffff", label: "White" },
  { value: "checker", color: "checker", label: "Transparent" },
  { value: "accent", color: "var(--accent)", label: "Accent" },
];

const ACCENTS: ReadonlyArray<{ value: Accent; color: string; label: string }> = [
  { value: "violet", color: "oklch(0.72 0.15 300)", label: "Violet" },
  { value: "blue", color: "oklch(0.70 0.15 250)", label: "Blue" },
  { value: "green", color: "oklch(0.72 0.14 158)", label: "Green" },
  { value: "amber", color: "oklch(0.75 0.13 70)", label: "Amber" },
  { value: "red", color: "oklch(0.70 0.16 12)", label: "Red" },
];

registerCatalogueEntry({
  id: "swatch",
  label: "swatch / swatch-row",
  render: () => {
    const [bg, setBg] = createSignal<Bg>("checker");
    const [accent, setAccent] = createSignal<Accent>("violet");

    return (
      <section>
        <h2>swatch / swatch-row</h2>
        <p>Color tile. Optional radio-style group. Special `checker` tone for transparency.</p>

        <h3 style={{ "font-size": "0.86rem", "margin-block": "1rem 0.4rem" }}>background</h3>
        <SwatchRow value={bg()} options={BG} aria-label="background" onChange={setBg} />

        <h3 style={{ "font-size": "0.86rem", "margin-block": "1rem 0.4rem" }}>accent presets</h3>
        <SwatchRow value={accent()} options={ACCENTS} aria-label="accent" onChange={setAccent} />
      </section>
    );
  },
});
