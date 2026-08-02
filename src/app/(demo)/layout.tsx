"use client";

import { usePathname } from "next/navigation";
import { FloatingTabBar } from "@/components/layout/FloatingTabBar";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import {
  TabBarVisibilityProvider,
  useTabBarVisibility,
} from "@/components/layout/TabBarVisibility";

const HOME_BG_SRC = "/images/intro/home-bg-ocean.jpg";

function DemoChrome({ children }: { children: React.ReactNode }) {
  const { tabBarVisible } = useTabBarVisibility();
  const pathname = usePathname();
  const homeOcean = pathname === "/dashboard";

  return (
    <div
      className={`relative flex h-full min-h-0 flex-1 flex-col overflow-hidden ${
        homeOcean ? "glass-light-page--ocean" : "glass-light-page"
      }`}
    >
      {homeOcean ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HOME_BG_SRC}
            alt=""
            className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 object-cover blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-0 bg-black/40"
            aria-hidden
          />
        </>
      ) : null}
      <div className="scrollbar-hide relative z-10 flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain">
        <div className="flex min-h-0 flex-1 flex-col pb-[4.25rem]">{children}</div>
      </div>
      {tabBarVisible ? <FloatingTabBar /> : null}
    </div>
  );
}

/**
 * Authenticated demo app chrome: phone frame + floating pill nav.
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
