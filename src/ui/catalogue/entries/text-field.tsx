import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { TextField } from "~/ui/primitives/text-field";

registerCatalogueEntry({
  id: "text-field",
  label: "text-field",
  render: () => {
    const [name, setName] = createSignal("Untitled project");
    const [layer, setLayer] = createSignal("");
    const [readonly] = createSignal("locked.mp4");
    const [bad, setBad] = createSignal("ab");

    return (
      <section>
        <h2>text-field</h2>
        <p>Single-line text input. IME-safe. Mirrors NumberInput chrome.</p>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "0.4rem",
            "max-inline-size": "32rem",
          }}
        >
          <TextField label="Project" value={name()} onChange={setName} maxLength={64} />
          <TextField
            label="Layer"
            value={layer()}
            placeholder="Rename layer…"
            onChange={setLayer}
          />
          <TextField label="Asset" value={readonly()} readOnly onChange={() => {}} />
          <TextField label="Validated" value={bad()} invalid={bad().length < 3} onChange={setBad} />
          <TextField label="Disabled" value="—" disabled onChange={() => {}} />
        </div>
      </section>
    );
  },
});
