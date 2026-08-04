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
 * Shared onboarding footer — Back middle-left, primary CTA middle-right.
 * Inset from the screen edges so controls aren’t in the corners.
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
      } flex justify-center px-8`}
      style={{
        paddingBottom:
          "max(1.75rem, calc(var(--speak-page-safe-bottom) + 1.15rem))",
      }}
    >
      <div className="flex w-full max-w-[19.5rem] items-center justify-between">
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] min-w-[4.5rem] text-left text-[15px] font-medium text-[#0A0A0A] transition hover:opacity-70"
          >
            Back
          </button>
        ) : (
          <span className="min-w-[4.5rem]" aria-hidden />
        )}
        {showNext ? (
          <button
            type={nextType}
            onClick={onNext}
            disabled={nextDisabled}
            className="inline-flex h-11 min-w-[7.5rem] items-center justify-center rounded-full bg-[#0A0A0A] px-8 text-[14px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
          >
            {nextLabel}
          </button>
        ) : (
          <span className="min-w-[7.5rem]" aria-hidden />
        )}
      </div>
    </div>
  );
}
