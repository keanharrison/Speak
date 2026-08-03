"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { introSrc } from "@/features/entry/introBeats";
import {
  fadeIntroMusicOut,
  getIntroMusic,
  setIntroMusicGain,
  clearIntroMusicFade,
} from "@/features/entry/introMusic";

/**
 * Speak cinematic intro — greeting → play → captions → Speak → name.
 *
 * Drop voiceover at /public/audio/intro-vo.m4a
 */
/**
 * Intro timing constants.
 */
/** Music-only black hold before the open fade */
const OPEN_BLACK_S = 0.55;
/** Fade continues into the playing clip (no frozen still) */
const OPEN_REVEAL_MS = 900;
/** Tiny hold after VO/video start before the black veil lifts */
const OPEN_REVEAL_DELAY_MS = 80;

const LINES = [
  /** Music-only black lead — then fade + VO + first clip together */
  {
    text: "",
    duration: OPEN_BLACK_S,
    layout: "black",
    openLead: true,
  },
  // 01-origin (~5.0s)
  {
    text: "For 10,000 years",
    duration: 1.9,
    file: "01-origin.mp4",
    need: "Motion: ancient bond / dog+human history energy",
  },
  {
    text: "dogs have lived beside us",
    duration: 2.85,
    file: "01-origin.mp4",
    need: "Motion: ancient bond / dog+human history energy",
  },
  // 02-closeness — trim last 0.2s of source; slow to fill same wall time
  {
    text: "We share our days",
    duration: 1.45,
    file: "02-closeness.mp4",
    need: "Motion: home intimacy — hands in fur, shared space",
  },
  {
    text: "our home",
    duration: 1.1,
    file: "02-closeness.mp4",
    need: "Motion: home intimacy — hands in fur, shared space",
  },
  {
    text: "our quiet",
    duration: 3.15,
    file: "02-closeness.mp4",
    need: "Motion: home intimacy — hands in fur, shared space",
  },
  // 03-hinge
  {
    text: "but when they speak",
    duration: 1.8,
    file: "03-hinge.mp4",
    need: "Motion: almost-communication — night worry, eye contact",
  },
  {
    text: "we still can't understand them",
    duration: 2.0,
    file: "03-hinge.mp4",
    need: "Motion: almost-communication — night worry, eye contact",
    charMs: 44,
    /** Caption ends → hold (+1s) → googling + “So,” together */
    afterTypeHoldMs: 1500,
  },
  // 04-loop — video + “So,” land together after hinge hold
  {
    text: "So, we wait, we read, we watch",
    duration: 4.1,
    file: "04-loop.mp4",
    need: "Motion: googling / phone scroll / watching and waiting",
    charMs: 55,
    /** “So” starts immediately on cut (0.3s sooner than the old lead-in) */
    typeStartMs: 0,
    pauseAfter: [
      { endsWith: "So,", extraMs: 400 },
      { endsWith: "wait,", extraMs: 400 },
      { endsWith: "read,", extraMs: 200 },
    ],
  },
  {
    text: "trying to guess what's wrong",
    duration: 2.0,
    file: "04-loop.mp4",
    need: "Motion: googling / phone scroll / watching and waiting",
    /** Full caption → 1.5s → dog + question */
    afterTypeHoldMs: 1500,
  },
  /**
   * Final dog clip + question together (types like other captions).
   * Then Speak endcard on blurred ocean — no mid-black cut.
   */
  {
    text: "But what if we didn't have to guess?",
    duration: 4.85,
    file: "05-turn.mp4",
    layout: "caption",
    need: "Motion: dog looking into lens — slow push-in",
  },
] as const;

type IntroLine = (typeof LINES)[number];

const VIDEO_FILES = [
  "01-origin.mp4",
  "02-closeness.mp4",
  "03-hinge.mp4",
  "04-loop.mp4",
  "05-turn.mp4",
] as const;

/** Zoom animates on the computer / googling shot */
const ZOOM_FILE = "04-loop.mp4";
const ZOOM_SCALE = 1.28;
const ZOOM_MS = 3200;
/** Hinge starts already punched in — no zoom animation */
const HINGE_FILE = "03-hinge.mp4";
const HINGE_STATIC_SCALE = 1.22;
/** Closeness — drop last 0.2s of source; slow to fill the caption wall time */
const CLOSENESS_FILE = "02-closeness.mp4";
const CLOSENESS_TRIM_END_S = 0.2;
const CLOSENESS_WALL_S = 1.45 + 1.1 + 3.15;

/** Pre-play greeting (portrait type → Next → landscape play) */
const GREETING_COPY = `Welcome to Speak!

Before you view our product demo, we invite you to watch a brief video.

- Kean & McCoy`;
const GREETING_CHAR_MS = 42;
/** Beat after title before body line */
const GREETING_AFTER_TITLE_MS = 520;
/** Next appears after typing finishes */
const GREETING_NEXT_DELAY_MS = 800;

/** Voiceover — place file in /public/audio/ (served on Vercel as a static asset). */
const AUDIO_SRC = "/audio/intro-vo.m4a?v=20260731i";
/** Front screen + blurred video backdrop */
const GREETING_BG_SRC = "/images/intro/greeting-bg-front.jpg";

/** Shared type for greeting + captions (system / SF stack) */
const INTRO_MESSAGE_TYPE =
  "font-medium leading-relaxed tracking-[-0.01em] text-white";
/** Skip lead-in on VO (0 = play from start) */
const AUDIO_START_S = 0;
/** Music — steady under VO for the whole intro (no swell) */
const MUSIC_VOLUME = 0.55;

