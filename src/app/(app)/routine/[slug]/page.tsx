import Link from "next/link";
import { notFound } from "next/navigation";
import { PoseAvatar } from "@/components/pose-avatar";
import { ROUTINES } from "@/lib/routines";

export function generateStaticParams() {
  return ROUTINES.map((routine) => ({ slug: routine.slug }));
}

export default async function RoutinePage({ params }: PageProps<"/routine/[slug]">) {
  const { slug } = await params;
  const routine = ROUTINES.find((r) => r.slug === slug);
  if (!routine) notFound();

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-6">
      <Link href="/" className="text-sm font-medium text-muted">
        ← Today
      </Link>
      <p className="pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {routine.minutes} minutes · {routine.poses.length} poses
      </p>
      <h1 className="mt-1 text-4xl font-bold tracking-tight">{routine.title}</h1>
      <p className="mt-3 text-[15px] text-muted">{routine.blurb}</p>

      <ol className="mt-8 flex flex-col gap-2.5">
        {routine.poses.map((pose, i) => (
          <li
            key={`${pose}-${i}`}
            className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-3"
          >
            <PoseAvatar pose={pose} className="size-14" />
            <div>
              <p className="font-semibold capitalize">{pose.replace("-", " ")}</p>
              <p className="text-sm text-muted">Hold 40 seconds</p>
            </div>
            <span className="ml-auto pr-2 text-sm tabular-nums text-muted">{i + 1}</span>
          </li>
        ))}
      </ol>

      <button
        type="button"
        className="mt-8 w-full rounded-full bg-ink px-6 py-4 text-[15px] font-semibold text-white transition active:scale-[0.98]"
      >
        Start routine
      </button>
    </main>
  );
}
