import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { IconButton } from "~/ui/primitives/icon-button";
import { Tooltip } from "~/ui/primitives/tooltip";

registerCatalogueEntry({
  id: "tooltip",
  label: "tooltip",
  render: () => (
    <section>
      <h2>tooltip</h2>
      <p>Text-only hover/focus hint. 500ms hover-open delay, 150ms close delay.</p>

      <div
        style={{ display: "flex", gap: "0.6rem", "align-items": "center", "margin-block": "1rem" }}
      >
        {/* one tooltip per placement so the four sides are easy to inspect. */}
        <Tooltip label="Play" placement="top">
          <IconButton aria-label="Play">▶</IconButton>
        </Tooltip>
        <Tooltip label="Mute" placement="bottom" showArrow>
          <IconButton aria-label="Mute">♪</IconButton>
        </Tooltip>
        <Tooltip label="Record" placement="right">
          <IconButton aria-label="Record">●</IconButton>
        </Tooltip>
        <Tooltip label="Stop" placement="left">
          <IconButton aria-label="Stop">■</IconButton>
        </Tooltip>

        {/* disabled — wrapper renders the child verbatim with no surface or aria injection. */}
        <Tooltip label="Tooltip suppressed via disabled" disabled>
          <IconButton aria-label="suppressed">?</IconButton>
        </Tooltip>
      </div>

      <p style={{ "font-size": "0.78rem", color: "var(--text2)" }}>
        Icon-only triggers always benefit from a visible hint — the icon alone isn't intuitive.
        Kobalte wires the tooltip via <code>aria-describedby</code> so it complements the button's{" "}
        <code>aria-label</code> rather than replacing it. Don't use tooltips on text triggers whose
        label already matches the tooltip text. Shortcut hints (e.g. "Toggle play (Space)") will
        appear once the hotkey primitive lands in Phase 9 — until then there's no real binding to
        read.
      </p>
    </section>
  ),
});
