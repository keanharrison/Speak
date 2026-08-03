"use client";

import { useCallback, useEffect, useState } from "react";

type SoftKeyboardProps = {
  open: boolean;
  onKey: (key: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
  onHide: () => void;
};

const LETTERS_LOWER = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
] as const;

const LETTERS_UPPER = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
] as const;

const NUMBERS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
  [".", ",", "?", "!", "'"],
] as const;

const SYMBOLS = [
  ["[", "]", "{", "}", "#", "%", "^", "*", "+", "="],
  ["_", "\\", "|", "~", "<", ">", "€", "£", "¥", "•"],
  [".", ",", "?", "!", "'"],
] as const;

type Layout = "letters" | "numbers" | "symbols";

/**
 * In-app keyboard — blocks the native iOS keyboard so the demo
 * behaves like a real app (layout shifts inside the phone stage).
 */
export function SoftKeyboard({
  open,
  onKey,
  onBackspace,
  onReturn,
  onHide,
}: SoftKeyboardProps) {
  const [layout, setLayout] = useState<Layout>("letters");
  const [shifted, setShifted] = useState(true);

  useEffect(() => {
    if (!open) {
      setLayout("letters");
      setShifted(true);
    }
  }, [open]);

  const pressLetter = useCallback(
    (key: string) => {
      onKey(key);
      if (shifted && layout === "letters") setShifted(false);
    },
    [onKey, shifted, layout],
  );

  if (!open) return null;

  const letterRows = shifted ? LETTERS_UPPER : LETTERS_LOWER;
  const rows =
    layout === "letters"
      ? letterRows
      : layout === "numbers"
        ? NUMBERS
        : SYMBOLS;

  return (
    <div
      className="speak-soft-keyboard shrink-0 select-none"
      role="group"
      aria-label="Keyboard"
      onMouseDown={(event) => event.preventDefault()}
    >
      <div className="flex items-center justify-between gap-2 px-3 pb-1.5 pt-2">
        <button
          type="button"
          className="speak-soft-key speak-soft-key--action min-w-[4.5rem] px-3 text-[13px] font-semibold text-[#0A0A0A]"
          onClick={onHide}
        >
          Hide
        </button>
        <p className="text-[12px] font-medium text-[#6b6b6b]">Speak keyboard</p>
        <button
          type="button"
          className="speak-soft-key speak-soft-key--action min-w-[4.5rem] px-3 text-[13px] font-semibold text-[#0A0A0A]"
          onClick={onReturn}
        >
          Send
        </button>
      </div>

      <div className="flex flex-col gap-[6px] px-1.5 pb-2">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center gap-[5px]">
            {layout === "letters" && rowIndex === 2 ? (
              <button
                type="button"
                aria-label={shifted ? "Lowercase" : "Shift"}
                className={`speak-soft-key speak-soft-key--action w-[42px] text-[15px] ${
                  shifted ? "speak-soft-key--active" : ""
                }`}
                onClick={() => setShifted((value) => !value)}
              >
                ⇧
              </button>
            ) : null}

            {layout !== "letters" && rowIndex === 2 ? (
              <button
                type="button"
                className="speak-soft-key speak-soft-key--action min-w-[42px] px-2 text-[13px] font-semibold"
                onClick={() =>
                  setLayout(layout === "numbers" ? "symbols" : "numbers")
                }
              >
                {layout === "numbers" ? "#+=" : "123"}
              </button>
            ) : null}

            {row.map((key) => (
              <button
                key={`${layout}-${key}`}
                type="button"
                className={`speak-soft-key ${
                  layout === "letters" ? "flex-1" : "min-w-[28px] flex-1"
                }`}
                onClick={() =>
                  layout === "letters" ? pressLetter(key) : onKey(key)
                }
              >
                {key}
              </button>
            ))}

            {rowIndex === 2 ? (
              <button
                type="button"
                aria-label="Delete"
                className="speak-soft-key speak-soft-key--action w-[42px] text-[15px]"
                onClick={onBackspace}
              >
                ⌫
              </button>
            ) : null}
          </div>
        ))}

        <div className="flex justify-center gap-[5px]">
          <button
            type="button"
            className="speak-soft-key speak-soft-key--action min-w-[42px] px-2 text-[13px] font-semibold"
            onClick={() =>
              setLayout(layout === "letters" ? "numbers" : "letters")
            }
          >
            {layout === "letters" ? "123" : "ABC"}
          </button>
          <button
            type="button"
            className="speak-soft-key flex-[4] text-[15px]"
            onClick={() => onKey(" ")}
          >
            space
          </button>
          <button
            type="button"
            className="speak-soft-key speak-soft-key--action min-w-[72px] px-3 text-[13px] font-semibold"
            onClick={onReturn}
          >
            return
          </button>
        </div>
      </div>

      <div
        className="h-[max(0.35rem,env(safe-area-inset-bottom,0px))]"
        aria-hidden
      />
    </div>
  );
}
