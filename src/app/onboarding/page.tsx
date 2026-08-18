"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { QUESTIONS, type Answers, type Question } from "@/lib/questions";
import { saveProfile } from "@/lib/profile";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUESTIONS[step];
  const total = QUESTIONS.length;
  const isLast = step === total - 1;
  const current = answers[question.id];

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const finish = useCallback(
    (final: Answers) => {
      saveProfile(final);
      router.replace("/");
    },
    [router],
  );

  const goNext = useCallback(
    (final: Answers) => {
      if (isLast) finish(final);
      else setStep((s) => s + 1);
    },
    [isLast, finish],
  );

  const answer = useCallback(
    (value: Answers[string], { advance }: { advance: boolean }) => {
      const next = { ...answers, [question.id]: value };
      setAnswers(next);
      if (!advance) return;
      // Brief pause so the selected state is visible before the step changes.
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => goNext(next), 180);
    },
    [answers, question.id, goNext],
  );

  const canContinue = isAnswered(question, current);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col px-6 pb-10 pt-6">
      <header className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          aria-label="Previous question"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ink transition disabled:opacity-25"
        >
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={2.2}>
            <path d="M15 5 L8 12 L15 19" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label="Onboarding progress"
        >
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>

        <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
          {step + 1}/{total}
        </span>
      </header>

      {/* Keyed on question id so each step remounts and replays the transition. */}
      <div key={question.id} className="step-in flex flex-1 flex-col pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-balance">{question.title}</h1>
        {question.subtitle && (
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{question.subtitle}</p>
        )}

        <div className="pt-8">
          <QuestionControl question={question} value={current} onAnswer={answer} />
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => goNext(answers)}
            disabled={!canContinue}
            className="w-full rounded-full bg-ink px-6 py-4 text-[15px] font-semibold text-white transition active:scale-[0.98] disabled:bg-hairline disabled:text-muted disabled:active:scale-100"
          >
            {isLast ? "Build my plan" : "Continue"}
          </button>
        </div>
      </div>
    </main>
  );
}

function isAnswered(question: Question, value: unknown): boolean {
  switch (question.kind) {
    case "text":
      return typeof value === "string" && value.trim().length > 0;
    case "multi":
      return Array.isArray(value) && value.length >= question.min;
    case "scale":
      return typeof value === "number";
    case "single":
      return typeof value === "string";
  }
}

type ControlProps = {
  question: Question;
  value: unknown;
  onAnswer: (value: Answers[string], opts: { advance: boolean }) => void;
};

function QuestionControl({ question, value, onAnswer }: ControlProps) {
  switch (question.kind) {
    case "text":
      return (
        <input
          autoFocus
          type="text"
          value={typeof value === "string" ? value : ""}
          placeholder={question.placeholder}
          onChange={(e) => onAnswer(e.target.value, { advance: false })}
          className="w-full border-b-2 border-hairline bg-transparent pb-3 text-2xl font-medium outline-none placeholder:text-muted/60 focus:border-brand"
        />
      );

    case "single":
      return (
        <ul className="flex flex-col gap-3">
          {question.choices.map((choice) => {
            const selected = value === choice.value;
            return (
              <li key={choice.value}>
                <button
                  type="button"
                  onClick={() => onAnswer(choice.value, { advance: true })}
                  aria-pressed={selected}
                  className={`w-full rounded-2xl border-2 px-5 py-4 text-left transition active:scale-[0.99] ${
                    selected
                      ? "border-brand bg-brand-soft"
                      : "border-transparent bg-surface hover:border-hairline"
                  }`}
                >
                  <span className="block font-semibold">{choice.label}</span>
                  {choice.hint && (
                    <span className="mt-0.5 block text-sm text-muted">{choice.hint}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      );

    case "multi": {
      const selected = Array.isArray(value) ? (value as string[]) : [];
      return (
        <ul className="flex flex-wrap gap-2.5">
          {question.choices.map((choice) => {
            const on = selected.includes(choice.value);
            return (
              <li key={choice.value}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    onAnswer(
                      on
                        ? selected.filter((v) => v !== choice.value)
                        : [...selected, choice.value],
                      { advance: false },
                    )
                  }
                  className={`rounded-full border-2 px-5 py-3 text-[15px] font-medium transition active:scale-[0.97] ${
                    on ? "border-brand bg-brand-soft" : "border-transparent bg-surface"
                  }`}
                >
                  {choice.label}
                </button>
              </li>
            );
          })}
        </ul>
      );
    }

    case "scale": {
      const steps = Array.from(
        { length: question.max - question.min + 1 },
        (_, i) => question.min + i,
      );
      return (
        <div>
          <div className="flex flex-wrap gap-2">
            {steps.map((n) => {
              const on = value === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onAnswer(n, { advance: false })}
                  className={`size-11 rounded-full text-[15px] font-semibold tabular-nums transition active:scale-95 ${
                    on ? "bg-ink text-white" : "bg-surface text-ink"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between text-xs font-medium uppercase tracking-wide text-muted">
            <span>{question.minLabel}</span>
            <span>{question.maxLabel}</span>
          </div>
        </div>
      );
    }
  }
}
