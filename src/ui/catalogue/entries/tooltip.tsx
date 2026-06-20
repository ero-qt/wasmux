import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { IconButton } from "~/ui/primitives/icon-button";
import { StatusDot } from "~/ui/primitives/status-dot";
import { Tooltip } from "~/ui/primitives/tooltip";

registerCatalogueEntry({
  id: "tooltip",
  label: "tooltip",
  render: () => (
    <section>
      <h2>tooltip</h2>
      <p>Text-only hover/focus hint. 500ms open delay, 150ms close delay.</p>

      <div
        style={{ display: "flex", gap: "0.6rem", "align-items": "center", "margin-block": "1rem" }}
      >
        <Tooltip label="Play / Pause" placement="top">
          <IconButton aria-label="play">▶</IconButton>
        </Tooltip>
        <Tooltip label="Mute" placement="bottom" showArrow>
          <IconButton aria-label="mute">♪</IconButton>
        </Tooltip>
        <Tooltip label="Recording" placement="right">
          <StatusDot tone="accent" pulse />
        </Tooltip>
        <Tooltip label="Disabled tooltip" disabled>
          <IconButton aria-label="disabled-tooltip">?</IconButton>
        </Tooltip>
      </div>

      <p style={{ "font-size": "0.78rem", color: "var(--text2)" }}>
        Hover or focus a control. asLabel-mode tooltips skip the surface and apply aria-label
        directly on the trigger — used when the tooltip duplicates the button's name.
      </p>
    </section>
  ),
});
