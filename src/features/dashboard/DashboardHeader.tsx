type DashboardHeaderProps = {
  petName: string;
  quarter: string;
  screeningLabel: string;
};

export function DashboardHeader({
  petName,
  quarter,
  screeningLabel,
}: DashboardHeaderProps) {
  return (
    <header>
      <h1 className="text-[32px] font-medium tracking-tight text-ink md:text-[40px]">
        {petName}&apos;s health record
      </h1>
      <p className="mt-2 text-body text-muted">
        {quarter} · {screeningLabel}
      </p>
    </header>
  );
}
