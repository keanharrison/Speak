import Link from "next/link";

const moreLinks = [
  {
    href: "/info",
    label: "Info",
    description: "Founders, contact, and roadmap.",
  },
  {
    href: "/glass",
    label: "Glass lab",
    description: "Dark orbs + real glass morphism reference.",
  },
  {
    href: "/scheduling",
    label: "Scheduling",
    description: "Deferred — no auto-booking in V1.",
  },
  {
    href: "/lab-messages",
    label: "Lab messages",
    description: "Lab and clinic coordination (placeholder).",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Account preferences (placeholder).",
  },
] as const;

export default function MorePage() {
  return (
    <main className="flex-1 px-4 py-6">
      <h1 className="text-[28px] font-medium tracking-tight text-ink">More</h1>
      <p className="mt-2 text-[15px] text-muted">
        Extra demo screens. Primary story lives on Home, Ask, and You.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {moreLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-card border border-black/[0.07] bg-white p-4"
            >
              <p className="text-[15px] font-medium text-ink">{link.label}</p>
              <p className="mt-1 text-[13px] text-muted">{link.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
