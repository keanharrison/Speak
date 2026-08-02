"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { RotateCw } from "lucide-react";

type PhoneFrameProps = {
  children: React.ReactNode;
};

/**
 * iPhone frame for laptop demos.
 * Desktop circular-arrow control toggles portrait ↔ landscape (manual only).
 * Strips the bezel on real phones (portrait or landscape).
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  const pathname = usePathname();
  const isIntro = pathname === "/intro";
  const [landscape, setLandscape] = useState(false);
  const [isRealPhone, setIsRealPhone] = useState(false);
  const [deviceTall, setDeviceTall] = useState(false);

  useEffect(() => {
    if (!isIntro) {
      setLandscape(false);
    }
  }, [isIntro]);

  useEffect(() => {
    const sync = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const phoneSized =
        window.matchMedia("(max-width: 430px)").matches ||
        window.matchMedia("(max-height: 500px)").matches;
      const tall = window.matchMedia("(orientation: portrait)").matches;
      setIsRealPhone(coarse && phoneSized);
      setDeviceTall(tall);
    };
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  const shellClass = isRealPhone
    ? "relative flex h-dvh w-full flex-col overflow-hidden bg-[#e8e8e8]"
    : landscape
      ? "relative flex h-[390px] max-h-[calc(100dvh-5rem)] w-[844px] max-w-[calc(100dvw-3rem)] flex-col overflow-hidden rounded-[42px] border-[10px] border-black bg-[#e8e8e8] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]"
      : "relative flex h-[844px] max-h-[calc(100dvh-3rem)] w-[390px] max-w-full flex-col overflow-hidden rounded-[54px] border-[10px] border-black bg-[#e8e8e8] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]";

  const phoneOrientation = isRealPhone
    ? deviceTall
      ? "portrait"
      : "landscape"
    : landscape
      ? "landscape"
      : "portrait";

  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center gap-6 overflow-x-hidden p-6 ${
        isRealPhone ? "bg-canvas p-0" : "bg-[#cfcfcf]"
      }`}
    >
      <div className={shellClass}>
        {!isRealPhone ? (
          <div
            className={`pointer-events-none absolute z-50 rounded-full bg-black ${
              landscape
                ? "left-2 top-1/2 h-[120px] w-7 -translate-y-1/2"
                : "left-1/2 top-2 h-7 w-[120px] -translate-x-1/2"
            }`}
            aria-hidden
          />
        ) : null}

        <div
          id="speak-phone-stage"
          data-phone-orientation={phoneOrientation}
          className="group/phone relative flex min-h-0 flex-1 flex-col overflow-x-hidden"
        >
          {children}
        </div>
      </div>

      {isIntro && !isRealPhone ? (
        <button
          type="button"
          onClick={() => setLandscape((v) => !v)}
          aria-label={
            landscape ? "Switch phone to portrait" : "Switch phone to landscape"
          }
          title="Rotate phone"
          className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition hover:bg-white/92"
        >
          <RotateCw className="h-4 w-4" strokeWidth={2.25} />
        </button>
      ) : null}
    </div>
  );
}
