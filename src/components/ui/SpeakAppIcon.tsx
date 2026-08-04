type SpeakAppIconProps = {
  className?: string;
  /** bark = user Speak logo with rays (endcard); plain = S only */
  variant?: "plain" | "bark";
};

/** Speak app icon — black rounded square, white S (± bark rays). */
export function SpeakAppIcon({
  className = "",
  variant = "plain",
}: SpeakAppIconProps) {
  const src =
    variant === "bark"
      ? "/images/speak-app-icon-bark.png?v=20260804u"
      : "/images/speak-app-icon-v2.png?v=20260804s";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`object-contain ${className}`}
      draggable={false}
      aria-hidden
    />
  );
}
