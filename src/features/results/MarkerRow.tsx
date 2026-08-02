import type { Marker } from "@/types";
import { ResultCard } from "@/features/results/ResultCard";

type MarkerRowProps = {
  markers: Marker[];
};

export function MarkerRow({ markers }: MarkerRowProps) {
  return (
    <div className="flex flex-col gap-4">
      {markers.map((marker) => (
        <ResultCard key={marker.id} marker={marker} />
      ))}
    </div>
  );
}
