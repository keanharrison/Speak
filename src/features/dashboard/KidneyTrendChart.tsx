"use client";

import { useMemo, useState } from "react";
import type { DashboardPageContent } from "@/types";

type KidneyTrendChartProps = {
  chart: DashboardPageContent["trendChart"];
  compact?: boolean;
};

/** Interactive kidney trend — tap points to inspect values. */
export function KidneyTrendChart({
  chart,
  compact = false,
}: KidneyTrendChartProps) {
  const width = 720;
  const height = compact ? 200 : 240;
  const padding = { top: 28, right: 20, bottom: 40, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minY = chart.referenceMin - 0.005;
  const maxY = chart.referenceMax + 0.005;
  const range = maxY - minY;

  const toY = (value: number) =>
    padding.top + chartHeight - ((value - minY) / range) * chartHeight;

  const toX = (index: number) =>
    padding.left +
    (chart.points.length === 1
      ? chartWidth / 2
      : (index / (chart.points.length - 1)) * chartWidth);

  const coords = useMemo(
    () =>
      chart.points.map((point, index) => ({
        ...point,
        x: toX(index),
        y: toY(point.value),
      })),
    // chart identity is stable in the demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chart],
  );

  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, coords.length - 1),
  );
  const active = coords[activeIndex] ?? coords[coords.length - 1];

  const linePath = coords
    .map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padding.top + chartHeight).toFixed(1)} Z`;

  const refTopY = toY(chart.referenceMax);
  const refBottomY = toY(chart.referenceMin);

  return (
    <section
      className={`glass-panel mt-6 ${compact ? "p-4" : "p-5"}`}
      aria-label={chart.title}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[16px] font-semibold tracking-tight text-[#0A0A0A]">
            {chart.title}
          </h2>
          <p className="mt-0.5 text-[12px] text-[#6b6b6b]">{chart.subtitle}</p>
        </div>
        {active ? (
          <div className="shrink-0 text-right">
            <p className="text-[11px] font-medium text-[#6b6b6b]">
              {active.periodLabel}
            </p>
            <p className="text-[20px] font-semibold tracking-tight text-[#0A0A0A]">
              {active.value.toFixed(3)}
            </p>
          </div>
        ) : null}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={`mt-3 w-full touch-manipulation ${compact ? "h-[168px]" : "h-[200px]"}`}
        role="img"
        aria-label={`${chart.title}. Tap a point for details.`}
      >
        <line
          x1={padding.left}
          y1={refTopY}
          x2={width - padding.right}
          y2={refTopY}
          stroke="#0A0A0A"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.28}
        />
        <line
          x1={padding.left}
          y1={refBottomY}
          x2={width - padding.right}
          y2={refBottomY}
          stroke="#0A0A0A"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.28}
        />
        <path d={areaPath} fill="rgba(0, 0, 0, 0.05)" />
        <path
          d={linePath}
          fill="none"
          stroke="#0A0A0A"
          strokeWidth={2.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((c, index) => {
          const selected = index === activeIndex;
          return (
            <g key={c.quarter}>
              {selected ? (
                <line
                  x1={c.x}
                  y1={padding.top}
                  x2={c.x}
                  y2={padding.top + chartHeight}
                  stroke="#0A0A0A"
                  strokeWidth={1}
                  opacity={0.18}
                />
              ) : null}
              <circle
                cx={c.x}
                cy={c.y}
                r={selected ? 7 : 4.5}
                fill="#0A0A0A"
                stroke="#FFFFFF"
                strokeWidth={selected ? 2.5 : 1.5}
              />
              {/* Hit target */}
              <circle
                cx={c.x}
                cy={c.y}
                r={22}
                fill="transparent"
                className="cursor-pointer"
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`${c.periodLabel}: ${c.value.toFixed(3)}`}
              />
              <text
                x={c.x}
                y={height - 12}
                textAnchor="middle"
                className={`text-[12px] ${
                  selected ? "fill-[#0A0A0A] font-semibold" : "fill-[#6b6b6b]"
                }`}
              >
                {c.periodLabel}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-1 text-[12px] leading-relaxed text-[#6b6b6b]">
        {chart.referenceRangeLabel}
        {active ? ` · Selected ${active.periodLabel}` : null}
      </p>
    </section>
  );
}
