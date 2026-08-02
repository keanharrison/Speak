import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sparkline } from "@/features/dashboard/Sparkline";
import { markerDisplayValue } from "@/lib/marker-ui";
import type { DashboardMetricCard } from "@/types";

type CompactMarkerCardProps = {
  card: DashboardMetricCard;
  onSelect?: (id: string) => void;
};

/** Distilled marker — name, number, status badge. Tap for plain English. */
export function CompactMarkerCard({ card, onSelect }: CompactMarkerCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect ? () => onSelect(card.id) : undefined}
      className="glass-panel flex min-h-[108px] w-full flex-col p-3 text-left"
    >
      <p className="text-[11px] leading-snug text-[#6b6b6b]">{card.plainLabel}</p>
      <p className="mt-1.5 text-[18px] font-semibold tracking-tight text-[#0A0A0A]">
        {markerDisplayValue(card.technicalLabel)}
      </p>
      <div className="mt-auto pt-2">
        <StatusBadge status={card.status} />
      </div>
      <div className="mt-2 opacity-70">
        <Sparkline variant={card.sparkline} />
      </div>
    </button>
  );
}
