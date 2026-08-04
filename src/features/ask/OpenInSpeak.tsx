import Link from "next/link";

type OpenInSpeakProps = {
  /** What Speak should greet about — e.g. "Kidney concentration" */
  topic: string;
  /** solid = black CTA white text; full/compact = white glass; glassSecondary = frosted */
  variant?: "full" | "compact" | "glassSecondary" | "solid";
  className?: string;
  label?: string;
};

/** Opens Speak chat with context about a Home card or result. */
export function OpenInSpeak({
  topic,
  variant = "compact",
  className = "",
  label = "Open in Speak",
}: OpenInSpeakProps) {
  const href = `/ask?about=${encodeURIComponent(topic)}`;

  if (variant === "solid") {
    return (
      <Link
        href={href}
        onClick={(event) => event.stopPropagation()}
        className={`inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#0A0A0A] px-5 text-[14px] font-semibold text-white transition hover:bg-black ${className}`}
      >
        {label}
      </Link>
    );
  }

  if (variant === "glassSecondary") {
    return (
      <Link
        href={href}
        onClick={(event) => event.stopPropagation()}
        className={`glass-light-button-secondary inline-flex min-h-[44px] items-center justify-center rounded-full px-5 text-[14px] font-semibold ${className}`}
      >
        {label}
      </Link>
    );
  }

  if (variant === "full") {
    return (
      <Link
        href={href}
        onClick={(event) => event.stopPropagation()}
        className={`glass-light-button inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold ${className}`}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={(event) => event.stopPropagation()}
      className={`glass-light-button inline-flex min-h-[44px] items-center justify-center rounded-full px-3.5 text-[13px] font-semibold ${className}`}
    >
      {label}
    </Link>
  );
}
