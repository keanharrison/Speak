"use client";

import { useState } from "react";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";
import { BaileyAvatar } from "@/components/ui/BaileyAvatar";
import type { DashboardMetricCard } from "@/types";

type HomeLatestSummaryProps = {
  petName: string;
  dateLabel: string;
  markers: DashboardMetricCard[];
  detailsLabel: string;
  onOpenDetails: () => void;
  speakTopic: string;
};

/** First thing on Home — pet + date, marker tabs, stats, and actions. */
export function HomeLatestSummary({
  petName,
  dateLabel,
  markers,
  detailsLabel,
  onOpenDetails,
  speakTopic,
}: HomeLatestSummaryProps) {
  const [activeId, setActiveId] = useState(markers[0]?.id ?? "");
  const active = markers.find((m) => m.id === activeId) ?? markers[0];
  const highlightStats = markers.slice(0, 4);

  return (
    <section aria-label="Latest results">
      <div className="glass-light-card relative z-10 max-w-full overflow-hidden px-4 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <BaileyAvatar size="xl" className="mt-0.5 ring-2 ring-white/70" />
          <div className="min-w-0 pt-1">
            <p className="text-[17px] font-semibold text-white">{petName}</p>
            <p className="mt-0.5 text-[12px] text-white/65">{dateLabel}</p>
          </div>
        </div>

        {markers.length > 0 ? (
          <>
            <div
              className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Markers"
            >
              {markers.map((marker) => {
                const selected = marker.id === active?.id;
                return (
                  <button
                    key={marker.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveId(marker.id)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      selected
                        ? "bg-white text-[#0A0A0A]"
                        : "bg-white/12 text-white/80"
                    }`}
                  >
                    {marker.plainLabel}
                  </button>
                );
              })}
            </div>

            {active ? (
              <div key={active.id} className="mt-3">
                <p className="text-[12px] text-white/65">{active.plainLabel}</p>
                <p className="mt-0.5 text-[28px] font-semibold tracking-tight text-white">
                  {active.plainValue}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-white/60">
                  {active.technicalLabel}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/55">
                  {active.referenceRange}
                </p>
              </div>
            ) : null}

            <div className="mt-3 grid grid-cols-2 gap-2">
              {highlightStats.map((marker) => {
                const selected = marker.id === active?.id;
                return (
                  <button
                    key={`stat-${marker.id}`}
                    type="button"
                    onClick={() => setActiveId(marker.id)}
                    className={`glass-light-field rounded-[14px] px-3 py-2.5 text-left transition-shadow ${
                      selected ? "ring-1 ring-white/45" : ""
                    }`}
                  >
                    <p className="truncate text-[11px] text-white/60">
                      {marker.plainLabel}
                    </p>
                    <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-white">
                      {marker.plainValue}
                    </p>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        <div className="mt-4 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onOpenDetails}
            className="glass-light-button inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
          >
            {detailsLabel}
          </button>
          <OpenInSpeak
            topic={speakTopic}
            label="Ask Speak"
            className="w-full rounded-full"
            variant="glassSecondary"
          />
        </div>
      </div>
    </section>
  );
}