/** Caption — white */
const CAPTION_COLOR = "#FFFFFF";
/** Character type pace — spoken feel, not word pops */
const CHAR_MS = 32;
const PUNCT_PAUSE_MS = 160;
/** Black hold before Speak — cut straight to brand */
const BLACK_BEFORE_SPEAK_MS = 0;
/** S mark pops first, then the Speak word */
const SPEAK_S_BEFORE_WORD_MS = 780;
/** Speak word alone / with mark hold before fade to name */
const SPEAK_HOLD_MS = 3600;
/** Full-screen fade to black before name page */
const FADE_TO_NAME_MS = 1600;
/** Music keeps playing and eases out across the name-page handoff */
export const MUSIC_OUT_MS = 3600;
/** How long play/pause feedback stays on screen after a tap */
const CONTROL_FLASH_MS = 700;

type PauseAfter = { endsWith: string; extraMs: number };

type Phase =
  | "greeting"
  | "idle"
  | "playing"
  | "black"
  | "speak"
  | "fade";
type ControlFlash = "play" | "pause" | null;
type LineLayout = "caption" | "center" | "video" | "black";

function PlayGlyph() {
  return (
    <span
      className="ml-1 block h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-black"
      aria-hidden
    />
  );
}

function PauseGlyph() {
  return (
    <span className="flex items-center gap-[5px]" aria-hidden>
      <span className="block h-5 w-[5px] rounded-[1px] bg-black" />
      <span className="block h-5 w-[5px] rounded-[1px] bg-black" />
    </span>
  );
}

function BackArrowGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ForwardArrowGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/** Shared top inset for intro nav chevrons (below status / notch) */
const INTRO_ARROW_TOP =
  "max(2.15rem, calc(var(--speak-page-safe-top) + 1.85rem))";

/** App icon mark — white S on black squircle, no bark lines */
function SpeakMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden
    >
      <rect width="100" height="100" rx="22" fill="#0A0A0A" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
        fontSize="64"
        fontWeight="700"
      >
        S
      </text>
    </svg>
  );
}

