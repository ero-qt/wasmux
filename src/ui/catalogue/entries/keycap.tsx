import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Keycap } from "~/ui/primitives/keycap";

// platform-appropriate modifier glyph. macOS users expect ⌘; everyone else gets Ctrl.
const isMac =
  typeof navigator !== "undefined" && /mac|iphone|ipad|ipod/i.test(navigator.platform || "");
const mod = isMac ? "⌘" : "Ctrl";
const shift = isMac ? "⇧" : "Shift";
const sep = isMac ? "" : "+";

registerCatalogueEntry({
  id: "keycap",
  label: "keycap",
  render: () => (
    <section>
      <h2>keycap</h2>
      <p>Display-only kbd badge for hotkey hints. Modifier glyph is platform-aware.</p>
      <div style={{ display: "flex", gap: "0.4rem", "align-items": "baseline" }}>
        <Keycap>{`${mod}${sep}S`}</Keycap>
        <Keycap>{isMac ? `${shift}${mod}Z` : `${mod}+${shift}+Z`}</Keycap>
        <Keycap>Space</Keycap>
        <span>save · undo redo · play</span>
      </div>
    </section>
  ),
});
