import { SurfaceCard } from "@/components/ui/SurfaceCard";
import type { PlaceholderPageContent } from "@/types";

type PlaceholderViewProps = {
  data: PlaceholderPageContent;
};

export function PlaceholderView({ data }: PlaceholderViewProps) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-20 pt-8">
      <header>
        <h1 className="text-[40px] font-medium leading-[1.15] tracking-tight text-ink md:text-[56px]">
          {data.title}
        </h1>
        <p className="mt-2 text-body text-muted">{data.subtitle}</p>
      </header>

      <SurfaceCard as="section" className="mt-10 p-6">
        <p className="text-body text-ink">{data.body}</p>
      </SurfaceCard>
    </main>
  );
}
