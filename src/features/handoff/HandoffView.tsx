import Link from "next/link";
import { Calendar, CheckCircle2, FileText, Package } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { VetBookingCard } from "@/features/handoff/VetBookingCard";
import type { HandoffPageContent } from "@/types";

const nextStepIcons = [FileText, Package, Calendar] as const;

type HandoffViewProps = {
  data: HandoffPageContent;
};

/**
 * @deprecated FUTURE SCOPE — not V1.
 * Vet booking / “appointment booked” confirmation is deferred until clinic
 * partnerships exist and booking is owner-driven. `/handoff` redirects Home.
 */
export function HandoffView({ data }: HandoffViewProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-28 pt-6">
      <Link
        href={data.backHref}
        className="text-[13px] font-medium text-muted"
      >
        {data.backLabel}
      </Link>

      <header className="mt-8">
        <h1 className="text-[28px] font-black leading-tight tracking-tight text-ink">
          {data.title}
        </h1>
        <p className="mt-2 text-[15px] text-muted">{data.subtitle}</p>
      </header>

      <div className="mt-6">
        <VetBookingCard />
      </div>

      <section className="mt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-muted">
          {data.nextHeading}
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {data.nextSteps.map((step, index) => {
            const Icon = nextStepIcons[index] ?? CheckCircle2;
            return (
              <li key={step} className="flex items-start gap-3">
                <Icon
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-ink"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <span className="text-[15px] leading-relaxed text-ink">
                  {step}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-8 flex flex-col gap-3">
        <PillButton href="#" className="w-full min-h-[44px]">
          {data.calendarCta}
        </PillButton>
        <Link
          href={data.viewSentHref}
          className="text-center text-[13px] font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
        >
          {data.viewSentLabel}
        </Link>
      </div>
    </main>
  );
}