function waitRaf(times = 2) {
  return new Promise<void>((resolve) => {
    const step = (n: number) => {
      if (n <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(() => step(n - 1));
    };
    step(times);
  });
}

function seekTo(el: HTMLVideoElement, t: number) {
  return new Promise<void>((resolve) => {
    const finish = () => {
      el.removeEventListener("seeked", onSeeked);
      resolve();
    };
    const onSeeked = () => finish();
    if (el.readyState >= 2 && Math.abs(el.currentTime - t) < 0.05) {
      resolve();
      return;
    }
    el.addEventListener("seeked", onSeeked);
    try {
      el.currentTime = t;
    } catch {
      finish();
      return;
    }
    window.setTimeout(finish, 400);
  });
}

export function CinematicIntro() {
  const router = useRouter();
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const runIdRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const typeRunRef = useRef(0);
  const beatTimersRef = useRef<number[]>([]);
  const activeFileRef = useRef<string | null>(null);
  const lineIndexRef = useRef(0);
  const runLineRef = useRef<(index: number) => void>(() => {});
  const phaseRef = useRef<Phase>("greeting");

  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<Phase>("greeting");
  const [lineIndex, setLineIndex] = useState(0);
  const [lineText, setLineText] = useState("");
  const [stackZ, setStackZ] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [missing, setMissing] = useState<Record<string, boolean>>({});
  const missingRef = useRef<Record<string, boolean>>({});
  const [speakIn, setSpeakIn] = useState(false);
  const [speakLogo, setSpeakLogo] = useState(false);
  const [nameFade, setNameFade] = useState(false);
  const [paused, setPaused] = useState(false);
  const [controlFlash, setControlFlash] = useState<ControlFlash>(null);
  const [audioAvailable, setAudioAvailable] = useState(false);
  /** Closeness zoom animation */
  const [clipZoom, setClipZoom] = useState(false);
  /** Opening: veil lifts + slight scale settle */
  const [openReveal, setOpenReveal] = useState(false);
  const [greetingText, setGreetingText] = useState("");
  const [greetingDone, setGreetingDone] = useState(false);
  const [greetingNextVisible, setGreetingNextVisible] = useState(false);

  const pausedRef = useRef(false);
  const beatStartedAtRef = useRef(0);
  const beatRemainingMsRef = useRef(0);
  const typeResumeRef = useRef<{
    typeId: number;
    line: string;
    charIndex: number;
    charMs: number;
    pauseAfter: PauseAfter[];
  } | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const clearBeatTimers = useCallback(() => {
    beatTimersRef.current.forEach((id) => window.clearTimeout(id));
    beatTimersRef.current = [];
  }, []);

  const clearFlashTimer = useCallback(() => {
    if (flashTimerRef.current != null) {
      window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
  }, []);

  const flashControl = useCallback(
    (kind: ControlFlash) => {
      clearFlashTimer();
      setControlFlash(kind);
      flashTimerRef.current = window.setTimeout(() => {
        setControlFlash(null);
        flashTimerRef.current = null;
      }, CONTROL_FLASH_MS);
    },
    [clearFlashTimer],
  );

  const musicFadeRef = useRef<number | null>(null);

  const clearMusicFade = useCallback(() => {
    if (musicFadeRef.current != null) {
      window.clearInterval(musicFadeRef.current);
      musicFadeRef.current = null;
    }
    clearIntroMusicFade();
  }, []);

  const setMusicGain = useCallback((mult: number) => {
    setIntroMusicGain(mult);
  }, []);

  const setMusicVolumeNow = useCallback(
    (volume: number) => {
      clearMusicFade();
      const music = getIntroMusic();
      musicRef.current = music;
      if (music) music.volume = Math.max(0, Math.min(1, volume));
    },
    [clearMusicFade],
  );

  /** Ease out through the black → name handoff (continues on /explore). */
  const fadeMusicOut = useCallback(
    (ms = MUSIC_OUT_MS) => {
      musicRef.current = getIntroMusic();
      fadeIntroMusicOut(ms, MUSIC_VOLUME);
    },
    [],
  );

  const pauseVideos = useCallback(() => {
    Object.values(videoRefs.current).forEach((el) => el?.pause());
  }, []);

  const pauseAll = useCallback(() => {
    pauseVideos();
    audioRef.current?.pause();
    getIntroMusic()?.pause();
  }, [pauseVideos]);

  const stopVoice = useCallback(() => {
    clearMusicFade();
    setMusicGain(1);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = AUDIO_START_S;
    }
    const music = getIntroMusic();
    musicRef.current = music;
    if (music) {
      music.pause();
      music.currentTime = 0;
      music.volume = MUSIC_VOLUME;
    }
  }, [clearMusicFade, setMusicGain]);

  const playMusicFromStart = useCallback(() => {
    const music = getIntroMusic();
    musicRef.current = music;
    if (!music) return;
    setMusicGain(1);
    setMusicVolumeNow(MUSIC_VOLUME);
    music.currentTime = 0;
    void music.play().catch(() => {
      /* ignore */
    });
  }, [setMusicGain, setMusicVolumeNow]);

  const playVoiceOnly = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audioAvailable) {
      audio.volume = 1;
      audio.currentTime = AUDIO_START_S;
      void audio.play().catch(() => {
        /* missing file or autoplay policy */
      });
    }
  }, [audioAvailable]);

  function lineLayout(line: IntroLine): LineLayout {
    if ("layout" in line && line.layout) return line.layout;
    return "caption";
  }

  function lineFile(line: IntroLine | undefined): string | undefined {
    if (!line || !("file" in line)) return undefined;
    return line.file;
  }

  function lineStartAt(line: IntroLine | undefined): number {
    if (!line || !("startAt" in line)) return 0;
    const v = (line as { startAt?: number }).startAt;
    return typeof v === "number" ? v : 0;
  }

  function linePauseAfter(line: IntroLine): PauseAfter[] {
    if ("pauseAfter" in line && Array.isArray(line.pauseAfter)) {
      return line.pauseAfter as PauseAfter[];
    }
    return [];
  }

  /** Character-by-character type — no caret. One line replaces the previous. */
  const typeBeatLine = useCallback(
    (
      line: string,
      fromChar = 0,
      charMs = CHAR_MS,
      pauseAfter: PauseAfter[] = [],
      onComplete?: () => void,
      startDelayMs = 80,
    ) => {
      const typeId = ++typeRunRef.current;
      clearTimers();
      if (fromChar <= 0) setLineText("");

      let charIndex = fromChar;
      if (fromChar > 0) setLineText(line.slice(0, fromChar));

      typeResumeRef.current = { typeId, line, charIndex, charMs, pauseAfter };

      const tick = () => {
        if (typeRunRef.current !== typeId || pausedRef.current) return;
        if (charIndex >= line.length) {
          typeResumeRef.current = null;
          onComplete?.();
          return;
        }

        charIndex += 1;
        const typed = line.slice(0, charIndex);
        setLineText(typed);
        typeResumeRef.current = { typeId, line, charIndex, charMs, pauseAfter };

        if (charIndex >= line.length) {
          typeResumeRef.current = null;
          onComplete?.();
          return;
        }

        const justTyped = line[charIndex - 1] ?? "";
        let pause = /[,—–.!?]/.test(justTyped)
          ? charMs + PUNCT_PAUSE_MS
          : charMs;
        for (const rule of pauseAfter) {
          if (typed.endsWith(rule.endsWith)) {
            pause += rule.extraMs;
            break;
          }
        }
        timersRef.current.push(window.setTimeout(tick, pause));
      };

      const firstDelay =
        fromChar > 0 ? charMs : Math.max(0, startDelayMs);
      timersRef.current.push(window.setTimeout(tick, firstDelay));
    },
    [clearTimers],
  );

  /** Decode + seek next clip so the cut lands on the first frame (no lag). */
  const primeFile = useCallback(async (file: string, startAt = 0) => {
    if (missingRef.current[file]) return;
    const el = videoRefs.current[file];
    if (!el) return;
    el.muted = true;
    el.playsInline = true;
    if (el.readyState < 2) {
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        el.addEventListener("loadeddata", done, { once: true });
        el.addEventListener("error", done, { once: true });
        window.setTimeout(done, 1500);
      });
    }
    if (el.readyState < 2) return;
    await seekTo(el, startAt);
    el.pause();
  }, []);

  const cutToFile = useCallback(
    async (
      file: string,
      runId: number,
      opts?: { play?: boolean; startAt?: number },
    ) => {
      if (missingRef.current[file]) return;

      const el = videoRefs.current[file];
      if (!el || runIdRef.current !== runId) return;
      const shouldPlay = opts?.play !== false;
      const startAt = opts?.startAt ?? 0;

      el.muted = true;
      el.playsInline = true;

      if (el.readyState < 2) {
        await new Promise<void>((resolve) => {
          const done = () => resolve();
          el.addEventListener("loadeddata", done, { once: true });
          el.addEventListener("error", done, { once: true });
          window.setTimeout(done, 1500);
        });
      }
      if (runIdRef.current !== runId) return;
      if (el.readyState < 2) return;

      await seekTo(el, startAt);
      if (runIdRef.current !== runId) return;

      if (file === CLOSENESS_FILE) {
        const dur = el.duration;
        if (dur && Number.isFinite(dur) && dur > CLOSENESS_TRIM_END_S) {
          const content = dur - CLOSENESS_TRIM_END_S;
          el.playbackRate = Math.max(0.5, Math.min(1, content / CLOSENESS_WALL_S));
        } else {
          el.playbackRate = CLOSENESS_WALL_S / (CLOSENESS_WALL_S + CLOSENESS_TRIM_END_S);
        }
      } else {
        el.playbackRate = 1;
      }

      // Show frame immediately — don’t wait for play()/raf (fixes googling lag)
      setRevealed((prev) => ({ ...prev, [file]: true }));
      setStackZ((prev) => {
        const top = Math.max(0, ...Object.values(prev), 0) + 1;
        return { ...prev, [file]: top };
      });

      Object.entries(videoRefs.current).forEach(([f, other]) => {
        if (f !== file && other && !other.paused) other.pause();
      });

      if (file === ZOOM_FILE && shouldPlay) {
        setClipZoom(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (runIdRef.current === runId) setClipZoom(true);
          });
        });
      } else {
        setClipZoom(false);
      }

      if (shouldPlay) {
        try {
          await el.play();
        } catch {
          /* ignore autoplay blocks */
        }
      } else {
        el.pause();
      }
    },
    [],
  );

  const runLine = useCallback(
    (index: number) => {
      clearBeatTimers();
      const runId = ++runIdRef.current;

      if (index >= LINES.length) {
        pauseVideos();
        const audio = audioRef.current;
        if (audio) {
          audio.pause();
          audio.currentTime = AUDIO_START_S;
        }
        typeRunRef.current += 1;
        clearTimers();
        setLineText("");
        setRevealed({});
        setClipZoom(false);
        activeFileRef.current = null;
        setSpeakIn(false);
        setSpeakLogo(false);
        setNameFade(false);
        setPhase("black");
        beatTimersRef.current.push(
          window.setTimeout(() => {
            if (runIdRef.current !== runId) return;
            setPhase("speak");
            try {
              router.prefetch("/explore");
            } catch {
              /* ignore */
            }
            // S mark pops first → Speak word → hold → name page
            beatTimersRef.current.push(
              window.setTimeout(() => {
                if (runIdRef.current !== runId) return;
                setSpeakLogo(true);
                beatTimersRef.current.push(
                  window.setTimeout(() => {
                    if (runIdRef.current !== runId) return;
                    setSpeakIn(true);
                    beatTimersRef.current.push(
                      window.setTimeout(() => {
                        if (runIdRef.current !== runId) return;
                        clearBeatTimers();
                        const audio = audioRef.current;
                        if (audio) {
                          audio.pause();
                          audio.currentTime = AUDIO_START_S;
                        }
                        fadeMusicOut(MUSIC_OUT_MS);
                        setPhase("fade");
                        setNameFade(true);
                        try {
                          sessionStorage.setItem("introSeen", "true");
                        } catch {
                          /* ignore */
                        }
                        window.setTimeout(() => {
                          router.push("/explore");
                        }, FADE_TO_NAME_MS);
                      }, SPEAK_HOLD_MS),
                    );
                  }, SPEAK_S_BEFORE_WORD_MS),
                );
              }, BLACK_BEFORE_SPEAK_MS),
            );
          }, BLACK_BEFORE_SPEAK_MS),
        );
        return;
      }

      setPhase("playing");
      setPaused(false);
      pausedRef.current = false;
      setLineIndex(index);
      lineIndexRef.current = index;
      const next = LINES[index];
      const layout = lineLayout(next);
      const file = lineFile(next);
      const charMs =
        "charMs" in next && typeof next.charMs === "number"
          ? next.charMs
          : CHAR_MS;
      const pauses = linePauseAfter(next);
      const leavingOpenLead =
        index > 0 &&
        "openLead" in LINES[index - 1] &&
        Boolean(
          (LINES[index - 1] as { openLead?: boolean }).openLead,
        );

      const afterTypeHoldMs =
        "afterTypeHoldMs" in next &&
        typeof (next as { afterTypeHoldMs?: number }).afterTypeHoldMs ===
          "number"
          ? (next as { afterTypeHoldMs: number }).afterTypeHoldMs
          : null;
      const typeStartMs =
        "typeStartMs" in next &&
        typeof (next as { typeStartMs?: number }).typeStartMs === "number"
          ? (next as { typeStartMs: number }).typeStartMs
          : 80;

      const snapText =
        "snapText" in next && Boolean((next as { snapText?: boolean }).snapText);

      if (layout === "center") {
        typeRunRef.current += 1;
        clearTimers();
        typeResumeRef.current = null;
        setLineText(next.text);
      } else if (snapText) {
        typeRunRef.current += 1;
        clearTimers();
        typeResumeRef.current = null;
        setLineText(next.text);
      } else if (layout === "black") {
        typeRunRef.current += 1;
        clearTimers();
        typeResumeRef.current = null;
        setLineText("");
      } else if (afterTypeHoldMs != null) {
        typeBeatLine(
          next.text,
          0,
          charMs,
          pauses,
          () => {
            if (runIdRef.current !== runId || pausedRef.current) return;
            beatTimersRef.current.push(
              window.setTimeout(() => {
                if (runIdRef.current !== runId || pausedRef.current) return;
                runLine(index + 1);
              }, afterTypeHoldMs),
            );
          },
          typeStartMs,
        );
      } else {
        typeBeatLine(next.text, 0, charMs, pauses, undefined, typeStartMs);
      }

      // After black hold: VO + video start; fade lifts a beat later
      if (leavingOpenLead) {
        playVoiceOnly();
        beatTimersRef.current.push(
          window.setTimeout(() => {
            if (runIdRef.current !== runId) return;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (runIdRef.current === runId) setOpenReveal(true);
              });
            });
          }, OPEN_REVEAL_DELAY_MS),
        );
      }

      const startAt = lineStartAt(next);
      if (layout === "center" || layout === "black" || !file) {
        pauseVideos();
        setRevealed({});
        setClipZoom(false);
        activeFileRef.current = null;
      } else if (activeFileRef.current !== file) {
        activeFileRef.current = file;
        void cutToFile(file, runId, { play: true, startAt });
      } else {
        const el = videoRefs.current[file];
        if (el && el.paused) {
          void el.play().catch(() => {
            /* ignore */
          });
        }
      }

      // Warm the next clip so “So, we…” lands on googling without hinge lag
      const upcoming = LINES[index + 1];
      const upcomingFile = upcoming ? lineFile(upcoming) : null;
      if (upcomingFile && upcomingFile !== file) {
        void primeFile(upcomingFile, lineStartAt(upcoming));
      }

      // Duration timer skipped when advancing after type-complete hold
      if (afterTypeHoldMs == null) {
        const ms = next.duration * 1000;
        beatStartedAtRef.current = Date.now();
        beatRemainingMsRef.current = ms;

        beatTimersRef.current.push(
          window.setTimeout(() => {
            if (runIdRef.current !== runId || pausedRef.current) return;
            runLine(index + 1);
          }, ms),
        );
      } else {
        beatStartedAtRef.current = Date.now();
        beatRemainingMsRef.current = 8000;
      }
    },
    [
      clearBeatTimers,
      clearTimers,
      cutToFile,
      fadeMusicOut,
      pauseVideos,
      playVoiceOnly,
      primeFile,
      setMusicGain,
      setMusicVolumeNow,
      typeBeatLine,
      router,
    ],
  );

  runLineRef.current = runLine;
  phaseRef.current = phase;

  /** When a clip finishes early, loop hinge/googling; freeze others. */
  const onVideoEnded = useCallback((file: string) => {
    if (phaseRef.current !== "playing" || pausedRef.current) return;
    if (activeFileRef.current !== file) return;
    const el = videoRefs.current[file];
    if (!el) return;
    try {
      if (file === HINGE_FILE || file === ZOOM_FILE) {
        el.currentTime = 0;
        void el.play().catch(() => {
          /* ignore */
        });
        return;
      }
      el.pause();
      if (el.duration && Number.isFinite(el.duration)) {
        const trim =
          file === CLOSENESS_FILE ? CLOSENESS_TRIM_END_S : 0.05;
        el.currentTime = Math.max(0, el.duration - trim);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const onVideoTimeUpdate = useCallback((file: string) => {
    if (file !== CLOSENESS_FILE) return;
    if (phaseRef.current !== "playing" || pausedRef.current) return;
    if (activeFileRef.current !== file) return;
    const el = videoRefs.current[file];
    if (!el || !el.duration || !Number.isFinite(el.duration)) return;
    const stopAt = el.duration - CLOSENESS_TRIM_END_S;
    if (el.currentTime >= stopAt - 0.04) {
      try {
        el.pause();
        el.currentTime = Math.max(0, stopAt);
      } catch {
        /* ignore */
      }
    }
  }, []);

  const togglePause = useCallback(() => {
    if (phase !== "playing") return;

    if (!pausedRef.current) {
      const elapsed = Date.now() - beatStartedAtRef.current;
      beatRemainingMsRef.current = Math.max(
        0,
        beatRemainingMsRef.current - elapsed,
      );
      clearBeatTimers();
      clearTimers();
      pauseAll();
      pausedRef.current = true;
      setPaused(true);
      flashControl("pause");
      return;
    }

    pausedRef.current = false;
    setPaused(false);
    flashControl("play");

    const file = lineFile(LINES[lineIndex]);
    const el = file ? videoRefs.current[file] : null;
    if (el) {
      void el.play().catch(() => {
        /* ignore */
      });
    }
    if (audioAvailable && audioRef.current) {
      audioRef.current.volume = 1;
      void audioRef.current.play().catch(() => {
        /* ignore */
      });
    }
    if (musicRef.current || getIntroMusic()) {
      const music = getIntroMusic();
      musicRef.current = music;
      if (music) {
        setMusicVolumeNow(MUSIC_VOLUME);
        setMusicGain(1);
        void music.play().catch(() => {
          /* ignore */
        });
      }
    }

    const resume = typeResumeRef.current;
    if (resume && resume.charIndex < resume.line.length) {
      typeBeatLine(
        resume.line,
        resume.charIndex,
        resume.charMs,
        resume.pauseAfter,
      );
    }

    const runId = runIdRef.current;
    const remaining = beatRemainingMsRef.current;
    beatStartedAtRef.current = Date.now();
    beatTimersRef.current.push(
      window.setTimeout(() => {
        if (runIdRef.current !== runId || pausedRef.current) return;
        runLine(lineIndex + 1);
      }, remaining),
    );
  }, [
    phase,
    lineIndex,
    audioAvailable,
    clearBeatTimers,
    clearTimers,
    pauseAll,
    flashControl,
    setMusicVolumeNow,
    setMusicGain,
    typeBeatLine,
    runLine,
  ]);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      await waitRaf(2);
      if (cancelled) return;

      setReady(true);

      const nextMissing: Record<string, boolean> = { ...missingRef.current };

      VIDEO_FILES.forEach((file) => {
        const el = videoRefs.current[file];
        if (!el) {
          nextMissing[file] = true;
          return;
        }
        el.muted = true;
        el.playsInline = true;
        el.preload = "auto";
        el.src = introSrc(file);

        let settled = false;
        const ok = () => {
          if (settled || cancelled) return;
          settled = true;
          nextMissing[file] = false;
          missingRef.current = { ...nextMissing };
          setMissing({ ...nextMissing });
        };
        const bad = () => {
          if (settled || cancelled) return;
          settled = true;
          nextMissing[file] = true;
          missingRef.current = { ...nextMissing };
          setMissing({ ...nextMissing });
        };

        el.addEventListener("loadeddata", ok, { once: true });
        el.addEventListener("error", bad, { once: true });
        el.load();
        window.setTimeout(() => {
          if (el.readyState >= 2) ok();
          else bad();
        }, 3000);
      });

      missingRef.current = nextMissing;
      setMissing({ ...nextMissing });

      // Probe voiceover — optional until you drop the file in
      const probe = new Audio();
      probe.preload = "auto";
      probe.src = AUDIO_SRC;
      const markOk = () => {
        if (!cancelled) setAudioAvailable(true);
      };
      const markBad = () => {
        if (!cancelled) setAudioAvailable(false);
      };
      probe.addEventListener("canplaythrough", markOk, { once: true });
      probe.addEventListener("error", markBad, { once: true });
      window.setTimeout(() => {
        if (probe.readyState >= 2) markOk();
      }, 2000);
    };

    void boot();
    return () => {
      cancelled = true;
      clearTimers();
      clearBeatTimers();
      clearFlashTimer();
      stopVoice();
      runIdRef.current += 1;
      typeRunRef.current += 1;
    };
    // Boot once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resume at play screen when returning from name page
  useEffect(() => {
    let resume = false;
    try {
      resume = sessionStorage.getItem("introResume") === "idle";
      if (resume) sessionStorage.removeItem("introResume");
    } catch {
      /* ignore */
    }
    if (!resume) return;
    setPhase("idle");
    setGreetingText("");
    setGreetingDone(false);
    setGreetingNextVisible(false);
  }, []);

  const startIntro = useCallback(() => {
    if (phase !== "idle" || !ready) return;
    clearBeatTimers();
    setNameFade(false);
    setSpeakIn(false);
    setSpeakLogo(false);
    setLineText("");
    setLineIndex(0);
    setRevealed({});
    setClipZoom(false);
    setOpenReveal(false);
    activeFileRef.current = null;
    setPhase("playing");
    setPaused(false);
    pausedRef.current = false;
    // Music starts on black; VO + first clip begin after open-lead beat
    playMusicFromStart();
    runLine(0);
  }, [phase, ready, clearBeatTimers, playMusicFromStart, runLine]);

  const goToPlayScreen = useCallback(() => {
    if (phase !== "greeting" || !greetingNextVisible) return;
    setPhase("idle");
  }, [phase, greetingNextVisible]);

  /** Demo navigation — step back through greeting → play → film */
  const goBack = useCallback(() => {
    if (phase === "idle") {
      setPhase("greeting");
      return;
    }

    // playing / speak / fade / black → stop and return to play screen
    runIdRef.current += 1;
    typeRunRef.current += 1;
    clearTimers();
    clearBeatTimers();
    clearFlashTimer();
    stopVoice();
    pauseVideos();
    setPaused(false);
    pausedRef.current = false;
    setLineText("");
    setLineIndex(0);
    setSpeakIn(false);
    setSpeakLogo(false);
    setNameFade(false);
    setOpenReveal(false);
    setClipZoom(false);
    setControlFlash(null);
    setRevealed({});
    activeFileRef.current = null;
    setPhase("idle");
  }, [
    phase,
    clearTimers,
    clearBeatTimers,
    clearFlashTimer,
    stopVoice,
    pauseVideos,
  ]);

  /** Skip ahead to the name page from the video screen. */
  const goForward = useCallback(() => {
    runIdRef.current += 1;
    typeRunRef.current += 1;
    clearTimers();
    clearBeatTimers();
    clearFlashTimer();
    stopVoice();
    pauseVideos();
    try {
      sessionStorage.setItem("introSeen", "true");
    } catch {
      /* ignore */
    }
    router.push("/explore");
  }, [
    clearTimers,
    clearBeatTimers,
    clearFlashTimer,
    stopVoice,
    pauseVideos,
    router,
  ]);

  // Greeting typewriter — Next appears when typing finishes
  useEffect(() => {
    if (phase !== "greeting") return;
    let cancelled = false;
    let i = 0;
    setGreetingText("");
    setGreetingDone(false);
    setGreetingNextVisible(false);
    const tick = () => {
      if (cancelled) return;
      if (i >= GREETING_COPY.length) {
        setGreetingDone(true);
        window.setTimeout(() => {
          if (!cancelled) setGreetingNextVisible(true);
        }, GREETING_NEXT_DELAY_MS);
        return;
      }
      i += 1;

      // After “Welcome to Speak!” skip the blank line so the caret
      // lands on the body (one newline only, no empty middle line).
      const finishedTitle = GREETING_COPY.slice(0, i).endsWith("Speak!");
      if (finishedTitle && GREETING_COPY[i] === "\n") {
        i += 1; // keep a single line break
        while (i < GREETING_COPY.length && GREETING_COPY[i] === "\n") {
          i += 1; // drop the empty line
        }
      }

      const next = GREETING_COPY.slice(0, i);
      setGreetingText(next);
      const justTyped = GREETING_COPY[i - 1] ?? "";

      let delay = GREETING_CHAR_MS;
      if (finishedTitle) {
        delay = GREETING_AFTER_TITLE_MS;
      } else if (justTyped === "\n") {
        delay = GREETING_CHAR_MS + 160;
      } else if (/[.!]/.test(justTyped)) {
        delay = GREETING_CHAR_MS + 260;
      }
      window.setTimeout(tick, delay);
    };
    const id = window.setTimeout(tick, 100);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [phase]);

  const showVideo = phase === "playing";
  const showIdle = phase === "idle";
  const showGreeting = phase === "greeting";
  const active = LINES[lineIndex];
  const activeLayout = active ? lineLayout(active) : "caption";
  const activeFile = lineFile(active);
  const activeMissing = Boolean(activeFile && missing[activeFile]);
  const hideStageForBeat =
    activeLayout === "center" || activeLayout === "black";
  const openLeadActive =
    showVideo &&
    Boolean(
      active &&
        "openLead" in active &&
        (active as { openLead?: boolean }).openLead,
    );
  const showFilmShell = showIdle || showVideo;
  const showBlurBg =
    showFilmShell || phase === "speak" || phase === "fade" || phase === "black";
  const showCaptionUnder = showVideo && activeLayout === "caption";
  const showCenterLine = showVideo && activeLayout === "center";
  // Mid-film black only — open-lead stays on the film shell
  const showBlackBeat = showVideo && activeLayout === "black" && !openLeadActive;
  const showControlFlash =
    showVideo &&
    !hideStageForBeat &&
    (controlFlash === "pause" || controlFlash === "play");
  const showSpeakEnd =
    phase === "speak" || (phase === "fade" && speakIn && !nameFade);

  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-black">
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      {/* Blurred ocean still behind the glass film stage / Speak endcard */}
      {showBlurBg ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GREETING_BG_SRC}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-black/40"
            aria-hidden
          />
        </>
      ) : null}

      {showGreeting ? (
        <div className="absolute inset-0 z-40 overflow-hidden bg-[#6a7a88]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GREETING_BG_SRC}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[52%] bg-gradient-to-b from-black/35 via-black/12 to-transparent"
            aria-hidden
          />

          {/* Message centered in the sky half (above the sea line) */}
          <div
            className="relative z-10 flex h-[48%] flex-col items-center justify-center px-7"
            style={{
              paddingTop: "max(2.5rem, calc(var(--speak-page-safe-top) + 1.5rem))",
              paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
              paddingRight: "max(1.25rem, env(safe-area-inset-right))",
            }}
          >
            <div className="relative w-full max-w-md">
              <p
                className={`invisible whitespace-pre-wrap text-center text-[20px] sm:text-[21px] ${INTRO_MESSAGE_TYPE}`}
                aria-hidden
              >
                {GREETING_COPY}
              </p>
              <p
                className={`absolute inset-0 whitespace-pre-wrap text-center text-[20px] sm:text-[21px] ${INTRO_MESSAGE_TYPE}`}
                style={{ textShadow: "0 1px 14px rgba(0,0,0,0.4)" }}
              >
                {greetingText}
                {greetingText || greetingDone ? (
                  <span
                    className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-white"
                    style={{
                      animation: "typing-caret-blink 1.05s step-end infinite",
                    }}
                    aria-hidden
                  />
                ) : null}
              </p>
            </div>
          </div>

          {greetingNextVisible ? (
            <button
              type="button"
              onClick={goToPlayScreen}
              className="absolute z-20 inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-black shadow-[0_8px_24px_rgba(0,0,0,0.28)] transition hover:bg-white/92"
              style={{
                right: "max(1.25rem, env(safe-area-inset-right))",
                bottom: "max(1.35rem, calc(var(--speak-page-safe-bottom) + 0.75rem))",
              }}
            >
              Next
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Glass film stage over blurred ocean */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-3 ${
          showFilmShell && !showGreeting
            ? ""
            : "pointer-events-none opacity-0"
        }`}
        style={{
          paddingTop: "max(3.25rem, calc(var(--speak-page-safe-top) + 2.5rem))",
          paddingBottom:
            "max(1.25rem, calc(var(--speak-page-safe-bottom) + 0.75rem))",
        }}
      >
        <div
          className={`relative aspect-[16/9] w-full max-w-[40rem] max-h-[min(58vh,28rem)] overflow-hidden rounded-[18px] sm:rounded-[22px] group-data-[phone-orientation=portrait]/phone:max-h-[min(42vh,22rem)] group-data-[phone-orientation=portrait]/phone:w-[calc(100%-0.5rem)] group-data-[phone-orientation=portrait]/phone:max-w-none ${
            showFilmShell ? "" : "pointer-events-none absolute opacity-0"
          }`}
          style={{
            border: "0.5px solid rgba(255,255,255,0.55)",
            background: "rgba(255,255,255,0.12)",
            boxShadow:
              "0 20px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.65), inset 0 -1px 0 rgba(255,255,255,0.12)",
            backdropFilter: "blur(28px) saturate(170%)",
            WebkitBackdropFilter: "blur(28px) saturate(170%)",
          }}
        >
          <div className="absolute inset-[1px] overflow-hidden rounded-[17px] sm:rounded-[21px] bg-black/80">
            <div
              className="absolute inset-0"
              style={{
                opacity: showIdle ? 1 : openReveal ? 1 : 0,
                transition: showIdle
                  ? undefined
                  : `opacity ${OPEN_REVEAL_MS}ms ease-out`,
              }}
            >
              {VIDEO_FILES.map((file) => {
                const z = stackZ[file] ?? 0;
                const show =
                  showVideo &&
                  !hideStageForBeat &&
                  Boolean(revealed[file]) &&
                  !missing[file];
                const scale =
                  file === ZOOM_FILE && clipZoom
                    ? ZOOM_SCALE
                    : file === HINGE_FILE
                      ? HINGE_STATIC_SCALE
                      : 1;
                return (
                  <video
                    key={file}
                    ref={(el) => {
                      videoRefs.current[file] = el;
                    }}
                    muted
                    playsInline
                    preload="auto"
                    loop={file === HINGE_FILE || file === ZOOM_FILE}
                    onEnded={() => onVideoEnded(file)}
                    onTimeUpdate={() => onVideoTimeUpdate(file)}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      zIndex: z,
                      opacity: show ? 1 : 0,
                      transform: `scale(${scale})`,
                      transition:
                        file === ZOOM_FILE
                          ? `transform ${ZOOM_MS}ms ease-out`
                          : undefined,
                      transformOrigin: "center center",
                    }}
                  />
                );
              })}
            </div>

            {showIdle ? (
              <div className="absolute inset-0 z-40 flex items-center justify-center">
                <button
                  type="button"
                  onClick={startIntro}
                  disabled={!ready}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 transition hover:bg-white disabled:opacity-40"
                  aria-label="Play intro"
                >
                  <PlayGlyph />
                </button>
              </div>
            ) : null}

            {showVideo && !showIdle ? (
              <div
                className="pointer-events-none absolute inset-0 z-[25] bg-black"
                style={{
                  opacity: openReveal ? 0 : 1,
                  transition: `opacity ${OPEN_REVEAL_MS}ms ease-in-out`,
                }}
                aria-hidden
              />
            ) : null}

            {showVideo && !hideStageForBeat ? (
              <button
                type="button"
                className="absolute inset-0 z-40 cursor-pointer bg-transparent"
                aria-label={paused ? "Resume intro" : "Pause intro"}
                onClick={togglePause}
              />
            ) : null}

            {showControlFlash ? (
              <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95">
                  {controlFlash === "pause" ? <PauseGlyph /> : <PlayGlyph />}
                </div>
              </div>
            ) : null}

            {showVideo && activeMissing && active ? (
              <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                  {(activeFile ?? "").replace(".mp4", "")} · awaiting upload
                </p>
                <p className="max-w-xs text-[11px] leading-relaxed text-white/25">
                  {"need" in active ? active.need : ""}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {/* Captions under the glass stage — same type as greeting */}
        {showFilmShell ? (
          <div className="flex w-full shrink-0 justify-center px-3">
            <p
              className={`min-h-[2.75em] max-w-[min(24rem,94%)] text-center text-[16px] sm:text-[17px] ${INTRO_MESSAGE_TYPE}`}
              style={{
                color: CAPTION_COLOR,
                visibility: showCaptionUnder ? "visible" : "hidden",
                textShadow: "0 1px 14px rgba(0,0,0,0.55)",
              }}
              aria-hidden={!showCaptionUnder}
            >
              {showCaptionUnder ? lineText || "\u00a0" : "\u00a0"}
            </p>
          </div>
        ) : null}

        {(showIdle || showVideo) && !showGreeting ? (
          <>
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="absolute z-[60] flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15"
              style={{
                top: INTRO_ARROW_TOP,
                left: "max(0.65rem, env(safe-area-inset-left))",
              }}
            >
              <BackArrowGlyph />
            </button>
            <button
              type="button"
              onClick={goForward}
              aria-label="Skip to name"
              className="absolute z-[60] flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15"
              style={{
                top: INTRO_ARROW_TOP,
                right: "max(0.65rem, env(safe-area-inset-right))",
              }}
            >
              <ForwardArrowGlyph />
            </button>
          </>
        ) : null}
      </div>

      {showBlackBeat ? (
        <div className="absolute inset-0 z-30 bg-black">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-transparent"
            aria-label={paused ? "Resume intro" : "Pause intro"}
            onClick={togglePause}
          />
        </div>
      ) : null}

      {showCenterLine ? (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center bg-black"
          style={{
            paddingTop: "max(1rem, var(--speak-page-safe-top))",
            paddingBottom: "max(1rem, var(--speak-page-safe-bottom))",
            paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
            paddingRight: "max(1.25rem, env(safe-area-inset-right))",
          }}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-transparent"
            aria-label={paused ? "Resume intro" : "Pause intro"}
            onClick={togglePause}
          />
          <p
            className={`pointer-events-none max-w-[min(36rem,92%)] text-center text-[20px] sm:text-[26px] ${INTRO_MESSAGE_TYPE}`}
            style={{ color: CAPTION_COLOR }}
          >
            {lineText || "\u00a0"}
          </p>
        </div>
      ) : null}

      {showSpeakEnd ? (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{
            paddingTop: "max(1rem, var(--speak-page-safe-top))",
            paddingBottom: "max(1rem, var(--speak-page-safe-bottom))",
            paddingLeft: "max(1.25rem, env(safe-area-inset-left))",
            paddingRight: "max(1.25rem, env(safe-area-inset-right))",
          }}
        >
          <button
            type="button"
            onClick={goBack}
            aria-label="Back"
            className="absolute z-30 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15"
            style={{
              top: INTRO_ARROW_TOP,
              left: "max(0.65rem, env(safe-area-inset-left))",
            }}
          >
            <BackArrowGlyph />
          </button>
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="flex items-center justify-center"
              style={{
                opacity: speakLogo ? 1 : 0,
                transform: speakLogo
                  ? "translateY(0) scale(1)"
                  : "translateY(14px) scale(0.86)",
                transition:
                  "opacity 650ms cubic-bezier(0.22, 1, 0.36, 1), transform 650ms cubic-bezier(0.22, 1, 0.36, 1)",
                marginBottom: "1.15rem",
              }}
            >
              <SpeakMark className="h-[5.25rem] w-[5.25rem] sm:h-[6.25rem] sm:w-[6.25rem]" />
            </div>
            <p
              className="text-[64px] font-bold leading-none tracking-tight text-white sm:text-[84px]"
              style={{
                opacity: speakIn ? 1 : 0,
                transform: speakIn ? "translateY(0)" : "translateY(10px)",
                transition:
                  "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              Speak
            </p>
          </div>
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          background: "#000000",
          opacity: nameFade ? 1 : 0,
          transition: `opacity ${FADE_TO_NAME_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
        aria-hidden
      />
    </main>
  );
}
