import { Logo } from "../components/Logo";
import { LINKS } from "../config/links";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 py-16">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-7" decorative />
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              KoThok
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-eink-500">
            A reader for Kobo e-ink devices. Read your books, or let them be read aloud.
          </p>
          <div className="font-mono text-xs uppercase tracking-[0.16em] text-eink-500">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>Also part of KoThok:</span>
              <a
                href={LINKS.crates.koboCore}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-ink"
              >
                kobo-core
              </a>
              <span>-</span>
              <a
                href={LINKS.crates.edgeTts}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-ink"
              >
                kothok-edge-tts
              </a>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span>PolyForm-Noncommercial</span>
              <span className="h-3 w-px bg-ink/15" aria-hidden />
              <a href="#privacy" className="link-underline hover:text-ink">
                Privacy
              </a>
              <span className="h-3 w-px bg-ink/15" aria-hidden />
              <a
                href={LINKS.repo.main}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-ink"
              >
                Source - GitHub
              </a>
            </div>
          </div>

          <a
            href={LINKS.repo.main}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2.5 rounded-xl bg-ink px-5 py-3 font-mono text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.446l-7.416 3.967 1.48-8.279L0 9.306l8.332-1.151z" />
            </svg>
            Star on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
