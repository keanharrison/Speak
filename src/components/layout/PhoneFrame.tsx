"use client";

import { useEffect, useState } from "react";

type PhoneFrameProps = {
  children: React.ReactNode;
};

/**
 * Pin the demo to iOS Safari’s *visible* area:
 * below the Dynamic Island, above the Safari toolbar / keyboard.
 *
 * Uses VisualViewport height + offsetTop (not 100vh/dvh alone).
 * Bottom chrome gap = layoutHeight − vv.height − vv.offsetTop.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
 */
function useSpeakViewport(enabled: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    let stableHeight = 0;

    if (!enabled) {
      root.classList.remove("speak-device");
      root.style.removeProperty("--speak-app-height");
      root.style.removeProperty("--speak-app-top");
      root.style.removeProperty("--speak-app-left");
      root.style.removeProperty("--speak-app-width");
      root.style.removeProperty("--speak-app-bottom-gap");
      body.style.removeProperty("overflow");
      body.style.removeProperty("position");
      body.style.removeProperty("width");
      body.style.removeProperty("height");
      body.style.removeProperty("touch-action");
      return;
    }

    root.classList.add("speak-device");

    const isTextFieldFocused = () => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        el.isContentEditable
      );
    };

    const sync = () => {
      const vv = window.visualViewport;
      const layoutH = root.clientHeight || window.innerHeight;

      if (!vv) {
        root.style.setProperty("--speak-app-height", "100svh");
        root.style.setProperty("--speak-app-top", "0px");
        root.style.setProperty("--speak-app-left", "0px");
        root.style.setProperty("--speak-app-width", "100%");
        root.style.setProperty("--speak-app-bottom-gap", "0px");
        return;
      }

      const vvHeight = Math.max(1, Math.round(vv.height));
      const top = 0;
      const left = Math.max(0, Math.round(vv.offsetLeft));
      const width = Math.max(1, Math.round(vv.width));
      const rawShell = vvHeight + Math.round(vv.offsetTop);
      const bottomGap = Math.max(
        0,
        Math.round(layoutH - vvHeight - vv.offsetTop),
      );

      // Keep shell height stable while the native keyboard is up so the UI
      // doesn't squash — composer lifts separately in AskView.
      const keyboardOpen =
        isTextFieldFocused() && vvHeight < layoutH * 0.82;

      if (keyboardOpen && stableHeight > 0) {
        root.style.setProperty("--speak-app-height", `${stableHeight}px`);
        root.style.setProperty("--speak-app-top", `${top}px`);
        root.style.setProperty("--speak-app-left", `${left}px`);
        root.style.setProperty("--speak-app-width", `${width}px`);
        root.style.setProperty("--speak-app-bottom-gap", "0px");
        return;
      }

      stableHeight = rawShell;
      root.style.setProperty("--speak-app-height", `${rawShell}px`);
      root.style.setProperty("--speak-app-top", `${top}px`);
      root.style.setProperty("--speak-app-left", `${left}px`);
      root.style.setProperty("--speak-app-width", `${width}px`);
      root.style.setProperty("--speak-app-bottom-gap", `${bottomGap}px`);
    };

    // Lock document scroll — only #speak-phone-stage children scroll
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.touchAction = "manipulation";

    sync();
    const vv = window.visualViewport;
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    document.addEventListener("focusin", sync);
    document.addEventListener("focusout", sync);

    // iOS sometimes settles insets a tick after chrome show/hide
    const settle = window.setTimeout(sync, 150);

    return () => {
      window.clearTimeout(settle);
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      document.removeEventListener("focusin", sync);
      document.removeEventListener("focusout", sync);
      root.classList.remove("speak-device");
      root.style.removeProperty("--speak-app-height");
      root.style.removeProperty("--speak-app-top");
      root.style.removeProperty("--speak-app-left");
      root.style.removeProperty("--speak-app-width");
      root.style.removeProperty("--speak-app-bottom-gap");
      body.style.removeProperty("overflow");
      body.style.removeProperty("position");
      body.style.removeProperty("width");
      body.style.removeProperty("height");
      body.style.removeProperty("touch-action");
    };
  }, [enabled]);
}

/**
 * iPhone frame for laptop demos — always portrait (same seat as every page).
 * Strips the bezel on real phones.
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  const [isRealPhone, setIsRealPhone] = useState(false);
  const [deviceTall, setDeviceTall] = useState(false);

  useSpeakViewport(isRealPhone);

  useEffect(() => {
    const sync = () => {
      // Touch-first + no-hover covers phones; 548px catches Pro Max (~440)
      // and still excludes typical laptop/demo widths.
      const touchPrimary =
        window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(hover: none)").matches;
      const phoneSized =
        window.matchMedia("(max-width: 548px)").matches ||
        window.matchMedia("(max-height: 500px)").matches;
      const tall = window.matchMedia("(orientation: portrait)").matches;
      setIsRealPhone(touchPrimary && phoneSized);
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
    ? "speak-phone-shell--device"
    : "speak-phone-shell--pending relative flex h-[844px] max-h-[calc(100dvh-3rem)] w-[390px] max-w-full flex-col overflow-hidden rounded-[54px] border-[10px] border-black bg-[#e8e8e8] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)]";

  const phoneOrientation = isRealPhone
    ? deviceTall
      ? "portrait"
      : "landscape"
    : "portrait";

  return (
    <div
      className={
        isRealPhone
          ? "speak-phone-root--device"
          : "speak-phone-root--pending flex min-h-dvh flex-col items-center justify-center overflow-x-hidden bg-[#cfcfcf] p-6"
      }
    >
      <div className={shellClass}>
        {!isRealPhone ? (
          <div
            className="speak-phone-notch pointer-events-none absolute left-1/2 top-2 z-50 h-7 w-[120px] -translate-x-1/2 rounded-full bg-black"
            aria-hidden
          />
        ) : null}

        <div
          id="speak-phone-stage"
          data-phone-orientation={phoneOrientation}
          data-real-phone={isRealPhone ? "true" : "false"}
          className="group/phone relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[var(--color-canvas)]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
