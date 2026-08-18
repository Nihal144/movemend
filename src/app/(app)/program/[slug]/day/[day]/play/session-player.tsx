"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ExerciseMedia } from "@/components/exercise-media";
import { exerciseFor } from "@/lib/exercises";
import { formatClock } from "@/lib/format";
import type { Program, ProgramDay } from "@/lib/programs";
import { useProgramProgress } from "@/lib/progress";

export function SessionPlayer({ program, session }: { program: Program; session: ProgramDay }) {
  const router = useRouter();
  const { completeDay } = useProgramProgress(program.slug, program.days);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = session.poses.length;
  const pose = session.poses[index];
  const exercise = exerciseFor(pose);

  const advance = useCallback(() => {
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    completeDay(session.day);
    setFinished(true);
  }, [index, total, completeDay, session.day]);

  useKeepAwake(!paused && !finished);

  if (finished) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-brand-soft text-2xl text-brand">
          ✓
        </span>
        <h1 className="text-3xl font-bold tracking-tight">Day {session.day} complete</h1>
        <p className="text-[15px] text-muted">
          {total} exercises done. That&apos;s {program.headline.toLowerCase()} one day closer.
        </p>
        <Link
          href={`/program/${program.slug}`}
          className="mt-2 w-full rounded-full bg-ink px-6 py-4 text-[15px] font-semibold text-white transition active:scale-[0.98]"
        >
          Back to the plan
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-8 pt-4">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push(`/program/${program.slug}/day/${session.day}`)}
          aria-label="End session"
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted"
        >
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={2.2}>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <ol className="flex flex-1 gap-1.5" aria-label={`Exercise ${index + 1} of ${total}`}>
          {session.poses.map((_, i) => (
            <li
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-ink" : "bg-hairline"}`}
            />
          ))}
        </ol>

        <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
          {index + 1}/{total}
        </span>
      </header>

      <div className="pt-5">
        <ExerciseMedia pose={pose} />
      </div>

      {/* Keyed on the exercise so each one starts a fresh timer. */}
      <ExerciseTimer key={index} seconds={session.seconds} paused={paused} onDone={advance} />

      <h1 className="pt-5 text-3xl font-bold tracking-tight" aria-live="polite">
        {exercise.name}
      </h1>
      <p className="pt-2 text-[15px] leading-relaxed text-muted">{exercise.description}</p>

      <div className="mt-auto flex items-center gap-3 pt-8">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          aria-label="Previous exercise"
          className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-hairline transition active:scale-95 disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth={2.2}>
            <path d="M15 5L8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-hairline transition active:scale-95"
          aria-label={paused ? "Resume timer" : "Pause timer"}
        >
          {paused ? (
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
              <path d="M8 5l11 7-11 7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
              <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={advance}
          className="h-14 flex-1 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition active:scale-[0.98]"
        >
          {index + 1 === total ? "Finish" : "Next exercise"}
        </button>
      </div>
    </main>
  );
}

function ExerciseTimer({
  seconds,
  paused,
  onDone,
}: {
  seconds: number;
  paused: boolean;
  onDone: () => void;
}) {
  const [remaining, setRemaining] = useState(seconds);
  // Deadline-based so the countdown stays accurate if timers are throttled.
  // Set on the first running tick rather than at render, which must stay pure.
  const deadlineRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) {
      pausedAtRef.current = Date.now();
      return;
    }
    if (deadlineRef.current === null) {
      deadlineRef.current = Date.now() + seconds * 1000;
    } else if (pausedAtRef.current !== null) {
      deadlineRef.current += Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    const deadline = deadlineRef.current;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        clearInterval(id);
        onDone();
      }
    }, 200);
    return () => clearInterval(id);
  }, [paused, onDone, seconds]);

  const elapsed = ((seconds - remaining) / seconds) * 100;

  return (
    <div className="pt-6">
      <p
        role="timer"
        aria-live="off"
        className="text-center text-6xl font-bold tabular-nums tracking-tight"
      >
        {formatClock(remaining)}
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-hairline">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-200 ease-linear"
          style={{ width: `${elapsed}%` }}
        />
      </div>
    </div>
  );
}

/** Holds a screen wake lock while a session is running, where supported. */
function useKeepAwake(active: boolean) {
  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;
    let sentinel: WakeLockSentinel | null = null;
    let released = false;

    navigator.wakeLock
      .request("screen")
      .then((lock) => {
        if (released) lock.release();
        else sentinel = lock;
      })
      .catch(() => {
        // Denied or unsupported — the session still runs, the screen may dim.
      });

    return () => {
      released = true;
      sentinel?.release().catch(() => {});
    };
  }, [active]);
}
