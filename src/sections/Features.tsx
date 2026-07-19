import { useCallback, useState } from "react";
import { Reveal, STAGGER } from "../components/Reveal";
import { FeaturePhoto } from "../components/FeaturePhoto";
import { FeatureLightbox } from "../components/FeatureLightbox";
import { FEATURES } from "../content/features";
import type { FeatureCell, SpecChip } from "../content/features";

function ChipRow({ chips }: { chips: SpecChip[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] ${
            chip.tone === "key"
              ? "bg-kothokgreen/10 text-kothokgreen"
              : chip.tone === "caveat"
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                : "bg-ink/5 text-eink-500"
          }`}
        >
          <span className="opacity-60">{chip.label}</span>
          <span className="font-medium">{chip.value}</span>
        </span>
      ))}
    </div>
  );
}

export function Features() {
  const [active, setActive] = useState<FeatureCell | null>(null);
  const [isFullSize, setIsFullSize] = useState(false);

  const open = useCallback((feature: FeatureCell) => {
    setActive(feature);
    setIsFullSize(false);
  }, []);

  const close = useCallback(() => {
    setActive(null);
    setIsFullSize(false);
  }, []);

  const toggleSize = useCallback(() => setIsFullSize((v) => !v), []);

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5 text-center">What it does</p>
        </Reveal>
        <Reveal delay={STAGGER.lead}>
          <h2 className="mx-auto max-w-2xl text-center font-display text-h2 font-semibold leading-tight text-ink">
            Read it, listen to it, or both at once.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {FEATURES.map((feature, i) => {
            // An odd count would leave a hole in a two-column grid, so the last
            // card widens to close the row instead.
            const wide = i === FEATURES.length - 1 && FEATURES.length % 2 === 1;
            return (
              <Reveal key={feature.id} className={wide ? "md:col-span-2" : ""}>
                <button
                  type="button"
                  onClick={() => open(feature)}
                  aria-label={`Enlarge ${feature.title} image`}
                  className="group flex h-full w-full cursor-zoom-in flex-col overflow-hidden rounded-2xl bg-ink/[0.02] text-left shadow-lg ring-1 ring-black/5"
                >
                  <div
                    className={`relative overflow-hidden ${
                      wide ? "aspect-[3/4] md:aspect-[21/9]" : "aspect-[3/4]"
                    }`}
                  >
                    <FeaturePhoto
                      state={feature.state}
                      alt={feature.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-ink md:text-2xl">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-eink-700">{feature.line}</p>
                    <ChipRow chips={feature.chips} />
                  </div>
                </button>
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
