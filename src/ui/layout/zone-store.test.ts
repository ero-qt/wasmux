import { afterEach, describe, expect, test } from "vitest";
import {
  ALL_ZONES,
  hideZone,
  isZoneVisible,
  showAllZones,
  showZone,
  toggleZone,
  visibleZones,
} from "~/ui/layout/zone-store";

afterEach(() => {
  showAllZones();
});

describe("zone store", () => {
  test("every zone is visible by default", () => {
    for (const zone of ALL_ZONES) {
      expect(isZoneVisible(zone)).toBe(true);
    }
  });

  test("visibleZones returns all zones in canonical order by default", () => {
    expect(visibleZones()).toEqual(ALL_ZONES);
  });

  test("hideZone removes the zone from visible", () => {
    hideZone("bin");
    expect(isZoneVisible("bin")).toBe(false);
    expect(visibleZones()).not.toContain("bin");
  });

  test("showZone restores a hidden zone", () => {
    hideZone("inspector");
    showZone("inspector");
    expect(isZoneVisible("inspector")).toBe(true);
  });

  test("toggleZone flips visibility", () => {
    expect(isZoneVisible("timeline")).toBe(true);
    toggleZone("timeline");
    expect(isZoneVisible("timeline")).toBe(false);
    toggleZone("timeline");
    expect(isZoneVisible("timeline")).toBe(true);
  });

  test("hiding multiple zones leaves the rest visible in order", () => {
    hideZone("bin");
    hideZone("timeline");
    expect(visibleZones()).toEqual(["program", "inspector"]);
  });

  test("showZone on a visible zone is a no-op", () => {
    showZone("bin");
    expect(visibleZones()).toEqual(ALL_ZONES);
  });

  test("hideZone on a hidden zone is a no-op", () => {
    hideZone("bin");
    hideZone("bin");
    expect(visibleZones()).toEqual(["program", "inspector", "timeline"]);
  });

  test("showAllZones restores everything", () => {
    hideZone("bin");
    hideZone("inspector");
    showAllZones();
    expect(visibleZones()).toEqual(ALL_ZONES);
  });
});
