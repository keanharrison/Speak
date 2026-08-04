type SpeakAppIconProps = {
  className?: string;
};

/**
 * Speak app icon — square master (teal rays) under an iOS squircle mask.
 */
export function SpeakAppIcon({ className = "" }: SpeakAppIconProps) {
  return (
    <div
      className={`relative overflow-hidden bg-black shadow-[0_18px_50px_rgba(0,0,0,0.45)] ${className}`}
      style={{
        WebkitMaskImage: "url(/images/ios-squircle-mask.png)",
        maskImage: "url(/images/ios-squircle-mask.png)",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/speak-app-icon-teal.png"
        alt=""
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}
