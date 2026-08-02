import { brand } from "@/constants/brand";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Sparkline } from "@/features/dashboard/Sparkline";
import { markerDisplayValue } from "@/lib/marker-ui";
import type { DashboardMetricCard } from "@/types";

type MetricCardProps = {
  card: DashboardMetricCard;
  onSelect: (id: string) => void;
};

export function MetricCard({ card, onSelect }: MetricCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(card.id)}
      className="flex min-h-[132px] w-full cursor-pointer flex-col rounded-card bg-surface p-4 text-left transition-opacity hover:opacity-90"
      style={{ border: brand.cardBorder }}
    >
      <p className="text-[11px] text-muted">{card.plainLabel}</p>
      <p className="mt-2 text-[20px] font-semibold tracking-tight text-ink">
        {markerDisplayValue(card.technicalLabel)}
      </p>
      <div className="mt-2">
        <StatusBadge status={card.status} />
      </div>
      <div className="mt-auto pt-3">
        <Sparkline variant={card.sparkline} />
      </div>
    </button>
  );
}
