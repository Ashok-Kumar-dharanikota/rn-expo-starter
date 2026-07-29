import type { Config } from "tailwindcss";

/** Semantic color built from a CSS variable holding "R G B" channels. */
const c = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: c("canvas"), raised: c("canvas-raised") },
        surface: { DEFAULT: c("surface"), raised: c("surface-raised") },
        line: { DEFAULT: c("line"), strong: c("line-strong") },
        content: {
          DEFAULT: c("content"),
          muted: c("content-muted"),
          subtle: c("content-subtle"),
          faint: c("content-faint"),
        },
        // Monochrome primary action (Expo's neutral button treatment)
        primary: { DEFAULT: c("primary"), foreground: c("primary-foreground") },
        // Expo signature indigo — reserved for highlights, selection, focus
        accent: { DEFAULT: c("accent"), foreground: c("accent-foreground") },
        success: { DEFAULT: c("success"), foreground: c("success-foreground") },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "SF Pro Display",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      borderRadius: { lg: "12px", md: "10px", sm: "8px" },
      boxShadow: {
        glow: "0 0 0 1px rgb(var(--accent) / 0.35), 0 0 22px -6px rgb(var(--accent) / 0.45)",
        "glow-soft": "0 0 0 1px rgb(var(--accent) / 0.18)",
        panel: "0 1px 0 0 rgb(var(--content) / 0.04) inset, 0 10px 34px -14px rgb(0 0 0 / 0.55)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.98)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        "pulse-ring": {
          "0%": { opacity: "0.9" },
          "50%": { opacity: "0.35" },
          "100%": { opacity: "0.9" },
        },
        "drift-a": {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-22px,0)" },
        },
        "drift-b": {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,18px,0)" },
        },
        "drift-c": {
          "0%,100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-14px,0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.16,1,0.3,1) both",
        blink: "blink 1s steps(1) infinite",
        "pulse-ring": "pulse-ring 1.6s ease-in-out infinite",
        "drift-a": "drift-a 13s ease-in-out infinite",
        "drift-b": "drift-b 16s ease-in-out infinite",
        "drift-c": "drift-c 19s ease-in-out infinite",
      },
      transitionTimingFunction: { spring: "cubic-bezier(0.16,1,0.3,1)" },
    },
  },
  plugins: [],
};

export default config;
