import type { Component } from "solid-js";
import type { HotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import { HotkeyButton } from "~/ui/hotkey-button";
import { theme, toggleTheme } from "~/ui/theme/theme-store";

export interface ThemeToggleProps {
  registry: HotkeyRegistry;
}

/**
 * Hotkey-bound button that flips between dark and light themes. Label always
 * names the *target* theme ("Light" while dark is active) so the action it
 * performs is obvious; `aria-pressed` reflects the *current* theme so assistive
 * tech announces state changes correctly.
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
    >
      {theme() === "dark" ? t("theme.light") : t("theme.dark")}
    </HotkeyButton>
  );
};
