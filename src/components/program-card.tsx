"use client";

import Link from "next/link";
import type { Program, ProgramTone } from "@/lib/programs";
import { useProgramProgress } from "@/lib/progress";

const TONES: Record<ProgramTone, { wash: string; ink: string }> = {
  back: { wash: "bg-program-back", ink: "text-program-back-ink" },
  core: { wash: "bg-program-core", ink: "text-program-core-ink" },
  calm: { wash: "bg-program-calm", ink: "text-program-calm-ink" },
};

export function ProgramCard({ program }: { program: Program }) {
  const { completedCount } = useProgramProgress(program.slug, program.days);
  const tone = TONES[program.tone];
  const started = completedCount > 0;

  return (
    <Link
      href={`/program/${program.slug}`}
      className={`${tone.wash} flex w-[85%] shrink-0 snap-center flex-col rounded-card p-6 transition active:scale-[0.99]`}
    >
      <p className={`${tone.ink} text-xs font-semibold uppercase tracking-[0.14em] opacity-70`}>
        {program.minutesPerDay} min / day · {program.days} days
      </p>

      <h3 className={`${tone.ink} mt-3 text-[28px] font-bold leading-[1.15] tracking-tight text-balance`}>
        {program.headline}
      </h3>

      <p className={`${tone.ink} mt-3 text-[15px] leading-relaxed opacity-80`}>
        {program.promise}
      </p>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          {started && (
            <>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-black/10"
                role="progressbar"
                aria-valuenow={completedCount}
                aria-valuemin={0}
                aria-valuemax={program.days}
                aria-label={`${program.headline} progress`}
              >
                <div
                  className={`${tone.ink} h-full rounded-full bg-current`}
                  style={{ width: `${(completedCount / program.days) * 100}%` }}
                />
              </div>
              <p className={`${tone.ink} mt-2 text-xs font-medium opacity-70`}>
                {completedCount} of {program.days} days done
              </p>
            </>
          )}
        </div>

        <span
          className={`${tone.ink} grid size-10 shrink-0 place-items-center rounded-full bg-white/50`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5 fill-none stroke-current"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h13M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
