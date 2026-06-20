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
        {/* asLabel — tooltip text matches the trigger's aria-label so AT users don't get a double-announcement. */}
        <Tooltip label="Play" placement="top" asLabel>
          <IconButton aria-label="Play">▶</IconButton>
        </Tooltip>
        <Tooltip label="Mute" placement="bottom" showArrow asLabel>
          <IconButton aria-label="Mute">♪</IconButton>
        </Tooltip>
        <Tooltip label="Record" placement="right" asLabel>
          <IconButton aria-label="Record">●</IconButton>
        </Tooltip>

        {/* Non-asLabel — tooltip adds genuinely new info (a shortcut hint) on top of the button's existing name. */}
        <Tooltip label="Toggle play (Space)" placement="bottom">
          <IconButton aria-label="play-pause">⏯</IconButton>
        </Tooltip>

        {/* Disabled — wrapper renders the child verbatim with no surface or aria injection. */}
        <Tooltip label="Tooltip suppressed via disabled" disabled>
          <IconButton aria-label="suppressed">?</IconButton>
        </Tooltip>
      </div>

      <p style={{ "font-size": "0.78rem", color: "var(--text2)" }}>
        <strong>asLabel</strong> mode (first three) skips the surface and applies the label as
        aria-label on the trigger — use when the tooltip duplicates the button's name. The fourth
        case demonstrates a tooltip that adds new info (a keyboard shortcut) and so keeps a separate
        visible aria-label. The fifth shows <code>disabled</code> suppression.
      </p>
    </section>
  ),
});
