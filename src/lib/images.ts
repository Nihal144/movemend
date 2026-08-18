/**
 * Central registry for remote media URLs.
 *
 * Values can be a local path under /public (e.g. "/images/rewind.jpg") or a
 * remote URL. Anything missing falls back to the built-in illustration.
 */

/** Background artwork for program cards, keyed by program slug. */
export const PROGRAM_IMAGES: Record<string, string | undefined> = {
  // rewind: "…",
  // "strong-back": "…",
  // "lift-grandkids": "…",
};

/** Looping demo clips (MP4/WebM) or GIFs, keyed by exercise. */
export const EXERCISE_MEDIA: Record<string, string | undefined> = {
  "chair-squat": "https://ik.imagekit.io/xpmg4xpua/Movemend/chair-squat.mp4",
  bridge: "https://ik.imagekit.io/xpmg4xpua/Movemend/Bridge.mp4",
  // "bird-dog": "…",
  // "hip-hinge": "…",
  // "carry-march": "…",
};

export function programImage(slug: string): string | undefined {
  return PROGRAM_IMAGES[slug];
}

export function exerciseMediaUrl(key: string): string | undefined {
  return EXERCISE_MEDIA[key];
}
