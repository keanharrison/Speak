import type { InfoPageContent } from "@/types";

type InfoViewProps = {
  data: InfoPageContent;
};

/**
 * Notion-plain about page — team contacts + roadmap for the prototype.
 */
export function InfoView({ data }: InfoViewProps) {
  return (
    <main className="mx-auto w-full flex-1 px-5 pb-28 pt-6">
      <h1 className="text-[28px] font-black tracking-tight text-ink">
        {data.title}
      </h1>
      <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
        {data.intro}
      </p>

      <section className="mt-10">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          {data.teamHeading}
        </h2>
        <ul className="mt-3 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {data.contacts.map((person) => (
            <li key={person.email} className="py-4">
              <p className="text-[16px] font-semibold text-ink">{person.name}</p>
              <p className="mt-0.5 text-[13px] text-muted">{person.role}</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[14px]">
                <a
                  href={`mailto:${person.email}`}
                  className="text-ink underline decoration-black/20 underline-offset-2 hover:decoration-ink"
                >
                  {person.email}
                </a>
                <a
                  href={person.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink underline decoration-black/20 underline-offset-2 hover:decoration-ink"
                >
                  {person.linkedinLabel}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted">
          {data.roadmapHeading}
        </h2>
        <ol className="mt-3 divide-y divide-black/[0.08] border-y border-black/[0.08]">
          {data.roadmap.map((item) => (
            <li key={item.phase} className="py-4">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-accent">
                {item.phase}
              </p>
              <p className="mt-1 text-[15px] font-semibold text-ink">
                {item.title}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">
                {item.detail}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <p className="mt-10 text-[12px] leading-relaxed text-muted">
        {data.footnote}
      </p>
    </main>
  );
}
