import type { MarkerStatus } from "@/types";
import { markerStatusLabel } from "@/lib/marker-ui";

type StatusBadgeProps = {
  status: MarkerStatus;
  /** Light text treatment when sitting on darker glass */
  onGlass?: boolean;
};

/** Compact single-line status chip — never wraps awkwardly. */
export function StatusBadge({ status, onGlass = false }: StatusBadgeProps) {
  const isChanged = status === "changed";
  const label = markerStatusLabel[status];

  if (onGlass) {
    return (
      <span
        className={`inline-flex max-w-full shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium leading-none ${
          isChanged
            ? "bg-white/12 text-white/75"
            : "bg-[#34C759]/20 text-[#7DFFB0]"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            isChanged ? "bg-white/55" : "bg-[#7DFFB0]"
          }`}
          aria-hidden
        />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex max-w-full shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-medium leading-none ${
        isChanged
          ? "bg-black/10 text-[#0A0A0A]"
          : "bg-[#2A8A5A]/12 text-[#2A8A5A]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          isChanged ? "bg-[#6b6b6b]" : "bg-[#2A8A5A]"
        }`}
        aria-hidden
      />
      {label}
    </span>
  );
}
