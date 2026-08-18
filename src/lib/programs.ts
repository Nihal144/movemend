import type { PoseKey } from "@/components/pose-avatar";

export type ProgramTone = "back" | "core" | "calm";

export type Session = {
  title: string;
  focus: string;
  poses: PoseKey[];
};

export type Program = {
  slug: string;
  headline: string;
  promise: string;
  detail: string;
  minutesPerDay: number;
  days: number;
  tone: ProgramTone;
  /** Onboarding goal values this program serves. */
  goals: string[];
  /** Onboarding area values this program serves. */
  areas: string[];
  /** One week of distinct sessions; the program runs it twice. */
  block: Session[];
  /** Shown when the promise touches a medical condition. */
  caution?: string;
};

export type ProgramDay = Session & {
  day: number;
  week: number;
  holdSeconds: number;
};

const WEEK = 7;
const BASE_HOLD = 40;
const PROGRESSED_HOLD = 55;

export const PROGRAMS: Program[] = [
  {
    slug: "strong-back",
    headline: "Carry your own groceries at 80",
    promise: "Relieve and strengthen your back.",
    detail:
      "Two weeks of short, daily work that takes pressure off the spine and rebuilds the muscle that holds you upright.",
    minutesPerDay: 15,
    days: 14,
    tone: "back",
    goals: ["pain", "mobility"],
    areas: ["lower-back", "hips"],
    block: [
      { title: "Decompress", focus: "Take the load off the spine", poses: ["child", "supine", "bridge", "twist", "cobra"] },
      { title: "Hinge and Hold", focus: "Teach the hips to lead", poses: ["fold", "lunge", "bridge", "downdog", "child"] },
      { title: "Gentle Extension", focus: "Open the front line", poses: ["cobra", "bridge", "reach", "lunge", "supine"] },
      { title: "Rotation", focus: "Restore twist through the mid-back", poses: ["twist", "seated", "supine", "child", "cobra"] },
      { title: "Posterior Chain", focus: "Wake up glutes and hamstrings", poses: ["bridge", "fold", "downdog", "lunge", "supine"] },
      { title: "Carry Prep", focus: "Brace before you lift", poses: ["bridge", "cobra", "lunge", "reach", "twist"] },
      { title: "Reset", focus: "Settle everything down", poses: ["child", "supine", "seated", "twist", "fold"] },
    ],
  },
  {
    slug: "lift-grandkids",
    headline: "Lift your grandkids with ease",
    promise: "Build the core that carries you.",
    detail:
      "Daily core work built around real lifting — bracing, hinging and standing back up with something in your arms.",
    minutesPerDay: 15,
    days: 14,
    tone: "core",
    goals: ["strength"],
    areas: ["lower-back", "posture"],
    block: [
      { title: "Deep Core", focus: "Find the brace", poses: ["supine", "bridge", "child", "cobra", "seated"] },
      { title: "Anti-Rotation", focus: "Resist the twist", poses: ["twist", "bridge", "lunge", "reach", "supine"] },
      { title: "Hip Hinge", focus: "Lift from the hips, not the back", poses: ["fold", "lunge", "bridge", "downdog", "seated"] },
      { title: "Overhead", focus: "Strength above your head", poses: ["reach", "cobra", "lunge", "downdog", "twist"] },
      { title: "Split Stance", focus: "Steady on one leg", poses: ["lunge", "reach", "bridge", "fold", "child"] },
      { title: "Full Chain", focus: "Link top to bottom", poses: ["downdog", "cobra", "bridge", "lunge", "reach"] },
      { title: "Recover", focus: "Let the work consolidate", poses: ["child", "supine", "seated", "twist", "fold"] },
    ],
  },
  {
    slug: "rewind",
    headline: "Rewind your body's clock",
    promise: "Steady daily movement to help bring blood pressure down.",
    detail:
      "Unhurried, low-intensity sessions with long exhales — the kind of regular activity that supports a healthier resting blood pressure.",
    minutesPerDay: 15,
    days: 14,
    tone: "calm",
    goals: ["mobility", "pain"],
    areas: ["shoulders", "neck"],
    caution:
      "This supports a healthy routine — it isn't a treatment. Keep taking any medication as prescribed, and talk to your doctor before changing how you manage your blood pressure.",
    block: [
      { title: "Long Exhale", focus: "Slow the breath down", poses: ["supine", "child", "seated", "twist", "bridge"] },
      { title: "Easy Flow", focus: "Keep moving, keep it light", poses: ["reach", "fold", "downdog", "lunge", "cobra"] },
      { title: "Open Chest", focus: "Room to breathe", poses: ["cobra", "reach", "bridge", "twist", "supine"] },
      { title: "Legs Up", focus: "Let circulation do the work", poses: ["supine", "bridge", "child", "seated", "fold"] },
      { title: "Steady Rhythm", focus: "Gentle repeats, no rush", poses: ["fold", "reach", "lunge", "downdog", "child"] },
      { title: "Unwind Shoulders", focus: "Release what you hold up top", poses: ["twist", "reach", "seated", "cobra", "supine"] },
      { title: "Stillness", focus: "End slow", poses: ["child", "supine", "seated", "twist", "fold"] },
    ],
  },
];

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((program) => program.slug === slug);
}

/**
 * Expands the one-week block into the full schedule. Week two repeats the same
 * movements with longer holds, which is how the load progresses.
 */
export function expandSessions(program: Program): ProgramDay[] {
  return Array.from({ length: program.days }, (_, i) => {
    const day = i + 1;
    const week = Math.floor(i / WEEK) + 1;
    const session = program.block[i % program.block.length];
    return {
      ...session,
      day,
      week,
      holdSeconds: week === 1 ? BASE_HOLD : PROGRESSED_HOLD,
    };
  });
}

/**
 * Orders the home rail by fit with the questionnaire — the stated goal counts
 * for more than any single sore area.
 */
export function rankPrograms(goal: string | undefined, areas: string[]): Program[] {
  const score = (program: Program) =>
    (goal && program.goals.includes(goal) ? 2 : 0) +
    program.areas.filter((area) => areas.includes(area)).length;
  return [...PROGRAMS].sort((a, b) => score(b) - score(a));
}
