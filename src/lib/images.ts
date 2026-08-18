/**
 * Background artwork for program cards, keyed by program slug.
 *
 * Values can be a local path under /public (e.g. "/images/rewind.jpg") or a
 * remote URL. Cards without an entry fall back to their flat colour wash.
 */
export const PROGRAM_IMAGES: Record<string, string | undefined> = {
  // rewind: "…",           // ← blood-pressure card background
  // "strong-back": "…",
  // "lift-grandkids": "…",
};

export function programImage(slug: string): string | undefined {
  return PROGRAM_IMAGES[slug];
}
