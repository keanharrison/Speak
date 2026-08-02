import { TrendLine } from "@/components/charts/TrendLine";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { Marker } from "@/types";

type ResultCardProps = {
  marker: Marker;
};

export function ResultCard({ marker }: ResultCardProps) {
  return (
    <SurfaceCard as="article" className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-label uppercase text-accent">{marker.label}</p>
          <p className="mt-2 text-[28px] font-medium tracking-tight text-ink">
            {marker.value}
          </p>
        </div>
        <StatusBadge status={marker.status} />
      </div>
      <p className="mt-4 text-body text-ink">{marker.plainEnglish}</p>
      {marker.trend ? (
        <div className="mt-5">
          <TrendLine points={marker.trend} compact />
        </div>
      ) : null}
    </SurfaceCard>
  );
}
