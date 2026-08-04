type SpeakWordmarkProps = {
  className?: string;
  /** Dark text on white (onboarding) vs light on photo */
  tone?: "ink" | "light";
};

/**
 * Brand wordmark — lowercase “speak” in Inter Tight ExtraBold
 * (closest free replica of Superpower’s NB International display face:
 * geometric, heavy, aggressively tight tracking).
 */
export function SpeakWordmark({
  className = "",
  tone = "ink",
}: SpeakWordmarkProps) {
  return (
    <span
      className={`font-speak-brand inline-block lowercase leading-none tracking-[-0.06em] ${
        tone === "light" ? "text-white" : "text-[#0A0A0A]"
      } ${className}`}
      aria-label="Speak"
    >
      speak
    </span>
  );
}
