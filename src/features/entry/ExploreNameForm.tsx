"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IntroBottomBar } from "@/features/entry/IntroBottomBar";
import { saveViewerName } from "@/lib/account";

const TITLE = "What's your first name?";
const TITLE_CHAR_MS = 62;
const FORM_REVEAL_DELAY_MS = 500;

/**
 * Name capture — bright white onboarding canvas + native iOS keyboard.
 */
export function ExploreNameForm() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [titleDone, setTitleDone] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submitName() {
    const trimmed = firstName.trim();

    if (!trimmed) {
      setError("Please enter a name.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    inputRef.current?.blur();

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
    inputRef.current?.blur();
  }

  function focusField() {
    if (!formVisible) return;
    inputRef.current?.focus();
  }

  function onChange(event: ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value.slice(0, 40));
    setError("");
  }

  // Type the prompt, then reveal field + actions
  useEffect(() => {
    let cancelled = false;
    let i = 0;
    setTitleText("");
    setTitleDone(false);
    setFormVisible(false);

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
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#ffffff]"
      onClick={dismissKeyboard}
    >
      <div
        className="relative z-50 flex flex-1 flex-col items-center justify-center px-7"
        style={{
          paddingTop: "max(2.5rem, calc(var(--speak-page-safe-top) + 1.5rem))",
          paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
          paddingRight: "max(1.25rem, env(safe-area-inset-right))",
          paddingBottom: "max(6.5rem, calc(var(--speak-page-safe-bottom) + 5.5rem))",
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
              className="relative flex h-11 w-full cursor-text items-center rounded-full border border-[#0A0A0A]/14 bg-[#F4F4F5] px-4"
              onClick={focusField}
            >
              <input
                ref={inputRef}
                type="text"
                name="firstName"
                autoComplete="given-name"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                maxLength={40}
                value={firstName}
                placeholder="John"
                aria-label="First name"
                tabIndex={formVisible ? 0 : -1}
                onChange={onChange}
                className="relative z-[1] h-full w-full cursor-text bg-transparent text-left text-[16px] font-normal text-[#0A0A0A] outline-none placeholder:text-[#0A0A0A]/35"
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
          </form>
        </div>
      </div>

      {formVisible ? (
        <div onClick={(event) => event.stopPropagation()}>
          <IntroBottomBar
            onBack={goBackToIntro}
            nextType="button"
            nextLabel={isSubmitting ? "…" : "Demo"}
            nextDisabled={isSubmitting}
            onNext={() => {
              void submitName();
            }}
          />
        </div>
      ) : null}
    </main>
  );
}
