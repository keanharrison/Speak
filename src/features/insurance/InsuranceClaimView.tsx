"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    id: "reason",
    title: "Why you're filing",
    body: "Kidney concentration changed from Bailey's baseline on the Q3 Speak screen — worth documenting for your policy.",
  },
  {
    id: "record",
    title: "Attach Speak record",
    body: "Q3 2026 urinalysis summary + trend chart. Plain-English BLUF included for the adjuster.",
  },
  {
    id: "vet",
    title: "Vet visit (optional)",
    body: "If you already saw Dr. Patel, add the visit note. If not, Speak can attach a prep packet instead.",
  },
] as const;

/**
 * Insurance claim — demo shell for the product vision (file with Speak evidence).
 */
export function InsuranceClaimView() {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <main
      className="relative z-10 mx-auto w-full flex-1 overflow-x-hidden px-5 pb-6"
      style={{
        paddingTop:
          "max(2.75rem, calc(var(--speak-page-safe-top) + 2rem))",
      }}
    >
      <h1 className="page-title mt-1">Insurance</h1>

      {submitted ? (
        <section className="glass-panel mt-6 px-4 py-5">
          <p className="text-[15px] font-semibold text-white">
            Claim draft ready
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-white/65">
            Demo only — nothing was sent. In the real product, Speak would
            package the screening, baseline trend, and vet packet for your
            insurer.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setStarted(false);
            }}
            className="glass-light-button mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
          >
            Start over
          </button>
        </section>
      ) : (
        <>
          <section className="glass-panel mt-6 px-4 py-4">
            <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-white/65">
              Suggested from Home
            </p>
            <p className="mt-2 text-[17px] font-semibold text-white">
              Q3 kidney concentration change
            </p>
            <p className="mt-1 text-[14px] leading-relaxed text-white/65">
              One marker moved vs Bailey&apos;s baseline. Use Speak&apos;s
              record so the claim isn&apos;t just a vague worry.
            </p>
            {!started ? (
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="glass-light-button mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
              >
                Start claim
              </button>
            ) : null}
          </section>

          {started ? (
            <section className="mt-4" aria-label="Claim steps">
              <ul className="flex flex-col gap-2.5">
                {STEPS.map((step, index) => (
                  <li key={step.id} className="glass-panel px-4 py-4">
                    <p className="text-[12px] font-medium text-white/65">
                      Step {index + 1}
                    </p>
                    <p className="mt-1 text-[15px] font-semibold text-white">
                      {step.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-white/65">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setSubmitted(true)}
                  className="glass-light-button inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
                >
                  Submit claim draft
                </button>
                <Link
                  href="/dashboard"
                  className="glass-light-button-secondary inline-flex min-h-[44px] w-full items-center justify-center rounded-full px-5 text-[14px] font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </section>
          ) : null}
        </>
      )}
    </main>
  );
}
