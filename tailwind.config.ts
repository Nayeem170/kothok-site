import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        kothokred: "#F42A41",
        kothokgreen: "#006A4E",
        screen: "#f3f0e8",
        "reading-line": "#d8d4ca",
        "bezel-from": "#2b2b30",
        "bezel-to": "#0e0e12",
        eink: {
          300: "rgb(var(--eink-300) / <alpha-value>)",
          500: "rgb(var(--eink-500) / <alpha-value>)",
          700: "rgb(var(--eink-700) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['Fredoka', 'system-ui', 'sans-serif'],
        body: ['Fredoka', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ["clamp(2.75rem, 8vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        h2: ["clamp(1.75rem, 4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        reading: "68ch",
      },
      zIndex: {
        lightbox: 100,
      },
    },
  },
  plugins: [],
} satisfies Config;
