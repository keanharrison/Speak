"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";
import { Sparkline } from "@/features/dashboard/Sparkline";
import { markerDisplayValue } from "@/lib/marker-ui";
import type { DashboardMetricCard } from "@/types";

type MetricModalProps = {
  card: DashboardMetricCard;
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Metric detail sheet — phone-framed drill-in with status, value, trend, plain English.
 */
export function MetricModal({ card, isOpen, onClose }: MetricModalProps) {
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const isFlagged = card.status === "changed";

  useEffect(() => {
    setStage(document.getElementById("speak-phone-stage"));
  }, []);

  if (!isOpen || !stage) return null;

  return createPortal(
    <div
      className="absolute inset-0 z-[60] flex items-end justify-center bg-ink/40 px-3 pb-6 pt-12 sm:items-center sm:pb-14 sm:pt-14"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`metric-modal-${card.id}`}
      onClick={onClose}
    >
      <div
        className="glass-panel scrollbar-hide relative flex max-h-full w-full flex-col overflow-y-auto px-5 pb-5 pt-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <StatusBadge status={card.status} />
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-[22px] leading-none text-muted"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <h2
          id={`metric-modal-${card.id}`}
          className="text-[20px] font-semibold tracking-tight text-ink"
        >
          {card.plainLabel}
        </h2>
        <p className="mt-2 text-[28px] font-black tracking-tight text-ink">
          {markerDisplayValue(card.technicalLabel)}
        </p>
        <p className="mt-1 text-[13px] text-muted">{card.technicalLabel}</p>

        <div className="mt-5 rounded-[12px] bg-canvas px-3 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
            Trend
          </p>
          <div className="mt-2">
            <Sparkline variant={card.sparkline} />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
            Reference
          </p>
          <p className="mt-1.5 text-[14px] text-ink">{card.referenceRange}</p>
        </div>

        <div className="mt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
            In plain English
          </p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
            {card.explanation}
          </p>
        </div>

        {isFlagged ? (
          <div className="mt-5 flex flex-col gap-2.5">
            <p className="text-[13px] leading-relaxed text-muted">
              Changed from Bailey&apos;s baseline — worth a vet conversation.
            </p>
            <OpenInSpeak topic={card.plainLabel} variant="full" />
            <Link
              href="/vet"
              onClick={onClose}
              className="text-center text-[13px] font-medium text-ink underline-offset-2 hover:underline"
            >
              Prep packet on Vet tab
            </Link>
          </div>
        ) : (
          <div className="mt-5">
            <OpenInSpeak topic={card.plainLabel} variant="full" />
          </div>
        )}
      </div>
    </div>,
    stage,
  );
}
