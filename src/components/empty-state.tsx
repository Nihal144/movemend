export function EmptyState({
  title,
  body,
  glyph,
}: {
  title: string;
  body: string;
  glyph: string;
}) {
  return (
    <main className="mx-auto w-full max-w-md flex-1 px-6 pt-6">
      <h1 className="border-b border-hairline pb-5 text-4xl font-bold tracking-tight">
        {title}
      </h1>
      <div className="flex flex-col items-center gap-4 pt-24 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-surface text-muted">
          <svg
            viewBox="0 0 24 24"
            className="size-7 fill-none stroke-current"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={glyph} />
          </svg>
        </span>
        <p className="max-w-[16rem] text-[15px] leading-relaxed text-muted">{body}</p>
      </div>
    </main>
  );
}
