import { Reveal, STAGGER } from "../components/Reveal";
import { COMPARE, COMPARE_CHECKED_ON } from "../content/compare";

export function Compare() {
  return (
    <section id="compare" className="relative py-24 md:py-32">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5 text-center">How it compares</p>
        </Reveal>
        <Reveal delay={STAGGER.lead}>
          <h2 className="mx-auto mb-12 max-w-xl text-center font-display text-h2 font-semibold leading-tight text-ink">
            Against the alternatives.
          </h2>
        </Reveal>
        <Reveal delay={STAGGER.follow}>
          <div className="overflow-x-auto rounded-2xl shadow-lg ring-1 ring-black/5">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-ink/10 bg-ink/[0.02]">
                  <th className="p-4 text-sm font-medium text-eink-500" />
                  <th className="bg-kothokgreen/5 p-4 font-display text-base font-semibold text-kothokgreen">
                    KoThok
                  </th>
                  <th className="p-4 text-sm font-medium text-eink-700">Kobo 5.10</th>
                  <th className="p-4 text-sm font-medium text-eink-700">KOReader + plugin</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row) => (
                  <tr key={row.feature} className="border-b border-ink/5 last:border-0">
                    <th scope="row" className="p-4 text-left text-sm font-medium text-ink">
                      {row.feature}
                    </th>
                    <td
                      className={`bg-kothokgreen/5 p-4 text-sm ${
                        row.kothokWeak
                          ? "text-amber-700 dark:text-amber-400"
                          : "font-medium text-ink"
                      }`}
                    >
                      {row.kothok}
                    </td>
                    <td className="p-4 text-sm text-eink-700">{row.kobo}</td>
                    <td className="p-4 text-sm text-eink-700">{row.koreader}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={STAGGER.trail}>
          <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.16em] text-eink-500">
            Checked {COMPARE_CHECKED_ON}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
