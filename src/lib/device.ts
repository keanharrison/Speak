/**
 * Soft on-screen keyboard for touch devices and in-phone demos.
 * Real phones get the custom keyboard; desktop outside the frame uses hardware.
 */
export function prefersSoftKeyboard(): boolean {
  if (typeof window === "undefined") return false;
  if (document.getElementById("speak-phone-stage")) return true;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}
