import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Textarea } from "~/ui/primitives/textarea";

registerCatalogueEntry({
  id: "textarea",
  label: "textarea",
  render: () => {
    const [body, setBody] = createSignal("Drop your title copy here.");
    const [caption, setCaption] = createSignal("");
    const [notes] = createSignal("Locked notes.");
    const [short, setShort] = createSignal("");
    const [bad, setBad] = createSignal("oop");

    return (
      <section>
        <h2>textarea</h2>
        <p>Multi-line. Auto-grows via field-sizing: content. IME-safe.</p>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "0.6rem",
            "max-inline-size": "32rem",
          }}
        >
          <Textarea
            label="Text clip body"
            value={body()}
            onChange={setBody}
            minRows={3}
            maxRows={8}
          />
          <Textarea
            label="Caption"
            value={caption()}
            placeholder="Describe this clip…"
            onChange={setCaption}
            minRows={2}
            maxRows={6}
            description="Visible during playback"
          />
          <Textarea label="Read-only notes" value={notes()} readOnly onChange={() => {}} />
          <Textarea
            label="Fixed height"
            value={short()}
            onChange={setShort}
            autoGrow={false}
            minRows={4}
          />
          <Textarea
            label="Invalid (min 4 chars)"
            value={bad()}
            onChange={setBad}
            invalid={bad().length < 4}
            minRows={2}
            {...(bad().length < 4 ? { description: "Minimum 4 characters required" } : {})}
          />
        </div>
      </section>
    );
  },
});
