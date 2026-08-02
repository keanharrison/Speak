"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SoftKeyboard } from "@/features/ask/SoftKeyboard";
import { saveViewerName } from "@/lib/account";
import { prefersSoftKeyboard } from "@/lib/device";

const PLACEHOLDER = "Name";
const EXPLORE_BG_SRC = "/images/intro/choice-bg-hill.png";
const BLACK_REVEAL_MS = 1400;

/**
 * Name capture before the demo — frosted glass over illustrated backdrop.
 */
export function ExploreNameForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [fieldFocused, setFieldFocused] = useState(false);
  const [cardIn, setCardIn] = useState(false);
  const [blackOut, setBlackOut] = useState(true);
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
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitName();
  }

  function openSoftKeyboard() {
    if (prefersSoftKeyboard()) setKeyboardOpen(true);
  }

  function dismissKeyboard() {
    setKeyboardOpen(false);
    inputRef.current?.blur();
    setFieldFocused(false);
  }

  /** Soft keyboard only from a direct tap on the field — not from focus alone. */
  function focusField() {
    openSoftKeyboard();
    inputRef.current?.focus();
    setFieldFocused(true);
  }

  // Desktop: focus for hardware typing, no soft keyboard.
  // Phone: wait for tap — soft keyboard only then.
  useEffect(() => {
    if (prefersSoftKeyboard()) return;
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      setFieldFocused(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  // Black → page reveal; glass card pops after the veil lifts.
  useEffect(() => {
    const reveal = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setBlackOut(false));
    });
    const card = window.setTimeout(() => setCardIn(true), 520);
    return () => {
      window.cancelAnimationFrame(reveal);
      window.clearTimeout(card);
    };
  }, []);

  // Intro music fade is owned by a shared Audio module — it keeps running here.

  // Leaving the tab/URL bar: drop soft keyboard, keep caret if input still focused.
  useEffect(() => {
    const hideSoftOnly = () => setKeyboardOpen(false);
    const onVis = () => {
      if (document.visibilityState === "hidden") hideSoftOnly();
    };
    window.addEventListener("blur", hideSoftOnly);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("blur", hideSoftOnly);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const showCaret = fieldFocused && !firstName;

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#a8d0ef]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={EXPLORE_BG_SRC}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-white/10" aria-hidden />

      <div
        className="pointer-events-none absolute inset-0 z-40 bg-black"
        style={{
          opacity: blackOut ? 1 : 0,
          transition: `opacity ${BLACK_REVEAL_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        aria-hidden
      />

      <div
        className={`relative z-10 flex min-h-0 flex-1 flex-col items-center px-6 ${
          keyboardOpen ? "justify-end pb-3 pt-10" : "justify-center py-10"
        }`}
      >
        {keyboardOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-0 cursor-default"
            aria-label="Dismiss keyboard"
            onClick={dismissKeyboard}
          />
        ) : null}

        <div
          className="relative z-10 w-full max-w-sm overflow-hidden rounded-[20px] px-6 py-10"
          style={{
            border: "1px solid rgba(255,255,255,0.7)",
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.52) 45%, rgba(255,255,255,0.4) 100%)",
            boxShadow:
              "0 16px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            opacity: cardIn ? 1 : 0,
            transform: cardIn
              ? "translateY(0) scale(1)"
              : "translateY(18px) scale(0.94)",
            transition:
              "opacity 520ms cubic-bezier(0.22, 1, 0.36, 1), transform 560ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <h1 className="text-center text-[26px] font-black leading-snug tracking-tight text-[#0A0A0A]">
            What&apos;s your first name?
          </h1>

          <form onSubmit={onSubmit} className="mt-8 flex w-full flex-col">
            <div
              className="relative flex h-12 w-full cursor-text items-center rounded-full px-5"
              style={{
                border: "1px solid rgba(255,255,255,0.65)",
                background: "rgba(255,255,255,0.55)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
              }}
              onClick={focusField}
            >
              {!firstName ? (
                <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center">
                  {showCaret ? (
                    <span className="typing-caret" aria-hidden />
                  ) : null}
                  <span className="text-[15px] font-normal text-[#A3A3A3]">
                    {PLACEHOLDER}
                  </span>
                </div>
              ) : null}

              <input
                ref={inputRef}
                type="text"
                name="firstName"
                autoComplete="given-name"
                autoCapitalize="words"
                maxLength={40}
                value={firstName}
                aria-label="First name"
                onFocus={() => {
                  setFieldFocused(true);
                }}
                onBlur={() => {
                  window.setTimeout(() => {
                    if (document.activeElement !== inputRef.current) {
                      setFieldFocused(false);
                    }
                  }, 0);
                }}
                onChange={(event) => {
                  setFirstName(event.target.value.slice(0, 40));
                  setError("");
                }}
                className={`h-full w-full bg-transparent text-left text-[15px] font-normal text-[#0A0A0A] outline-none ${
                  firstName ? "" : "caret-transparent"
                }`}
              />
            </div>

            {error ? (
              <p
                className="mt-3 text-center text-[13px] font-medium text-[#0A0A0A]/80"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0A0A0A] px-6 text-[14px] font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition hover:bg-black/90 disabled:opacity-60"
            >
              {isSubmitting ? "Saving…" : "Continue to Speak"}
            </button>

            <button
              type="button"
              className="mx-auto mt-5 text-[14px] font-medium text-[#0A0A0A]/70 transition-colors hover:text-[#0A0A0A]"
              onClick={() => {
                dismissKeyboard();
                try {
                  sessionStorage.setItem("introResume", "idle");
                } catch {
                  /* ignore */
                }
                router.push("/intro");
              }}
            >
              Back
            </button>
          </form>
        </div>
      </div>

      {keyboardOpen ? (
        <div className="relative z-20 w-full">
          <SoftKeyboard
            onKey={(key) => {
              setFirstName((prev) => `${prev}${key}`.slice(0, 40));
              setError("");
              inputRef.current?.focus();
            }}
            onBackspace={() => {
              setFirstName((prev) => prev.slice(0, -1));
              inputRef.current?.focus();
            }}
            onReturn={() => {
              void submitName();
            }}
            onDismiss={dismissKeyboard}
          />
        </div>
      ) : null}
    </main>
  );
}
