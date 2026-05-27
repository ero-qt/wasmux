import { type Component, Show } from "solid-js";
import type { HotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import {
  appShell,
  binRegion,
  brandMark,
  headerActions,
  headerRegion,
  inspectorRegion,
  placeholderText,
  programRegion,
  statusRegion,
  timelineRegion,
  zoneTitle,
} from "~/styles/layout.css";
import { ViewsMenu } from "~/ui/header/views-menu";
import { JobChainWidget } from "~/ui/jobs/job-chain-widget";
import { JobsPanel } from "~/ui/jobs/jobs-panel";
import { isZoneVisible } from "~/ui/layout/zone-store";
import { ThemeToggle } from "~/ui/theme/theme-toggle";

export interface AppShellProps {
  registry: HotkeyRegistry;
}

/**
 * Top-level chrome. Six grid regions: header / bin / program / inspector /
 * timeline / status. Header and status are always shown; the four content
 * zones (bin / program / inspector / timeline) are toggleable from the
 * `<ViewsMenu>` and collapse out of the grid when hidden.
 *
 * The jobs panel currently docks into the inspector zone. When a second
 * panel arrives, the inspector grows a tab strip to switch between them.
 */
export const AppShell: Component<AppShellProps> = (props) => {
  return (
    <div class={appShell}>
      <header class={headerRegion}>
        <h1 class={brandMark}>{t("brand")}</h1>
        <span class={headerActions}>
          <ViewsMenu />
          <ThemeToggle registry={props.registry} />
        </span>
      </header>

      <Show when={isZoneVisible("bin")}>
        <aside class={binRegion} aria-label={t("region.bin")}>
          <span class={placeholderText}>{t("region.bin")}</span>
        </aside>
      </Show>

      <Show when={isZoneVisible("program")}>
        <section class={programRegion} aria-label={t("region.program")}>
          <span class={placeholderText}>{t("region.program")}</span>
        </section>
      </Show>

      <Show when={isZoneVisible("inspector")}>
        <aside class={inspectorRegion} aria-label={t("region.inspector")}>
          <h2 class={zoneTitle}>{t("panel.jobs.title")}</h2>
          <JobsPanel />
        </aside>
      </Show>

      <Show when={isZoneVisible("timeline")}>
        <section class={timelineRegion} aria-label={t("region.timeline")}>
          <span class={placeholderText}>{t("region.timeline")}</span>
        </section>
      </Show>

      <section class={statusRegion} aria-label={t("region.status")}>
        <JobChainWidget />
      </section>
    </div>
  );
};
