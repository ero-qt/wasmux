import { type Component, Show, Suspense, lazy } from "solid-js";
import { createHotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import { fireDemoJob } from "~/ui/jobs/demo-job";
import { AppShell } from "~/ui/layout/app-shell";
import { mountHotkeys } from "~/ui/mount-hotkeys";

const Catalogue = lazy(() => import("~/ui/catalogue"));

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

  // ?catalogue=1 forces catalogue, ?catalogue=0 forces AppShell, no param defaults to catalogue in DEV.
  const param = new URLSearchParams(window.location.search).get("catalogue");
  const catalogueMode = param === "1" || (param !== "0" && import.meta.env.DEV);

  return (
    <Show when={catalogueMode} fallback={<AppShell registry={hotkeys} />}>
      <Suspense>
        <Catalogue />
      </Suspense>
    </Show>
  );
};
