"use client";

import { useEffect, useState } from "react";
import { Mic, Send, X } from "lucide-react";

type VoiceNotePanelProps = {
  open: boolean;
  onClose: () => void;
  onSend: (label: string) => void;
};

/**
 * Demo voice-note sheet for Speak chat — waveform + mic/send/cancel.
 * Visual only; no real mic capture in the prototype.
 */
export function VoiceNotePanel({ open, onClose, onSend }: VoiceNotePanelProps) {
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 28 }, () => 0.25 + Math.random() * 0.55),
  );

  useEffect(() => {
    if (!open) {
      setSeconds(0);
      return;
    }
    const tick = window.setInterval(() => {
      setSeconds((s) => s + 1);
      setBars(
        Array.from({ length: 28 }, () => 0.2 + Math.random() * 0.75),
      );
    }, 180);
    return () => window.clearInterval(tick);
  }, [open]);

  if (!open) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 px-5"
      style={{
        paddingBottom:
          "max(3.85rem, calc(var(--speak-page-safe-bottom) + 3.1rem))",
      }}
    >
      <div
        className="glass-light-card mx-auto w-full max-w-sm px-5 py-5"
        role="dialog"
        aria-label="Voice note"
      >
        <p className="text-center text-[15px] font-semibold text-[#0A0A0A]">
          Voice Note
        </p>

        <div className="mt-5 flex h-12 items-end justify-center gap-[3px]">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-[4px] rounded-full bg-[#0A0A0A]/75"
              style={{ height: `${Math.max(12, h * 48)}px` }}
              aria-hidden
            />
          ))}
        </div>

        <p className="mt-3 text-center text-[13px] text-[#6b6b6b]">
          {mm}:{ss}
        </p>

        <div className="mt-5 flex items-center justify-center gap-5">
          <button
            type="button"
            aria-label="Cancel voice note"
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black/[0.06] text-[#0A0A0A] transition hover:bg-black/[0.1]"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Recording"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0A0A0A] text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
          >
            <Mic className="h-6 w-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Send voice note"
            onClick={() => {
              onSend(`Voice note (${mm}:${ss})`);
              onClose();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#0A0A0A] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition hover:bg-white/90"
          >
            <Send className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
