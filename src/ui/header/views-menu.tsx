import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { type Component, For } from "solid-js";
import { t } from "~/i18n";
import { headerIcon, headerIconButton } from "~/styles/header.css";
import {
  viewsMenuContent,
  viewsMenuItem,
  viewsMenuItemIndicatorSlot,
} from "~/styles/views-menu.css";
import { ALL_ZONES, type ZoneId, isZoneVisible, toggleZone } from "~/ui/layout/zone-store";

const zoneLabel = (id: ZoneId): string => {
  switch (id) {
    case "bin":
      return t("region.bin");
    case "program":
      return t("region.program");
    case "inspector":
      return t("region.inspector");
    case "timeline":
      return t("region.timeline");
  }
};

/**
 * Header dropdown listing each toggleable workspace zone. Matches the Premiere
 * "Window" / Resolve "Workspace" menu pattern: each zone is a checkbox-item
 * whose state reflects whether the zone is shown. Wraps Kobalte's accessible
 * `DropdownMenu`; keyboard nav, focus trap, Escape, and ARIA come from there.
 */
export const ViewsMenu: Component = () => {
  return (
    <DropdownMenu placement="bottom-end" gutter={4}>
      <DropdownMenu.Trigger
        class={headerIconButton}
        aria-label={t("header.viewsToggle")}
        title={t("header.views")}
      >
        <svg class={headerIcon} viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <rect x="1" y="1" width="4" height="4" rx="0.6" />
          <rect x="7" y="1" width="4" height="4" rx="0.6" />
          <rect x="1" y="7" width="4" height="4" rx="0.6" />
          <rect x="7" y="7" width="4" height="4" rx="0.6" />
        </svg>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class={viewsMenuContent}>
          <For each={ALL_ZONES}>
            {(zone) => (
              <DropdownMenu.CheckboxItem
                class={viewsMenuItem}
                checked={isZoneVisible(zone)}
                onChange={() => toggleZone(zone)}
              >
                <span class={viewsMenuItemIndicatorSlot}>
                  <DropdownMenu.ItemIndicator>
                    <svg
                      viewBox="0 0 12 12"
                      width="0.85em"
                      height="0.85em"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2.5 6.2 L5 8.5 L9.5 3.7" />
                    </svg>
                  </DropdownMenu.ItemIndicator>
                </span>
                {zoneLabel(zone)}
              </DropdownMenu.CheckboxItem>
            )}
          </For>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
