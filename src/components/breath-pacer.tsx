"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { BreathPhase } from "@/lib/exercises";
import type { Tone } from "@/components/pose-avatar";

/**
 * Paces a breathing pattern: the circle grows on the inhale, holds, and shrinks
 * on the exhale. The motion is a generated CSS keyframe so it loops smoothly on
 * the compositor; JS only tracks which phase to label.
 */
export function BreathPacer({
  phases,
  paused,
  tone,
}: {
  phases: BreathPhase[];
  paused: boolean;
  tone: Tone;
}) {
  const rawId = useId();
  const name = `breath-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const total = phases.reduce((sum, phase) => sum + phase.seconds, 0);

  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused) {
      pausedAtRef.current = Date.now();
      return;
    }
    if (startRef.current === null) {
      startRef.current = Date.now();
    } else if (pausedAtRef.current !== null) {
      startRef.current += Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    const start = startRef.current;
    const id = setInterval(() => setElapsed((Date.now() - start) / 1000), 100);
    return () => clearInterval(id);
  }, [paused]);

  // Derive the active phase from elapsed time rather than storing it.
  const withinCycle = total > 0 ? elapsed % total : 0;
  let acc = 0;
  let phase = phases[0];
  let remaining = phases[0].seconds;
  for (const candidate of phases) {
    if (withinCycle < acc + candidate.seconds) {
      phase = candidate;
      remaining = acc + candidate.seconds - withinCycle;
      break;
    }
    acc += candidate.seconds;
  }

  const keyframes = buildKeyframes(name, phases, total);
  const textInk = tone.ink.includes("white") ? "text-white" : "text-ink";

  return (
    <div
      className={`${tone.bg} relative grid aspect-square w-full place-items-center overflow-hidden rounded-card`}
      role="img"
      aria-label={`Breathing pacer: ${phase.label}`}
    >
      <style>{keyframes}</style>
      <div
        className="absolute aspect-square w-3/4 rounded-full bg-white/45"
        style={{
          animation: `${name} ${total}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      />
      <div className={`${textInk} relative text-center`}>
        <p className="text-xl font-semibold tracking-tight">{phase.label}</p>
        <p className="text-6xl font-bold tabular-nums leading-tight">{Math.ceil(remaining)}</p>
      </div>
    </div>
  );
}

function buildKeyframes(name: string, phases: BreathPhase[], total: number): string {
  // The cycle starts where it ends, so the loop has no visible seam.
  const stops = [`0% { transform: scale(${phases[phases.length - 1].scale}); }`];
  let acc = 0;
  for (const phase of phases) {
    acc += phase.seconds;
    const pct = ((acc / total) * 100).toFixed(3);
    stops.push(`${pct}% { transform: scale(${phase.scale}); }`);
  }
  return `@keyframes ${name} { ${stops.join(" ")} }`;
}
