import { Logo } from "../components/Logo";
import { LINKS } from "../config/links";

export function Footer() {
  return (
    <footer className="relative border-t border-ink/10 py-16">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-7 w-7" />
              <span className="font-display text-xl font-semibold tracking-tight text-ink">
                KoThok
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-eink-500">
              A reader for Kobo e-ink devices. Read your books, or let
              them be read aloud.
            </p>
          </div>

          <a
            href={LINKS.repo.main}
            target="_blank"
            rel="noreferrer"
            className="link-underline self-start font-mono text-xs uppercase tracking-[0.16em] text-eink-500 hover:text-ink md:self-auto"
          >
            Source · GitHub
          </a>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-6 text-xs text-eink-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono uppercase tracking-[0.16em]">Built in Rust · MIT</span>
            <span className="font-mono uppercase tracking-[0.16em]">Tested on Kobo Clara Colour</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono uppercase tracking-[0.16em]">
            <span>Also part of KoThok:</span>
            <a
              href={LINKS.crates.koboCore}
              target="_blank"
              rel="noreferrer"
              className="link-underline hover:text-ink"
            >
              kobo-core
            </a>
            <span>·</span>
            <a
              href={LINKS.crates.edgeTts}
              target="_blank"
              rel="noreferrer"
              className="link-underline hover:text-ink"
            >
              kothok-edge-tts
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
