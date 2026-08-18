import Link from "next/link";
import { notFound } from "next/navigation";
import { PoseAvatar } from "@/components/pose-avatar";
import { AREAS, ROUTINES } from "@/lib/routines";

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }));
}

export default async function AreaPage({ params }: PageProps<"/area/[slug]">) {
  const { slug } = await params;
  const area = AREAS.find((a) => a.slug === slug);
  if (!area) notFound();

  const matches = ROUTINES.filter((r) => r.areas.includes(area.slug));

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-6">
      <Link href="/" className="text-sm font-medium text-muted">
        ← Today
      </Link>

      <div className="flex items-center gap-4 pt-6">
        <PoseAvatar pose={area.pose} className="size-16" />
        <h1 className="text-4xl font-bold tracking-tight">{area.label}</h1>
      </div>

      <h2 className="pt-8 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {matches.length ? "Routines for this area" : "Nothing scheduled yet"}
      </h2>

      <ul className="flex flex-col gap-3 pt-4">
        {matches.map((routine) => (
          <li key={routine.slug}>
            <Link
              href={`/routine/${routine.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-hairline bg-surface p-4 transition active:scale-[0.99]"
            >
              <PoseAvatar pose={routine.poses[0]} className="size-12" />
              <div>
                <p className="font-semibold">{routine.title}</p>
                <p className="text-sm text-muted">{routine.minutes} minutes</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
