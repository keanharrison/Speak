/**
 * Shared intro music — survives /intro → /explore so the outro fade can finish on the name page.
 */
export const INTRO_MUSIC_SRC = "/audio/intro-music.m4a";

let sharedMusic: HTMLAudioElement | null = null;
let sharedBoost: { ctx: AudioContext; gain: GainNode } | null = null;
let fadeTimer: number | null = null;

export function getIntroMusic(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedMusic) {
    sharedMusic = new Audio(INTRO_MUSIC_SRC);
    sharedMusic.loop = true;
    sharedMusic.preload = "auto";
  }
  return sharedMusic;
}

export function clearIntroMusicFade() {
  if (fadeTimer != null) {
    window.clearInterval(fadeTimer);
    fadeTimer = null;
  }
}

export function setIntroMusicGain(mult: number) {
  const el = getIntroMusic();
  if (!el) return;
  try {
    if (!sharedBoost) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      const src = ctx.createMediaElementSource(el);
      const gain = ctx.createGain();
      gain.gain.value = 1;
      src.connect(gain);
      gain.connect(ctx.destination);
      sharedBoost = { ctx, gain };
    }
    if (sharedBoost.ctx.state === "suspended") void sharedBoost.ctx.resume();
    sharedBoost.gain.gain.cancelScheduledValues(sharedBoost.ctx.currentTime);
    sharedBoost.gain.gain.setTargetAtTime(
      mult,
      sharedBoost.ctx.currentTime,
      0.04,
    );
  } catch {
    /* Web Audio unavailable */
  }
}

/** Slow ease-out; safe to call again on /explore to finish the handoff. */
export function fadeIntroMusicOut(ms: number, floorVolume = 0.55) {
  clearIntroMusicFade();
  const music = getIntroMusic();
  if (!music) return;

  const start = music.volume;
  const t0 = performance.now();
  try {
    if (sharedBoost) {
      if (sharedBoost.ctx.state === "suspended") void sharedBoost.ctx.resume();
      sharedBoost.gain.gain.cancelScheduledValues(sharedBoost.ctx.currentTime);
      sharedBoost.gain.gain.setTargetAtTime(
        0.0001,
        sharedBoost.ctx.currentTime,
        ms / 4000,
      );
    }
  } catch {
    /* ignore */
  }

  fadeTimer = window.setInterval(() => {
    const p = Math.min(1, (performance.now() - t0) / ms);
    const e = 1 - (1 - p) ** 2;
    music.volume = Math.max(0, start * (1 - e));
    if (p >= 1) {
      clearIntroMusicFade();
      music.pause();
      music.currentTime = 0;
      music.volume = floorVolume;
      setIntroMusicGain(1);
    }
  }, 16);
}
