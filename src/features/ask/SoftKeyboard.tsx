"use client";

import { useCallback, useState } from "react";

type SoftKeyboardProps = {
  open?: boolean;
  onKey: (key: string) => void;
  onBackspace: () => void;
  onReturn: () => void;
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

function fireOnPointerDown(
  event: React.PointerEvent,
  action: () => void,
) {
  // Fire on press (not click release) so typing feels immediate
  if (event.button !== 0 && event.pointerType === "mouse") return;
  event.preventDefault();
  event.stopPropagation();
  action();
}

/**
 * In-app keyboard — pointer-down keys for snappy typing; no native iOS keyboard.
 */
export function SoftKeyboard({
  open = true,
  onKey,
  onBackspace,
  onReturn,
}: SoftKeyboardProps) {
  const [layout, setLayout] = useState<Layout>("letters");
  const [shifted, setShifted] = useState(true);

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
      <div className="speak-soft-keyboard__suggestions flex items-center justify-between px-3 py-2">
        {["to", "and", "on"].map((word, index) => (
          <button
            key={word}
            type="button"
            className={`flex-1 py-0.5 text-center text-[16px] text-[#0A0A0A] ${
              index === 1
                ? "border-x border-black/10"
                : ""
            }`}
            onPointerDown={(event) =>
              fireOnPointerDown(event, () => onKey(word))
            }
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[5px] px-1.5 pb-1.5 pt-0.5">
        {rows.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center gap-[5px]">
            {layout === "letters" && rowIndex === 2 ? (
              <button
                type="button"
                aria-label={shifted ? "Lowercase" : "Shift"}
                className={`speak-soft-key speak-soft-key--action w-[42px] text-[15px] ${
                  shifted ? "speak-soft-key--active" : ""
                }`}
                onPointerDown={(event) =>
                  fireOnPointerDown(event, () => setShifted((value) => !value))
                }
              >
                ⇧
              </button>
            ) : null}

            {layout !== "letters" && rowIndex === 2 ? (
              <button
                type="button"
                className="speak-soft-key speak-soft-key--action min-w-[42px] px-2 text-[13px] font-semibold"
                onPointerDown={(event) =>
                  fireOnPointerDown(event, () =>
                    setLayout(layout === "numbers" ? "symbols" : "numbers"),
                  )
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
                onPointerDown={(event) =>
                  fireOnPointerDown(event, () =>
                    layout === "letters" ? pressLetter(key) : onKey(key),
                  )
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
                onPointerDown={(event) =>
                  fireOnPointerDown(event, onBackspace)
                }
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
            onPointerDown={(event) =>
              fireOnPointerDown(event, () =>
                setLayout(layout === "letters" ? "numbers" : "letters"),
              )
            }
          >
            {layout === "letters" ? "123" : "ABC"}
          </button>
          <button
            type="button"
            className="speak-soft-key flex-[4] text-[15px]"
            onPointerDown={(event) =>
              fireOnPointerDown(event, () => onKey(" "))
            }
          >
            space
          </button>
          <button
            type="button"
            aria-label="Return"
            className="speak-soft-key speak-soft-key--action min-w-[72px] px-3 text-[18px] font-semibold"
            onPointerDown={(event) => fireOnPointerDown(event, onReturn)}
          >
            ↵
          </button>
        </div>
      </div>

      <div
        className="h-[max(0.25rem,env(safe-area-inset-bottom,0px))]"
        aria-hidden
      />
    </div>
  );
}
