import { StatusBadge } from "@/components/ui/StatusBadge";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { BaileyPageContent } from "@/types";

type BaileyViewProps = {
  data: BaileyPageContent;
};

export function BaileyView({ data }: BaileyViewProps) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-20 pt-8">
      <header>
        <h1 className="text-[40px] font-medium leading-[1.15] tracking-tight text-ink md:text-[56px]">
          {data.title}
        </h1>
        <p className="mt-2 text-body text-muted">{data.subtitle}</p>
      </header>

      <section className="mt-10">
        <h2 className="text-[20px] font-medium tracking-tight text-ink">
          {data.historyHeading}
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          {data.history.map((item) => (
            <SurfaceCard key={item.quarter} as="article" className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-ink">
                    {item.quarter}
                  </p>
                  <p className="mt-2 text-body text-muted">{item.summary}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <SurfaceCard as="article" className="p-5">
          <p className="text-[12px] text-muted">{data.nextKitHeading}</p>
          <p className="mt-2 text-[18px] font-medium text-ink">
            {data.nextKitBody}
          </p>
        </SurfaceCard>
        <SurfaceCard as="article" className="p-5">
          <p className="text-[12px] text-muted">{data.membershipHeading}</p>
          <p className="mt-2 text-[18px] font-medium text-ink">
            {data.membershipBody}
          </p>
        </SurfaceCard>
      </section>
    </main>
  );
}
