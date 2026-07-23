import { useState, useEffect, useSyncExternalStore } from "react";
import type { Theme } from "./three/Device";
import { Logo } from "./components/Logo";
import { Hero } from "./sections/Hero";
import { Demo } from "./sections/Demo";
import { Features } from "./sections/Features";
import { Compare } from "./sections/Compare";
import { GetStarted } from "./sections/GetStarted";
import { Feedback } from "./sections/Feedback";
import { Footer } from "./sections/Footer";
import { Privacy } from "./sections/Privacy";
import { StickyBar } from "./components/StickyBar";

/// Probe once, then remember. Each probe creates a real WebGL context, and a
/// browser only allows about 16 live at a time before it starts killing the
/// oldest - which would eventually be the hero's. So the context is released
/// immediately and the answer cached for the life of the page.
let webglSupport: boolean | null = null;

export function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    // three requests webgl2 first, so probe in the same order it will.
    const ctx = c.getContext("webgl2") ?? c.getContext("webgl");
    ctx?.getExtension("WEBGL_lose_context")?.loseContext();
    webglSupport = !!ctx;
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/// `?force3d` runs the hero fully animated whatever the OS says. The stage
/// itself no longer depends on prefers-reduced-motion - that only freezes the
/// animation now - so this exists to check the moving version on a machine
/// where Windows has animation effects switched off.
function forced3D(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("force3d");
}

function subscribeMatchMedia(query: string, callback: () => void): () => void {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function useMatchMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => subscribeMatchMedia(query, cb),
    () => window.matchMedia(query).matches,
    () => false,
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
  const force3d = forced3D();
  const reducedMotion = useMatchMedia("(prefers-reduced-motion: reduce)") && !force3d;
  const enhanced = supportsWebGL() || force3d;


  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  );

  const [route, setRoute] = useState(
    typeof window !== "undefined" ? window.location.hash : "",
  );

  useEffect(() => {
    const onHash = () => {
      setRoute(window.location.hash);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("kothok-theme", next);
      } catch {
      }
      return next;
    });
  };

  return (
    <div id="top">
      <Nav theme={theme} onToggleTheme={toggleTheme} />

      {route === "#privacy" ? (
        <Privacy />
      ) : (
        <main>
          <Hero theme={theme} reducedMotion={reducedMotion} enhanced={enhanced} />
          <Demo />
          <Features />
          <Compare />
          <GetStarted />
          <Feedback />
          <Footer />
        </main>
      )}

      <StickyBar />
    </div>
  );
}
