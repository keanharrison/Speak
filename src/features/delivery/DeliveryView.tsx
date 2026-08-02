import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { DeliveryPageContent } from "@/types";

type DeliveryViewProps = {
  data: DeliveryPageContent;
};

export function DeliveryView({ data }: DeliveryViewProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-20 pt-8">
      <header>
        <h1 className="text-[40px] font-medium leading-[1.15] tracking-tight text-ink md:text-[56px]">
          {data.title}
        </h1>
        <p className="mt-2 text-body text-muted">{data.subtitle}</p>
      </header>

      <ol className="mt-10 flex flex-col gap-4">
        {data.steps.map((step) => {
          const isComplete = step.status === "complete";
          const isUpcoming = step.status === "upcoming";

          return (
            <li key={step.label}>
              <SurfaceCard className="p-5">
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      isComplete
                        ? "bg-success"
                        : isUpcoming
                          ? "bg-muted"
                          : "bg-accent"
                    }`}
                    aria-hidden
                  />
                  <div>
                    <p className="text-[15px] font-medium text-ink">{step.label}</p>
                    <p className="mt-1 text-body text-muted">{step.detail}</p>
                  </div>
                </div>
              </SurfaceCard>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
