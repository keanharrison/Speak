"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SoftKeyboard } from "@/features/ask/SoftKeyboard";
import { saveViewerName } from "@/lib/account";

const TITLE = "What's your first name?";
const TITLE_CHAR_MS = 62;
const FORM_REVEAL_DELAY_MS = 500;

/**
 * Name capture — white onboarding canvas + SoftKeyboard on field tap.
 */
export function ExploreNameForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [titleDone, setTitleDone] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submitName() {
    const trimmed = firstName.trim();

    if (!trimmed) {
      setError("Please enter a name.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setKeyboardOpen(false);

    try {
      const response = await fetch("/api/viewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Could not save name");
      }

      saveViewerName(trimmed);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitName();
  }

  function goBackToIntro() {
    try {
      sessionStorage.setItem("introResume", "idle");
    } catch {
      /* ignore */
    }
    router.push("/intro");
  }

  function dismissKeyboard() {
    setKeyboardOpen(false);
    inputRef.current?.blur();
  }

  function openKeyboard() {
    if (!formVisible) return;
    setKeyboardOpen(true);
    inputRef.current?.focus({ preventScroll: true });
  }

  // Type the prompt, then reveal field + actions
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    setTitleText("");
    setTitleDone(false);
    setFormVisible(false);
    setKeyboardOpen(false);

    const tick = () => {
      if (cancelled) return;
      if (i >= TITLE.length) {
        setTitleDone(true);
        window.setTimeout(() => {
          if (cancelled) return;
          setFormVisible(true);
        }, FORM_REVEAL_DELAY_MS);
        return;
      }
      i += 1;
      setTitleText(TITLE.slice(0, i));
      window.setTimeout(tick, TITLE_CHAR_MS);
    };

    const start = window.setTimeout(tick, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(start);
    };
  }, []);

  return (
    <main
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white"
      onClick={dismissKeyboard}
    >
      <div
        className="relative z-50 flex flex-1 flex-col items-center justify-center px-7"
        style={{
          paddingTop: "max(2.5rem, calc(var(--speak-page-safe-top) + 1.5rem))",
          paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
          paddingRight: "max(1.25rem, env(safe-area-inset-right))",
        }}
      >
        <div className="flex w-full max-w-[19rem] flex-col items-center">
          <div className="relative w-full">
            <p
              className="invisible whitespace-pre-wrap text-center text-[26px] font-medium leading-snug tracking-[-0.02em] text-[#0A0A0A] sm:text-[28px]"
              aria-hidden
            >
              {TITLE}
            </p>
            <p className="absolute inset-0 whitespace-pre-wrap text-center text-[26px] font-medium leading-snug tracking-[-0.02em] text-[#0A0A0A] sm:text-[28px]">
              {titleText}
              {titleText || titleDone ? (
                <span
                  className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-[#0A0A0A]"
                  style={{
                    animation: formVisible
                      ? "none"
                      : "typing-caret-blink 1.05s step-end infinite",
                    opacity: formVisible ? 0 : undefined,
                  }}
                  aria-hidden
                />
              ) : null}
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="mt-7 flex w-full flex-col items-center"
            style={{
              opacity: formVisible ? 1 : 0,
              pointerEvents: formVisible ? "auto" : "none",
              transition: "opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            aria-hidden={!formVisible}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative flex h-11 w-full cursor-text items-center rounded-full border border-[#0A0A0A]/18 bg-[#F4F4F5] px-4"
              onClick={openKeyboard}
            >
              {!firstName && keyboardOpen ? (
                <span
                  className="pointer-events-none absolute left-4 top-1/2 h-[1.05em] w-[2px] -translate-y-1/2 bg-[#0A0A0A]"
                  style={{
                    animation: "typing-caret-blink 1.05s step-end infinite",
                  }}
                  aria-hidden
                />
              ) : null}
              <input
                ref={inputRef}
                type="text"
                name="firstName"
                readOnly
                inputMode="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={40}
                value={firstName}
                placeholder={keyboardOpen ? "" : "John"}
                aria-label="First name"
                tabIndex={formVisible ? 0 : -1}
                onFocus={openKeyboard}
                onClick={openKeyboard}
                className="h-full w-full cursor-text bg-transparent text-left text-[16px] font-normal text-[#0A0A0A] outline-none placeholder:text-[#0A0A0A]/35"
              />
            </div>

            {error ? (
              <p
                className="mt-2 text-center text-[12px] font-medium text-[#0A0A0A]"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div className="mt-8 flex w-full items-center justify-between gap-4">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goBackToIntro();
                }}
                tabIndex={formVisible ? 0 : -1}
                className="text-[15px] font-medium text-[#0A0A0A] transition hover:opacity-70"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formVisible}
                tabIndex={formVisible ? 0 : -1}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex h-11 min-w-[10rem] items-center justify-center rounded-full bg-[#0A0A0A] px-6 text-[14px] font-semibold text-white transition hover:bg-black disabled:opacity-60"
              >
                {isSubmitting ? "…" : "Continue to demo"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        className="relative z-50 mt-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <SoftKeyboard
          open={keyboardOpen && formVisible}
          onKey={(key) => {
            setFirstName((prev) => `${prev}${key}`.slice(0, 40));
            setError("");
          }}
          onBackspace={() => {
            setFirstName((prev) => prev.slice(0, -1));
            setError("");
          }}
          onReturn={() => {
            void submitName();
          }}
        />
      </div>
    </main>
  );
}
