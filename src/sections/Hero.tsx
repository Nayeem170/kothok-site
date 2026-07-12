import { lazy, Suspense } from "react";
import type { Theme } from "../three/Device";
import { Reveal } from "../components/Reveal";
import { SamplePlayer } from "../components/SamplePlayer";
import { DownloadButton } from "../components/DownloadButton";

const HeroStage = lazy(() => import("../three/HeroStage").then((m) => ({ default: m.HeroStage })));

export function Hero({
  theme,
  reducedMotion,
  enhanced,
}: {
  theme: Theme;
  reducedMotion: boolean;
  enhanced: boolean;
}) {
  const showDevice = enhanced;

  return (
    <section className="relative flex min-h-screen flex-col md:flex-row md:items-center">
      {showDevice && (
        <div className="pointer-events-none z-0 mt-20 h-[34vh] w-full sm:h-[38vh] md:absolute md:right-0 md:top-0 md:m-0 md:h-full md:w-1/2 lg:w-[55%]">
          <Suspense fallback={null}>
            <HeroStage theme={theme} reducedMotion={reducedMotion} className="h-full w-full" />
          </Suspense>
        </div>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-3 pb-16 md:px-12 md:py-20">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow mb-5">For Kobo e-readers</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-display font-bold text-ink">
              <span className="text-kothokred">Read</span>
              <span className="text-eink-300"> ·</span>
              <br />
              <span className="text-kothokgreen">Listen</span>
              <span className="text-eink-300"> ·</span>
              <br />
              Anywhere
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-eink-700">
              Open a book and KoThok reads it aloud to you over Bluetooth - or
              settle in and read it yourself on the colour e-ink screen.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <SamplePlayer />
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <DownloadButton />
              <a
                href="#about"
                className="font-mono text-sm uppercase tracking-[0.16em] text-eink-500 transition-colors hover:text-ink"
              >
                See how it works
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
