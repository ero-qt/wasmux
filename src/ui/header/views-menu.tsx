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
        <span class={headerIcon} aria-hidden="true">
          ▦
        </span>
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
                    <span aria-hidden="true">✓</span>
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
