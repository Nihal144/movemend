import type { PoseKey, Tone } from "@/components/pose-avatar";
import { exerciseMediaUrl } from "./images";
import { POSE_TONES } from "@/components/pose-avatar";

export type BreathKey =
  | "diaphragmatic"
  | "four-six"
  | "box-gentle"
  | "pursed-lip"
  | "long-exhale";

export type ExerciseKey = PoseKey | BreathKey;

/**
 * One step of a breathing cycle. `scale` is where the pacer circle should be by
 * the end of the phase, so inhale grows, exhale shrinks and holds sit still.
 */
export type BreathPhase = {
  label: string;
  seconds: number;
  scale: number;
};

export type Exercise = {
  name: string;
  description: string;
  /** Step-by-step instructions, listed under the description. */
  steps?: string[];
  /** Why the exercise earns its place in the session. */
  why?: string;
  /** Optional looping demo (GIF/MP4) from /public; overrides the illustration. */
  media?: string;
  /** Pose exercises render the figure illustration. */
  pose?: PoseKey;
  /** Breathing exercises render a paced circle instead. */
  breath?: BreathPhase[];
  tone?: Tone;
};

const IN = (seconds: number): BreathPhase => ({ label: "Inhale", seconds, scale: 1 });
const OUT = (seconds: number): BreathPhase => ({ label: "Exhale", seconds, scale: 0.55 });
const HOLD = (seconds: number): BreathPhase => ({ label: "Hold", seconds, scale: 1 });
const PAUSE = (seconds: number): BreathPhase => ({ label: "Pause", seconds, scale: 0.55 });

const POSE_EXERCISES: Record<PoseKey, Omit<Exercise, "pose">> = {
  child: {
    name: "Child's Pose",
    description:
      "Kneel and sit back toward your heels with your arms stretched forward. Let your chest sink and breathe wide into your lower back.",
  },
  downdog: {
    name: "Downward Dog",
    description:
      "Hands and feet on the floor, hips lifted high. Press the floor away and let your heels drift down without locking your knees.",
  },
  fold: {
    name: "Standing Forward Fold",
    description:
      "Feet hip-width apart, hinge from the hips and let your head hang heavy. Keep a soft bend in the knees throughout.",
  },
  cobra: {
    name: "Cobra",
    description:
      "Lie face down with hands under your shoulders. Press up gently until you feel a stretch across the front of your hips, not a pinch in your back.",
  },
  bridge: {
    name: "Glute Bridges",
    description: "Hip lifts from the floor, working the glutes without loading the spine.",
    steps: [
      "Lie on your back with knees bent.",
      "Feet flat on the floor.",
      "Tighten your core.",
      "Squeeze your glutes and lift your hips.",
      "Lower slowly, then repeat.",
    ],
    why: "Strengthens glutes and hips, which are what actually do the lifting and carrying.",
  },
  reach: {
    name: "Overhead Reach",
    description:
      "Stand tall and reach both arms overhead. Lengthen through your sides and keep your ribs down rather than arching your lower back.",
  },
  lunge: {
    name: "Low Lunge",
    description:
      "Step one foot forward and lower the back knee. Ease your hips forward to open the front of the back thigh. Swap sides halfway.",
  },
  twist: {
    name: "Supine Twist",
    description:
      "On your back, drop both knees to one side and turn your head the other way. Keep both shoulders on the floor. Swap sides halfway.",
  },
  seated: {
    name: "Seated Forward Bend",
    description:
      "Sit with your legs extended and hinge forward from the hips. Reach toward your feet without forcing your spine to round.",
  },
  supine: {
    name: "Constructive Rest",
    description:
      "Lie on your back with knees bent and feet flat. Let your whole spine settle into the floor and slow your breathing down.",
  },
  "chair-squat": {
    name: "Chair Squats",
    description: "Sitting back to a chair and standing again — the everyday get-up, rehearsed.",
    steps: [
      "Stand in front of a sturdy chair.",
      "Feet approximately hip-width apart.",
      "Push your hips backward and lower toward the chair.",
      "Lightly touch the chair.",
      "Stand up by pushing through your feet.",
      "Keep your chest lifted.",
    ],
    why: "Builds the leg and hip strength needed to lift a child from a low position.",
  },
  "bird-dog": {
    name: "Bird Dog",
    description: "Opposite arm and leg extended from all fours, holding the trunk still.",
    steps: [
      "Start on hands and knees.",
      "Brace your stomach gently.",
      "Extend the opposite arm and leg.",
      "Return to the starting position.",
      "Alternate sides.",
    ],
    why: "Develops core stability, hip control and coordination without heavy spinal loading.",
  },
  "hip-hinge": {
    name: "Hip Hinge + Reach",
    description: "The bend-and-return pattern that keeps your back out of the lift.",
    steps: [
      "Stand with feet hip-width apart.",
      "Slightly bend the knees.",
      "Push your hips backward, keeping your back neutral.",
      "Return to standing and reach your arms forward and up.",
      "Repeat slowly.",
    ],
    why: "Teaches the right way to pick a child up off the floor — bending through the hips rather than rounding the back.",
  },
  "carry-march": {
    name: "Supported Carry / March",
    description:
      "Marching on the spot holding a light weight — dumbbells, water bottles or any household object.",
    steps: [
      "Stand tall and hold the weight close to your body.",
      "Slowly march in place.",
      "Keep your ribs stacked over your hips.",
      "Maintain an upright posture.",
      "If balance is an issue, stay next to a sturdy support.",
    ],
    why: "Develops the core stability, grip, hip strength and balance that carrying actually demands.",
  },
};

