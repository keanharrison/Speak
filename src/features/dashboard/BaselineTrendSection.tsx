import { TrendLine } from "@/components/charts/TrendLine";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { TrendPoint } from "@/types";

type BaselineTrendSectionProps = {
  petName: string;
  points: TrendPoint[];
  caption: string;
};

export function BaselineTrendSection({
  petName,
  points,
  caption,
}: BaselineTrendSectionProps) {
  return (
    <SurfaceCard as="section" className="mt-10 p-6 md:p-8">
      <h2 className="text-[22px] font-medium tracking-tight text-ink">
        {petName}&apos;s baseline over time
      </h2>
      <div className="mt-6">
        <TrendLine
          points={points}
          ariaLabel={`${petName}'s urine specific gravity trend across quarters`}
        />
      </div>
      <p className="mt-4 max-w-2xl text-body text-muted">{caption}</p>
    </SurfaceCard>
  );
}
