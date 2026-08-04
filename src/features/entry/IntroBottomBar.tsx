"use client";

type IntroBottomBarProps = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextType?: "button" | "submit";
  nextDisabled?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  /** When true, bar is in normal flow at the bottom of a flex column */
  relative?: boolean;
};

/**
 * Shared onboarding footer — Back + primary CTA closer together at bottom center.
 * Primary = black / white text · Back = white outline / black text.
 */
export function IntroBottomBar({
  onBack,
  onNext,
  nextLabel = "Next",
  nextType = "button",
  nextDisabled = false,
  showBack = true,
  showNext = true,
  relative = false,
}: IntroBottomBarProps) {
  return (
    <div
      className={`${
        relative ? "relative z-20 mt-auto" : "absolute inset-x-0 bottom-0 z-[60]"
      } flex justify-center px-6`}
      style={{
        paddingBottom:
          "max(1.75rem, calc(var(--speak-page-safe-bottom) + 1.15rem))",
      }}
    >
      <div className="flex items-center justify-center gap-3">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 min-w-[5.5rem] items-center justify-center rounded-full border border-[#0A0A0A] bg-white px-5 text-[14px] font-semibold text-[#0A0A0A] transition hover:bg-black/[0.04]"
          >
            Back
          </button>
        ) : null}
        {showNext ? (
          <button
            type={nextType}
            onClick={onNext}
            disabled={nextDisabled}
            className="inline-flex h-11 min-w-[5.5rem] items-center justify-center rounded-full bg-[#0A0A0A] px-5 text-[14px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
          >
            {nextLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
