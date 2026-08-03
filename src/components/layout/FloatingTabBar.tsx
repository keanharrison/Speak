"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AskIcon,
  CarePlusIcon,
  ContactsIcon,
  HomeIcon,
  YouIcon,
} from "@/components/layout/navIcons";
import { mobileNav } from "@/lib/hardcoded-data";

const iconMap = {
  home: HomeIcon,
  messageCircle: AskIcon,
  vet: CarePlusIcon,
  user: YouIcon,
  contacts: ContactsIcon,
} as const;

/**
 * Light frosted pill. Active page = black circle + white icon.
 */
export function FloatingTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3"
      aria-label="Primary"
    >
      <ul className="glass-tab-bar pointer-events-auto flex w-[min(100%,22.5rem)] items-center justify-between rounded-full px-3 py-1.5">
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
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors [&_svg]:h-[26px] [&_svg]:w-[26px] ${
                  isActive
                    ? "bg-[#0A0A0A] text-white"
                    : "text-[#0A0A0A] opacity-40"
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
