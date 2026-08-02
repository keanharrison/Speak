type DashboardHeaderRowProps = {
  title: string;
  subtitle: string;
  nextKit: string;
};

/** Pet + quarter context under the BLUF banner. */
export function DashboardHeaderRow({
  title,
  subtitle,
  nextKit,
}: DashboardHeaderRowProps) {
  return (
    <div className="mt-5">
      <h2 className="text-[15px] font-semibold leading-tight tracking-tight text-ink">
        {title}
      </h2>
      <p className="mt-1 text-[13px] text-muted">{subtitle}</p>
      <p className="mt-0.5 text-[13px] text-muted">{nextKit}</p>
    </div>
  );
}
