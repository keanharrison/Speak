"use client";

import type { AskSuggestion } from "@/types";

type PromptMarqueeProps = {
  suggestions: AskSuggestion[];
  onSelect: (suggestion: AskSuggestion) => void;
};

/**
 * Slow horizontal marquee of prompt cards — fades at the edges.
 */
export function PromptMarquee({ suggestions, onSelect }: PromptMarqueeProps) {
  if (suggestions.length === 0) return null;

  const loop = [...suggestions, ...suggestions];

  return (
    <div className="speak-prompt-marquee relative w-full overflow-hidden py-1">
      <div className="speak-prompt-marquee__track flex w-max gap-2.5">
        {loop.map((suggestion, index) => (
          <button
            key={`${suggestion.id}-${index}`}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="glass-panel shrink-0 px-3.5 py-2.5"
          >
            <p className="whitespace-nowrap text-[13px] font-semibold text-[#0A0A0A]">
              {suggestion.title}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
