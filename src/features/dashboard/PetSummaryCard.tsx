import { StatusBadge } from "@/components/ui/StatusBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { MarkerStatus } from "@/types";

type PetSummaryCardProps = {
  label: string;
  value: string;
  status: MarkerStatus;
  statusLabel: string;
};

export function PetSummaryCard({
  label,
  value,
  status,
  statusLabel,
}: PetSummaryCardProps) {
  return (
    <SurfaceCard as="article" className="p-5">
      <p className="text-label uppercase text-accent">{label}</p>
      <p className="mt-3 text-[26px] font-medium tracking-tight text-ink">{value}</p>
      <div className="mt-3">
        <StatusBadge status={status} />
      </div>
    </SurfaceCard>
  );
}
