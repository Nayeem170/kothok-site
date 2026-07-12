import { Reveal } from "../components/Reveal";

export function About() {
  return (
    <section className="relative min-h-screen py-32">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-12">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow mb-5">What it is</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-h2 font-semibold leading-tight text-ink">
              One book, two ways in.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-eink-700">
              KoThok is a reader you install on a Kobo e-reader. While you read,
              it takes over the screen - showing your library, chapters, and pages
              on colour e-ink. Tap once more and the same book is spoken through a
              Bluetooth speaker, in a voice chosen for its language.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 text-lg leading-relaxed text-eink-700">
              No phone, no cloud account. Just the device in your hand.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
