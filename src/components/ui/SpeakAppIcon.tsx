type SpeakAppIconProps = {
  className?: string;
};

/** Speak app icon — pre-cropped iOS squircle PNG. */
export function SpeakAppIcon({ className = "" }: SpeakAppIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/speak-empty-icon.png"
      alt=""
      className={`object-contain ${className}`}
      draggable={false}
      aria-hidden
    />
  );
}
