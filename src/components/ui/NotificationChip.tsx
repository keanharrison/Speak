import type { MarkerStatus } from "@/types";

type NotificationChipProps = {
  status: MarkerStatus;
  title: string;
  subtitle: string;
};

export function NotificationChip({
  status,
  title,
  subtitle,
}: NotificationChipProps) {
  const isChanged = status === "changed";

  return (
    <div className="glass-panel rounded-card px-3.5 py-3">
      <div className="flex items-start gap-2">
        <span
          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
            isChanged ? "bg-flag" : "bg-success"
          }`}
          aria-hidden
        />
        <div>
          <p className="text-[13px] font-medium leading-snug text-ink">{title}</p>
          <p className="mt-0.5 text-[12px] leading-snug text-muted">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
