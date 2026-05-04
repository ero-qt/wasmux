/** Source-of-truth message catalog. All other locales must structurally match. */
export const en = {
  brand: "wasmux",
  editor: {
    history: {
      undo: "Undo",
      redo: "Redo",
    },
  },
} as const;

export type Messages = typeof en;
