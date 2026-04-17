import type {
  Asset,
  AssetSource,
  AudioClip,
  Crop,
  ImageClip,
  Project,
  Resolution,
  Scale,
  Track,
  Transform,
  VideoClip,
} from "~/core/project/types";
import { type RationalTime, ZERO, time } from "~/core/time/rational-time";

/** Options for {@link videoClip}. */
export interface VideoClipOptions {
  startTime?: RationalTime;
  sourceIn?: RationalTime;
  transform?: Transform;
  crop?: Crop;
  volume?: number;
  enabled?: boolean;
}

export function videoClip(
  assetId: string,
  sourceDuration: RationalTime,
  options?: VideoClipOptions,
): VideoClip {
  return {
    kind: "video",
    assetId,
    startTime: options?.startTime ?? ZERO,
    sourceIn: options?.sourceIn ?? ZERO,
    sourceDuration,
    transform: options?.transform ?? transform(),
    ...(options?.crop !== undefined ? { crop: options.crop } : {}),
    volume: options?.volume ?? 1,
    enabled: options?.enabled ?? true,
  };
}

/** Options for {@link audioClip}. */
export interface AudioClipOptions {
  startTime?: RationalTime;
  sourceIn?: RationalTime;
  volume?: number;
  enabled?: boolean;
}

export function audioClip(
  assetId: string,
  sourceDuration: RationalTime,
  options?: AudioClipOptions,
): AudioClip {
  return {
    kind: "audio",
    assetId,
    startTime: options?.startTime ?? ZERO,
    sourceIn: options?.sourceIn ?? ZERO,
    sourceDuration,
    volume: options?.volume ?? 1,
    enabled: options?.enabled ?? true,
  };
}

/** Options for {@link imageClip}. */
export interface ImageClipOptions {
  startTime?: RationalTime;
  transform?: Transform;
  crop?: Crop;
  enabled?: boolean;
}

export function imageClip(
  assetId: string,
  duration: RationalTime,
  options?: ImageClipOptions,
): ImageClip {
  return {
    kind: "image",
    assetId,
    startTime: options?.startTime ?? ZERO,
    duration,
    transform: options?.transform ?? transform(),
    ...(options?.crop !== undefined ? { crop: options.crop } : {}),
    enabled: options?.enabled ?? true,
  };
}

export function videoAsset(params: {
  id: string;
  name: string;
  source: AssetSource;
  width: number;
  height: number;
  frameRate: RationalTime;
  duration: RationalTime;
  hasAudio: boolean;
  videoCodec: string;
  audioCodec?: string;
}): Asset {
  return {
    id: params.id,
    name: params.name,
    source: params.source,
    metadata: {
      kind: "video",
      width: params.width,
      height: params.height,
      frameRate: params.frameRate,
      duration: params.duration,
      hasAudio: params.hasAudio,
      codecs: {
        video: params.videoCodec,
        ...(params.audioCodec !== undefined ? { audio: params.audioCodec } : {}),
      },
    },
  };
}

export function audioAsset(params: {
  id: string;
  name: string;
  source: AssetSource;
  duration: RationalTime;
  codec: string;
  channels: number;
  sampleRate: number;
}): Asset {
  return {
    id: params.id,
    name: params.name,
    source: params.source,
    metadata: {
      kind: "audio",
      duration: params.duration,
      codec: params.codec,
      channels: params.channels,
      sampleRate: params.sampleRate,
    },
  };
}

export function imageAsset(params: {
  id: string;
  name: string;
  source: AssetSource;
  width: number;
  height: number;
}): Asset {
  return {
    id: params.id,
    name: params.name,
    source: params.source,
    metadata: {
      kind: "image",
      width: params.width,
      height: params.height,
    },
  };
}

/** Fills unspecified fields with defaults (centered, 100% scale, no rotation, full opacity). */
export function transform(overrides?: Partial<Transform>): Transform {
  return {
    position: overrides?.position ?? { x: 0, y: 0 },
    scale: overrides?.scale ?? { x: 1, y: 1 },
    rotation: overrides?.rotation ?? 0,
    opacity: overrides?.opacity ?? 1,
  };
}

/** Fills unspecified edges with 0. */
export function crop(overrides?: Partial<Crop>): Crop {
  return {
    top: overrides?.top ?? 0,
    right: overrides?.right ?? 0,
    bottom: overrides?.bottom ?? 0,
    left: overrides?.left ?? 0,
  };
}

export function uniformScale(factor: number): Scale {
  return {
    x: factor,
    y: factor,
  };
}

export function resolution(width: number, height: number): Resolution {
  return {
    width,
    height,
  };
}

export function track(name: string, item: Track["item"]): Track {
  return {
    kind: "track",
    name,
    item,
  };
}

/** Options for {@link project}. */
export interface ProjectOptions {
  assets?: readonly Asset[] | Readonly<Record<string, Asset>>;
  tracks?: readonly Track[];
  resolution?: Resolution;
  frameRate?: RationalTime;
}

const DEFAULT_RESOLUTION: Resolution = { width: 1920, height: 1080 };
const DEFAULT_FRAME_RATE = time(30, 1);

/** Every field has a default so a blank "untitled" project can be constructed with no arguments. */
export function project(options?: ProjectOptions): Project {
  return {
    kind: "project",
    assets: normalizeAssets(options?.assets),
    tracks: options?.tracks ?? [],
    resolution: options?.resolution ?? DEFAULT_RESOLUTION,
    frameRate: options?.frameRate ?? DEFAULT_FRAME_RATE,
  };
}

function normalizeAssets(
  input: readonly Asset[] | Readonly<Record<string, Asset>> | undefined,
): Readonly<Record<string, Asset>> {
  if (input === undefined) {
    return {};
  }

  if (Array.isArray(input)) {
    const out: Record<string, Asset> = {};

    for (const a of input) {
      out[a.id] = a;
    }

    return out;
  }

  return input as Readonly<Record<string, Asset>>;
}
