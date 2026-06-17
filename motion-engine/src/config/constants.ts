/**
 * Shared defaults for all Valfin Motion Engine compositions.
 * Individual templates may override these per-composition.
 */
export const VIDEO_FPS = 30;

export const FORMATS = {
  vertical: { width: 1080, height: 1920 }, // Reels / TikTok / Shorts
  square: { width: 1080, height: 1080 }, // Feed posts
  horizontal: { width: 1920, height: 1080 }, // YouTube / landscape
  carousel: { width: 1080, height: 1350 }, // IG/LinkedIn carousel slides (4:5)
} as const;
