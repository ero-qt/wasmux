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
      <span class={headerIcon} aria-hidden="true">
        <Show when={theme() === "dark"} fallback="☾">
          ☀
        </Show>
      </span>
    </HotkeyButton>
  );
};
