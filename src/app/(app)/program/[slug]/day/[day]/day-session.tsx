"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PoseAvatar } from "@/components/pose-avatar";
import type { Program, ProgramDay } from "@/lib/programs";
import { useProgramProgress } from "@/lib/progress";

export function DaySession({ program, session }: { program: Program; session: ProgramDay }) {
  const router = useRouter();
  const { isComplete, completeDay } = useProgramProgress(program.slug, program.days);
  const done = isComplete(session.day);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-6">
      <Link href={`/program/${program.slug}`} className="text-sm font-medium text-muted">
        ← {program.headline}
      </Link>

      <p className="pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Day {session.day} of {program.days} · Week {session.week} · {program.minutesPerDay} min
      </p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">{session.title}</h1>
      <p className="mt-3 text-[15px] text-muted">{session.focus}</p>

      <ol className="mt-8 flex flex-col gap-2.5">
        {session.poses.map((pose, i) => (
          <li
            key={`${pose}-${i}`}
            className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-3"
          >
            <PoseAvatar pose={pose} className="size-14" />
            <div>
              <p className="font-semibold capitalize">{pose}</p>
              <p className="text-sm text-muted">Hold {session.holdSeconds} seconds</p>
            </div>
            <span className="ml-auto pr-2 text-sm tabular-nums text-muted">{i + 1}</span>
          </li>
        ))}
      </ol>

      {done ? (
        <p className="mt-8 rounded-full bg-brand-soft px-6 py-4 text-center text-[15px] font-semibold text-brand">
          Day {session.day} complete
        </p>
      ) : (
        <button
          type="button"
          onClick={() => {
            completeDay(session.day);
            router.push(`/program/${program.slug}`);
          }}
          className="mt-8 w-full rounded-full bg-ink px-6 py-4 text-[15px] font-semibold text-white transition active:scale-[0.98]"
        >
          Mark day {session.day} complete
        </button>
      )}
    </main>
  );
}
