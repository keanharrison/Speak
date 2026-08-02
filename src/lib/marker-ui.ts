import type { MarkerStatus } from "@/types";

/** Every marker uses one of two labels — never random plain-English status words. */
export const markerStatusLabel: Record<MarkerStatus, string> = {
  normal: "Within baseline",
  changed: "Changed from baseline",
};

/** Value line on cards — the reading after the marker name (e.g. "1.022"). */
export function markerDisplayValue(technicalLabel: string): string {
  const parts = technicalLabel.split(" · ");
  return parts.length > 1 ? parts[parts.length - 1] : technicalLabel;
}
