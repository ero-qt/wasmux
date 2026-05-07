import { DropdownMenu } from "@kobalte/core/dropdown-menu";
import { type Component, For } from "solid-js";
import { t } from "~/i18n";
import {
  viewsMenuContent,
  viewsMenuItem,
  viewsMenuItemIndicatorSlot,
  viewsMenuTrigger,
  viewsMenuTriggerIcon,
} from "~/styles/views-menu.css";
import { isPanelOpen, togglePanel } from "~/ui/panels/panel-store";

interface ViewItem {
  readonly id: string;
  readonly label: () => string;
}

/**
 * The list of toggleable views. Hand-maintained for now; once a second panel
 * lands we'll lift this into a registry that panels register themselves with.
 */
const VIEWS: readonly ViewItem[] = [{ id: "jobs", label: () => t("panel.jobs.title") }];

/**
 * Header dropdown that lists every floating panel as a checkable menu item.
 * Wraps Kobalte's accessible `DropdownMenu` primitive: keyboard nav, focus
 * trap, Escape to close, and ARIA attributes are handled for us.
 */
export const ViewsMenu: Component = () => {
  return (
    <DropdownMenu placement="bottom-end" gutter={4}>
      <DropdownMenu.Trigger class={viewsMenuTrigger} aria-label={t("header.viewsToggle")}>
        <svg
          class={viewsMenuTriggerIcon}
          viewBox="0 0 12 12"
          fill="currentColor"
          aria-hidden="true"
        >
          <rect x="1" y="1" width="4" height="4" rx="0.6" />
          <rect x="7" y="1" width="4" height="4" rx="0.6" />
          <rect x="1" y="7" width="4" height="4" rx="0.6" />
          <rect x="7" y="7" width="4" height="4" rx="0.6" />
        </svg>
        <span>{t("header.views")}</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content class={viewsMenuContent}>
          <For each={VIEWS}>
            {(view) => (
              <DropdownMenu.CheckboxItem
                class={viewsMenuItem}
                checked={isPanelOpen(view.id)}
                onChange={() => togglePanel(view.id)}
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
                {view.label()}
              </DropdownMenu.CheckboxItem>
            )}
          </For>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu>
  );
};
