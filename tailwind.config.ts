import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0812",
        "ink-2": "#130F1E",
        "ink-3": "#1A1428",
        paper: "#F2F1ED",
        text: "#F3F1F8",
        muted: "#948FA6",
        signal: "#A855F7",
        data: "#948FA6",
        line: "#241E33",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
