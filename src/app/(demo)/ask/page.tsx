import { Suspense } from "react";
import { AskView } from "@/features/ask/AskView";
import { askPage } from "@/lib/hardcoded-data";

export default function AskPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-5 pb-6 pt-14">
          <p className="text-[14px] text-muted">Loading Speak…</p>
        </main>
      }
    >
      <AskView data={askPage} />
    </Suspense>
  );
}
