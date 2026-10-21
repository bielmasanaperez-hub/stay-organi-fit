import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        club: {
          obsidian: "#09090B",
          carbon: "#111114",
          surface: "#16161A",
          elevated: "#1D1D22",
          border: "#27272D",
          gold: "#C8A97E",
          goldLight: "#DFC6A2",
          goldMuted: "#8F7552",
          ivory: "#F5F3EF",
          stone: "#A09D96",
          muted: "#6E6B64",
          sage: "#3B5E4C",
          ocean: "#2D4F6C",
          terracotta: "#8C4A32",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
