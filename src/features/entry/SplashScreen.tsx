"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SPLASH_MS = 3800;

/** First reference photo — golden being held outdoors. */
const SPLASH_IMAGE = "/images/reference/splash-golden-held.jpg";

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.push("/intro");
    }, SPLASH_MS);

    return () => window.clearTimeout(timer);
  }, [router]);

  function goToWelcome() {
    router.push("/intro");
  }

  return (
    <main
      role="button"
      tabIndex={0}
      onClick={goToWelcome}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToWelcome();
        }
      }}
      className="relative flex min-h-0 flex-1 cursor-pointer flex-col overflow-hidden bg-ink"
      aria-label="Continue to Speak"
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SPLASH_IMAGE}
          alt=""
          decoding="sync"
          fetchPriority="high"
          className="h-full w-full object-cover object-[center_28%]"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/25"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5">
        <h1 className="text-center text-5xl font-bold tracking-tight text-white">
          Speak
        </h1>
      </div>
    </main>
  );
}
