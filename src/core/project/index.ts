/** Public API for the project model. */

export { clipDuration, clipEndTime, projectDuration } from "~/core/project/duration";
export {
  type AudioClipOptions,
  type ImageClipOptions,
  type ProjectOptions,
  type VideoClipOptions,
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
export type {
  Asset,
  AssetMetadata,
  AssetSource,
  AudioClip,
  Clip,
  Crop,
  ExportSettings,
  ImageClip,
  Position,
  Project,
  Resolution,
  Scale,
  Track,
  Transform,
  VideoClip,
} from "~/core/project/types";
