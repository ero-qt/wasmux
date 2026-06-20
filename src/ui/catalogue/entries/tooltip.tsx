import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Button } from "~/ui/primitives/button";
import { IconButton } from "~/ui/primitives/icon-button";
import { Tooltip } from "~/ui/primitives/tooltip";

registerCatalogueEntry({
  id: "tooltip",
  label: "tooltip",
  render: () => (
    <section>
      <h2>tooltip</h2>
      <p>
        Hover/focus hint composed of a <code>message</code> and/or a <code>hotkey</code>. 500ms
        hover-open delay, 150ms close delay. Phase 9 will wire real bindings; the key combinations
        below are visual hints only.
      </p>

      <h3>Icon triggers — message describes the icon</h3>
      <div
        style={{ display: "flex", gap: "0.6rem", "align-items": "center", "margin-block": "1rem" }}
      >
        <Tooltip message="Play" placement="top">
          <IconButton aria-label="Play">▶</IconButton>
        </Tooltip>
        <Tooltip message="Mute" placement="bottom" showArrow>
          <IconButton aria-label="Mute">♪</IconButton>
        </Tooltip>
        <Tooltip message="Record" placement="right">
          <IconButton aria-label="Record">●</IconButton>
        </Tooltip>
        <Tooltip message="Stop" placement="left">
          <IconButton aria-label="Stop">■</IconButton>
        </Tooltip>
      </div>

      <h3>Text triggers — redundant message is auto-suppressed</h3>
      <p>
        Hover the buttons below. Nothing appears: the message matches the trigger's own text, so the
        primitive skips the surface entirely.
      </p>
      <div
        style={{ display: "flex", gap: "0.6rem", "align-items": "center", "margin-block": "1rem" }}
      >
        <Tooltip message="Save">
          <Button>Save</Button>
        </Tooltip>
        <Tooltip message="Cancel">
          <Button variant="ghost">Cancel</Button>
        </Tooltip>
        <Tooltip message="Delete">
          <Button variant="danger">Delete</Button>
        </Tooltip>
      </div>

      <h3>With key combinations</h3>
      <p>
        When the message is redundant but a <code>hotkey</code> is provided, only the key
        combination is shown — no parens, no restated label. Differing messages render side by side
        with the Keycap.
      </p>
      <div
        style={{ display: "flex", gap: "0.6rem", "align-items": "center", "margin-block": "1rem" }}
      >
        {/* redundant message + hotkey → shows only the Keycap. */}
        <Tooltip message="Save" hotkey="Ctrl+S">
          <Button>Save</Button>
        </Tooltip>
        {/* icon trigger + message + hotkey → message and Keycap both render. */}
        <Tooltip message="Toggle playback" hotkey="Space">
          <IconButton aria-label="play-pause">⏯</IconButton>
        </Tooltip>
        {/* hotkey-only (no message) → just the Keycap. */}
        <Tooltip hotkey="Esc">
          <IconButton aria-label="Close">×</IconButton>
        </Tooltip>
      </div>

      <h3>Disabled</h3>
      <div
        style={{ display: "flex", gap: "0.6rem", "align-items": "center", "margin-block": "1rem" }}
      >
        <Tooltip message="Tooltip suppressed via disabled" disabled>
          <IconButton aria-label="suppressed">?</IconButton>
        </Tooltip>
      </div>
    </section>
  ),
});
