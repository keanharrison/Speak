"use client";

import { useEffect, useState } from "react";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";
import { BaileyAvatar } from "@/components/ui/BaileyAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { DashboardMetricCard } from "@/types";

type HomeLatestSummaryProps = {
  petName: string;
  quarter: string;
  markers: DashboardMetricCard[];
  detailsLabel: string;
  onOpenDetails: () => void;
  speakTopic: string;
};

/** Home latest card — pet + quarter, all markers as tiles, detail popup. */
export function HomeLatestSummary({
  petName,
  quarter,
  markers,
  detailsLabel,
  onOpenDetails,
  speakTopic,
}: HomeLatestSummaryProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = markers.find((m) => m.id === openId) ?? null;

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  return (
    <section aria-label="Latest results">
      <div className="glass-light-card relative z-10 max-w-full overflow-hidden px-4 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <BaileyAvatar size="xl" className="mt-0.5 ring-2 ring-white/70" />
          <div className="min-w-0 pt-1">
            <p className="text-[17px] font-semibold text-white">{petName}</p>
            <p className="mt-0.5 text-[12px] text-white/65">{quarter}</p>
          </div>
        </div>

        {markers.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {markers.map((marker) => (
              <button
                key={marker.id}
                type="button"
                onClick={() => setOpenId(marker.id)}
                className="glass-light-field rounded-[14px] px-3 py-2.5 text-left transition hover:bg-white/10"
              >
                <p className="truncate text-[11px] text-white/60">
                  {marker.plainLabel}
                </p>
                <p className="mt-0.5 text-[15px] font-semibold tracking-tight text-white">
                  {marker.plainValue}
                </p>
              </button>
            ))}
          </div>
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
            variant="solid"
          />
        </div>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          role="dialog"
          aria-modal="true"
          aria-label={open.plainLabel}
          onClick={() => setOpenId(null)}
        >
          <div
            className="absolute inset-0 bg-black/35 backdrop-blur-[6px]"
            aria-hidden
          />
          <div
            className="glass-panel relative z-[1] w-full max-w-[17.5rem] rounded-[20px] px-4 py-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <StatusBadge status={open.status} onGlass />
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="flex h-8 w-8 items-center justify-center text-[20px] leading-none text-white/70"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-[13px] text-white/65">{open.plainLabel}</p>
            <p className="mt-0.5 text-[28px] font-semibold tracking-tight text-white">
              {open.plainValue}
            </p>
            <p className="mt-2 text-[12px] leading-snug text-white/60">
              {open.technicalLabel}
            </p>
            <p className="mt-1 text-[12px] leading-snug text-white/55">
              {open.referenceRange}
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/85">
              {open.explanation}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
