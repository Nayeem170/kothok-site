import { Reveal } from "../components/Reveal";
import { DownloadButton } from "../components/DownloadButton";

type Step = { n: string; title: string; body: string };
type Installer = { os: string; file: string; how: string };

const STEPS: Step[] = [
  {
    n: "01",
    title: "Download KoThok",
    body: "Get the installer for your system. No build tools needed.",
  },
  {
    n: "02",
    title: "Plug in your Kobo",
    body: "Connect the reader with the USB cable that came with it.",
  },
  {
    n: "03",
    title: "Double-click the installer",
    body: "Open the installer for your system. It downloads KoThok and copies it to your reader. No terminal, no setup.",
  },
  {
    n: "04",
    title: "Start reading",
    body: 'Eject the reader, then tap "KoThok" in your Kobo\'s menu.',
  },
];

const INSTALLERS: Installer[] = [
  { os: "Windows", file: "install.bat", how: "Double-click in Explorer" },
  { os: "macOS", file: "install.command", how: "Double-click in Finder" },
  { os: "Linux", file: "install.sh", how: "Run ./install.sh" },
];

function StepList() {
  return (
    <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {STEPS.map((step, i) => (
        <Reveal key={step.n} delay={0.05 * i}>
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
        <Reveal delay={0.05}>
          <h2 className="font-display text-h2 font-semibold leading-tight text-ink">
            Put KoThok on your Kobo.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg leading-relaxed text-eink-700">
            A computer, a USB cable, and a minute. Download, plug in, double-click. No tools, no
            account.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-8">
            <DownloadButton />
          </div>
        </Reveal>
        <StepList />
        <Reveal delay={0.1}>
          <InstallerGrid />
        </Reveal>
      </div>
    </section>
  );
}
