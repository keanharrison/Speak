"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  FlaskConical,
  Home,
  MessageCircle,
  Package,
  PawPrint,
  Settings,
  User,
} from "lucide-react";
import { sidebar } from "@/lib/hardcoded-data";

const iconMap = {
  home: Home,
  fileText: FileText,
  messageCircle: MessageCircle,
  calendar: Calendar,
  flask: FlaskConical,
  package: Package,
  pawPrint: PawPrint,
  settings: Settings,
  user: User,
} as const;

type IconKey = keyof typeof iconMap;

function NavLink({
  href,
  label,
  icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: IconKey;
  isActive: boolean;
}) {
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-card px-3 py-2.5 text-[14px] transition-colors ${
        isActive
          ? "text-accent"
          : "text-white/45 hover:bg-white/5 hover:text-white/70"
      }`}
      style={isActive ? { backgroundColor: "rgba(196, 118, 58, 0.15)" } : undefined}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-accent" : "text-white/45"}`}
        strokeWidth={1.75}
        aria-hidden
      />
      {label}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex w-56 shrink-0 flex-col bg-ink px-4 py-6 md:w-60"
      style={{ borderRight: "0.5px solid rgba(255,255,255,0.08)" }}
    >
      <Link
        href="/"
        className="px-3 pb-8 text-[18px] font-bold tracking-tight text-white"
      >
        {sidebar.wordmark}
      </Link>

      <nav className="flex flex-col gap-1">
        {sidebar.primaryNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            }
          />
        ))}
      </nav>

      <div
        className="my-4 h-px"
        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        aria-hidden
      />

      <nav className="flex flex-col gap-1">
        {sidebar.secondaryNav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isActive={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
            }
          />
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-3 px-3 pt-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[14px] font-medium text-white"
          aria-hidden
        >
          {sidebar.user.initial}
        </span>
        <div>
          <p className="text-[14px] font-medium text-white">{sidebar.user.name}</p>
          <p className="text-[12px] text-white/45">{sidebar.user.subtitle}</p>
        </div>
      </div>
    </aside>
  );
}
