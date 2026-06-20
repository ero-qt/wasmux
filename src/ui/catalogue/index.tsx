import { type Component, For, createSignal } from "solid-js";
import {
  catalogueItem,
  catalogueList,
  cataloguePanel,
  catalogueShell,
  catalogueSidebar,
} from "~/styles/catalogue.css";
import "~/ui/catalogue/entries/placeholder";
import "~/ui/catalogue/entries/button";
import "~/ui/catalogue/entries/icon-button";
import "~/ui/catalogue/entries/toggle";
import "~/ui/catalogue/entries/pill";
import "~/ui/catalogue/entries/status-dot";
import "~/ui/catalogue/entries/keycap";
import "~/ui/catalogue/entries/slider";
import "~/ui/catalogue/entries/number-input";
import "~/ui/catalogue/entries/select";
import "~/ui/catalogue/entries/chip";
import "~/ui/catalogue/entries/segmented-control";
import "~/ui/catalogue/entries/swatch";
import "~/ui/catalogue/entries/modal";
import "~/ui/catalogue/entries/popover";
import "~/ui/catalogue/entries/menu";
import "~/ui/catalogue/entries/tooltip";
import { catalogueEntries } from "~/ui/catalogue/registry";

/**
 * Dev-only catalogue route. Renders every registered primitive entry with all
 * its states for visual review. Mount gated by `import.meta.env.DEV` or a
 * `?catalogue=1` URL param — see `src/App.tsx`.
 */
export const Catalogue: Component = () => {
  const entries = catalogueEntries();
  const [activeId, setActiveId] = createSignal(entries[0]?.id ?? "");

  const active = (): (typeof entries)[number] | undefined =>
    entries.find((e) => e.id === activeId());

  return (
    <div class={catalogueShell}>
      <nav class={catalogueSidebar} aria-label="catalogue">
        <ul class={catalogueList}>
          <For each={[...entries]}>
            {(entry) => (
              <li>
                <button
                  type="button"
                  class={catalogueItem}
                  aria-current={entry.id === activeId() ? "true" : undefined}
                  onClick={() => setActiveId(entry.id)}
                >
                  {entry.label}
                </button>
              </li>
            )}
          </For>
        </ul>
      </nav>
      <main class={cataloguePanel}>{active()?.render()}</main>
    </div>
  );
};

export default Catalogue;
