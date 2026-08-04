type SpeakAppIconProps = {
  className?: string;
};

/** Speak app icon — black squircle, white S only (no bark rays). */
export function SpeakAppIcon({ className = "" }: SpeakAppIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/speak-app-icon-v2.png"
      alt=""
      className={`object-contain ${className}`}
      draggable={false}
      aria-hidden
    />
  );
}
