import { StatusBadge } from "@/components/ui/StatusBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { Sparkline } from "@/features/dashboard/Sparkline";
import type { ResultsMarker } from "@/types";

type ResultDetailCardProps = {
  marker: ResultsMarker;
};

export function ResultDetailCard({ marker }: ResultDetailCardProps) {
  return (
    <SurfaceCard as="article" className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] text-muted">{marker.plainLabel}</p>
          <p className="mt-2 text-[28px] font-medium tracking-tight text-ink">
            {marker.plainValue}
          </p>
          <p className="mt-1 text-[13px] text-muted">{marker.technicalLabel}</p>
        </div>
        <StatusBadge status={marker.status} />
      </div>
      <p className="mt-4 text-body text-ink">{marker.plainEnglish}</p>
      {marker.sparkline ? (
        <div className="mt-5 max-w-[160px]">
          <Sparkline variant={marker.sparkline} />
        </div>
      ) : null}
    </SurfaceCard>
  );
}
