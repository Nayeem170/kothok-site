import { Reveal } from "../components/Reveal";
import { YouTubeFacade } from "../components/YouTubeFacade";

const VIDEO_ID = "NJBg5JZHOFY";
const POSTER_SRC = `${import.meta.env.BASE_URL}video/kothok-demo.jpg`;

export function Demo() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-4 text-center">See it in action</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-center font-display text-3xl font-bold text-ink md:text-4xl">
            Read and listen on a Kobo
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg leading-relaxed text-eink-700">
            Tap to watch a short demo of reading, voice narration, and
            Bluetooth playback.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10">
            <YouTubeFacade
              videoId={VIDEO_ID}
              poster={POSTER_SRC}
              title="KoThok demo - reading and listening on a Kobo e-reader"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
