import { describe, expect, test } from "vitest";
import { createMemoryStorage } from "~/ui/layout/layout-storage";

describe("memory storage", () => {
  test("load returns null when nothing is saved", async () => {
    const s = createMemoryStorage();
    expect(await s.load()).toBeNull();
  });

  test("save then load round-trips the content", async () => {
    const s = createMemoryStorage();
    await s.save("hello");
    expect(await s.load()).toBe("hello");
  });

  test("constructor seed pre-loads content", async () => {
    const s = createMemoryStorage("seeded");
    expect(await s.load()).toBe("seeded");
  });

  test("save overwrites previous content", async () => {
    const s = createMemoryStorage("first");
    await s.save("second");
    expect(await s.load()).toBe("second");
  });
});
