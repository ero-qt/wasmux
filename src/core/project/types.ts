import type { RationalTime } from "~/core/time/rational-time";

/** Output resolution in pixels. */
export interface Resolution {
  readonly width: number;

  readonly height: number;
}

/**
 * 2D position in pixels, relative to the top-left corner of the
 * composition frame.
 */
export interface Position {
  readonly x: number;

  readonly y: number;
}

/**
 * 2D scale factor where 1 means 100% (original size).
 */
export interface Scale {
  readonly x: number;

  readonly y: number;
}

/**
 * Spatial transform applied to an item in the composition frame.
 * When absent on an item, the item uses default values (centered,
 * 100% scale, no rotation, full opacity).
 */
export interface Transform {
  /** Position in pixels from the top-left of the composition. */
  readonly position: Position;

  /** Scale factor (1 = original size). */
  readonly scale: Scale;

  /** Rotation in degrees, clockwise. */
  readonly rotation: number;

  /** Opacity from 0 (transparent) to 1 (opaque). */
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
 * Where the bytes of an {@link Asset} actually live. Extensible via
 * the discriminator so new sources (cloud, stream, etc.) are additive,
 * not breaking.
 */
export type AssetSource =
  | { readonly kind: "opfs"; readonly path: string }
  | { readonly kind: "url"; readonly url: string }
  | { readonly kind: "blob"; readonly blobId: string };

/**
 * Detected properties of an {@link Asset}. Discriminated by media
 * kind so each media type carries only the fields that apply to it.
 *
 * Codec identifiers are free-form strings (e.g. `"avc1.64001F"`).
 * The UI whitelists supported codecs; the model stays loose so saved
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
 * A piece of media imported into a {@link Project}. Assets are
 * content-addressed and deduplicated: importing the same bytes twice
 * should produce a single asset (ID is typically a content hash).
 *
 * Clips reference assets by {@link Asset.id}, so the same asset can
 * back any number of clips across any number of tracks.
 */
export interface Asset {
  readonly id: string;

  /** User-editable display name. Defaults to the imported file name. */
  readonly name: string;

  readonly source: AssetSource;

  readonly metadata: AssetMetadata;
}

/**
 * A segment of video placed on a {@link Track}. Video clips have
 * temporal trim (`sourceIn` + `sourceDuration`), spatial properties
 * in the composition frame, and a `volume` for the asset's audio
 * track (ignored if the asset is silent).
 *
 * Anything with more than one frame — including animated GIFs,
 * APNGs, animated WebP — is modelled as a video clip.
 */
export interface VideoClip {
  readonly kind: "video";

  /** Reference to an {@link Asset} in {@link Project.assets}. */
  readonly assetId: string;

  /** Where the clip starts on the project timeline. */
  readonly startTime: RationalTime;

  /** First frame of the source media to use. */
  readonly sourceIn: RationalTime;

  /** How much of the source media to use. */
  readonly sourceDuration: RationalTime;

  readonly transform: Transform;

  readonly crop?: Crop | undefined;

  /** Playback volume in the range 0..1. Ignored when the asset has no audio. */
  readonly volume: number;

  readonly enabled: boolean;
}

/**
 * A segment of audio placed on a {@link Track}. Audio clips have
 * temporal trim and a `volume`, but no spatial properties — nothing
 * appears on the composition canvas.
 */
export interface AudioClip {
  readonly kind: "audio";

  readonly assetId: string;

  readonly startTime: RationalTime;

  readonly sourceIn: RationalTime;

  readonly sourceDuration: RationalTime;

  /** Playback volume in the range 0..1. */
  readonly volume: number;

  readonly enabled: boolean;
}

/**
 * A still image placed on a {@link Track}. Images have no source
 * time axis (there is nothing to trim into), so instead of
 * `sourceIn` + `sourceDuration` they just have `duration`: how
 * long the image is shown on the project timeline.
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

/**
 * Any clip that can appear on a {@link Track}. Discriminated by
 * `kind` so each variant carries only the fields that apply to it.
 */
export type Clip = VideoClip | AudioClip | ImageClip;

/**
 * Represents a layer in the composition. Each track holds one
 * clip and stacks vertically with other tracks (higher index
 * composites on top). The track's media kind is implied by
 * `item.kind` — no separate discriminator needed.
 */
export interface Track {
  readonly kind: "track";

  readonly name: string;

  readonly item: Clip;
}

/**
 * Export/render settings, kept separate from editing state so the
 * timeline can be edited without ever picking an output format, and
 * output settings can be changed without touching the timeline.
 *
 * Codec fields are free-form strings populated from a UI whitelist
 * of what MediaBunny + WebCodecs can actually encode in the user's
 * browser.
 */
export interface ExportSettings {
  readonly container: string;

  readonly video?: { readonly codec: string; readonly bitrate?: number | undefined } | undefined;

  readonly audio?: { readonly codec: string; readonly bitrate?: number | undefined } | undefined;
}

/**
 * Top-level container for a video editing project.
 *
 * Assets are stored centrally and referenced by ID from clips, so
 * the same media can back many clips without duplication.
 */
export interface Project {
  readonly kind: "project";

  /** Imported media, keyed by {@link Asset.id}. */
  readonly assets: Readonly<Record<string, Asset>>;

  /** The layers that make up this project, bottom to top. */
  readonly tracks: readonly Track[];

  /** Output resolution. */
  readonly resolution: Resolution;

  /** Project frame rate. */
  readonly frameRate: RationalTime;

  readonly exportSettings?: ExportSettings | undefined;
}
