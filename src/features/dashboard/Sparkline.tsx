type SparklineProps = {
  variant: "down" | "flat";
};

export function Sparkline({ variant }: SparklineProps) {
  const width = 120;
  const height = 32;
  const padding = 4;

  const isDown = variant === "down";
  const stroke = isDown ? "#0A0A0A" : "#2A8A5A";

  const path = isDown
    ? `M ${padding} ${padding + 4} L ${width / 2} ${height / 2} L ${width - padding} ${height - padding}`
    : `M ${padding} ${height / 2} L ${width - padding} ${height / 2}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-8 w-full"
      role="img"
      aria-hidden
    >
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {!isDown ? (
        <circle cx={width - padding} cy={height / 2} r={2.5} fill={stroke} />
      ) : (
        <circle cx={width - padding} cy={height - padding} r={2.5} fill={stroke} />
      )}
    </svg>
  );
}
