import type { Component } from "solid-js";
import type { HotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import {
  appShell,
  binRegion,
  brandMark,
  headerRegion,
  inspectorRegion,
  placeholderText,
  programRegion,
  statusRegion,
  timelineRegion,
} from "~/styles/layout.css";
import { JobChainWidget } from "~/ui/jobs/job-chain-widget";
import { JobsPanel } from "~/ui/jobs/jobs-panel";
import { FloatingPanel } from "~/ui/panels/floating-panel";
import { PanelOverlay } from "~/ui/panels/panel-overlay";
import { ThemeToggle } from "~/ui/theme/theme-toggle";

export interface AppShellProps {
  registry: HotkeyRegistry;
}

/**
 * Top-level chrome. Six named grid regions: header / bin / program / inspector /
 * timeline / status. Each non-header region is a semantic landmark with an
 * `aria-label` so screen readers can navigate by region. Floating panels render
 * in a sibling overlay layer above the grid.
 */
export const AppShell: Component<AppShellProps> = (props) => {
  return (
    <>
      <div class={appShell}>
        <header class={headerRegion}>
          <h1 class={brandMark}>{t("brand")}</h1>
          <ThemeToggle registry={props.registry} />
        </header>

        <aside class={binRegion} aria-label={t("region.bin")}>
          <span class={placeholderText}>{t("region.bin")}</span>
        </aside>

        <section class={programRegion} aria-label={t("region.program")}>
          <span class={placeholderText}>{t("region.program")}</span>
        </section>

        <aside class={inspectorRegion} aria-label={t("region.inspector")}>
          <span class={placeholderText}>{t("region.inspector")}</span>
        </aside>

        <section class={timelineRegion} aria-label={t("region.timeline")}>
          <span class={placeholderText}>{t("region.timeline")}</span>
        </section>

        <section class={statusRegion} aria-label={t("region.status")}>
          <JobChainWidget />
        </section>
      </div>

      <PanelOverlay>
        <FloatingPanel id="jobs" title={t("panel.jobs.title")} position="bottom-right">
          <JobsPanel />
        </FloatingPanel>
      </PanelOverlay>
    </>
  );
};
