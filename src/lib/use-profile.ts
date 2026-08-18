"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { getProfileSnapshot, subscribeProfile, type Profile } from "./profile";

const noopSubscribe = () => () => {};

/**
 * Gates a screen behind completed onboarding. The profile lives in
 * localStorage, which the server can't see — `ready` stays false through
 * hydration so a brand-new visitor never flashes the signed-in shell.
 */
export function useProfileGate(): { profile: Profile | null; ready: boolean } {
  const router = useRouter();

  const profile = useSyncExternalStore(subscribeProfile, getProfileSnapshot, () => null);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (hydrated && !profile) router.replace("/onboarding");
  }, [hydrated, profile, router]);

  return { profile, ready: hydrated && profile !== null };
}
