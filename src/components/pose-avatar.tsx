import type { ReactNode } from "react";

export type PoseKey =
  | "downdog"
  | "fold"
  | "child"
  | "cobra"
  | "bridge"
  | "reach"
  | "lunge"
  | "twist"
  | "seated"
  | "supine"
  | "chair-squat"
  | "bird-dog"
  | "hip-hinge"
  | "carry-march";

export type Tone = { bg: string; ink: string };

/** Each pose owns a tone so the same movement reads consistently everywhere. */
export const POSE_TONES: Record<PoseKey, Tone> = {
  downdog: { bg: "bg-pose-sage", ink: "stroke-white" },
  fold: { bg: "bg-pose-brick", ink: "stroke-white" },
  child: { bg: "bg-pose-sand", ink: "stroke-ink" },
  cobra: { bg: "bg-pose-navy", ink: "stroke-white" },
  bridge: { bg: "bg-pose-moss", ink: "stroke-ink" },
  reach: { bg: "bg-pose-sky", ink: "stroke-ink" },
  lunge: { bg: "bg-pose-forest", ink: "stroke-white" },
  twist: { bg: "bg-pose-lilac", ink: "stroke-ink" },
  seated: { bg: "bg-pose-mustard", ink: "stroke-ink" },
  supine: { bg: "bg-pose-slate", ink: "stroke-white" },
  "chair-squat": { bg: "bg-pose-mustard", ink: "stroke-ink" },
  "bird-dog": { bg: "bg-pose-navy", ink: "stroke-white" },
  "hip-hinge": { bg: "bg-pose-brick", ink: "stroke-white" },
  "carry-march": { bg: "bg-pose-forest", ink: "stroke-white" },
};

/** Simplified stroke figures — a mat line plus a body, drawn in a 48px box. */
export const POSE_FIGURES: Record<PoseKey, ReactNode> = {
  downdog: (
    <>
      <path d="M11 37 L24 15 L37 37" />
      <circle cx="14" cy="30" r="3.2" />
    </>
  ),
  fold: (
    <>
      <path d="M25 37 L25 24 Q25 18 19 20" />
      <circle cx="16" cy="22" r="3.2" />
    </>
  ),
  child: (
    <>
      <path d="M13 36 Q22 19 33 33" />
      <circle cx="13" cy="32" r="3.2" />
    </>
  ),
  cobra: (
    <>
      <path d="M11 37 L25 37 Q34 36 34 26" />
      <circle cx="34" cy="21" r="3.2" />
    </>
  ),
  bridge: (
    <>
      <path d="M12 37 L18 37 Q24 19 31 37 L36 37" />
      <circle cx="12" cy="33" r="3.2" />
    </>
  ),
  reach: (
    <>
      <path d="M24 37 L24 22 M24 24 L17 12 M24 24 L31 12" />
      <circle cx="24" cy="17" r="3.2" />
    </>
  ),
  lunge: (
    <>
      <path d="M11 37 L20 26 L20 37 M20 26 L33 37 M20 26 L26 17" />
      <circle cx="28" cy="14" r="3.2" />
    </>
  ),
  twist: (
    <>
      <path d="M14 37 L30 37 M22 37 L22 24 Q22 20 29 21" />
      <circle cx="20" cy="20" r="3.2" />
    </>
  ),
  seated: (
    <>
      <path d="M13 37 L33 37 M20 37 L20 25 M20 27 L29 23" />
      <circle cx="20" cy="21" r="3.2" />
    </>
  ),
  supine: (
    <>
      <path d="M13 33 L28 33 Q34 33 34 26" />
      <circle cx="11" cy="30" r="3.2" />
    </>
  ),
  "chair-squat": (
    <>
      {/* Chair behind, figure sitting back toward it. */}
      <path d="M31 38 L31 27 L43 27 M43 27 L43 14" />
      <path d="M14 18 L16 27 L25 28 L25 38" />
      <path d="M15 21 L24 20" />
      <circle cx="13" cy="14" r="3.2" />
    </>
  ),
  "bird-dog": (
    <>
      <path d="M17 25 L31 25" />
      <path d="M19 25 L18 35 M29 25 L30 35" />
      <path d="M17 25 L7 21 M31 25 L42 30" />
      <circle cx="14" cy="21" r="2.8" />
    </>
  ),
  "hip-hinge": (
    <>
      <path d="M27 38 L27 26 L17 21" />
      <path d="M19 22 L8 24" />
      <circle cx="14" cy="17" r="3.2" />
    </>
  ),
  "carry-march": (
    <>
      <path d="M24 15 L24 27 M24 27 L24 38 M24 27 L31 27 L31 34" />
      <circle cx="24" cy="11" r="3.2" />
      {/* Weights held at the sides. */}
      <path d="M16 23 L16 29 M34 23 L34 29" />
    </>
  ),
};

export function PoseAvatar({
  pose,
  className = "size-12",
}: {
  pose: PoseKey;
  className?: string;
}) {
  const tone = POSE_TONES[pose];
  return (
    <span
      className={`${tone.bg} ${className} inline-flex shrink-0 items-center justify-center rounded-full`}
    >
      <svg
        viewBox="0 0 48 48"
        className={`${tone.ink} size-[70%] fill-none`}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {POSE_FIGURES[pose]}
      </svg>
    </span>
  );
}
