import { type Template, template } from "@solid-primitives/i18n";

/** Source-of-truth message catalog. All other locales must structurally match. */
export const en = {
  brand: "wasmux",
  editor: {
    history: {
      undo: "Undo",
      redo: "Redo",
    },
  },
  region: {
    bin: "Project bin",
    program: "Program",
    inspector: "Inspector",
    timeline: "Timeline",
    status: "Status",
  },
  theme: {
    dark: "Dark",
    light: "Light",
    toggle: {
      description: "Toggle theme",
    },
  },
  panel: {
    close: "Close",
    jobs: {
      title: "Jobs",
      toggle: "Toggle jobs panel",
    },
  },
  jobs: {
    empty: "No jobs this session",
    expand: "Expand",
    collapse: "Collapse",
  },
  dev: {
    demoJob: "Run demo job (dev only)",
  },
  hotkey: {
    modifier: {
      ctrl: "Ctrl",
      alt: "Alt",
      shift: "Shift",
      meta: {
        mac: "Cmd",
        windows: "Win",
        linux: "Super",
        other: "Meta",
      },
    },
    key: {
      space: "Space",
      enter: "Enter",
      escape: "Esc",
      backspace: "Backspace",
      tab: "Tab",
      delete: "Delete",
      home: "Home",
      end: "End",
      pageUp: "Page Up",
      pageDown: "Page Down",
      insert: "Insert",
      arrowLeft: "Left",
      arrowRight: "Right",
      arrowUp: "Up",
      arrowDown: "Down",
      numpad: template<{ suffix: string }>("Numpad {{ suffix }}"),
    },
  },
} as const;

export type Messages = typeof en;

/** Re-exports the template helper so other locales can stay self-contained. */
export type { Template };
