import type { MarkerStatus } from "@/types";
import { markerStatusLabel } from "@/lib/marker-ui";

type StatusBadgeProps = {
  status: MarkerStatus;
  /** Light text treatment when sitting on darker glass (unused in B&W pass) */
  onGlass?: boolean;
};

/** Changed = black/grey · Within baseline = green (no red). */
export function StatusBadge({ status, onGlass = false }: StatusBadgeProps) {
  const isChanged = status === "changed";
  const label = markerStatusLabel[status];

  if (onGlass) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
          isChanged
            ? "bg-black/10 text-[#0A0A0A]"
            : "bg-[#2A8A5A]/15 text-[#2A8A5A]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isChanged ? "bg-[#6b6b6b]" : "bg-[#2A8A5A]"
          }`}
          aria-hidden
        />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        isChanged
          ? "bg-black/10 text-[#0A0A0A]"
          : "bg-[#2A8A5A]/12 text-[#2A8A5A]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isChanged ? "bg-[#6b6b6b]" : "bg-[#2A8A5A]"
        }`}
        aria-hidden
      />
      {label}
    </span>
  );
}
