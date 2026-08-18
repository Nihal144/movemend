import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are currently offline.",
};

export default function OfflinePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-surface text-muted">
        <svg
          viewBox="0 0 24 24"
          className="size-7 fill-none stroke-current"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 3 L21 21 M5 12.5a10 10 0 0 1 4-2.4 M2 8.8a15 15 0 0 1 5-3 M12 19h.01 M8.5 15.8a5 5 0 0 1 3-1.3 M13.5 10.4a15 15 0 0 1 8.5 -1.6" />
        </svg>
      </span>
      <h1 className="text-2xl font-semibold tracking-tight">You&apos;re offline</h1>
      <p className="max-w-sm text-[15px] leading-relaxed text-muted">
        MoveMend can&apos;t reach the network right now. Pages you&apos;ve already visited are
        still available, and this one will refresh once you reconnect.
      </p>
    </main>
  );
}
