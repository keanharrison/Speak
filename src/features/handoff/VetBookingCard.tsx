import { vetAppointment } from "@/lib/hardcoded-data";

export function VetBookingCard() {
  const appt = vetAppointment;

  return (
    <article className="glass-panel px-4 py-5">
      <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-accent">
        Clinic on file
      </p>
      <h2 className="mt-2 text-[17px] font-semibold tracking-tight text-ink">
        {appt.vetName}
      </h2>
      <p className="mt-0.5 text-[14px] text-muted">{appt.clinic}</p>
      <p className="mt-3 text-[15px] font-medium text-ink">{appt.dateLabel}</p>
      <p className="mt-1 text-[13px] text-muted">{appt.address}</p>

      <div className="mt-5 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
        <span className="text-[13px] font-medium text-ink">
          {appt.recordsStatusLabel}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        {appt.recordsNote}
      </p>

      <p className="mt-4 text-[13px] text-ink">
        <span className="text-muted">Estimated cost: </span>
        {appt.estimatedCost}
      </p>
    </article>
  );
}
