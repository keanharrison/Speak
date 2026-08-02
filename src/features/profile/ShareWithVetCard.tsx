"use client";

import { useState } from "react";
import type { VetSharePacket } from "@/types";

type ShareWithVetCardProps = {
  packet: VetSharePacket;
  /** Accent treatment when this is the Care-tab hero */
  featured?: boolean;
};

/**
 * Owner-controlled vet prep packet — preview + copy, never auto-send.
 */
export function ShareWithVetCard({
  packet,
  featured = false,
}: ShareWithVetCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = [
      packet.heading,
      "",
      ...packet.bullets.map((line) => `• ${line}`),
      "",
      packet.footnote,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      id="share"
      className={`scroll-mt-6 px-4 py-4 ${
        featured ? "glass-light-card" : "glass-panel"
      }`}
      aria-label="Share with vet"
    >
      <h3 className="text-[15px] font-semibold text-[#0A0A0A]">
        {packet.heading}
      </h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[#6b6b6b]">
        {packet.subtitle}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {packet.bullets.map((bullet) => (
          <li
            key={bullet}
            className="text-[13px] leading-relaxed text-[#0A0A0A] before:mr-2 before:text-[#0A0A0A] before:content-['•']"
          >
            {bullet}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleCopy}
        className="glass-light-button mt-4 flex min-h-[44px] w-full items-center justify-center rounded-full px-4 text-[14px] font-semibold"
      >
        {copied ? packet.copiedLabel : packet.shareCta}
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-[#6b6b6b]">
        {packet.footnote}
      </p>
    </section>
  );
}
