/**
 * Abstract over the persistence backend so tests can inject an in-memory stub
 * instead of touching the real OPFS root. The interface is intentionally tiny
 * — a key/value blob with async I/O.
 */
export interface LayoutStorage {
  /** Returns the saved snapshot text, or `null` when nothing is stored. */
  load(): Promise<string | null>;

  /** Writes the snapshot text. Subsequent loads return this content. */
  save(content: string): Promise<void>;
}

const FILENAME = "layout.v1.json";

/**
 * OPFS-backed storage. OPFS files live in the browser's Origin Private File
 * System — per-origin, never sent over the network, invisible in DevTools by
 * default. This is the only persistence primitive the project's privacy gate
 * allows.
 */
export function createOpfsStorage(): LayoutStorage {
  const dirHandle = async (): Promise<FileSystemDirectoryHandle | null> => {
    if (typeof navigator === "undefined" || !("storage" in navigator)) {
      return null;
    }
    try {
      return await navigator.storage.getDirectory();
    } catch {
      return null;
    }
  };

  return {
    async load() {
      const dir = await dirHandle();
      if (dir === null) {
        return null;
      }
      try {
        const handle = await dir.getFileHandle(FILENAME);
        const file = await handle.getFile();
        return await file.text();
      } catch {
        return null;
      }
    },

    async save(content) {
      const dir = await dirHandle();
      if (dir === null) {
        return;
      }
      const handle = await dir.getFileHandle(FILENAME, { create: true });
      const writable = await handle.createWritable();
      try {
        await writable.write(content);
      } finally {
        await writable.close();
      }
    },
  };
}

/**
 * In-memory stub. Tests use this so they don't depend on OPFS being available
 * in jsdom (it isn't). Pre-seed `initial` to simulate a previous session.
 */
export function createMemoryStorage(initial: string | null = null): LayoutStorage {
  let content: string | null = initial;
  return {
    async load() {
      return content;
    },
    async save(c) {
      content = c;
    },
  };
}
