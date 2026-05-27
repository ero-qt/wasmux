import { type Component, Show } from "solid-js";
import type { HotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import { headerIcon, headerIconButton } from "~/styles/header.css";
import { HotkeyButton } from "~/ui/hotkey-button";
import { theme, toggleTheme } from "~/ui/theme/theme-store";

export interface ThemeToggleProps {
  registry: HotkeyRegistry;
}

/**
 * Icon-only header button that flips between dark and light themes. Shows a
 * sun while dark is active (clicking it brings light) and a moon while light
 * is active. `aria-pressed` reflects the *current* theme so assistive tech
 * announces it; the tooltip names the target action.
 */
export const ThemeToggle: Component<ThemeToggleProps> = (props) => {
  return (
    <HotkeyButton
      registry={props.registry}
      id="theme.toggle"
      description={t("theme.toggle.description")}
      keys={["KeyT"]}
      toggled={theme() === "dark"}
      onClick={toggleTheme}
      class={headerIconButton}
    >
      <Show when={theme() === "dark"} fallback={<MoonIcon />}>
        <SunIcon />
      </Show>
    </HotkeyButton>
  );
};

const SunIcon: Component = () => (
  <svg
    class={headerIcon}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.4"
    stroke-linecap="round"
    aria-hidden="true"
  >
    <circle cx="8" cy="8" r="3" fill="currentColor" stroke="none" />
    <path d="M8 1.5 V3.5 M8 12.5 V14.5 M1.5 8 H3.5 M12.5 8 H14.5 M3.4 3.4 L4.8 4.8 M11.2 11.2 L12.6 12.6 M3.4 12.6 L4.8 11.2 M11.2 4.8 L12.6 3.4" />
  </svg>
);

const MoonIcon: Component = () => (
  <svg class={headerIcon} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M11.5 11.5 A6 6 0 1 1 6.5 1.5 A5 5 0 0 0 11.5 11.5 Z" />
  </svg>
);
