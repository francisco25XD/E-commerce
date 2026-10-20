import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#04261a", 700: "#0a3b29", 600: "#14513a" },
        mint: { 50: "#f3fbf7", 100: "#eaf6f0", 200: "#d6f0e2", 300: "#b8e6cd" },
        rosewood: "#7a1f2b",
        cream: "#faf9f5",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
