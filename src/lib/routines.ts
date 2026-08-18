import type { PoseKey } from "@/components/pose-avatar";

export type Routine = {
  slug: string;
  title: string;
  minutes: number;
  blurb: string;
  poses: PoseKey[];
  /** Areas this routine targets, matched against onboarding answers. */
  areas: string[];
};

export type Area = {
  slug: string;
  label: string;
  pose: PoseKey;
};

export const ROUTINES: Routine[] = [
  {
    slug: "wake-up",
    title: "Wake Up",
    minutes: 5,
    blurb: "Gentle full-body mobility to start the day.",
    poses: ["child", "downdog", "cobra", "reach", "fold", "lunge", "bridge"],
    areas: ["lower-back", "hips", "shoulders"],
  },
  {
    slug: "desk-reset",
    title: "Desk Reset",
    minutes: 8,
    blurb: "Undo a morning at the keyboard.",
    poses: ["twist", "reach", "seated", "cobra", "fold", "supine"],
    areas: ["neck", "shoulders", "posture"],
  },
  {
    slug: "low-back-relief",
    title: "Low Back Relief",
    minutes: 10,
    blurb: "Decompress and settle an aching back.",
    poses: ["child", "bridge", "supine", "twist", "cobra", "seated"],
    areas: ["lower-back", "hips"],
  },
  {
    slug: "wind-down",
    title: "Wind Down",
    minutes: 12,
    blurb: "Slow, floor-based stretches before bed.",
    poses: ["supine", "child", "seated", "twist", "fold", "bridge"],
    areas: ["hamstrings", "hips", "lower-back"],
  },
];

export const AREAS: Area[] = [
  { slug: "hips", label: "Hips", pose: "seated" },
  { slug: "lower-back", label: "Lower Back", pose: "child" },
  { slug: "hamstrings", label: "Hamstrings", pose: "supine" },
  { slug: "shoulders", label: "Shoulders", pose: "reach" },
  { slug: "neck", label: "Neck", pose: "twist" },
  { slug: "posture", label: "Posture", pose: "lunge" },
];
