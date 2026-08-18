import { InstallPrompt } from "@/components/install-prompt";

const features = [
  {
    title: "Guided sessions",
    body: "Follow structured movement plans built around your recovery stage.",
  },
  {
    title: "Progress tracking",
    body: "Log range of motion and pain scores, and watch the trend line move.",
  },
  {
    title: "Works offline",
    body: "Installed as an app, MoveMend keeps working without a connection.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-16">
      <header className="flex flex-col items-center gap-5 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-600/20">
          <svg viewBox="0 0 512 512" className="size-9" aria-hidden="true">
            <path
              d="M112 344 L200 256 L272 328 L392 184"
              fill="none"
              stroke="white"
              strokeWidth="46"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="392" cy="184" r="30" fill="white" />
          </svg>
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">MoveMend</h1>
        <p className="max-w-md text-balance text-black/60 dark:text-white/60">
          Track your movement, guide your recovery.
        </p>
        <InstallPrompt />
      </header>

      <ul className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="rounded-2xl border border-black/10 p-5 dark:border-white/15"
          >
            <h2 className="font-medium">{feature.title}</h2>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">{feature.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
