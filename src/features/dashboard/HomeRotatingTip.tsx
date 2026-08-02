"use client";

import { useEffect, useState } from "react";
import { OpenInSpeak } from "@/features/ask/OpenInSpeak";

type HomeRotatingTipProps = {
  tips: string[];
};

/**
 * Between-kit / between-visits tip — keeps Home useful after results land.
 */
export function HomeRotatingTip({ tips }: HomeRotatingTipProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (tips.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % tips.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [tips.length]);

  if (!tips.length) return null;

  return (
    <section
      aria-label="Tip"
      className="mt-5 rounded-[14px] bg-surface px-4 py-4"
      style={{ border: "0.5px solid rgba(0,0,0,0.08)" }}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
        Tip
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-ink">{tips[index]}</p>
      {tips.length > 1 ? (
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {tips.map((_, tipIndex) => (
            <span
              key={tipIndex}
              className={`h-1 w-1 rounded-full ${
                tipIndex === index ? "bg-ink" : "bg-ink/20"
              }`}
            />
          ))}
        </div>
      ) : null}
      <div className="mt-3 flex justify-end">
        <OpenInSpeak topic="caring for Bailey between kits" />
      </div>
    </section>
  );
}
