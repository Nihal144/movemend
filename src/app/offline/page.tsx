import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-600/10 text-2xl">
        📡
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">You&apos;re offline</h1>
      <p className="max-w-sm text-sm text-black/60 dark:text-white/60">
        MoveMend can&apos;t reach the network right now. Pages you&apos;ve already visited are
        still available, and this one will refresh once you reconnect.
      </p>
    </main>
  );
}
