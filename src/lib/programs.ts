import type { ExerciseKey } from "@/lib/exercises";

export type ProgramTone = "back" | "core" | "calm";

export type Session = {
  title: string;
  focus: string;
  exercises: ExerciseKey[];
  /** Overrides the program-wide per-exercise duration. */
  seconds?: number;
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
  /** The block of distinct sessions; the program cycles through it. */
  block: Session[];
  /** Shown when the promise touches a medical condition. */
  caution?: string;
};

export type ProgramDay = Session & {
  day: number;
  week: number;
  /** Seconds spent on each exercise in this session. */
  seconds: number;
};

const WEEK = 7;
/** Each exercise runs two minutes; week two adds thirty seconds. */
const BASE_SECONDS = 120;
const PROGRESSED_SECONDS = 150;

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
      { title: "Decompress", focus: "Take the load off the spine", exercises: ["child", "supine", "bridge", "twist", "cobra", "seated", "fold"] },
      { title: "Hinge and Hold", focus: "Teach the hips to lead", exercises: ["fold", "lunge", "bridge", "downdog", "child", "reach", "supine"] },
      { title: "Gentle Extension", focus: "Open the front line", exercises: ["cobra", "bridge", "reach", "lunge", "supine", "child", "twist"] },
      { title: "Rotation", focus: "Restore twist through the mid-back", exercises: ["twist", "seated", "supine", "child", "cobra", "bridge", "fold"] },
      { title: "Posterior Chain", focus: "Wake up glutes and hamstrings", exercises: ["bridge", "fold", "downdog", "lunge", "supine", "child", "seated"] },
      { title: "Carry Prep", focus: "Brace before you lift", exercises: ["bridge", "cobra", "lunge", "reach", "twist", "downdog", "child"] },
      { title: "Reset", focus: "Settle everything down", exercises: ["child", "supine", "seated", "twist", "fold", "bridge", "cobra"] },
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
      { title: "Deep Core", focus: "Find the brace", exercises: ["supine", "bridge", "child", "cobra", "seated", "twist", "fold"] },
      { title: "Anti-Rotation", focus: "Resist the twist", exercises: ["twist", "bridge", "lunge", "reach", "supine", "downdog", "child"] },
      { title: "Hip Hinge", focus: "Lift from the hips, not the back", exercises: ["fold", "lunge", "bridge", "downdog", "seated", "cobra", "supine"] },
      { title: "Overhead", focus: "Strength above your head", exercises: ["reach", "cobra", "lunge", "downdog", "twist", "bridge", "child"] },
      { title: "Split Stance", focus: "Steady on one leg", exercises: ["lunge", "reach", "bridge", "fold", "child", "supine", "seated"] },
      { title: "Full Chain", focus: "Link top to bottom", exercises: ["downdog", "cobra", "bridge", "lunge", "reach", "twist", "fold"] },
      { title: "Recover", focus: "Let the work consolidate", exercises: ["child", "supine", "seated", "twist", "fold", "bridge", "cobra"] },
    ],
  },
  {
    slug: "rewind",
    headline: "Rewind your body's clock",
    promise: "Steady daily breathing to help bring blood pressure down.",
    detail:
      "The same ten-minute breathing protocol every day: five paced exercises that calm the nervous system and slow your breathing rate. Consistency is what makes it work.",
    minutesPerDay: 10,
    days: 14,
    tone: "calm",
    goals: ["mobility", "pain"],
    areas: ["shoulders", "neck"],
    caution:
      "This supports a healthy routine — it isn't a treatment. Keep taking any medication as prescribed, and talk to your doctor before changing how you manage your blood pressure.",
    // A fixed daily protocol rather than a rotating block: the same five
    // exercises every day, which is how paced-breathing programmes are run.
    block: [
      {
        title: "BP & Breathing",
        focus: "Calm the nervous system and slow the breath",
        seconds: 120,
        exercises: ["diaphragmatic", "four-six", "box-gentle", "pursed-lip", "long-exhale"],
      },
    ],
  },
];

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((program) => program.slug === slug);
}

/**
 * Expands the block into the full schedule. Programs with a rotating block
 * progress by holding longer in week two; a single-session block (the
 * breathing protocol) repeats unchanged, so it pins its own duration.
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
      seconds: session.seconds ?? (week === 1 ? BASE_SECONDS : PROGRESSED_SECONDS),
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

/** Total minutes for a session, rounded for display. */
export function sessionMinutes(day: ProgramDay): number {
  return Math.round((day.exercises.length * day.seconds) / 60);
}
