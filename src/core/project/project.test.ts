import { describe, expect, test } from "vitest";
import { clipDuration, clipEndTime, projectDuration } from "~/core/project/duration";
import {
  audioAsset,
  audioClip,
  crop,
  imageAsset,
  imageClip,
  project,
  resolution,
  track,
  transform,
  uniformScale,
  videoAsset,
  videoClip,
} from "~/core/project/factory";
import { eq, time } from "~/core/time/rational-time";

describe("project model", () => {
  // factory: assets

  test("creates a video asset", () => {
    const a = videoAsset({
      id: "sha-1",
      name: "clip.mp4",
      source: { kind: "opfs", path: "/media/clip.mp4" },
      width: 1920,
      height: 1080,
      frameRate: time(24, 1),
      duration: time(240, 24),
      hasAudio: true,
      videoCodec: "avc1.64001F",
      audioCodec: "mp4a.40.2",
    });

    expect(a.id).toBe("sha-1");
    expect(a.name).toBe("clip.mp4");
    expect(a.source).toEqual({ kind: "opfs", path: "/media/clip.mp4" });
    expect(a.metadata.kind).toBe("video");

    if (a.metadata.kind === "video") {
      expect(a.metadata.codecs.video).toBe("avc1.64001F");
      expect(a.metadata.codecs.audio).toBe("mp4a.40.2");
      expect(a.metadata.hasAudio).toBe(true);
    }
  });

  test("creates a video asset without audio", () => {
    const a = videoAsset({
      id: "sha-2",
      name: "silent.mp4",
      source: { kind: "url", url: "https://example.com/silent.mp4" },
      width: 1280,
      height: 720,
      frameRate: time(30, 1),
      duration: time(300, 30),
      hasAudio: false,
      videoCodec: "avc1.42E01E",
    });

    if (a.metadata.kind === "video") {
      expect(a.metadata.hasAudio).toBe(false);
      expect(a.metadata.codecs.audio).toBeUndefined();
    }
  });

  test("creates an audio asset", () => {
    const a = audioAsset({
      id: "sha-3",
      name: "music.flac",
      source: { kind: "opfs", path: "/media/music.flac" },
      duration: time(180, 1),
      codec: "flac",
      channels: 2,
      sampleRate: 48000,
    });

    expect(a.metadata.kind).toBe("audio");

    if (a.metadata.kind === "audio") {
      expect(a.metadata.codec).toBe("flac");
      expect(a.metadata.channels).toBe(2);
      expect(a.metadata.sampleRate).toBe(48000);
    }
  });

  test("creates an image asset", () => {
    const a = imageAsset({
      id: "sha-4",
      name: "logo.png",
      source: { kind: "opfs", path: "/media/logo.png" },
      width: 512,
      height: 512,
    });

    expect(a.metadata.kind).toBe("image");

    if (a.metadata.kind === "image") {
      expect(a.metadata.width).toBe(512);
      expect(a.metadata.height).toBe(512);
    }
  });

  // factory: video clip

  test("creates a video clip with defaults", () => {
    const c = videoClip("asset-1", time(48, 24));

    expect(c.kind).toBe("video");
    expect(c.assetId).toBe("asset-1");
    expect(eq(c.startTime, time(0, 1))).toBe(true);
    expect(eq(c.sourceIn, time(0, 1))).toBe(true);
    expect(eq(c.sourceDuration, time(48, 24))).toBe(true);
    expect(c.transform).toEqual(transform());
    expect(c.crop).toBeUndefined();
    expect(c.volume).toBe(1);
    expect(c.enabled).toBe(true);
  });

  test("creates a video clip with explicit options", () => {
    const t = transform({ opacity: 0.5 });
    const cr = crop({ top: 10 });
    const c = videoClip("asset-1", time(48, 24), {
      startTime: time(24, 24),
      sourceIn: time(10, 24),
      transform: t,
      crop: cr,
      volume: 0.5,
      enabled: false,
    });

    expect(eq(c.startTime, time(24, 24))).toBe(true);
    expect(eq(c.sourceIn, time(10, 24))).toBe(true);
    expect(c.transform.opacity).toBe(0.5);
    expect(c.crop?.top).toBe(10);
    expect(c.volume).toBe(0.5);
    expect(c.enabled).toBe(false);
  });

  // factory: audio clip

  test("creates an audio clip with defaults", () => {
    const c = audioClip("asset-1", time(240, 1));

    expect(c.kind).toBe("audio");
    expect(c.assetId).toBe("asset-1");
    expect(eq(c.startTime, time(0, 1))).toBe(true);
    expect(eq(c.sourceIn, time(0, 1))).toBe(true);
    expect(eq(c.sourceDuration, time(240, 1))).toBe(true);
    expect(c.volume).toBe(1);
    expect(c.enabled).toBe(true);
  });

  // factory: image clip

  test("creates an image clip with defaults", () => {
    const c = imageClip("asset-1", time(120, 24));

    expect(c.kind).toBe("image");
    expect(c.assetId).toBe("asset-1");
    expect(eq(c.startTime, time(0, 1))).toBe(true);
    expect(eq(c.duration, time(120, 24))).toBe(true);
    expect(c.transform).toEqual(transform());
    expect(c.crop).toBeUndefined();
    expect(c.enabled).toBe(true);
  });

  // factory: transform

  test("creates a transform with defaults", () => {
    const t = transform();

    expect(t.position).toEqual({ x: 0, y: 0 });
    expect(t.scale).toEqual({ x: 1, y: 1 });
    expect(t.rotation).toBe(0);
    expect(t.opacity).toBe(1);
  });

  test("creates a transform with overrides", () => {
    const t = transform({
      position: { x: 100, y: 50 },
      rotation: 45,
    });

    expect(t.position).toEqual({ x: 100, y: 50 });
    expect(t.rotation).toBe(45);
    expect(t.scale).toEqual({ x: 1, y: 1 });
    expect(t.opacity).toBe(1);
  });

  // factory: crop

  test("creates a crop with defaults", () => {
    const c = crop();
    expect(c).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
  });

  test("creates a crop with overrides", () => {
    const c = crop({ top: 10, left: 20 });
    expect(c.top).toBe(10);
    expect(c.left).toBe(20);
    expect(c.right).toBe(0);
    expect(c.bottom).toBe(0);
  });

  // factory: uniformScale

  test("creates a uniform scale", () => {
    expect(uniformScale(0.5)).toEqual({ x: 0.5, y: 0.5 });
  });

  // factory: track

  test("creates a track", () => {
    const c = videoClip("asset-1", time(48, 24));
    const t = track("V1", c);

    expect(t.kind).toBe("track");
    expect(t.name).toBe("V1");
    expect(t.item).toBe(c);
  });

  // factory: project

  test("creates an empty project with defaults", () => {
    const p = project();

    expect(p.kind).toBe("project");
    expect(p.assets).toEqual({});
    expect(p.tracks).toEqual([]);
    expect(p.resolution).toEqual({ width: 1920, height: 1080 });
    expect(eq(p.frameRate, time(30, 1))).toBe(true);
  });

  test("creates a project with explicit settings", () => {
    const asset = imageAsset({
      id: "a1",
      name: "logo.png",
      source: { kind: "opfs", path: "/logo.png" },
      width: 100,
      height: 100,
    });
    const v1 = track("V1", imageClip("a1", time(48, 24)));
    const p = project({
      resolution: resolution(1280, 720),
      frameRate: time(24, 1),
      assets: [asset],
      tracks: [v1],
    });

    expect(p.resolution).toEqual({ width: 1280, height: 720 });
    expect(eq(p.frameRate, time(24, 1))).toBe(true);
    expect(p.assets.a1).toBe(asset);
    expect(p.tracks).toHaveLength(1);
  });

  test("accepts assets as a record keyed by id", () => {
    const asset = imageAsset({
      id: "a1",
      name: "logo.png",
      source: { kind: "opfs", path: "/logo.png" },
      width: 100,
      height: 100,
    });
    const p = project({ assets: { a1: asset } });
    expect(p.assets.a1).toBe(asset);
  });
});

