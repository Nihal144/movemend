"use client";

import { useRouter } from "next/navigation";
import { PoseAvatar } from "@/components/pose-avatar";
import { clearProfile, firstName } from "@/lib/profile";
import { QUESTIONS, type Answer } from "@/lib/questions";
import { useProfileGate } from "@/lib/use-profile";

/** Renders a stored answer using the question's own labels. */
function formatAnswer(questionId: string, value: Answer): string {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question) return String(value);

  switch (question.kind) {
    case "single":
      return question.choices.find((c) => c.value === value)?.label ?? String(value);
    case "multi":
      return (Array.isArray(value) ? value : [])
        .map((v) => question.choices.find((c) => c.value === v)?.label ?? v)
        .join(", ");
    case "scale":
      return `${value} of ${question.max}`;
    case "text":
      return String(value);
  }
}

const SUMMARY_LABELS: Record<string, string> = {
  goal: "Goal",
  areas: "Focus areas",
  pain: "Discomfort",
  experience: "Experience",
  minutes: "Session length",
  frequency: "Frequency",
};

export default function ProfilePage() {
  const router = useRouter();
  const { profile, ready } = useProfileGate();

  if (!ready) return <div className="flex-1" aria-hidden="true" />;

  const name = firstName(profile);
  const answers = profile?.answers ?? {};

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-6">
      <h1 className="border-b border-hairline pb-5 text-4xl font-bold tracking-tight">
        Profile
      </h1>

      <div className="flex items-center gap-4 pt-6">
        <PoseAvatar pose="reach" className="size-16" />
        <div>
          <p className="text-xl font-semibold">{name ?? "Your plan"}</p>
          <p className="text-sm text-muted">
            Set up {new Date(profile!.completedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <dl className="mt-8 divide-y divide-hairline rounded-2xl border border-hairline bg-surface px-4">
        {Object.entries(SUMMARY_LABELS).map(([id, label]) =>
          answers[id] === undefined ? null : (
            <div key={id} className="flex items-baseline justify-between gap-6 py-3.5">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-right text-sm font-medium">
                {formatAnswer(id, answers[id])}
              </dd>
            </div>
          ),
        )}
      </dl>

      <button
        type="button"
        onClick={() => {
          clearProfile();
          router.replace("/onboarding");
        }}
        className="mt-8 w-full rounded-full border-2 border-hairline px-6 py-4 text-[15px] font-semibold transition active:scale-[0.98]"
      >
        Retake questionnaire
      </button>
    </main>
  );
}
