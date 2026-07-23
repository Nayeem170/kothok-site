import { Reveal, STAGGER } from "../components/Reveal";

type Control = {
  action: string;
  gesture: string;
};

const CONTROLS: Control[] = [
  { action: "Play / Pause", gesture: "Single tap" },
  { action: "Bookmark", gesture: "Double tap" },
  { action: "Skip forward", gesture: "Next button or Volume up hold" },
  { action: "Skip back", gesture: "Prev button or Volume down hold" },
];

export function Controls() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto w-full max-w-4xl px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-4 text-center">Headset controls</p>
        </Reveal>
        <Reveal delay={STAGGER.lead}>
          <h2 className="text-center font-display text-2xl font-bold text-ink md:text-3xl">
            Keep your phone in your pocket
          </h2>
        </Reveal>
        <Reveal delay={STAGGER.follow}>
          <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-eink-700">
            Control playback without touching the device. Works with any
            Bluetooth headset or speaker that supports AVRCP.
          </p>
        </Reveal>
        <Reveal delay={STAGGER.trail}>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CONTROLS.map((c) => (
              <div
                key={c.action}
                className="flex items-center justify-between rounded-xl border border-ink/10 bg-ink/[0.02] px-5 py-4"
              >
                <span className="font-display text-base font-semibold text-ink">
                  {c.action}
                </span>
                <span className="font-mono text-sm text-kothokgreen">
                  {c.gesture}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
