import { OpenInSpeak } from "@/features/ask/OpenInSpeak";
import { BaileyAvatar } from "@/components/ui/BaileyAvatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { MarkerStatus } from "@/types";

type HomeLatestSummaryProps = {
  eyebrow: string;
  quarter: string;
  dateLabel: string;
  bluf: string;
  status: MarkerStatus;
  detailsLabel: string;
  onOpenDetails: () => void;
  speakTopic: string;
};

/** First thing on Home — plain-English summary of the latest screening. */
export function HomeLatestSummary({
  eyebrow,
  quarter,
  dateLabel,
  bluf,
  status,
  detailsLabel,
  onOpenDetails,
  speakTopic,
}: HomeLatestSummaryProps) {
  return (
    <section aria-label={eyebrow}>
      <p className="section-eyebrow relative z-10">{eyebrow}</p>
      <div className="glass-light-card relative z-10 mt-2 overflow-hidden px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <BaileyAvatar size="sm" className="mt-0.5" />
            <div className="min-w-0">
              <p className="text-[17px] font-semibold text-[#0A0A0A]">{quarter}</p>
              <p className="mt-0.5 text-[12px] text-[#6b6b6b]">{dateLabel}</p>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-[#0A0A0A]">{bluf}</p>

        <div className="mt-4 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onOpenDetails}
            className="glass-light-button inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
          >
            {detailsLabel}
          </button>
          <OpenInSpeak
            topic={speakTopic}
            label="Ask Speak"
            className="w-full rounded-full"
            variant="glassSecondary"
          />
        </div>
      </div>
    </section>
  );
}
