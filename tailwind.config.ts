import type { Config } from "tailwindcss";

/**
 * Tailwind is present for its preflight reset only. The design system is a
 * fluid 1440 vw grid expressed in CSS custom properties (app/globals.css) —
 * utility classes cannot express clamp()-wrapped vw arithmetic driven by
 * animatable variables, which is the core of the layout.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        wordmark: ["var(--font-wordmark)"],
      },
    },
  },
  plugins: [],
};

export default config;
