import { Reveal, STAGGER } from "../components/Reveal";
import { DownloadButton } from "../components/DownloadButton";
import { STEPS, INSTALLERS } from "../content/steps";
import { REQUIREMENTS } from "../content/requirements";

function StepList() {
  return (
    <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {STEPS.map((step, i) => (
        <Reveal key={step.n} delay={STAGGER.lead * i}>
          <div className="flex gap-4">
            <span className="font-mono text-sm text-kothokgreen">{step.n}</span>
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-base leading-relaxed text-eink-700">{step.body}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function InstallerGrid() {
  return (
    <div className="mt-12">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-eink-500">
        One installer per system. Just double-click.
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {INSTALLERS.map((installer) => (
          <div key={installer.os} className="rounded-xl border border-ink/10 bg-ink/[0.02] p-4">
            <div className="font-display text-base font-semibold text-ink">{installer.os}</div>
            <div className="mt-1 font-mono text-sm text-kothokgreen">{installer.file}</div>
            <div className="mt-2 text-sm text-eink-700">{installer.how}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-eink-500">
        The first install also adds a "KoThok" entry to your Kobo's menu. Once only.
      </p>
    </div>
  );
}

export function GetStarted() {
  return (
    <section id="get-started" className="relative py-28">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-12">
        <Reveal>
          <p className="eyebrow mb-5">Get it</p>
        </Reveal>
        <Reveal delay={STAGGER.lead}>
          <h2 className="font-display text-h2 font-semibold leading-tight text-ink">
            Put KoThok on your Kobo.
          </h2>
        </Reveal>
        <Reveal delay={STAGGER.follow}>
          <p className="mt-6 text-lg leading-relaxed text-eink-700">
            A computer, a USB cable, and a minute. Download, plug in, double-click. No tools, no
            account.
          </p>
        </Reveal>
        <Reveal delay={STAGGER.trail}>
          <div className="mt-8">
            <DownloadButton />
          </div>
        </Reveal>
        <StepList />
        <Reveal delay={STAGGER.follow}>
          <div className="mt-12 rounded-2xl bg-ink/[0.02] p-6 ring-1 ring-black/5">
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.16em] text-eink-500">
              Requirements and limits
            </p>
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {REQUIREMENTS.map((req) => (
                <div key={req.label} className="flex gap-3">
                  <dt className="shrink-0 text-sm font-medium text-eink-500">{req.label}</dt>
                  <dd className="text-sm text-ink">{req.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
        <Reveal delay={STAGGER.follow}>
          <InstallerGrid />
        </Reveal>
        <Reveal delay={STAGGER.follow}>
          <p className="mt-8 text-sm leading-relaxed text-eink-500">
            Want it off? Plug in via USB and run the matching{" "}
            <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs text-eink-700">
              uninstall
            </code>{" "}
            script - it scans, shows what it will delete, and asks before touching anything. See the{" "}
            <a
              href="https://github.com/Nayeem170/KoThok/tree/main/installer#uninstall"
              className="text-kothokgreen underline-offset-2 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              installer README
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
