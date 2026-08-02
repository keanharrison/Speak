import { PetSummaryCard } from "@/features/dashboard/PetSummaryCard";
import type { DashboardMetric } from "@/types";

type DashboardMetricsProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <section
      aria-label="Key screening metrics"
      className="mt-8 grid gap-4 md:grid-cols-3"
    >
      {metrics.map((metric) => (
        <PetSummaryCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          status={metric.status}
          statusLabel={metric.statusLabel}
        />
      ))}
    </section>
  );
}
