import { type Template, template } from "@solid-primitives/i18n";

/** Source-of-truth message catalog. All other locales must structurally match. */
export const en = {
  brand: "wasmux",
  editor: {
    history: {
      undo: "undo",
      redo: "redo",
    },
  },
  region: {
    bin: "project bin",
    program: "program",
    inspector: "inspector",
    timeline: "timeline",
    status: "status",
  },
  header: {
    views: "views",
    viewsToggle: "open views menu",
  },
  theme: {
    dark: "dark",
    light: "light",
    toggle: {
      description: "toggle theme",
    },
  },
  panel: {
    close: "close",
    dragHandle: template<{ title: string }>("drag handle for {{ title }} panel"),
    jobs: {
      title: "jobs",
      toggle: "toggle jobs panel",
    },
  },
  jobs: {
    empty: "no jobs this session",
    expand: "expand",
    collapse: "collapse",
    status: {
      running: "running",
      completed: "completed",
      failed: "failed",
      cancelled: "cancelled",
    },
  },
  dev: {
    demoJob: "run demo job (dev only)",
  },
  hotkey: {
    modifier: {
      ctrl: "ctrl",
      alt: "alt",
      shift: "shift",
      meta: {
        mac: "cmd",
        windows: "win",
        linux: "super",
        other: "meta",
      },
    },
    key: {
      space: "space",
      enter: "enter",
      escape: "esc",
      backspace: "backspace",
      tab: "tab",
      delete: "delete",
      home: "home",
      end: "end",
      pageUp: "page up",
      pageDown: "page down",
      insert: "insert",
      arrowLeft: "left",
      arrowRight: "right",
      arrowUp: "up",
      arrowDown: "down",
      numpad: template<{ suffix: string }>("numpad {{ suffix }}"),
    },
  },
} as const;

export type Messages = typeof en;

/** Re-exports the template helper so other locales can stay self-contained. */
export type { Template };
