"use client";

import Link from "next/link";
import type { Program, ProgramDay, ProgramTone } from "@/lib/programs";
import { useProgramProgress } from "@/lib/progress";

const TONES: Record<ProgramTone, { wash: string; ink: string }> = {
  back: { wash: "bg-program-back", ink: "text-program-back-ink" },
  core: { wash: "bg-program-core", ink: "text-program-core-ink" },
  calm: { wash: "bg-program-calm", ink: "text-program-calm-ink" },
};

export function ProgramDetail({ program, days }: { program: Program; days: ProgramDay[] }) {
  const { completedCount, isComplete, isUnlocked, nextDay, resetProgram } = useProgramProgress(
    program.slug,
    program.days,
  );
  const tone = TONES[program.tone];
  const finished = nextDay === null;

  return (
    <main className="mx-auto w-full max-w-md flex-1 pb-8">
      <div className={`${tone.wash} px-6 pb-7 pt-6`}>
        <Link href="/" className={`${tone.ink} text-sm font-medium opacity-70`}>
          ← Today
        </Link>

        <p className={`${tone.ink} pt-6 text-xs font-semibold uppercase tracking-[0.14em] opacity-70`}>
          {program.minutesPerDay} min / day · {program.days} days
        </p>
        <h1 className={`${tone.ink} mt-2 text-[32px] font-bold leading-[1.15] tracking-tight text-balance`}>
          {program.headline}
        </h1>
        <p className={`${tone.ink} mt-3 text-[15px] leading-relaxed opacity-80`}>
          {program.detail}
        </p>

        <div className="mt-6">
          <div
            className="h-2 overflow-hidden rounded-full bg-black/10"
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={program.days}
            aria-label="Program progress"
          >
            <div
              className={`${tone.ink} h-full rounded-full bg-current transition-all duration-300`}
              style={{ width: `${(completedCount / program.days) * 100}%` }}
            />
          </div>
          <p className={`${tone.ink} mt-2 text-xs font-medium opacity-70`}>
            {completedCount} of {program.days} days done
          </p>
        </div>

        {!finished && (
          <Link
            href={`/program/${program.slug}/day/${nextDay}`}
            className="mt-6 block rounded-full bg-ink px-6 py-4 text-center text-[15px] font-semibold text-white transition active:scale-[0.98]"
          >
            {completedCount === 0 ? "Start day 1" : `Continue — day ${nextDay}`}
          </Link>
        )}
      </div>

      {program.caution && (
        <p className="mx-6 mt-6 rounded-2xl border border-hairline bg-surface p-4 text-[13px] leading-relaxed text-muted">
          {program.caution}
        </p>
      )}

      <ol className="mt-6 flex flex-col gap-2 px-6">
        {days.map((day) => {
          const done = isComplete(day.day);
          const open = isUnlocked(day.day);
          const isNext = day.day === nextDay;

          const inner = (
            <>
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full text-[13px] font-semibold tabular-nums ${
                  done ? "bg-ink text-white" : open ? "bg-canvas text-ink" : "bg-canvas text-muted"
                }`}
              >
                {done ? "✓" : day.day}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold leading-tight">{day.title}</span>
                <span className="mt-0.5 block text-sm text-muted">
                  {day.focus} · {day.holdSeconds}s holds
                </span>
              </span>
              {isNext && (
                <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand">
                  Next
                </span>
              )}
              {!open && (
                <svg
                  viewBox="0 0 24 24"
                  className="size-4 shrink-0 fill-none stroke-muted"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" />
                </svg>
              )}
            </>
          );

          return (
            <li key={day.day}>
              {open ? (
                <Link
                  href={`/program/${program.slug}/day/${day.day}`}
                  className="flex items-center gap-3.5 rounded-2xl border border-hairline bg-surface p-3.5 transition active:scale-[0.99]"
                >
                  {inner}
                </Link>
              ) : (
                <div
                  aria-disabled="true"
                  className="flex items-center gap-3.5 rounded-2xl border border-hairline bg-surface/50 p-3.5 opacity-60"
                >
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {completedCount > 0 && (
        <button
          type="button"
          onClick={resetProgram}
          className="mx-6 mt-6 block rounded-full border-2 border-hairline px-6 py-3 text-sm font-semibold transition active:scale-[0.98]"
        >
          Reset progress
        </button>
      )}
    </main>
  );
}
