import Link from "next/link";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";

type DashboardStatusBannerProps = {
  message: string;
  bookVetLabel: string;
  bookVetHref: string;
  shareLabel?: string;
  shareHref?: string;
};

/** Flagged-quarter hero — BLUF + Open in Speak. */
export function DashboardStatusBanner({
  message,
  bookVetLabel,
  bookVetHref,
  shareLabel,
  shareHref,
}: DashboardStatusBannerProps) {
  return (
    <div
      className="glass-panel relative flex w-full flex-col gap-4 px-4 py-4"
      role="status"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent"
          aria-hidden
        />
        <p className="text-[15px] leading-relaxed text-ink">{message}</p>
      </div>
      <div className="flex flex-col gap-2.5">
        <Link
          href={bookVetHref}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-ink px-5 text-[14px] font-semibold text-white"
        >
          {bookVetLabel.replace(/\s*→\s*$/, "")}
        </Link>
        {shareLabel && shareHref ? (
          <Link
            href={shareHref}
            className="text-center text-[13px] font-medium text-ink underline-offset-2 hover:underline"
          >
            {shareLabel}
          </Link>
        ) : null}
      </div>
      <div className="flex justify-end">
        <OpenInSpeak topic="this quarter's results" />
      </div>
    </div>
  );
}
