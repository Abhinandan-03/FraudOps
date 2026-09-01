/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0C",
        surface: "#131315",
        "surface-dim": "#0E0E10",
        primary: "#E21B23",
        secondary: "#A100FF",
        tertiary: "#00F5FF",
        neutral: "#0A0A0C",
        "on-background": "#FFFFFF",
        "on-surface": "#FFFFFF",
        "on-surface-muted": "#A1A1AA", // zinc-400
        border: "#27272A", // zinc-800
      },
      fontFamily: {
        headline: ["Anybody", "sans-serif"],
        body: ["Geist", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      transformOrigin: {
        "0": "0%",
      },
      spacing: {
        18: "4.5rem",
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
