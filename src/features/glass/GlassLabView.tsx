import type { GlassLabPageContent } from "@/types";

type GlassLabViewProps = {
  data: GlassLabPageContent;
};

/**
 * Glass morphism design lab.
 * Cards sit on blurred color orbs — never a flat cream canvas.
 */
export function GlassLabView({ data }: GlassLabViewProps) {
  return (
    <main className="glass-page-background absolute inset-0 z-10 overflow-y-auto pb-28 pt-10 text-white">
      <div className="glass-orb-1" aria-hidden />
      <div className="glass-orb-2" aria-hidden />
      <div className="glass-orb-3" aria-hidden />

      <div className="relative z-10 px-5 pb-8">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/50">
          Experiment
        </p>
        <h1 className="mt-2 text-[28px] font-black tracking-tight text-white">
          {data.title}
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/65">
          {data.subtitle}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {data.stats.map((stat) => (
            <article key={stat.id} className="glass-card px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/55">
                {stat.label}
              </p>
              <p className="mt-2 text-[26px] font-black tracking-tight text-white">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[12px] leading-snug text-white/60">
                {stat.detail}
              </p>
            </article>
          ))}
        </div>

        <section className="glass-card mt-3 px-4 py-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-white/55">
            Full-width glass
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-white/85">
            Bailey&apos;s Q3 panel sits on color, not cream. Blur + saturation let
            the green and terracotta orbs read through the surface.
          </p>
        </section>

        <p className="mt-6 text-[12px] leading-relaxed text-white/45">
          {data.note}
        </p>
      </div>
    </main>
  );
}
