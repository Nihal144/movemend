"use client";

import type { Answers } from "./questions";

export type Profile = {
  answers: Answers;
  completedAt: string;
};

const KEY = "movemend.profile.v1";

const listeners = new Set<() => void>();

// useSyncExternalStore requires a referentially stable snapshot, so the parsed
// profile is cached and only rebuilt when the raw string actually changes.
let cachedRaw: string | null = null;
let cachedProfile: Profile | null = null;

function parse(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Profile;
    return parsed && typeof parsed === "object" && parsed.answers ? parsed : null;
  } catch {
    return null;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribeProfile(listener: () => void) {
  listeners.add(listener);
  // Keep other tabs in sync when the profile is saved or cleared.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getProfileSnapshot(): Profile | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedProfile = parse(raw);
  }
  return cachedProfile;
}

export function loadProfile(): Profile | null {
  return getProfileSnapshot();
}

export function saveProfile(answers: Answers): Profile {
  const profile: Profile = { answers, completedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // Private-mode quota failures shouldn't block the user from continuing.
  }
  emit();
  return profile;
}

export function clearProfile() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to do — the profile is already unreachable.
  }
  emit();
}

export function firstName(profile: Profile | null): string | null {
  const name = profile?.answers.name;
  return typeof name === "string" && name.trim() ? name.trim().split(/\s+/)[0] : null;
}
