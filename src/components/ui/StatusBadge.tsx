import type { MarkerStatus } from "@/types";
import { markerStatusLabel } from "@/lib/marker-ui";

type StatusBadgeProps = {
  status: MarkerStatus;
  /** Light text treatment when sitting on darker glass (unused in B&W pass) */
  onGlass?: boolean;
};

export function StatusBadge({ status, onGlass = false }: StatusBadgeProps) {
  const isChanged = status === "changed";
  const label = markerStatusLabel[status];

  if (onGlass) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
          isChanged
            ? "bg-[#C62828]/15 text-[#C62828]"
            : "bg-[#2A8A5A]/15 text-[#2A8A5A]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isChanged ? "bg-[#C62828]" : "bg-[#2A8A5A]"
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
          ? "bg-[#C62828]/12 text-[#C62828]"
          : "bg-[#2A8A5A]/12 text-[#2A8A5A]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isChanged ? "bg-[#C62828]" : "bg-[#2A8A5A]"
        }`}
        aria-hidden
      />
      {label}
    </span>
  );
}
