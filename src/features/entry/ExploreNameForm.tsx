"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DemoBackArrow } from "@/components/layout/DemoBackArrow";
import { SoftKeyboard } from "@/features/ask/SoftKeyboard";
import { saveViewerName } from "@/lib/account";

const TITLE = "What's your first name?";
const NAME_BG_SRC = "/images/intro/name-bg-ocean.jpg";
const BLACK_REVEAL_MS = 1400;
const TITLE_CHAR_MS = 62;
const FORM_REVEAL_DELAY_MS = 500;

/**
 * Name capture — ocean still, typed prompt, SoftKeyboard (same as Speak).
 */
export function ExploreNameForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blackOut, setBlackOut] = useState(true);
  const [titleText, setTitleText] = useState("");
  const [titleDone, setTitleDone] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

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

  function focusComposer() {
    if (!formVisible) return;
    setKeyboardOpen(true);
    inputRef.current?.focus({ preventScroll: true });
  }

  function appendKey(key: string) {
    setFirstName((prev) => {
      if (prev.length >= 40) return prev;
      return `${prev}${key}`.slice(0, 40);
    });
    setError("");
  }

  // Black → page reveal
  useEffect(() => {
    const reveal = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setBlackOut(false));
    });
    return () => window.cancelAnimationFrame(reveal);
  }, []);

  // Type the prompt, then reveal field + actions
  useEffect(() => {
    if (blackOut) return;
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
  }, [blackOut]);

  return (
    <main
      className="absolute inset-0 flex flex-col overflow-hidden bg-[#6a7a88]"
      onClick={dismissKeyboard}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={NAME_BG_SRC}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/40 via-black/15 to-transparent"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-40 bg-black"
        style={{
          opacity: blackOut ? 1 : 0,
          transition: `opacity ${BLACK_REVEAL_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        aria-hidden
      />

      <div onClick={(event) => event.stopPropagation()}>
        <DemoBackArrow tone="light" onClick={goBackToIntro} />
      </div>

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col items-center px-7"
        style={{
          paddingTop: "max(0.45rem, calc(var(--speak-page-safe-top) + 0.2rem))",
          paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
          paddingRight: "max(1.25rem, env(safe-area-inset-right))",
        }}
      >
        <div
          className={`flex w-full max-w-[19rem] flex-col items-center ${
            keyboardOpen ? "justify-end pb-4 pt-6" : "justify-center"
          } min-h-0 flex-1`}
        >
          <div className="relative w-full">
            <p
              className="invisible whitespace-pre-wrap text-center text-[26px] font-medium leading-snug tracking-[-0.02em] text-white sm:text-[28px]"
              aria-hidden
            >
              {TITLE}
            </p>
            <p
              className="absolute inset-0 whitespace-pre-wrap text-center text-[26px] font-medium leading-snug tracking-[-0.02em] text-white sm:text-[28px]"
              style={{ textShadow: "0 1px 14px rgba(0,0,0,0.4)" }}
            >
              {titleText}
              {titleText || titleDone ? (
                <span
                  className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-white"
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
              className="relative flex h-11 w-full cursor-text items-center rounded-full px-4"
              style={{
                border: "0.5px solid rgba(255,255,255,0.55)",
                background: "rgba(255,255,255,0.22)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.65), 0 8px 24px rgba(0,0,0,0.12)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
              }}
              onClick={focusComposer}
            >
              {!firstName ? (
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
                  {keyboardOpen ? (
                    <span className="typing-caret mr-0.5 bg-white" aria-hidden />
                  ) : null}
                  <span className="text-[16px] text-white/45">John</span>
                </div>
              ) : null}
              <div
                ref={inputRef}
                role="textbox"
                tabIndex={formVisible ? 0 : -1}
                aria-label="First name"
                aria-multiline="false"
                onFocus={() => {
                  if (formVisible) setKeyboardOpen(true);
                }}
                className="flex h-full min-w-0 flex-1 items-center text-left text-[16px] font-normal text-white outline-none"
              >
                {firstName ? (
                  <>
                    <span className="whitespace-pre-wrap break-words">
                      {firstName}
                    </span>
                    {keyboardOpen ? (
                      <span
                        className="typing-caret ml-0.5 shrink-0 bg-white"
                        aria-hidden
                      />
                    ) : null}
                  </>
                ) : null}
              </div>
            </div>

            {error ? (
              <p
                className="mt-2 text-center text-[12px] font-medium text-white/90"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <div className="mt-7 flex items-center justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !formVisible}
                tabIndex={formVisible ? 0 : -1}
                className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[14px] font-semibold text-[#0A0A0A] shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition hover:bg-white/92 disabled:opacity-60"
              >
                {isSubmitting ? "…" : "Continue to demo"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div
        className="relative z-30"
        onClick={(event) => event.stopPropagation()}
      >
        <SoftKeyboard
          open={keyboardOpen && formVisible}
          onKey={appendKey}
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
