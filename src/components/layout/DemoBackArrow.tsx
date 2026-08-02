"use client";

import Link from "next/link";

type DemoBackArrowProps = {
  href?: string;
  onClick?: () => void;
  /** Light arrow for dark photo backgrounds */
  tone?: "light" | "dark";
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
 * Small top-left back chevron for demo navigation
 * (intro stages + name + Home only).
 */
export function DemoBackArrow({
  href,
  onClick,
  tone = "dark",
  className = "",
}: DemoBackArrowProps) {
  const color =
    tone === "light"
      ? "text-white/90 hover:bg-white/15"
      : "text-[#0A0A0A]/85 hover:bg-black/5";

  const style = {
    top: "max(2.15rem, calc(var(--speak-page-safe-top) + 1.85rem))",
    left: "max(0.65rem, env(safe-area-inset-left))",
  } as const;

  const classes = `absolute z-40 flex h-10 w-10 items-center justify-center rounded-full transition ${color} ${className}`;

  if (href) {
    return (
      <Link href={href} aria-label="Back" className={classes} style={style}>
        <ArrowGlyph />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className={classes}
      style={style}
    >
      <ArrowGlyph />
    </button>
  );
}
