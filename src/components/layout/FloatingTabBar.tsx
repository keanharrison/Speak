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

const activeColor = "#0A0A0A";
const inactiveColor = "#0A0A0A";

const iconMap = {
  home: HomeIcon,
  messageCircle: AskIcon,
  vet: CarePlusIcon,
  user: YouIcon,
  contacts: ContactsIcon,
} as const;

/** Floating pill only — overlays content, no header/footer chrome. */
export function FloatingTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center px-3"
      style={{
        paddingBottom:
          "max(1.35rem, calc(env(safe-area-inset-bottom) + 0.65rem))",
      }}
      aria-label="Primary"
    >
      <ul className="glass-tab-bar pointer-events-auto flex w-[min(100%,22.5rem)] items-center justify-between rounded-full px-5 py-3">
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
                className="flex h-11 w-11 items-center justify-center [&_svg]:h-[22px] [&_svg]:w-[22px]"
                style={{
                  color: isActive ? activeColor : inactiveColor,
                  opacity: isActive ? 1 : 0.45,
                }}
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
