import { type Component, Show } from "solid-js";
import type { HotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import { headerStrip } from "~/styles/header.css";
import {
  appShell,
  binFrame,
  headerArea,
  inspectorFrame,
  placeholderText,
  programFrame,
  statusArea,
  timelineFrame,
  visuallyHidden,
  zoneBody,
  zoneHeader,
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
 * timeline / status. Header hosts icon buttons (top-left, desktop-app
 * convention) and stays compact. The four content zones render as bordered
 * cards (each its own region) and collapse out of the grid when hidden via
 * the views menu.
 *
 * The brand mark is in a visually-hidden h1 so screen readers and the
 * landmark tree still anchor on it without occupying header space.
 */
export const AppShell: Component<AppShellProps> = (props) => {
  return (
    <div class={appShell}>
      <header class={`${headerArea} ${headerStrip}`}>
        <h1 class={visuallyHidden}>{t("brand")}</h1>
        <ViewsMenu />
        <ThemeToggle registry={props.registry} />
      </header>

      <Show when={isZoneVisible("bin")}>
        <aside class={binFrame} aria-label={t("region.bin")}>
          <header class={zoneHeader}>{t("region.bin")}</header>
          <div class={zoneBody}>
            <span class={placeholderText}>{t("region.bin")}</span>
          </div>
        </aside>
      </Show>

      <Show when={isZoneVisible("program")}>
        <section class={programFrame} aria-label={t("region.program")}>
          <header class={zoneHeader}>{t("region.program")}</header>
          <div class={zoneBody}>
            <span class={placeholderText}>{t("region.program")}</span>
          </div>
        </section>
      </Show>

      <Show when={isZoneVisible("inspector")}>
        <aside class={inspectorFrame} aria-label={t("region.inspector")}>
          <header class={zoneHeader}>{t("panel.jobs.title")}</header>
          <div class={zoneBody}>
            <JobsPanel />
          </div>
        </aside>
      </Show>

      <Show when={isZoneVisible("timeline")}>
        <section class={timelineFrame} aria-label={t("region.timeline")}>
          <header class={zoneHeader}>{t("region.timeline")}</header>
          <div class={zoneBody}>
            <span class={placeholderText}>{t("region.timeline")}</span>
          </div>
        </section>
      </Show>

      <section class={statusArea} aria-label={t("region.status")}>
        <JobChainWidget />
      </section>
    </div>
  );
};
