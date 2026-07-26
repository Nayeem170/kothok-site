import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
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

let webglSupport: boolean | null = null;

export function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("webgl2") ?? c.getContext("webgl");
    ctx?.getExtension("WEBGL_lose_context")?.loseContext();
    webglSupport = !!ctx;
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

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
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollToId(hash: string) {
    setMenuOpen(false);
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.replaceState(null, "", hash);
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/5 bg-paper/70 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-12">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5"
        >
          <Logo className="h-6 w-6" decorative />
          <span className="font-display text-lg font-semibold tracking-tight text-ink">KoThok</span>
        </a>

        <div className="hidden items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-eink-500 sm:flex sm:gap-6">
          <a href="#features" className="link-underline hover:text-ink">
            What it does
          </a>
          <a href="#get-started" className="link-underline hover:text-ink">
            Get it
          </a>
          <span className="mx-1 h-4 w-px bg-ink/10" aria-hidden />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-eink-500 transition-colors hover:text-ink"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="3" y1="5" x2="15" y2="5" className={menuOpen ? "opacity-0" : ""} />
              <line
                x1="3"
                y1="9"
                x2="15"
                y2="9"
                className={menuOpen ? "rotate-45" : ""}
                style={menuOpen ? { transformOrigin: "center" } : undefined}
              />
              <line
                x1="3"
                y1="13"
                x2="15"
                y2="13"
                className={menuOpen ? "-rotate-45" : ""}
                style={menuOpen ? { transformOrigin: "center" } : undefined}
              />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-ink/5 bg-paper/95 backdrop-blur-md sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("#features");
              }}
              className="rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-eink-500 hover:bg-ink/5 hover:text-ink"
            >
              What it does
            </a>
            <a
              href="#get-started"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("#get-started");
              }}
              className="rounded-lg px-3 py-2.5 font-mono text-xs uppercase tracking-[0.16em] text-eink-500 hover:bg-ink/5 hover:text-ink"
            >
              Get it
            </a>
          </nav>
        </div>
      )}
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

  const [route, setRoute] = useState(typeof window !== "undefined" ? window.location.hash : "");

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
      if (hash === "#privacy") {
        setRoute(hash);
        window.scrollTo(0, 0);
        return;
      }
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setRoute(hash);
          return;
        }
      }
      setRoute(hash);
      window.scrollTo(0, 0);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("kothok-theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

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
