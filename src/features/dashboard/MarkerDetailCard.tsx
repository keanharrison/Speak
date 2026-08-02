import { StatusBadge } from "@/components/ui/StatusBadge";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";
import { Sparkline } from "@/features/dashboard/Sparkline";
import { markerDisplayValue } from "@/lib/marker-ui";
import type { DashboardMetricCard } from "@/types";

type MarkerDetailCardProps = {
  card: DashboardMetricCard;
  onSelect?: (id: string) => void;
};

/** Marker row on Home — consistent badge + reading + Open in Speak. */
export function MarkerDetailCard({ card, onSelect }: MarkerDetailCardProps) {
  return (
    <div className="glass-panel relative w-full px-4 py-4 text-left">
      <button
        type="button"
        onClick={onSelect ? () => onSelect(card.id) : undefined}
        className={`w-full text-left ${
          onSelect ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink">{card.plainLabel}</p>
            <p className="mt-1 text-[22px] font-semibold tracking-tight text-ink">
              {markerDisplayValue(card.technicalLabel)}
            </p>
            <p className="mt-0.5 text-[12px] text-muted">{card.technicalLabel}</p>
          </div>
          <StatusBadge status={card.status} />
        </div>
        <p className="mt-3 text-[14px] leading-relaxed text-ink">
          {card.explanation}
        </p>
        <div className="mt-3 max-w-[140px]">
          <Sparkline variant={card.sparkline} />
        </div>
      </button>

      <div className="mt-3 flex justify-end">
        <OpenInSpeak topic={card.plainLabel} />
      </div>
    </div>
  );
}
