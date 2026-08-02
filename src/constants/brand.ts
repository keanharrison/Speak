/**
 * Speak brand tokens — cream + black (demo default).
 * Accents used sparingly for status / flags.
 */
export const brand = {
  canvas: "#F5F0E8",
  ink: "#0A0A0A",
  accent: "#0A0A0A",
  footer: "#0A0A0A",
  surface: "#FFFFFF",
  muted: "#6B6B6B",
  success: "#2A8A5A",
  flag: "#C4763A",
  sky: "#B5E0EF",
  cardBrowns: {
    dark: "#1A1A1A",
    medium: "#3A3A3A",
    warm: "#5C5C5C",
  },
  radius: {
    card: "14px",
    pill: "9999px",
  },
  fontSize: {
    body: "15px",
    label: "11px",
  },
  lineHeight: {
    body: "1.7",
  },
  letterSpacing: {
    label: "0.06em",
  },
  cardBorder: "0.5px solid rgba(0,0,0,0.07)",
} as const;

export type Brand = typeof brand;
