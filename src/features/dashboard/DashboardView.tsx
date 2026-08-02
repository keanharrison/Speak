"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";
import { CompactMarkerCard } from "@/features/dashboard/CompactMarkerCard";
import { HomeLatestSummary } from "@/features/dashboard/HomeLatestSummary";
import { HomeRecentChats } from "@/features/dashboard/HomeRecentChats";
import { KidneyTrendChart } from "@/features/dashboard/KidneyTrendChart";
import { MetricModal } from "@/features/dashboard/MetricModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getAccountFirstName } from "@/lib/account";
import type { DashboardPageContent, ScreeningTestSummary } from "@/types";

type DashboardViewProps = {
  data: DashboardPageContent;
};

/**
 * Home — latest report summary, resume chats, past screenings.
 */
export function DashboardView({ data }: DashboardViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [openMetricId, setOpenMetricId] = useState<string | null>(null);

  const testId = searchParams.get("test");
  const selected =
    data.tests.find((test) => test.id === testId) ?? null;
  const latest = data.tests[0];

  useEffect(() => {
    setFirstName(getAccountFirstName());
  }, []);

  function openTest(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("test", id);
    params.delete("phase");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function backToList() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("test");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  if (selected) {
    return (
      <TestDetailView
        test={selected}
        trendChart={data.trendChart}
        showTrend={selected.id === "q3"}
        openMetricId={openMetricId}
        onOpenMetric={setOpenMetricId}
        onBack={backToList}
      />
    );
  }

  return (
    <div className="relative min-h-full overflow-x-hidden">
      <main
        className="relative z-10 w-full flex-1 px-5 pb-6"
        style={{
          paddingTop: "max(2.25rem, calc(env(safe-area-inset-top) + 0.65rem))",
        }}
      >
        <Link
          href="/intro"
          className="inline-flex min-h-[44px] items-center text-[14px] font-medium text-[#0A0A0A]/70 transition-colors hover:text-[#0A0A0A]"
        >
          Back
        </Link>

        <div className="mt-2 mb-5">
          {firstName ? (
            <h1 className="page-title">Hi, {firstName}</h1>
          ) : (
            <h1 className="page-title">Home</h1>
          )}
        </div>

          <HomeLatestSummary
            eyebrow={data.latestSummary.eyebrow}
            quarter={latest.quarter}
            dateLabel={latest.dateLabel}
            bluf={latest.bluf}
            status={latest.status}
            detailsLabel={data.latestSummary.detailsLabel}
            onOpenDetails={() => openTest(latest.id)}
            speakTopic={latest.speakTopic}
          />

          <HomeRecentChats
            heading={data.recentChatsHeading}
            ctaLabel={data.recentChatsCtaLabel}
            chats={data.recentChats}
          />

          <section className="mt-6" aria-label="Past screenings">
            <h2 className="section-title">{data.testsHeading}</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              {data.tests.map((test) => (
                <li key={test.id}>
                  <button
                    type="button"
                    onClick={() => openTest(test.id)}
                    className="glass-panel flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-[#0A0A0A]">
                        {test.quarter}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#6b6b6b]">
                        {test.dateLabel}
                      </p>
                    </div>
                    <StatusBadge status={test.status} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
      </main>
    </div>
  );
}

type TestDetailViewProps = {
  test: ScreeningTestSummary;
  trendChart: DashboardPageContent["trendChart"];
  showTrend: boolean;
  openMetricId: string | null;
  onOpenMetric: (id: string | null) => void;
  onBack: () => void;
};

function TestDetailView({
  test,
  trendChart,
  showTrend,
  openMetricId,
  onOpenMetric,
  onBack,
}: TestDetailViewProps) {
  const isFlagged = test.status === "changed";

  return (
    <div className="relative min-h-full overflow-x-hidden">
      <main className="relative z-10 w-full flex-1 px-5 pb-6 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center text-[13px] font-medium text-[#6b6b6b]"
        >
          ← All screenings
        </button>

        <header className="mt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-[26px] font-black tracking-tight text-[#0A0A0A]">
                {test.quarter}
              </h1>
              <p className="mt-1 text-[13px] text-[#6b6b6b]">{test.dateLabel}</p>
            </div>
            <StatusBadge status={test.status} />
          </div>
        </header>

        <div
          className={`mt-5 px-4 py-4 ${
            isFlagged ? "glass-light-card" : "glass-panel"
          }`}
        >
          <p className="text-[15px] leading-relaxed text-[#0A0A0A]">
            {test.bluf}
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <OpenInSpeak
              topic={test.speakTopic}
              variant="full"
              label="Open in Speak"
            />
            {isFlagged ? (
              <Link
                href="/vet#share"
                className="glass-light-button-secondary inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
              >
                Prep for your vet
              </Link>
            ) : null}
          </div>
        </div>

        {showTrend ? <KidneyTrendChart chart={trendChart} compact /> : null}

        <section aria-label="Markers" className="mt-6">
          <h2 className="text-[15px] font-semibold text-[#0A0A0A]">Markers</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            {test.markers.map((card) => (
              <CompactMarkerCard
                key={card.id}
                card={card}
                onSelect={onOpenMetric}
              />
            ))}
          </div>
        </section>
      </main>

      {test.markers.map((card) => (
        <MetricModal
          key={card.id}
          card={card}
          isOpen={openMetricId === card.id}
          onClose={() => onOpenMetric(null)}
        />
      ))}
    </div>
  );
}
