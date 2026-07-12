import { Reveal } from "../components/Reveal";

type Feature = {
  title: string;
  body: string;
  mark: "red" | "green" | "grey";
};

const FEATURES: Feature[] = [
  {
    title: "Read aloud",
    body: "Natural-sounding voices read your book to you over a Bluetooth speaker, pausing like a person would.",
    mark: "green",
  },
  {
    title: "Read in colour",
    body: "Your books show in colour on the e-ink screen - covers, chapters, and pictures included.",
    mark: "red",
  },
  {
    title: "Reads any language",
    body: "Arabic, Bangla, Hindi, Thai, Chinese and more - each shown and spoken in its own voice.",
    mark: "grey",
  },
  {
    title: "Remembers you",
    body: "Your page, brightness, and chosen voice are saved - even after sleep or a font-size change.",
    mark: "grey",
  },
];

const MARK_COLOR: Record<Feature["mark"], string> = {
  red: "bg-kothokred",
  green: "bg-kothokgreen",
  grey: "bg-eink-500",
};

export function Features() {
  return (
    <section className="relative min-h-screen py-32">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-12">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow mb-5">What it does</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-h2 font-semibold leading-tight text-ink">
              Built around the page and the voice.
            </h2>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={0.05 * i}>
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-sm ${MARK_COLOR[f.mark]}`} />
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {f.title}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-eink-700">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
