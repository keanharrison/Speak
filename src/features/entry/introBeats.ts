/**
 * Speak cinematic intro — beat sheet (source of truth).
 *
 * Arc: Bond → Gap → Cost → System (TV) → Turn → Brand
 * Structure: montage → TV box → Speak
 * Runtime target: ~25–30s
 *
 * Drop files into /public/videos/intro/ using the `file` names below.
 * Captions are placeholders — VO timing can drift; pictures own the cuts.
 */

export type MontageBeat = {
  id: string;
  act: "A";
  kind: "video";
  /** Filename under /videos/intro/ */
  file: string;
  /** Seconds on screen */
  duration: number;
  /** Search / sourcing hint */
  need: string;
};

export type TvPlateBeat = {
  id: string;
  act: "B";
  kind: "tv-plate";
  file: string;
  duration: number;
  need: string;
};

export type TvScreenBeat = {
  id: string;
  act: "B";
  kind: "tv-screen";
  file: string;
  duration: number;
  need: string;
};

export type CardBeat = {
  id: string;
  act: "B" | "C";
  kind: "card";
  /** Full-screen or in-TV black card with typewriter text */
  text: string;
  duration: number;
  where: "tv" | "full";
};

export type BrandBeat = {
  id: string;
  act: "C";
  kind: "brand";
  duration: number;
};

export type DogLookBeat = {
  id: string;
  act: "C";
  kind: "video";
  file: string;
  duration: number;
  need: string;
};

export type IntroBeat =
  | MontageBeat
  | TvPlateBeat
  | TvScreenBeat
  | CardBeat
  | BrandBeat
  | DogLookBeat;

/** Spoken / yellow caption lines — not 1:1 with cuts. Timed by act windows. */
export const INTRO_LINES = [
  {
    id: "l1",
    text: "for ten thousand years, they've lived beside us",
    /** Show starting at global time (s) */
    at: 1.0,
    until: 4.5,
  },
  {
    id: "l2",
    text: "we loved them like family",
    at: 4.5,
    until: 7.0,
  },
  {
    id: "l3",
    text: "but we couldn't hear them when it mattered",
    at: 7.0,
    until: 11.5,
  },
  {
    id: "l4",
    text: "every year, millions hear \"come back if it gets worse\"",
    at: 12.5,
    until: 16.0,
  },
  {
    id: "l5",
    text: "by then, it usually has",
    at: 16.0,
    until: 18.5,
  },
  {
    id: "l6",
    text: "what if we could hear them sooner?",
    at: 18.5,
    until: 21.0,
  },
  {
    id: "l7",
    text: "Until now.",
    at: 21.5,
    until: 23.5,
  },
] as const;

export const INTRO_BEATS: IntroBeat[] = [
  // ── Act A: Montage ──────────────────────────────────────────
  {
    id: "01-eye",
    act: "A",
    kind: "video",
    file: "01-eye.mp4",
    duration: 1.0,
    need: "Dog eye extreme CU / pupil macro",
  },
  {
    id: "02-bond",
    act: "A",
    kind: "video",
    file: "02-bond.mp4",
    duration: 1.4,
    need: "Ancient bond — cave art, old photo, human+dog history",
  },
  {
    id: "03-run",
    act: "A",
    kind: "video",
    file: "03-run.mp4",
    duration: 1.2,
    need: "Dog running hard — power, dust, speed",
  },
  {
    id: "04-tenderness",
    act: "A",
    kind: "video",
    file: "04-tenderness.mp4",
    duration: 1.0,
    need: "Hand in fur / sleeping together — intimate",
  },
  {
    id: "05-night",
    act: "A",
    kind: "video",
    file: "05-night.mp4",
    duration: 1.2,
    need: "Owner awake at night, dog asleep — quiet worry",
  },
  {
    id: "06-anxiety",
    act: "A",
    kind: "video",
    file: "06-anxiety.mp4",
    duration: 1.5,
    need: "Anxiety — pacing or phone glow on a worried face",
  },
  {
    id: "07-money",
    act: "A",
    kind: "video",
    file: "07-money.mp4",
    duration: 1.5,
    need: "Financial weight — cash counted, card handed over, or empty wallet",
  },
  {
    id: "08-toolate",
    act: "A",
    kind: "video",
    file: "08-toolate.mp4",
    duration: 1.5,
    need: "Too late — empty dog bed or collar on a hook",
  },

  // ── Act B: TV world ─────────────────────────────────────────
  {
    id: "09-tv-plate",
    act: "B",
    kind: "tv-plate",
    file: "09-tv-plate.jpg",
    duration: 0.8,
    need: "Vintage CRT / tube TV on a desk — screen empty or easy to mask",
  },
  {
    id: "10-vet",
    act: "B",
    kind: "tv-screen",
    file: "10-vet.mp4",
    duration: 2.0,
    need: "Dog at vet / waiting room — the system you know",
  },
  {
    id: "11-google",
    act: "B",
    kind: "tv-screen",
    file: "11-google.mp4",
    duration: 2.0,
    need: "Owner googling pet symptoms on phone",
  },
  {
    id: "12-explain",
    act: "B",
    kind: "tv-screen",
    file: "12-explain.mp4",
    duration: 2.0,
    need: "Vet explaining results on a screen / X-ray",
  },
  {
    id: "13-question",
    act: "B",
    kind: "card",
    text: "what if we could hear them sooner?",
    duration: 2.5,
    where: "tv",
  },

  // ── Act C: Brand ────────────────────────────────────────────
  {
    id: "14-until",
    act: "C",
    kind: "card",
    text: "Until now.",
    duration: 2.0,
    where: "full",
  },
  {
    id: "15-speak",
    act: "C",
    kind: "brand",
    duration: 2.5,
  },
  {
    id: "16-look",
    act: "C",
    kind: "video",
    file: "16-look.mp4",
    duration: 2.0,
    need: "Dog looking into lens — steady, warm, eye contact",
  },
];

export const INTRO_VIDEO_DIR = "/videos/intro";

export function introSrc(file: string) {
  return `${INTRO_VIDEO_DIR}/${file}`;
}

export function totalIntroSeconds() {
  return INTRO_BEATS.reduce((sum, b) => sum + b.duration, 0);
}
