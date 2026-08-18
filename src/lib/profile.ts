"use client";

import { createLocalStore } from "./local-store";
import type { Answers } from "./questions";

export type Profile = {
  answers: Answers;
  completedAt: string;
};

const store = createLocalStore<Profile>("movemend.profile.v1", (value) => {
  const profile = value as Profile;
  return profile && typeof profile === "object" && profile.answers ? profile : null;
});

export const subscribeProfile = store.subscribe;
export const getProfileSnapshot = store.getSnapshot;
export const getProfileServerSnapshot = store.getServerSnapshot;

export function loadProfile(): Profile | null {
  return store.getSnapshot();
}

export function saveProfile(answers: Answers): Profile {
  const profile: Profile = { answers, completedAt: new Date().toISOString() };
  store.set(profile);
  return profile;
}

export function clearProfile() {
  store.clear();
}

export function firstName(profile: Profile | null): string | null {
  const name = profile?.answers.name;
  return typeof name === "string" && name.trim() ? name.trim().split(/\s+/)[0] : null;
}