describe("duration computation", () => {
  const asset = videoAsset({
    id: "a1",
    name: "clip.mp4",
    source: { kind: "opfs", path: "/clip.mp4" },
    width: 1920,
    height: 1080,
    frameRate: time(24, 1),
    duration: time(240, 24),
    hasAudio: false,
    videoCodec: "avc1.64001F",
  });

  // clip duration

  test("clip duration of video uses sourceDuration", () => {
    const c = videoClip("a1", time(48, 24));
    expect(eq(clipDuration(c), time(48, 24))).toBe(true);
  });

  test("clip duration of audio uses sourceDuration", () => {
    const c = audioClip("a1", time(90, 1));
    expect(eq(clipDuration(c), time(90, 1))).toBe(true);
  });

  test("clip duration of image uses duration", () => {
    const c = imageClip("a1", time(120, 24));
    expect(eq(clipDuration(c), time(120, 24))).toBe(true);
  });

  // clip end time

  test("clip end time is start plus clip duration", () => {
    const c = videoClip("a1", time(48, 24), { startTime: time(10, 24) });
    // 10/24 + 48/24 = 58/24
    expect(eq(clipEndTime(c), time(58, 24))).toBe(true);
  });

  test("clip at zero starts and ends at its duration", () => {
    const c = videoClip("a1", time(48, 24));
    expect(eq(clipEndTime(c), time(48, 24))).toBe(true);
  });

  // project duration

  test("empty project has zero duration", () => {
    const p = project();
    expect(eq(projectDuration(p), time(0, 1))).toBe(true);
  });

  test("project duration is the latest clip end", () => {
    const c1 = videoClip("a1", time(48, 24), { startTime: time(0, 24) });
    const c2 = videoClip("a1", time(24, 24), { startTime: time(100, 24) });

    const p = project({
      assets: [asset],
      tracks: [track("V1", c1), track("V2", c2)],
    });

    // c1 ends at 48/24, c2 ends at 124/24. Max = 124/24 = 31/6.
    expect(eq(projectDuration(p), time(31, 6))).toBe(true);
  });

  // real-world: logo overlay

  test("models a logo overlay on top of footage", () => {
    const footageAsset = videoAsset({
      id: "footage",
      name: "footage.mp4",
      source: { kind: "opfs", path: "/media/footage.mp4" },
      width: 1920,
      height: 1080,
      frameRate: time(24, 1),
      duration: time(720, 24),
      hasAudio: true,
      videoCodec: "avc1.64001F",
      audioCodec: "mp4a.40.2",
    });

    const logoAsset = imageAsset({
      id: "logo",
      name: "logo.png",
      source: { kind: "opfs", path: "/media/logo.png" },
      width: 512,
      height: 512,
    });

    const footage = videoClip("footage", time(720, 24));
    const logo = imageClip("logo", time(240, 24), {
      startTime: time(48, 24),
      transform: transform({
        position: { x: 1720, y: 50 },
        scale: { x: 0.2, y: 0.2 },
        opacity: 0.8,
      }),
    });

    const p = project({
      assets: [footageAsset, logoAsset],
      tracks: [track("V1", footage), track("V2", logo)],
    });

    // footage: 0 + 720/24 = 30s. logo: 48/24 + 240/24 = 288/24 = 12s.
    // project duration = 30s.
    expect(eq(projectDuration(p), time(720, 24))).toBe(true);
    expect(p.tracks).toHaveLength(2);
    const logoItem = p.tracks[1]?.item;
    expect(logoItem?.kind).toBe("image");
    if (logoItem?.kind === "image") {
      expect(logoItem.transform.opacity).toBe(0.8);
    }
    expect(p.assets[footage.assetId]).toBe(footageAsset);
  });

  test("the same asset can back multiple clips (dedup via id reference)", () => {
    const c1 = videoClip("a1", time(24, 24), { startTime: time(0, 24) });
    const c2 = videoClip("a1", time(24, 24), { startTime: time(48, 24) });

    const p = project({
      assets: [asset],
      tracks: [track("V1", c1), track("V2", c2)],
    });

    expect(Object.keys(p.assets)).toHaveLength(1);
    expect(p.tracks[0]?.item.assetId).toBe(p.tracks[1]?.item.assetId);
  });
});
