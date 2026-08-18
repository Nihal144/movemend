import { notFound } from "next/navigation";
import { PROGRAMS, expandSessions, getProgram } from "@/lib/programs";
import { ProgramDetail } from "./program-detail";

export function generateStaticParams() {
  return PROGRAMS.map((program) => ({ slug: program.slug }));
}

export default async function ProgramPage({ params }: PageProps<"/program/[slug]">) {
  const { slug } = await params;
  const program = getProgram(slug);
  if (!program) notFound();

  // Expanded on the server so the schedule ships as static HTML; only the
  // completion state needs the client.
  return <ProgramDetail program={program} days={expandSessions(program)} />;
}
