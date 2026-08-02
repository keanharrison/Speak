import { PillButton } from "@/components/ui/PillButton";
import { ResultDetailCard } from "@/features/results/ResultDetailCard";
import type { ResultsPageContent } from "@/types";

type ResultsViewProps = {
  data: ResultsPageContent;
};

export function ResultsView({ data }: ResultsViewProps) {
  return (
    <main className="mx-auto w-full flex-1 px-5 pb-28 pt-6">
      <header>
        <p className="text-[13px] font-medium text-muted">{data.contextLabel}</p>
        <h1 className="mt-1 text-[26px] font-black leading-tight tracking-tight text-ink">
          {data.title}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-muted">{data.meta}</p>
      </header>

      <section
        aria-label="Result markers"
        className="mt-6 flex flex-col gap-3"
      >
        {data.markers.map((marker) => (
          <ResultDetailCard key={marker.id} marker={marker} />
        ))}
      </section>

      <aside
        className="mt-6 rounded-[14px] px-4 py-4"
        style={{
          backgroundColor: "#FDF3E7",
          border: "0.5px solid var(--color-amber)",
        }}
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent"
            aria-hidden
          />
          <div>
            <h2 className="text-[16px] font-semibold text-ink">
              {data.flag.heading}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink">
              {data.flag.body}
            </p>
            <div className="mt-4">
              <PillButton href={data.flag.bookHref} className="w-full min-h-[44px]">
                {data.flag.bookCta}
              </PillButton>
            </div>
          </div>
        </div>
      </aside>

      <p className="mt-8 text-[12px] leading-relaxed text-muted">
        {data.complianceFootnote}
      </p>
    </main>
  );
}
