"use client";

import Link from "next/link";
import { PoseAvatar } from "@/components/pose-avatar";
import { firstName } from "@/lib/profile";
import { AREAS, rankRoutines, type Routine } from "@/lib/routines";
import { useProfileGate } from "@/lib/use-profile";

/** Grid slots that hold a pose; every other cell renders as a pale dot. */
const POSE_SLOTS = [2, 3, 6, 7, 8, 11, 12];
const GRID_CELLS = 20;

export default function TodayPage() {
  const { profile, ready } = useProfileGate();

  if (!ready) return <div className="flex-1" aria-hidden="true" />;

  const answers = profile?.answers ?? {};
  const areas = Array.isArray(answers.areas) ? (answers.areas as string[]) : [];
  const routines = rankRoutines(areas);
  const name = firstName(profile);

  const now = new Date();
  const month = now.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  const weekday = now.toLocaleDateString(undefined, { weekday: "long" });

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 pt-6">
      <header className="flex items-start justify-between border-b border-hairline pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            {month}
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight">{weekday}</h1>
        </div>
        <Link
          href="/profile"
          aria-label="Your profile"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-hairline/70 text-muted"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-6 fill-none stroke-current"
            strokeWidth={1.9}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="9" r="3.4" />
            <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
          </svg>
        </Link>
      </header>

      <p className="pt-6 text-[15px] text-muted">
        {name ? `Good to see you, ${name}.` : "Good to see you."} Here&apos;s today&apos;s plan.
      </p>

      {/* Edge-bleeding snap rail, so the next card peeks in from the right. */}
      <section className="-mx-6 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 no-scrollbar">
        {routines.map((routine) => (
          <RoutineCard key={routine.slug} routine={routine} />
        ))}
      </section>

      <h2 className="pt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Browse by area
      </h2>
      <ul className="grid grid-cols-3 gap-3 pb-8 pt-4">
        {AREAS.map((area) => (
          <li key={area.slug}>
            <Link
              href={`/area/${area.slug}`}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-hairline bg-surface px-2 py-4 transition active:scale-[0.98]"
            >
              <PoseAvatar pose={area.pose} className="size-12" />
              <span className="text-center text-[13px] font-semibold leading-tight">
                {area.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function RoutineCard({ routine }: { routine: Routine }) {
  const slots = POSE_SLOTS.slice(0, routine.poses.length);

  return (
    <Link
      href={`/routine/${routine.slug}`}
      className="w-[85%] shrink-0 snap-center rounded-card bg-surface p-6 shadow-[0_2px_20px_rgba(0,0,0,0.05)] transition active:scale-[0.99]"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {routine.minutes} minutes
      </p>
      <h3 className="mt-1 text-3xl font-bold tracking-tight">{routine.title}</h3>

      <div className="mt-5 grid grid-cols-5 gap-2.5" aria-hidden="true">
        {Array.from({ length: GRID_CELLS }, (_, cell) => {
          const poseIndex = slots.indexOf(cell);
          return poseIndex === -1 ? (
            <span key={cell} className="aspect-square rounded-full bg-canvas" />
          ) : (
            <PoseAvatar
              key={cell}
              pose={routine.poses[poseIndex]}
              className="aspect-square w-full"
            />
          );
        })}
      </div>

      <p className="mt-5 text-sm text-muted">{routine.blurb}</p>
    </Link>
  );
}
