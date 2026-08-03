import type { DashboardPageContent } from "@/types";

type KidneyTrendChartProps = {
  chart: DashboardPageContent["trendChart"];
  compact?: boolean;
};

export function KidneyTrendChart({
  chart,
  compact = false,
}: KidneyTrendChartProps) {
  const width = 720;
  const height = compact ? 160 : 200;
  const padding = { top: 20, right: 16, bottom: 36, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minY = chart.referenceMin - 0.005;
  const maxY = chart.referenceMax + 0.005;
  const range = maxY - minY;

  const toY = (value: number) =>
    padding.top + chartHeight - ((value - minY) / range) * chartHeight;

  const toX = (index: number) =>
    padding.left + (index / (chart.points.length - 1)) * chartWidth;

  const coords = chart.points.map((point, index) => ({
    ...point,
    x: toX(index),
    y: toY(point.value),
  }));

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} Z`;

  const refTopY = toY(chart.referenceMax);
  const refBottomY = toY(chart.referenceMin);

  return (
    <section className={`glass-panel mt-6 ${compact ? "p-3.5" : "p-4"}`}>
      <h2 className="text-[15px] font-semibold tracking-tight text-[#0A0A0A]">
        {chart.title}
      </h2>
      <p className="mt-0.5 text-[12px] text-[#6b6b6b]">{chart.subtitle}</p>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`mt-3 w-full ${compact ? "h-[120px]" : "h-[160px]"}`}
        role="img"
        aria-label={chart.title}
      >
        <line
          x1={padding.left}
          y1={refTopY}
          x2={width - padding.right}
          y2={refTopY}
          stroke="#0A0A0A"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.35}
        />
        <line
          x1={padding.left}
          y1={refBottomY}
          x2={width - padding.right}
          y2={refBottomY}
          stroke="#0A0A0A"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.35}
        />
        <path d={areaPath} fill="rgba(0, 0, 0, 0.06)" />
        <path
          d={linePath}
          fill="none"
          stroke="#0A0A0A"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, index) => {
          const isLast = index === coords.length - 1;
          return (
            <g key={c.quarter}>
              <circle
                cx={c.x}
                cy={c.y}
                r={isLast ? 5 : 3.5}
                fill="#0A0A0A"
                stroke={isLast ? "#FFFFFF" : "none"}
                strokeWidth={isLast ? 2 : 0}
              />
              <text
                x={c.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-[#6b6b6b] text-[11px]"
              >
                {c.periodLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
