import { useEffect, useState } from "react";
import { Reveal } from "../components/Reveal";
import { FeaturePhoto } from "../components/FeaturePhoto";
import { SCENE_IMAGES } from "../images";
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
    screen: "screen · read aloud",
  },
  {
    title: "Reads EPUB books",
    body: "Open your EPUB books on the Kobo and read them page by page on the e-ink screen.",
    state: "reading",
    screen: "screen · reading",
  },
  {
    title: "Your library",
    body: "All your books in one place - open one to read, or tap to hear it read aloud.",
    state: "library",
    screen: "screen · library",
  },
  {
    title: "Voice & speed",
    body: "Pick a natural-sounding voice that suits the book and a playback speed to match.",
    state: "settings",
    screen: "screen · settings",
  },
];

export function Features() {
  const [zoom, setZoom] = useState<Feature | null>(null);
  const [full, setFull] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoom(null);
        setFull(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom]);

  const close = () => {
    setZoom(null);
    setFull(false);
  };

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
          {FEATURES.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={f.title}>
                <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-5 md:gap-16">
                  <div className={`md:col-span-2 ${flip ? "md:order-2" : ""}`}>
                    <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-kothokgreen">
                      {f.screen}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">{f.title}</h3>
                    <p className="mt-3 max-w-md text-lg leading-relaxed text-eink-700">{f.body}</p>
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-eink-500">
                      Tap to enlarge
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(f);
                      setFull(false);
                    }}
                    aria-label={`Enlarge ${f.title} image`}
                    className={`block w-full cursor-zoom-in rounded-2xl md:col-span-3 ${flip ? "md:order-1" : ""}`}
                  >
                    <FeaturePhoto
                      state={f.state}
                      alt={f.title}
                      className="w-full rounded-2xl shadow-2xl ring-1 ring-black/10 aspect-[3/4] object-cover"
                    />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[100] bg-black" role="dialog" aria-modal="true" aria-label={zoom.title}>
          <div
            className={`absolute inset-0 ${full ? "overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "flex items-center justify-center"}`}
            onClick={close}
          >
            <div
              className={full ? "flex min-h-full items-start justify-center" : "flex h-full w-full items-center justify-center"}
            >
              <img
                src={SCENE_IMAGES[zoom.state][1]}
                alt={zoom.title}
                onClick={(e) => {
                  e.stopPropagation();
                  setFull((v) => !v);
                }}
                className={full ? "block max-w-none cursor-zoom-out" : "max-h-full max-w-full cursor-zoom-in object-contain"}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/25 transition-colors hover:bg-black/70"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="pointer-events-none absolute bottom-4 inset-x-0 z-10 text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/60">
            {zoom.title} · {full ? "scroll to read · click image to fit" : "click image for full size"}
          </div>
        </div>
      )}
    </section>
  );
}
