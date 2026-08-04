"use client";

import Link from "next/link";

type DemoBackArrowProps = {
  href?: string;
  onClick?: () => void;
  /** Light styles for dark photo backgrounds */
  tone?: "light" | "dark";
  /** When set, show text instead of the chevron (e.g. "Back") */
  label?: string;
  className?: string;
};

function ArrowGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/**
 * Demo back control — cleared well below the notch / Dynamic Island.
 */
export function DemoBackArrow({
  href,
  onClick,
  tone = "dark",
  label,
  className = "",
}: DemoBackArrowProps) {
  const color =
    tone === "light"
      ? "text-white/90 hover:bg-white/15"
      : "text-[#0A0A0A]/85 hover:bg-black/5";

  const style = {
    top: "max(2.35rem, calc(var(--speak-page-safe-top) + 1.65rem))",
    left: "max(0.85rem, calc(env(safe-area-inset-left) + 0.35rem))",
  } as const;

  const classes = label
    ? `absolute z-40 inline-flex min-h-[40px] items-center rounded-full px-3 text-[15px] font-medium transition ${color} ${className}`
    : `absolute z-40 flex h-10 w-10 items-center justify-center rounded-full transition ${color} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        aria-label={label ?? "Back"}
        className={classes}
        style={style}
      >
        {label ?? <ArrowGlyph />}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? "Back"}
      className={classes}
      style={style}
    >
      {label ?? <ArrowGlyph />}
    </button>
  );
}
