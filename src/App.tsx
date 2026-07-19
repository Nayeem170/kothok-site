import { useState } from "react";
import type { Theme } from "./three/Device";
import { Logo } from "./components/Logo";
import { Hero } from "./sections/Hero";
import { Features } from "./sections/Features";
import { Compare } from "./sections/Compare";
import { GetStarted } from "./sections/GetStarted";
import { Feedback } from "./sections/Feedback";
import { Footer } from "./sections/Footer";
import { StickyBar } from "./components/StickyBar";

function supportsWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-8 w-8 items-center justify-center rounded-full text-eink-500 transition-colors hover:text-ink"
    >
      {isDark ? (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-paper/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-12">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo className="h-6 w-6" />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">KoThok</span>
        </a>
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-eink-500 sm:gap-6">
          <a href="#features" className="link-underline hover:text-ink">
            What it does
          </a>
          <a href="#get-started" className="link-underline hover:text-ink">
            Get it
          </a>
          <span className="mx-1 h-4 w-px bg-ink/10" aria-hidden />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  const enhanced = typeof window !== "undefined" && supportsWebGL();
  const reducedMotion = typeof window !== "undefined" && prefersReducedMotion();
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("kothok-theme", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <div id="top">
      <Nav theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero theme={theme} reducedMotion={reducedMotion} enhanced={enhanced} />
        <Features />
        <Compare />
        <GetStarted />
        <Feedback />
        <Footer />
      </main>

      <StickyBar />
    </div>
  );
}