const BREATH_EXERCISES: Record<BreathKey, Exercise> = {
  diaphragmatic: {
    name: "Diaphragmatic Breathing",
    description:
      "Sit or stand tall. Inhale slowly through the nose for about 4 seconds, letting the belly expand rather than the chest. Exhale gently for about 6 seconds.",
    breath: [IN(4), OUT(6)],
    tone: { bg: "bg-pose-sky", ink: "stroke-ink" },
  },
  "four-six": {
    name: "4–6 Breathing",
    description:
      "Inhale through the nose for 4 seconds, then exhale for 6. Keep your shoulders relaxed and aim for around 6 breaths a minute.",
    breath: [IN(4), OUT(6)],
    tone: { bg: "bg-pose-moss", ink: "stroke-ink" },
  },
  "box-gentle": {
    name: "Box Breathing — Gentle",
    description:
      "Inhale for 4, hold for 2, exhale for 4–6, then pause for 2. Keep every phase comfortable — no forceful breath-holding.",
    breath: [IN(4), HOLD(2), OUT(5), PAUSE(2)],
    tone: { bg: "bg-pose-lilac", ink: "stroke-ink" },
  },
  "pursed-lip": {
    name: "Pursed-Lip Breathing",
    description:
      "Inhale through the nose for 3–4 seconds, then exhale slowly through lightly pursed lips for 5–6 seconds, as if cooling a hot drink.",
    breath: [IN(4), OUT(6)],
    tone: { bg: "bg-pose-sand", ink: "stroke-ink" },
  },
  "long-exhale": {
    name: "Long-Exhale Relaxation",
    description:
      "A comfortable nasal inhale followed by a longer, relaxed exhale. Focus on dropping your shoulders and unclenching your jaw.",
    breath: [IN(4), OUT(8)],
    tone: { bg: "bg-pose-slate", ink: "stroke-white" },
  },
};

export const EXERCISES: Record<ExerciseKey, Exercise> = {
  ...(Object.fromEntries(
    Object.entries(POSE_EXERCISES).map(([key, value]) => [
      key,
      { ...value, pose: key as PoseKey, tone: POSE_TONES[key as PoseKey] },
    ]),
  ) as Record<PoseKey, Exercise>),
  ...BREATH_EXERCISES,
};

export function exerciseFor(key: ExerciseKey): Exercise {
  return EXERCISES[key];
}

/** Demo clip for an exercise: the registry wins, then any inline default. */
export function mediaFor(key: ExerciseKey): string | undefined {
  return exerciseMediaUrl(key) ?? EXERCISES[key].media;
}

export function exerciseTone(key: ExerciseKey): Tone {
  return EXERCISES[key].tone ?? { bg: "bg-canvas", ink: "stroke-ink" };
}
