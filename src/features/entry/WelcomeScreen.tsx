"use client";

import { useEffect, useRef, useState } from "react";

/** Warm / orange-toned splash source. */
const ANIMATION_VIDEO = "/videos/16030615_3840_2160_60fps.mp4";

/** Brief lines over the continuous video (timestamps in seconds). */
const VIDEO_LINES: { at: number; until: number; text: string }[] = [
  {
    at: 0.3,
    until: 4.2,
    text: "For 10,000 years, dogs have lived beside us",
  },
  {
    at: 4.4,
    until: 8.2,
    text: "To this day, they still can't tell us what's wrong",
  },
];

/** “Until now.” visible, then clear gap, then Speak. */
const UNTIL_VISIBLE_MS = 2000;
const GAP_BEFORE_SPEAK_MS = 2000;

type Phase = "video" | "untilNow" | "gap" | "speak" | "hold";

export function WelcomeScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const phaseRef = useRef<Phase>("video");
  const activeLineRef = useRef("");

  const [phase, setPhase] = useState<Phase>("video");
  const [line, setLine] = useState("");
  const [speakVisible, setSpeakVisible] = useState(false);

  const goPhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  // Video + overlays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    void video.play().catch(() => {});

    const onTime = () => {
      if (phaseRef.current !== "video") return;
      const t = video.currentTime;

      const active = VIDEO_LINES.find((l) => t >= l.at && t < l.until);
      if (!active) {
        if (activeLineRef.current) {
          activeLineRef.current = "";
          setLine("");
        }
      } else if (activeLineRef.current !== active.text) {
        activeLineRef.current = active.text;
        setLine(active.text);
      }
    };

    const onEnded = () => {
      if (phaseRef.current !== "video") return;
      setLine("");
      // Black + “Until now.” land together
      goPhase("untilNow");
    };

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  // Until now (2s) → blank (2s) → Speak → hold
  useEffect(() => {
    if (phase === "untilNow") {
      setSpeakVisible(false);
      const id = window.setTimeout(() => goPhase("gap"), UNTIL_VISIBLE_MS);
      return () => window.clearTimeout(id);
    }

    if (phase === "gap") {
      setSpeakVisible(false);
      const id = window.setTimeout(() => goPhase("speak"), GAP_BEFORE_SPEAK_MS);
      return () => window.clearTimeout(id);
    }

    if (phase === "speak") {
      setSpeakVisible(false);
      const show = window.setTimeout(() => setSpeakVisible(true), 40);
      const hold = window.setTimeout(() => goPhase("hold"), 700);
      return () => {
        window.clearTimeout(show);
        window.clearTimeout(hold);
      };
    }
  }, [phase]);

  const showVideo = phase === "video";
  const showVideoOverlay = showVideo && Boolean(line);
  const showUntil = phase === "untilNow";
  const showSpeak = (phase === "speak" || phase === "hold") && speakVisible;

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={ANIMATION_VIDEO}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center"
        style={{ opacity: showVideo ? 1 : 0 }}
      />

      {showVideo ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-black/55"
          aria-hidden
        />
      ) : null}

      {showVideoOverlay ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <p
            className="max-w-[340px] text-center text-[22px] font-normal leading-[1.45] text-white"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            {line}
          </p>
        </div>
      ) : null}

      {showUntil ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <p
            className="max-w-[340px] text-center text-[22px] font-normal leading-[1.45] text-white"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            Until now.
          </p>
        </div>
      ) : null}

      {showSpeak ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6"
          style={{
            opacity: speakVisible ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <p
            className="text-center font-bold text-white"
            style={{
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "88px",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Speak
          </p>
        </div>
      ) : null}
    </main>
  );
}
