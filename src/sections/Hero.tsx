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
    <section className="relative min-h-screen overflow-hidden">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 pt-28 pb-16 md:grid-cols-2 md:gap-12 md:px-12 md:pt-20">
        {showDevice && (
          <div className="pointer-events-none order-first flex h-[40vh] items-center justify-center md:order-last md:h-[80vh]">
            <Suspense fallback={null}>
              <HeroStage theme={theme} reducedMotion={reducedMotion} className="h-full w-full" />
            </Suspense>
          </div>
        )}

        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow mb-5">For Kobo e-readers</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-display text-display font-bold text-ink">
              <span className="text-kothokred">Read</span>
              <br />
              <span className="text-kothokgreen">Listen</span>
              <br />
              Anywhere
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-eink-700">
              Open a book and KoThok reads it aloud to you over Bluetooth - or settle in and read it
              yourself on the e-ink screen.
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
