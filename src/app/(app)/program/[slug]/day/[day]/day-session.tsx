"use client";

import Link from "next/link";
import { ExerciseAvatar } from "@/components/exercise-avatar";
import { exerciseFor } from "@/lib/exercises";
import { formatClock } from "@/lib/format";
import { sessionMinutes, type Program, type ProgramDay } from "@/lib/programs";
import { useProgramProgress } from "@/lib/progress";

export function DaySession({ program, session }: { program: Program; session: ProgramDay }) {
  const { isComplete } = useProgramProgress(program.slug, program.days);
  const done = isComplete(session.day);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-6">
      <Link href={`/program/${program.slug}`} className="text-sm font-medium text-muted">
        ← {program.headline}
      </Link>

      <p className="pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Day {session.day} of {program.days} · Week {session.week}
      </p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">{session.title}</h1>
      <p className="mt-3 text-[15px] text-muted">{session.focus}</p>
      <p className="mt-1 text-[15px] text-muted">
        {session.exercises.length} exercises · {formatClock(session.seconds)} each ·{" "}
        {sessionMinutes(session)} min total
      </p>

      {done && (
        <p className="mt-6 rounded-2xl bg-brand-soft px-4 py-3 text-center text-sm font-semibold text-brand">
          You&apos;ve completed this day
        </p>
      )}

      <ol className="mt-8 flex flex-col gap-2.5">
        {session.exercises.map((key, i) => {
          const exercise = exerciseFor(key);
          return (
            <li
              key={`${key}-${i}`}
              className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-3"
            >
              <ExerciseAvatar exercise={key} className="size-14" />
              <div className="min-w-0">
                <p className="font-semibold leading-tight">{exercise.name}</p>
                <p className="text-sm text-muted">{formatClock(session.seconds)}</p>
              </div>
              <span className="ml-auto pr-2 text-sm tabular-nums text-muted">{i + 1}</span>
            </li>
          );
        })}
      </ol>

      <Link
        href={`/program/${program.slug}/day/${session.day}/play`}
        className="mt-8 block rounded-full bg-ink px-6 py-4 text-center text-[15px] font-semibold text-white transition active:scale-[0.98]"
      >
        {done ? "Do it again" : "Start session"}
      </Link>
    </main>
  );
}
