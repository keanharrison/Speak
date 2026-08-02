import { Suspense } from "react";
import { DashboardView } from "@/features/dashboard/DashboardView";
import { dashboardPage } from "@/lib/hardcoded-data";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 px-5 pb-6 pt-14">
          <p className="text-[14px] text-muted">Loading Home…</p>
        </main>
      }
    >
      <DashboardView data={dashboardPage} />
    </Suspense>
  );
}
