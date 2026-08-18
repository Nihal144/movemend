"use client";

import { useCallback, useSyncExternalStore } from "react";
import { createLocalStore } from "./local-store";

export type ProgramProgress = {
  completedDays: number[];
  startedAt: string;
};

export type ProgressMap = Record<string, ProgramProgress>;

const store = createLocalStore<ProgressMap>("movemend.progress.v1", (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? (value as ProgressMap) : null,
);

// Stable reference so components with no saved progress don't re-render.
const NONE: ProgramProgress = { completedDays: [], startedAt: "" };

function entryFor(map: ProgressMap | null, slug: string): ProgramProgress {
  const entry = map?.[slug];
  return entry && Array.isArray(entry.completedDays) ? entry : NONE;
}

export function useProgressMap(): ProgressMap | null {
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
}

export function useProgramProgress(slug: string, totalDays: number) {
  const map = useProgressMap();
  const { completedDays } = entryFor(map, slug);

  const completeDay = useCallback(
    (day: number) => {
      const current = store.getSnapshot() ?? {};
      const existing = entryFor(current, slug);
      if (existing.completedDays.includes(day)) return;
      store.set({
        ...current,
        [slug]: {
          completedDays: [...existing.completedDays, day].sort((a, b) => a - b),
          startedAt: existing.startedAt || new Date().toISOString(),
        },
      });
    },
    [slug],
  );

  const resetProgram = useCallback(() => {
    const current = store.getSnapshot() ?? {};
    const next = { ...current };
    delete next[slug];
    store.set(next);
  }, [slug]);

  const isComplete = (day: number) => completedDays.includes(day);
  // Day one is always open; each later day opens once the one before it is done.
  const isUnlocked = (day: number) => day === 1 || completedDays.includes(day - 1);

  const nextDay =
    Array.from({ length: totalDays }, (_, i) => i + 1).find((day) => !isComplete(day)) ?? null;

  return {
    completedDays,
    completedCount: completedDays.length,
    isComplete,
    isUnlocked,
    nextDay,
    completeDay,
    resetProgram,
  };
}
