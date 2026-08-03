"use client";

import { useState } from "react";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";
import { BaileyAvatar } from "@/components/ui/BaileyAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DashboardMetricCard, MarkerStatus } from "@/types";

type HomeLatestSummaryProps = {
  quarter: string;
  dateLabel: string;
  status: MarkerStatus;
  markers: DashboardMetricCard[];
  detailsLabel: string;
  onOpenDetails: () => void;
  speakTopic: string;
};

/** First thing on Home — latest screening with marker tabs, stats, and actions. */
export function HomeLatestSummary({
  quarter,
  dateLabel,
  status,
  markers,
  detailsLabel,
  onOpenDetails,
  speakTopic,
}: HomeLatestSummaryProps) {
  const [activeId, setActiveId] = useState(markers[0]?.id ?? "");
  const active = markers.find((m) => m.id === activeId) ?? markers[0];
  const highlightStats = [
    ...markers.filter((m) => m.status === "changed"),
    ...markers.filter((m) => m.status !== "changed"),
  ].slice(0, 4);

  return (
    <section aria-label="Latest results">
      <div className="glass-light-card relative z-10 max-w-full overflow-hidden px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <BaileyAvatar size="xl" className="mt-0.5" />
            <div className="min-w-0 pt-1">
              <p className="text-[17px] font-semibold text-[#0A0A0A]">{quarter}</p>
              <p className="mt-0.5 text-[12px] text-[#6b6b6b]">{dateLabel}</p>
            </div>
          </div>
          <StatusBadge status={status} />
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
                        ? "bg-[#0A0A0A] text-white"
                        : "bg-black/[0.06] text-[#0A0A0A]"
                    }`}
                  >
                    {marker.plainLabel}
                  </button>
                );
              })}
            </div>

            {active ? (
              <div key={active.id} className="mt-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] text-[#6b6b6b]">{active.plainLabel}</p>
                  <p className="mt-0.5 text-[28px] font-semibold tracking-tight text-[#0A0A0A]">
                    {active.plainValue}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-[#6b6b6b]">
                    {active.technicalLabel}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[#6b6b6b]">
                    {active.referenceRange}
                  </p>
                </div>
                <StatusBadge status={active.status} />
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
                    className={`rounded-[14px] px-3 py-2.5 text-left ${
                      selected ? "bg-black/[0.07]" : "bg-black/[0.035]"
                    }`}
                  >
                    <p className="truncate text-[11px] text-[#6b6b6b]">
                      {marker.plainLabel}
                    </p>
                    <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-[#0A0A0A]">
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
