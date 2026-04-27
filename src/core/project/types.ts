import type { RationalTime } from "~/core/time/rational-time";

/** Output resolution in pixels. */
export interface Resolution {
  readonly width: number;
  readonly height: number;
}

/** 2D position in pixels from the top-left of the composition frame. */
export interface Position {
  readonly x: number;
  readonly y: number;
}

/** 2D scale factor where 1 means 100%. */
export interface Scale {
  readonly x: number;
  readonly y: number;
}

/** Spatial transform applied to an item in the composition frame. */
export interface Transform {
  readonly position: Position;
  readonly scale: Scale;
  /** Degrees, clockwise. */
  readonly rotation: number;
  /** 0 (transparent) to 1 (opaque). */
  readonly opacity: number;
}

/** Inset crop in pixels from each edge. */
export interface Crop {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/**
 * Where the bytes of an {@link Asset} live. Extensible via the
 * discriminator so new sources (cloud, stream, etc.) are additive.
 *
 * The `url` variant is constrained at the type level to local schemes
 * (`blob:` or `data:`) so a project file cannot smuggle in a remote URL
 * that would later leak the user's IP and file inventory to a third party.
 */
export type AssetSource =
  | { readonly kind: "opfs"; readonly path: string }
  | { readonly kind: "url"; readonly url: `blob:${string}` | `data:${string}` }
  | { readonly kind: "blob"; readonly blobId: string };

/**
 * Detected properties of an {@link Asset}, discriminated by media kind
 * so each variant carries only the fields that apply.
 *
 * Codec identifiers are free-form strings (e.g. `"avc1.64001F"`). The
 * UI whitelists supported codecs; the model stays loose so saved
 * projects remain forward-compatible.
 */
export type AssetMetadata =
  | {
      readonly kind: "video";
      readonly width: number;
      readonly height: number;
      readonly frameRate: RationalTime;
      readonly duration: RationalTime;
      readonly hasAudio: boolean;
      readonly codecs: { readonly video: string; readonly audio?: string | undefined };
    }
  | {
      readonly kind: "audio";
      readonly duration: RationalTime;
      readonly codec: string;
      readonly channels: number;
      readonly sampleRate: number;
    }
  | {
      readonly kind: "image";
      readonly width: number;
      readonly height: number;
    };

/**
 * A piece of media imported into a {@link Project}. Content-addressed
 * and deduplicated: the same bytes imported twice should produce a
 * single asset (ID is typically a content hash). Clips reference
 * assets by {@link Asset.id}.
 */
export interface Asset {
  readonly id: string;
  /** User-editable display name. Defaults to the imported file name. */
  readonly name: string;
  readonly source: AssetSource;
  readonly metadata: AssetMetadata;
}

/**
 * A segment of video placed on a {@link Track}. Anything with more
 * than one frame — animated GIF, APNG, animated WebP — is a video clip.
 */
export interface VideoClip {
  readonly kind: "video";
  readonly assetId: string;
  /** Where the clip starts on the project timeline. */
  readonly startTime: RationalTime;
  /** First frame of the source media to use. */
  readonly sourceIn: RationalTime;
  /** How much of the source media to use. */
  readonly sourceDuration: RationalTime;
  readonly transform: Transform;
  readonly crop?: Crop | undefined;
  /** 0..1. Ignored when the asset has no audio. */
  readonly volume: number;
  readonly enabled: boolean;
}

/** A segment of audio placed on a {@link Track}. No spatial properties. */
export interface AudioClip {
  readonly kind: "audio";
  readonly assetId: string;
  readonly startTime: RationalTime;
  readonly sourceIn: RationalTime;
  readonly sourceDuration: RationalTime;
  /** 0..1. */
  readonly volume: number;
  readonly enabled: boolean;
}

/**
 * A still image placed on a {@link Track}. No source time axis, so
 * instead of `sourceIn` + `sourceDuration` it just has `duration`.
 */
export interface ImageClip {
  readonly kind: "image";
  readonly assetId: string;
  readonly startTime: RationalTime;
  /** How long the image is shown on the project timeline. */
  readonly duration: RationalTime;
  readonly transform: Transform;
  readonly crop?: Crop | undefined;
  readonly enabled: boolean;
}

/** Any clip that can appear on a {@link Track}. */
export type Clip = VideoClip | AudioClip | ImageClip;

/**
 * A layer in the composition. Tracks stack vertically, higher index
 * composites on top. The media kind is implied by `item.kind`.
 */
export interface Track {
  readonly kind: "track";
  readonly name: string;
  readonly item: Clip;
}

/**
 * Export/render settings, kept separate from editing state so the
 * timeline can be edited without picking an output format, and output
 * settings can change without touching the timeline.
 */
export interface ExportSettings {
  readonly container: string;
  readonly video?: { readonly codec: string; readonly bitrate?: number | undefined } | undefined;
  readonly audio?: { readonly codec: string; readonly bitrate?: number | undefined } | undefined;
}

/**
 * Top-level container for a video editing project. Assets are stored
 * centrally and referenced by ID from clips, so the same media can
 * back many clips without duplication.
 */
export interface Project {
  readonly kind: "project";
  /** Imported media, keyed by {@link Asset.id}. */
  readonly assets: Readonly<Record<string, Asset>>;
  /** Layers, bottom to top. */
  readonly tracks: readonly Track[];
  readonly resolution: Resolution;
  readonly frameRate: RationalTime;
  readonly exportSettings?: ExportSettings | undefined;
}
