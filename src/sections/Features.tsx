import { useCallback, useState } from "react";
import { Reveal } from "../components/Reveal";
import { DeviceFrame, ScreenContent } from "../components/DeviceScreen";
import { FeatureLightbox } from "../components/FeatureLightbox";
import type { ScreenState } from "../images";

type Feature = {
  title: string;
  body: string;
  state: ScreenState;
  screen: string;
};

const FEATURES: Feature[] = [
  {
    title: "Read aloud",
    body: "Natural-sounding voices read your book to you over a Bluetooth speaker, pausing like a person would.",
    state: "readAloud",
    screen: "screen - read aloud",
  },
  {
    title: "Reads EPUB books",
    body: "Open your EPUB books on the Kobo and read them page by page on the e-ink screen.",
    state: "reading",
    screen: "screen - reading",
  },
  {
    title: "Your library",
    body: "All your books in one place - open one to read, or tap to hear it read aloud.",
    state: "library",
    screen: "screen - library",
  },
  {
    title: "Voice & speed",
    body: "Pick a natural-sounding voice that suits the book and a playback speed to match.",
    state: "settings",
    screen: "screen - settings",
  },
];

export function Features() {
  const [active, setActive] = useState<Feature | null>(null);
  const [isFullSize, setIsFullSize] = useState(false);

  const open = useCallback((feature: Feature) => {
    setActive(feature);
    setIsFullSize(false);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setIsFullSize(false);
  }, []);

  const toggleSize = useCallback(() => setIsFullSize((v) => !v), []);

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5 text-center">What it does</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mx-auto max-w-2xl text-center font-display text-h2 font-semibold leading-tight text-ink">
            Built around the page and the voice.
          </h2>
        </Reveal>

        <div className="mt-20 flex flex-col gap-24 md:gap-32">
          {FEATURES.map((feature, i) => {
            const isReversed = i % 2 === 1;
            return (
              <Reveal key={feature.title}>
                <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-5 md:gap-16">
                  <div className={`md:col-span-2 ${isReversed ? "md:order-2" : ""}`}>
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-kothokgreen">
                      {feature.screen}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                      {feature.title}
                    </h3>
                    <p className="mt-3 max-w-md text-lg leading-relaxed text-eink-700">
                      {feature.body}
                    </p>
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-eink-500">
                      Tap to enlarge
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => open(feature)}
                    aria-label={`Enlarge ${feature.title} image`}
                    className={`block w-full cursor-zoom-in md:col-span-3 ${isReversed ? "md:order-1" : ""}`}
                  >
                    <DeviceFrame className="mx-auto w-full max-w-[300px]">
                      <ScreenContent state={feature.state} />
                    </DeviceFrame>
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {active && (
        <FeatureLightbox
          feature={active}
          isFullSize={isFullSize}
          onToggleSize={toggleSize}
          onClose={close}
        />
      )}
    </section>
  );
}
