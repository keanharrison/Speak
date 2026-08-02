import type { Config } from "tailwindcss";
import { brand } from "./src/constants/brand";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        ink: "var(--color-ink)",
        accent: "var(--color-accent)",
        green: "var(--color-green)",
        blue: "var(--color-blue)",
        muted: "var(--color-muted)",
        amber: "var(--color-amber)",
        surface: "var(--color-surface)",
        // Aliases used by existing screens until we restyle them
        success: "var(--color-green)",
        flag: "var(--color-amber)",
      },
      borderRadius: {
        card: brand.radius.card,
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Text",
          "SF Pro Display",
          "var(--font-inter)",
          "system-ui",
          "sans-serif",
        ],
        intro: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        body: [brand.fontSize.body, { lineHeight: brand.lineHeight.body }],
        label: [
          brand.fontSize.label,
          {
            lineHeight: "1.4",
            letterSpacing: brand.letterSpacing.label,
            fontWeight: "500",
          },
        ],
      },
      boxShadow: {
        none: "none",
      },
    },
  },
  plugins: [],
};

export default config;
