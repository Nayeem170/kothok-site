import { lazy, Suspense } from "react";
import type { Theme } from "../three/Device";
import { Reveal, STAGGER } from "../components/Reveal";
import { SamplePlayer } from "../components/SamplePlayer";
import { DownloadButton } from "../components/DownloadButton";

const HeroStage = lazy(() => import("../three/HeroStage").then((m) => ({ default: m.HeroStage })));

// Loaded eagerly as the reduced-motion / no-WebGL fallback, so it has to stay
// small - the 8.4MB render this replaced was the LCP image for every visitor
// who never reached the 3D stage.
const POSTER_SRC = `${import.meta.env.BASE_URL}images/05-kitchen.jpg`;

export function Hero({
  theme,
  reducedMotion,
  enhanced,
}: {
  theme: Theme;
  reducedMotion: boolean;
  enhanced: boolean;
}) {
  const useLive = enhanced && !reducedMotion;

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-8 px-6 pt-28 pb-16 md:grid-cols-2 md:gap-12 md:px-12 md:pt-20">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow mb-5">For Kobo e-readers</p>
          </Reveal>
          <Reveal delay={STAGGER.lead}>
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
              A reader that lives on your Kobo.
            </p>
          </Reveal>
          <Reveal delay={STAGGER.trail}>
            <p className="mt-3 max-w-md font-mono text-sm uppercase tracking-[0.14em] text-kothokgreen">
              Neural voices read your books aloud over Bluetooth
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <SamplePlayer />
          </Reveal>

          <Reveal delay={STAGGER.late}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <DownloadButton />
              <a
                href="#features"
                className="font-mono text-sm uppercase tracking-[0.16em] text-eink-500 transition-colors hover:text-ink"
              >
                See how it works
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 text-sm text-eink-500">
              Free and open source. Read-aloud needs WiFi.
            </p>
          </Reveal>
        </div>

        <div className="flex h-[40vh] items-center justify-center md:order-last md:h-[80vh]">
          {useLive ? (
            <Suspense fallback={<HeroPlaceholder />}>
              <HeroStage theme={theme} reducedMotion={reducedMotion} className="h-full w-full" />
            </Suspense>
          ) : (
            <HeroPoster />
          )}
        </div>
      </div>
    </section>
  );
}

/// Holds the stage's space while the 3D chunk loads. Deliberately empty: a real
/// screen shown here flashes up and is immediately replaced by the canvas, which
/// reads as a glitch. Matches the panel's 1072x1448 so nothing shifts on swap.
function HeroPlaceholder() {
  return (
    <div
      aria-hidden
      className="aspect-[1072/1448] max-h-full rounded-2xl bg-black/[0.04] ring-1 ring-black/5"
    />
  );
}

/// The real, final image for visitors who never get the 3D stage - reduced
/// motion or no WebGL. A screenshot is right here precisely because nothing
/// replaces it.
function HeroPoster() {
  return (
    <img
      src={POSTER_SRC}
      alt="A Kobo e-reader propped on a kitchen counter running KoThok, reading aloud to a speaker while someone cooks"
      className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-black/10"
      loading="eager"
    />
  );
}
