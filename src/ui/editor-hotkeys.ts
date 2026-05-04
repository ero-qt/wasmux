import type { HotkeyRegistry } from "~/core/hotkeys";
import { t } from "~/i18n";
import type { ProjectStore } from "~/ui/project-store";

/**
 * Registers the editor's standard undo/redo hotkeys against `registry`,
 * routing each combo to the matching {@link ProjectStore} method.
 */
export function registerEditorHotkeys(registry: HotkeyRegistry, store: ProjectStore): void {
  registry.register({
    id: "undo",
    description: t("editor.history.undo"),
    category: "history",
    keys: ["mod+KeyZ"],
    handler: () => store.undo(),
  });

  registry.register({
    id: "redo",
    description: t("editor.history.redo"),
    category: "history",
    keys: ["mod+shift+KeyZ", "mod+KeyY"],
    handler: () => store.redo(),
  });
}
