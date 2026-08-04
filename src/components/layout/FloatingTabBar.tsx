"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AskIcon,
  CarePlusIcon,
  ClaimIcon,
  HomeIcon,
  YouIcon,
} from "@/components/layout/navIcons";
import { mobileNav } from "@/lib/hardcoded-data";

const iconMap = {
  home: HomeIcon,
  messageCircle: AskIcon,
  vet: CarePlusIcon,
  claim: ClaimIcon,
  user: YouIcon,
} as const;

/**
 * Full-width rectangular bottom icon bar — flush to the screen bottom.
 * Active tab = solid white icon (no circle / outline chrome).
 */
export function FloatingTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40"
      aria-label="Primary"
    >
      <ul
        className="glass-tab-bar pointer-events-auto flex w-full items-center justify-around rounded-none border-x-0 border-b-0 px-1 pt-2"
        style={{
          paddingBottom:
            "max(0.45rem, calc(var(--speak-page-safe-bottom) + 0.15rem))",
        }}
      >
        {mobileNav.tabs.map((tab) => {
          const Icon = iconMap[tab.icon as keyof typeof iconMap];
          if (!Icon) return null;

          const isActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-11 w-11 items-center justify-center transition-colors [&_svg]:h-[26px] [&_svg]:w-[26px] ${
                  isActive ? "text-white" : "text-white/45"
                }`}
              >
                <Icon active={isActive} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
