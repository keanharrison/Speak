"use client";

import { FloatingTabBar } from "@/components/layout/FloatingTabBar";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "@/components/layout/TabBarVisibility";

/**
 * Authenticated demo app chrome: phone frame + full-width icon bar.
 */
export default function DemoAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PhoneFrame>
      <TabBarVisibilityProvider>
        <DemoChrome>{children}</DemoChrome>
      </TabBarVisibilityProvider>
    </PhoneFrame>
  );
}

function DemoChrome({ children }: { children: React.ReactNode }) {
  const { tabBarVisible } = useTabBarVisibility();

  return (
    <div className="glass-light-page relative flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="scrollbar-hide relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain">
        <div
          className="flex min-h-0 flex-1 flex-col"
          style={{
            // Flush to the nav — only enough pad so last content clears the bar
            paddingBottom: tabBarVisible
              ? "max(3.85rem, calc(var(--speak-page-safe-bottom) + 3.1rem))"
              : "0.5rem",
          }}
        >
          {children}
        </div>
      </div>
      {tabBarVisible ? <FloatingTabBar /> : null}
    </div>
  );
}
