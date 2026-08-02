import type { DashboardKitStep } from "@/types";

type HomeKitStatusCardProps = {
  heading: string;
  statusLabel: string;
  steps: DashboardKitStep[];
  nextKitDetail: string;
  daysUntilNextKit: number;
  featured?: boolean;
  daysLabel?: string;
  /** Slimmer kit strip for Home list */
  compact?: boolean;
};

export function HomeKitStatusCard({
  heading,
  statusLabel,
  steps,
  nextKitDetail,
  daysUntilNextKit,
  featured = false,
  daysLabel = "days",
  compact = false,
}: HomeKitStatusCardProps) {
  return (
    <section
      aria-label="Kit status"
      className={`rounded-[14px] bg-surface px-4 ${compact ? "py-3" : "py-4"} ${
        featured ? "mt-0" : "mt-0"
      }`}
      style={{
        border: featured
          ? "0.5px solid rgba(196,118,58,0.45)"
          : "0.5px solid rgba(0,0,0,0.08)",
        backgroundColor: featured ? "#FDF3E7" : undefined,
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-ink">{heading}</h2>
        <p className="text-[13px] font-medium text-accent">{statusLabel}</p>
      </div>

      {!compact ? (
        <ol className="mt-4 flex items-start justify-between gap-1">
          {steps.map((step) => {
            const done =
              step.status === "complete" || step.status === "current";
            const current = step.status === "current";
            return (
              <li
                key={step.label}
                className="flex min-w-0 flex-1 flex-col items-center text-center"
              >
                <span
                  className={`flex h-2.5 w-2.5 rounded-full ${
                    done ? "bg-ink" : "bg-ink/20"
                  } ${
                    current
                      ? "ring-2 ring-ink/20 ring-offset-2 ring-offset-surface"
                      : ""
                  }`}
                  aria-hidden
                />
                <span
                  className={`mt-2 text-[10px] leading-tight ${
                    current ? "font-semibold text-ink" : "text-muted"
                  }`}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      ) : null}

      <div className={`flex items-end justify-between gap-3 ${compact ? "mt-2" : "mt-4"}`}>
        <p className="text-[13px] text-muted">{nextKitDetail}</p>
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-muted">{daysLabel}</p>
          <p className="text-[15px] font-semibold text-ink">
            {daysUntilNextKit}
          </p>
        </div>
      </div>
    </section>
  );
}
