import { createSignal } from "solid-js";
import { registerCatalogueEntry } from "~/ui/catalogue/registry";
import { Menu } from "~/ui/primitives/menu";

type Sort = "name" | "date" | "size";

registerCatalogueEntry({
  id: "menu",
  label: "menu",
  render: () => {
    const [snap, setSnap] = createSignal(true);
    const [grid, setGrid] = createSignal(false);
    const [sort, setSort] = createSignal<Sort>("name");

    return (
      <section>
        <h2>menu</h2>
        <p>Themed Kobalte DropdownMenu. 4-column row: indicator | glyph | label | hotkey.</p>

        <div style={{ display: "flex", gap: "0.6rem", "flex-wrap": "wrap" }}>
          <Menu trigger="Edit" aria-label="edit-menu">
            <Menu.Item glyph={<span>✂</span>} hotkey="Ctrl+X" onSelect={() => {}}>
              Cut
            </Menu.Item>
            <Menu.Item glyph={<span>⎘</span>} hotkey="Ctrl+C" onSelect={() => {}}>
              Copy
            </Menu.Item>
            <Menu.Item glyph={<span>⎗</span>} hotkey="Ctrl+V" onSelect={() => {}}>
              Paste
            </Menu.Item>
            <Menu.Separator />
            <Menu.Item disabled onSelect={() => {}}>
              Disabled
            </Menu.Item>
          </Menu>

          <Menu trigger="View" aria-label="view-menu">
            <Menu.Label>Toggles</Menu.Label>
            <Menu.CheckboxItem checked={snap()} onChange={setSnap}>
              Snap
            </Menu.CheckboxItem>
            <Menu.CheckboxItem checked={grid()} onChange={setGrid}>
              Grid
            </Menu.CheckboxItem>
            <Menu.Separator />
            <Menu.Label>Sort</Menu.Label>
            <Menu.RadioGroup value={sort()} onChange={setSort}>
              <Menu.RadioItem value="name">Name</Menu.RadioItem>
              <Menu.RadioItem value="date">Date</Menu.RadioItem>
              <Menu.RadioItem value="size">Size</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu>

          <Menu trigger="More" aria-label="more-menu">
            <Menu.Item onSelect={() => {}}>Open</Menu.Item>
            <Menu.Sub trigger="Share">
              <Menu.Item onSelect={() => {}}>Copy link</Menu.Item>
              <Menu.Item onSelect={() => {}}>Send via email</Menu.Item>
            </Menu.Sub>
            <Menu.Item onSelect={() => {}}>Delete</Menu.Item>
          </Menu>
        </div>
      </section>
    );
  },
});
