import { type Component, Show } from "solid-js";
import { createHotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import { Catalogue } from "~/ui/catalogue";
import { fireDemoJob } from "~/ui/jobs/demo-job";
import { AppShell } from "~/ui/layout/app-shell";
import { mountHotkeys } from "~/ui/mount-hotkeys";

const hotkeys = createHotkeyRegistry();

if (import.meta.env.DEV) {
  hotkeys.register({
    id: "dev.demoJob",
    description: t("dev.demoJob"),
    keys: ["KeyG"],
    handler: () => {
      fireDemoJob().catch((err) => console.error("demo job failed:", err));
    },
  });
}

export const App: Component = () => {
  mountHotkeys(hotkeys);

  const catalogueMode =
    import.meta.env.DEV || new URLSearchParams(window.location.search).get("catalogue") === "1";

  return (
    <Show when={catalogueMode} fallback={<AppShell registry={hotkeys} />}>
      <Catalogue />
    </Show>
  );
};
