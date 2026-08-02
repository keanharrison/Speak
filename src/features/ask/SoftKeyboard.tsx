"use client";

import { useState } from "react";

const ROW1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"] as const;
const ROW2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"] as const;
const ROW3 = ["z", "x", "c", "v", "b", "n", "m"] as const;

type SoftKeyboardProps = {
  onKey: (key: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
  onDismiss?: () => void;
};

function LetterKey({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onPress}
      className="flex h-[42px] flex-1 items-center justify-center rounded-[5px] bg-white text-[22px] font-normal leading-none text-black active:bg-[#adb3bc]"
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.25)" }}
    >
      {label}
    </button>
  );
}

function ModKey({
  children,
  onPress,
  className = "",
  wide,
}: {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={onPress}
      className={`flex h-[42px] items-center justify-center rounded-[5px] bg-[#AEB3BE] text-[16px] font-normal text-black active:bg-[#8e949e] ${
        wide ? "w-[46px] shrink-0" : "flex-1"
      } ${className}`}
      style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.25)" }}
    >
      {children}
    </button>
  );
}

/**
 * iPhone-style soft keyboard for phone-frame demos.
 * Matches iOS layout: suggestions, QWERTY, shift/delete, 123/emoji/space/return.
 */
export function SoftKeyboard({
  onKey,
  onBackspace,
  onReturn,
}: SoftKeyboardProps) {
  const [shifted, setShifted] = useState(true);

  function pressLetter(letter: string) {
    onKey(shifted ? letter.toUpperCase() : letter);
    if (shifted) setShifted(false);
  }

  return (
    <div
      className="shrink-0 select-none rounded-t-[14px] bg-[#D1D5DB] px-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5"
      role="group"
      aria-label="Keyboard"
    >
      {/* Predictive text */}
      <div className="mb-1.5 flex h-9 items-center justify-between px-1">
        {["I", "the", "I'm"].map((word, index) => (
          <button
            key={word}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              onKey(word);
              setShifted(false);
            }}
            className={`flex h-full flex-1 items-center justify-center text-[16px] text-black ${
              index < 2 ? "border-r border-black/15" : ""
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex gap-[6px]">
        {ROW1.map((key) => (
          <LetterKey
            key={key}
            label={shifted ? key.toUpperCase() : key}
            onPress={() => pressLetter(key)}
          />
        ))}
      </div>

      <div className="mt-[10px] flex gap-[6px] px-[14px]">
        {ROW2.map((key) => (
          <LetterKey
            key={key}
            label={shifted ? key.toUpperCase() : key}
            onPress={() => pressLetter(key)}
          />
        ))}
      </div>

      <div className="mt-[10px] flex gap-[6px]">
        <ModKey wide onPress={() => setShifted((value) => !value)}>
          <span className={shifted ? "font-semibold" : ""} aria-hidden>
            ⇧
          </span>
        </ModKey>
        {ROW3.map((key) => (
          <LetterKey
            key={key}
            label={shifted ? key.toUpperCase() : key}
            onPress={() => pressLetter(key)}
          />
        ))}
        <ModKey wide onPress={onBackspace}>
          <span aria-hidden>⌫</span>
        </ModKey>
      </div>

      <div className="mt-[10px] flex gap-[6px]">
        <ModKey wide onPress={() => undefined}>
          <span className="text-[15px]">123</span>
        </ModKey>
        <ModKey wide onPress={() => undefined}>
          <span className="text-[18px]" aria-hidden>
            ☺
          </span>
        </ModKey>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onKey(" ")}
          className="relative flex h-[42px] flex-[4.5] items-center justify-center rounded-[5px] bg-white text-[16px] text-black active:bg-[#adb3bc]"
          style={{ boxShadow: "0 1px 0 rgba(0,0,0,0.25)" }}
        >
          <span className="sr-only">space</span>
          <span className="absolute right-3 text-[11px] text-black/40">
            EN FR
          </span>
        </button>
        <ModKey wide onPress={onReturn}>
          <span aria-hidden>↵</span>
        </ModKey>
      </div>

      <div className="mt-2 flex items-center justify-between px-4 pb-1">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          className="flex h-8 w-8 items-center justify-center text-[20px] text-black/70"
          aria-label="Emoji"
        >
          🌐
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          className="flex h-8 w-8 items-center justify-center text-[18px] text-black/70"
          aria-label="Dictation"
        >
          🎤
        </button>
      </div>
    </div>
  );
}
