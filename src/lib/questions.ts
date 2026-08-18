export type Choice = {
  value: string;
  label: string;
  hint?: string;
};

/**
 * Onboarding is a linear list of questions, one per screen. Each kind renders
 * its own control and decides whether answering advances automatically.
 */
export type Question =
  | { id: string; kind: "text"; title: string; subtitle?: string; placeholder: string }
  | { id: string; kind: "single"; title: string; subtitle?: string; choices: Choice[] }
  | {
      id: string;
      kind: "multi";
      title: string;
      subtitle?: string;
      choices: Choice[];
      min: number;
    }
  | {
      id: string;
      kind: "scale";
      title: string;
      subtitle?: string;
      min: number;
      max: number;
      minLabel: string;
      maxLabel: string;
    };

export type Answer = string | string[] | number;
export type Answers = Record<string, Answer>;

export const QUESTIONS: Question[] = [
  {
    id: "name",
    kind: "text",
    title: "First, what should we call you?",
    subtitle: "We use this to personalise your daily plan.",
    placeholder: "Your name",
  },
  {
    id: "goal",
    kind: "single",
    title: "What brings you to MoveMend?",
    subtitle: "Pick the one that matters most right now.",
    choices: [
      { value: "pain", label: "Ease pain", hint: "Relieve a nagging ache" },
      { value: "mobility", label: "Move more freely", hint: "Restore range of motion" },
      { value: "posture", label: "Fix my posture", hint: "Undo desk-bound habits" },
      { value: "strength", label: "Rebuild strength", hint: "Return after an injury" },
    ],
  },
  {
    id: "areas",
    kind: "multi",
    title: "Where do you feel it most?",
    subtitle: "Choose as many as apply.",
    min: 1,
    choices: [
      { value: "neck", label: "Neck" },
      { value: "shoulders", label: "Shoulders" },
      { value: "lower-back", label: "Lower back" },
      { value: "hips", label: "Hips" },
      { value: "hamstrings", label: "Hamstrings" },
      { value: "knees", label: "Knees" },
    ],
  },
  {
    id: "pain",
    kind: "scale",
    title: "How much discomfort are you in today?",
    subtitle: "Be honest — we scale your first sessions to this.",
    min: 0,
    max: 10,
    minLabel: "None",
    maxLabel: "Severe",
  },
  {
    id: "experience",
    kind: "single",
    title: "How familiar are you with mobility work?",
    choices: [
      { value: "new", label: "Brand new", hint: "Start me from the basics" },
      { value: "some", label: "Some experience", hint: "I know a few stretches" },
      { value: "regular", label: "I practise regularly", hint: "Give me the full range" },
    ],
  },
  {
    id: "minutes",
    kind: "single",
    title: "How long should a session be?",
    subtitle: "Short and consistent beats long and occasional.",
    choices: [
      { value: "5", label: "5 minutes", hint: "A quick daily reset" },
      { value: "10", label: "10 minutes", hint: "The sweet spot" },
      { value: "15", label: "15 minutes", hint: "A deeper practice" },
      { value: "20", label: "20 minutes", hint: "Full session" },
    ],
  },
  {
    id: "frequency",
    kind: "single",
    title: "How often do you want to move?",
    choices: [
      { value: "daily", label: "Every day" },
      { value: "5x", label: "5 days a week" },
      { value: "3x", label: "3 days a week" },
      { value: "flexible", label: "Keep it flexible" },
    ],
  },
];
