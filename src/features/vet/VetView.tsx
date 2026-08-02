"use client";

import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ShareWithVetCard } from "@/features/profile/ShareWithVetCard";
import type { VetPageContent } from "@/types";

type VetViewProps = {
  data: VetPageContent;
};

/**
 * Care tab — share packet first (loop-closer), then clinic context.
 */
export function VetView({ data }: VetViewProps) {
  const [scheduleNote, setScheduleNote] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#share") return;
    const el = document.getElementById("share");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <main
      className="relative z-10 mx-auto w-full flex-1 overflow-x-hidden px-5 pb-6"
      style={{
        paddingTop: "max(2.25rem, calc(env(safe-area-inset-top) + 0.65rem))",
      }}
    >
      {/* Spacer matches Home “← Back” row so titles share one plane */}
      <div className="min-h-[44px]" aria-hidden />
      <h1 className="page-title mt-2">{data.title}</h1>
      <p className="section-eyebrow mt-1">{data.subtitle}</p>

      <div className="mt-6">
        <ShareWithVetCard packet={data.sharePacket} featured />
      </div>

      <section className="glass-panel mt-4 px-4 py-4">
        <h2 className="section-title">{data.clinicHeading}</h2>
        <p className="mt-2 text-[17px] font-semibold text-[#0A0A0A]">
          {data.vetName}
        </p>
        <p className="mt-0.5 text-[14px] text-[#0A0A0A]">{data.clinic}</p>
        <p className="mt-3 text-[13px] text-[#6b6b6b]">{data.phone}</p>
        <p className="mt-0.5 text-[13px] text-[#6b6b6b]">{data.address}</p>
      </section>

      <section className="mt-6">
        <h2 className="section-title">{data.visitsHeading}</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {data.visits.map((visit) => (
            <li key={visit.id} className="glass-panel px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-[#0A0A0A]">
                    {visit.dateLabel}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#6b6b6b]">
                    {visit.clinic}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-snug text-[#0A0A0A]">
                    {visit.reason}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-[#6b6b6b]">
                  {visit.statusLabel}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="glass-panel mt-4 px-4 py-4">
        <h2 className="section-title">{data.insuranceHeading}</h2>
        <p className="mt-2 text-[14px] font-medium text-[#0A0A0A]">
          {data.insuranceDetail}
        </p>
        <p className="mt-1 text-[12px] text-[#6b6b6b]">{data.insuranceHint}</p>
      </section>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setScheduleNote(true)}
          className="min-h-[44px] text-[14px] font-medium text-[#0A0A0A] underline-offset-2 hover:underline"
        >
          {data.scheduleCta}
        </button>
        <p className="mt-2 text-[12px] text-[#6b6b6b]">
          {scheduleNote
            ? "Demo only — call your clinic to book. Speak won't book for you."
            : data.scheduleHint}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="section-title">{data.historyHeading}</h2>
        <ul className="mt-3 flex flex-col gap-2.5">
          {data.history.map((item) => (
            <li key={item.quarter} className="glass-panel px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-[#0A0A0A]">
                    {item.quarter}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#6b6b6b]">
                    {item.summary}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
