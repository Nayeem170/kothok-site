import { lazy, Suspense } from "react";
import type { Theme } from "./three/Device";
import { Logo } from "./components/Logo";

const HeroStage = lazy(() => import("./three/HeroStage").then((m) => ({ default: m.HeroStage })));

function Device({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Suspense fallback={null}>
        <HeroStage theme={"light" as Theme} reducedMotion={false} className="h-full w-full" />
      </Suspense>
    </div>
  );
}

const BOOKS = [
  { t: "The Happy Prince", a: "Oscar Wilde", c: "from-[#0e7a64] to-[#0a5645]" },
  { t: "Pride & Prejudice", a: "Jane Austen", c: "from-[#b23a4e] to-[#7c2436]" },
  { t: "Frankenstein", a: "Mary Shelley", c: "from-[#3b4358] to-[#20253a]" },
  { t: "Alice's Adventures", a: "Lewis Carroll", c: "from-[#6a4ca0] to-[#46306f]" },
  { t: "The Jungle Book", a: "Rudyard Kipling", c: "from-[#b5872e] to-[#856219]" },
  { t: "Treasure Island", a: "R.L. Stevenson", c: "from-[#1f5f8b] to-[#13486c]" },
];

function DeviceMock({
  className = "",
  variant = "library",
}: {
  className?: string;
  variant?: "library" | "splash";
}) {
  return (
    <div className={`${className} relative`}>
      <div className="absolute -bottom-3 left-1/2 h-4 w-3/4 -translate-x-1/2 rounded-[100%] bg-black/25 blur-md" />
      <div className="relative h-full w-full rounded-[18px] bg-gradient-to-b from-[#2b2b30] to-[#0e0e12] p-[7px] shadow-2xl ring-1 ring-black/40">
        <div className="relative h-full w-full overflow-hidden rounded-[11px] bg-[#f3f0e8]">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-transparent" />
          {variant === "library" ? (
            <div className="relative flex h-full flex-col p-2">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-display text-[0.62rem] font-semibold text-ink">Library</span>
                <span className="font-mono text-[0.5rem] text-eink-500">6 books</span>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-1.5">
                {BOOKS.map((b, i) => (
                  <div key={b.t} className={`relative overflow-hidden rounded-[3px] bg-gradient-to-b ${b.c} p-1.5 shadow-sm`}>
                    <span className="absolute left-0 top-0 h-full w-[2px] bg-black/25" />
                    <div className="flex h-full flex-col justify-between">
                      <span className="overflow-hidden text-[0.5rem] font-semibold leading-tight text-white/95">{b.t}</span>
                      <span className="truncate text-[0.42rem] uppercase tracking-wide text-white/70">{b.a}</span>
                    </div>
                    {i === 0 && <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-kothokred ring-1 ring-white/70" />}
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex items-center justify-between border-t border-ink/10 pt-1 font-mono text-[0.5rem]">
                <span className="text-kothokgreen">Library</span>
                <span className="text-eink-500">Settings</span>
              </div>
            </div>
          ) : (
            <div className="relative flex h-full flex-col items-center justify-center gap-1.5 p-3 text-center">
              <Logo className="h-8 w-8" />
              <span className="font-display text-[0.8rem] font-semibold text-ink">KoThok</span>
              <span className="font-mono text-[0.45rem] uppercase tracking-[0.15em] text-eink-500">Read · Listen · Anywhere</span>
              <div className="mt-1 h-1 w-2/3 overflow-hidden rounded-full bg-eink-300">
                <div className="h-1 w-2/5 rounded-full bg-kothokgreen" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2 font-display text-base font-semibold">
        <Logo className="h-5 w-5" /> KoThok
      </div>
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-eink-500">Get it</span>
    </div>
  );
}

function Player() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.04] px-3 py-1.5 font-mono text-[0.62rem] text-eink-700">
      ▶ Sample voice <span className="text-kothokgreen">▁▂▃▅▂▁</span>
    </span>
  );
}

function Btn() {
  return <button className="rounded-full bg-ink px-4 py-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-paper">Download</button>;
}

function Foot() {
  return (
    <div className="flex justify-between gap-3 border-t border-ink/10 px-6 py-4 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-eink-500">
      <span>Built in Rust · MIT</span>
      <span>Source · GitHub</span>
    </div>
  );
}

function Board({ name, tag, children }: { name: string; tag: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2 px-1">
        <span className="text-[1.02rem] font-semibold text-[#f3f3f5]">{name}</span>
        <span className="text-[0.78rem] text-[#8a8a93]">{tag}</span>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-[#26262c] bg-[#16161a]">
        <div className="w-[760px] max-w-none overflow-hidden rounded-2xl bg-paper text-ink shadow-xl">{children}</div>
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow mb-2">{children}</p>;
}

export function TemplatePreview() {
  return (
    <div className="min-h-screen bg-[#0e0e11] px-6 py-8 font-body text-[#e9e9ec]">
      <div className="mx-auto max-w-[1180px]">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[#f3f3f5]">KoThok - three template directions</h1>
          <p className="mt-1 text-[0.92rem] text-[#9a9aa3]">
            Full-page layouts with the <span className="text-kothokgreen">live 3D device</span>. Same content, three structures. Scroll a board horizontally on narrow screens.
          </p>
          <a href="/" className="mt-2 inline-block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[#8a8a93] hover:text-[#f3f3f5]">← Back to site</a>
        </header>

        <div className="flex flex-col gap-7">
          {/* ===== A - Editorial Asymmetry ===== */}
          <Board name="A - Editorial Asymmetry" tag="product-story · magazine">
            <NavBar />
            <div className="grid grid-cols-12 items-center gap-5 px-6 pb-7">
              <div className="col-span-7">
                <Eyebrow>For Kobo e-readers</Eyebrow>
                <h1 className="font-display text-[2.5rem] font-bold leading-[0.98] tracking-tight">
                  <span className="text-kothokred">Read</span><span className="text-eink-300"> ·</span><br />
                  <span className="text-kothokgreen">Listen</span><span className="text-eink-300"> ·</span><br />
                  Anywhere
                </h1>
                <p className="mt-3 max-w-[44ch] text-eink-700">Open a book and KoThok reads it aloud over Bluetooth - or read it yourself on colour e-ink.</p>
                <div className="mt-4"><Player /></div>
                <div className="mt-3 flex items-center gap-4"><Btn /><span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-eink-500">See how it works</span></div>
              </div>
              <div className="col-span-5 flex flex-col items-center">
                <Device className="h-44 w-36" />
                <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-eink-500">Kobo Clara Colour · colour e-ink</p>
              </div>
            </div>
            <div className="h-px w-full bg-ink/10" />
            <div className="grid grid-cols-12 gap-5 px-6 py-6">
              <div className="col-span-5"><Eyebrow>What it is</Eyebrow><h2 className="font-display text-[1.5rem] font-semibold leading-tight">One book,<br />two ways in.</h2></div>
              <div className="col-span-6 col-start-7 text-eink-700">
                <p>KoThok takes over the screen - library, chapters and pages on colour e-ink. Tap once more and the same book is spoken through a Bluetooth speaker.</p>
                <p className="mt-3">No phone, no cloud account. Just the device in your hand.</p>
              </div>
            </div>
            <div className="h-px w-full bg-ink/10" />
            <div className="px-6 py-5">
              <Eyebrow>What it does</Eyebrow>
              {[["01", "Read aloud", "Natural voices over a Bluetooth speaker, pausing like a person would.", "g"], ["02", "Read in colour", "Covers, chapters and pictures on the colour e-ink screen.", "r"], ["03", "Reads any language", "Arabic, Bangla, Hindi, Thai, Chinese and more - each in its own voice.", "gr"]].map((r) => (
                <div key={r[0]} className="grid grid-cols-[60px_1fr] items-baseline gap-3 border-t border-ink/10 py-3 first:border-t-0">
                  <span className="font-mono text-[0.8rem] text-kothokgreen">{r[0]}</span>
                  <div>
                    <h3 className="flex items-center gap-2 font-display text-[1rem] font-semibold">{r[1]}<span className={`inline-block h-2 w-2 rounded-sm ${r[3] === "r" ? "bg-kothokred" : r[3] === "g" ? "bg-kothokgreen" : "bg-eink-500"}`} /></h3>
                    <p className="mt-0.5 max-w-[60ch] text-eink-700">{r[2]}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-ink/10" />
            <div className="grid grid-cols-[1.4fr_1fr] items-center gap-6 px-6 py-6">
              <div>
                <Eyebrow>Get it</Eyebrow><h2 className="font-display text-[1.5rem] font-semibold leading-tight">Put KoThok on your Kobo.</h2>
                {[["01", "Download - get the installer for your system."], ["02", "Plug in - connect the reader over USB."], ["03", "Double-click - KoThok is copied to your reader."]].map((s) => (
                  <div key={s[0]} className="mt-2 flex gap-2"><span className="font-mono text-[0.7rem] text-kothokgreen">{s[0]}</span><span>{s[1]}</span></div>
                ))}
                <div className="mt-3 flex gap-2">
                  <span className="rounded-lg border border-ink/10 px-2 py-1 font-mono text-[0.55rem] text-eink-700">install.bat</span>
                  <span className="rounded-lg border border-ink/10 px-2 py-1 font-mono text-[0.55rem] text-eink-700">install.command</span>
                  <span className="rounded-lg border border-ink/10 px-2 py-1 font-mono text-[0.55rem] text-eink-700">install.sh</span>
                </div>
              </div>
              <div className="flex justify-center"><DeviceMock className="h-44 w-36" variant="library" /></div>
            </div>
            <Foot />
          </Board>

          {/* ===== B - Bento Showcase ===== */}
          <Board name="B - Bento Showcase" tag="modular · product-launch">
            <NavBar />
            <div className="px-4 pb-5">
              <div className="grid grid-cols-[2fr_1fr] gap-3">
                <div className="relative flex min-h-[230px] flex-col justify-end overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.03] p-4">
                  <div className="pointer-events-none absolute right-4 top-3"><Device className="h-40 w-32" /></div>
                  <Eyebrow>For Kobo e-readers</Eyebrow>
                  <h1 className="font-display text-[2.1rem] font-bold leading-[1] tracking-tight"><span className="text-kothokred">Read</span> · <span className="text-kothokgreen">Listen</span> · Anywhere</h1>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-1 flex-col justify-center rounded-2xl border border-ink/10 bg-ink/[0.015] p-4"><Eyebrow>Read aloud</Eyebrow><Player /><p className="mt-2 text-[0.78rem] text-eink-700">Natural voices over Bluetooth.</p></div>
                  <div className="flex flex-1 flex-col justify-center rounded-2xl border border-ink/10 bg-ink/[0.015] p-4"><Eyebrow>Colour e-ink</Eyebrow><div className="mt-1 flex gap-1.5"><i className="h-4 w-4 rounded bg-kothokred" /><i className="h-4 w-4 rounded bg-kothokgreen" /><i className="h-4 w-4 rounded bg-[#e8c34a]" /><i className="h-4 w-4 rounded bg-[#4a78d6]" /></div></div>
                  <div className="flex flex-1 flex-col justify-center rounded-2xl border border-ink/10 bg-ink/[0.015] p-4"><Eyebrow>Any language</Eyebrow><div className="mt-1 flex flex-wrap gap-1"><span className="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[0.55rem] text-eink-700">বাংলা</span><span className="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[0.55rem] text-eink-700">العربية</span><span className="rounded-full border border-ink/15 px-2 py-0.5 font-mono text-[0.55rem] text-eink-700">中文</span></div></div>
                </div>
              </div>

              <div className="mx-auto mt-4 max-w-[60ch] text-center"><Eyebrow>What it is</Eyebrow><h2 className="font-display text-[1.5rem] font-semibold leading-tight">One book, two ways in.</h2><p className="mx-auto mt-2 max-w-[50ch] text-eink-700">Read it on colour e-ink, or have it read aloud. No phone, no cloud - just the device in your hand.</p></div>

              <div className="mt-3 grid grid-cols-[1.4fr_1fr] gap-3">
                <div className="row-span-2 rounded-2xl border border-ink/10 bg-ink/[0.015] p-4">
                  <h3 className="flex items-center gap-2 font-display text-[0.98rem] font-semibold">Read aloud <span className="inline-block h-2 w-2 rounded-sm bg-kothokgreen" /></h3>
                  <p className="mt-1 text-eink-700">Natural-sounding voices read your book over a Bluetooth speaker, pausing like a person would.</p>
                  <div className="mt-3 w-fit"><Player /></div>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-ink/[0.015] p-4"><h3 className="flex items-center gap-2 font-display text-[0.98rem] font-semibold">Read in colour <span className="inline-block h-2 w-2 rounded-sm bg-kothokred" /></h3><p className="mt-1 text-eink-700">Covers, chapters &amp; pictures on colour e-ink.</p></div>
                <div className="rounded-2xl border border-ink/10 bg-ink/[0.015] p-4"><h3 className="flex items-center gap-2 font-display text-[0.98rem] font-semibold">Remembers you <span className="inline-block h-2 w-2 rounded-sm bg-eink-500" /></h3><p className="mt-1 text-eink-700">Page, brightness &amp; voice saved - even after sleep.</p></div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-ink/10 bg-ink/[0.015] p-4"><Eyebrow>Get it</Eyebrow><div className="mt-2 flex justify-between gap-2 text-center">
                  {[["01", "Download"], ["02", "Plug in"], ["03", "Run"], ["04", "Read"]].map((s) => (
                    <div key={s[0]} className="flex-1 rounded-xl border border-ink/10 py-2.5"><div className="font-mono text-[0.6rem] text-kothokgreen">{s[0]}</div><div className="mt-0.5 text-[0.72rem] font-semibold">{s[1]}</div></div>
                  ))}
                </div></div>
                <div className="flex flex-col items-start justify-center gap-2 rounded-2xl border border-ink/10 bg-ink/[0.015] p-4"><h3 className="font-display text-[0.98rem] font-semibold">Put KoThok on your Kobo</h3><Btn /></div>
              </div>
            </div>
            <Foot />
          </Board>

          {/* ===== C - Cinematic Scroll ===== */}
          <Board name="C - Cinematic Scroll" tag="immersive · device-led">
            <NavBar />
            <div className="grid min-h-[280px] grid-cols-1 items-center gap-6 px-6 py-9 text-center md:grid-cols-2 md:gap-10 md:px-10 md:text-left">
              <div className="flex justify-center"><Device className="h-40 w-32" /></div>
              <div>
                <h1 className="font-display text-[2.6rem] font-bold leading-[0.98] tracking-tight"><span className="text-kothokred">Read</span> · <span className="text-kothokgreen">Listen</span> · Anywhere</h1>
                <p className="mx-auto mt-2 max-w-[40ch] text-eink-700 md:mx-0">Open a book and KoThok reads it aloud over Bluetooth - or read it yourself on colour e-ink.</p>
                <div className="mt-3 flex items-center justify-center gap-4 md:justify-start"><Btn /><span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-eink-500">See how it works</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-5 px-6 py-6 md:grid-cols-2">
              <div>
                <p className="mb-1 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-kothokgreen">screen · library</p>
                <h3 className="font-display text-[1.05rem] font-semibold">One book, two ways in.</h3>
                <p className="mt-1.5 text-eink-700">KoThok takes over the screen - library, chapters and pages on colour e-ink.</p>
              </div>
              <DeviceMock className="mx-auto h-44 w-36" variant="library" />
            </div>
            <div className="grid grid-cols-1 items-center gap-5 px-6 py-6 md:grid-cols-2">
              <DeviceMock className="mx-auto h-44 w-36" variant="splash" />
              <div>
                <p className="mb-1 font-mono text-[0.55rem] uppercase tracking-[0.1em] text-kothokgreen">screen · splash</p>
                <h3 className="font-display text-[1.05rem] font-semibold">Read aloud, in any language.</h3>
                <p className="mt-1.5 text-eink-700">Voices read your book over Bluetooth. Arabic, Bangla, Hindi, Thai, Chinese and more.</p>
              </div>
            </div>
            <div className="flex flex-col items-center px-6 py-7 text-center">
              <Eyebrow>Get it</Eyebrow><h2 className="font-display text-[1.5rem] font-semibold leading-tight">Put KoThok on your Kobo.</h2>
              <div className="mt-3 w-full max-w-[430px] rounded-2xl border border-ink/10 p-4 text-left">
                {[["01", "Download the installer for your system."], ["02", "Plug in your Kobo over USB."], ["03", "Double-click - KoThok is copied to your reader."], ["04", "Start reading."]].map((s) => (
                  <div key={s[0]} className="mt-2 flex gap-2 first:mt-0"><span className="font-mono text-[0.66rem] text-kothokgreen">{s[0]}</span><span>{s[1]}</span></div>
                ))}
                <div className="mt-3"><Btn /></div>
              </div>
            </div>
            <Foot />
          </Board>
        </div>
      </div>
    </div>
  );
}
