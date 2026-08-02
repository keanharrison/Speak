import { brand } from "@/constants/brand";
import type { TrendPoint } from "@/types";

type TrendLineProps = {
  points: TrendPoint[];
  compact?: boolean;
  ariaLabel?: string;
};

export function TrendLine({
  points,
  compact = false,
  ariaLabel = "Trend line chart",
}: TrendLineProps) {
  if (points.length < 2) return null;

  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 0.01;

  const width = compact ? 160 : 480;
  const height = compact ? 40 : 160;
  const padding = compact ? 4 : 16;

  const coords = points.map((point, index) => {
    const x =
      padding + (index / (points.length - 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((point.value - min) / range) * (height - padding * 2);
    return { x, y, ...point };
  });

  const path = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  return (
    <div className={compact ? "" : "w-full"}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={compact ? "h-10 w-40" : "h-44 w-full max-w-xl"}
        role="img"
        aria-label={ariaLabel}
      >
        <path
          d={path}
          fill="none"
          stroke={brand.flag}
          strokeWidth={compact ? 2 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c) => (
          <circle
            key={c.quarter}
            cx={c.x}
            cy={c.y}
            r={compact ? 2.5 : 4}
            fill={brand.flag}
          />
        ))}
      </svg>
      {!compact ? (
        <div className="mt-3 flex max-w-xl justify-between text-[12px] text-muted">
          {points.map((p) => (
            <span key={p.quarter}>
              {p.quarter}: {p.value.toFixed(3)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
