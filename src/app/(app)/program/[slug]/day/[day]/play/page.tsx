import { notFound } from "next/navigation";
import { PROGRAMS, expandSessions, getProgram } from "@/lib/programs";
import { SessionPlayer } from "./session-player";

export function generateStaticParams() {
  return PROGRAMS.flatMap((program) =>
    Array.from({ length: program.days }, (_, i) => ({
      slug: program.slug,
      day: String(i + 1),
    })),
  );
}

export default async function PlayPage({ params }: PageProps<"/program/[slug]/day/[day]/play">) {
  const { slug, day } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  const session = expandSessions(program).find((d) => d.day === Number(day));
  if (!session) notFound();

  return <SessionPlayer program={program} session={session} />;
}
