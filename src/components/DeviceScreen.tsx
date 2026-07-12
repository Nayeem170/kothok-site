import type { ReactNode } from "react";
import type { ScreenState } from "../images";

const BOOKS = [
  { t: "The Happy Prince", a: "Oscar Wilde", c: "from-[#0e7a64] to-[#0a5645]" },
  { t: "Pride & Prejudice", a: "Jane Austen", c: "from-[#b23a4e] to-[#7c2436]" },
  { t: "Frankenstein", a: "Mary Shelley", c: "from-[#3b4358] to-[#20253a]" },
  { t: "Alice's Adventures", a: "Lewis Carroll", c: "from-[#6a4ca0] to-[#46306f]" },
  { t: "The Jungle Book", a: "Rudyard Kipling", c: "from-[#b5872e] to-[#856219]" },
  { t: "Treasure Island", a: "R.L. Stevenson", c: "from-[#1f5f8b] to-[#13486c]" },
];

const READING_LINES = ["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-3/4", "w-full", "w-5/6"];
const WAVE = [4, 8, 12, 7, 14, 10, 6, 13, 9, 5, 11, 7, 4, 9, 12, 6];

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function LibraryScreen() {
  return (
    <div className="relative flex h-full flex-col p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-display text-sm font-semibold text-ink">Library</span>
        <span className="font-mono text-[0.6rem] text-eink-500">6 books</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 overflow-hidden">
        {BOOKS.map((b, i) => (
          <div key={b.t} className={`relative flex flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br ${b.c} p-2`}>
            <span className="absolute left-0 top-0 h-full w-1 bg-black/25" />
            <span className="text-[0.62rem] font-semibold leading-tight text-white/95">{b.t}</span>
            <span className="truncate text-[0.5rem] uppercase tracking-wide text-white/70">{b.a}</span>
            {i === 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-kothokred ring-2 ring-white/80" />}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-ink/10 pt-2 font-mono text-[0.55rem]">
        <span className="text-kothokgreen">Library</span>
        <span className="text-eink-500">Settings</span>
      </div>
    </div>
  );
}

function ReadingScreen() {
  return (
    <div className="relative flex h-full flex-col p-4">
      <div className="mb-0.5 font-mono text-[0.55rem] uppercase tracking-wide text-eink-500">Chapter 3</div>
      <h4 className="font-display text-base font-semibold text-ink">The Selfish Giant</h4>
      <div className="mt-3 flex flex-col gap-1.5">
        {READING_LINES.map((w, i) => (
          <div key={i} className={`h-1.5 rounded bg-[#d8d4ca] ${w}`} />
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-2">
        <span className="font-mono text-[0.55rem] text-eink-500">Page 24</span>
        <div className="h-1 w-24 overflow-hidden rounded-full bg-eink-300">
          <div className="h-1 w-1/3 rounded-full bg-kothokgreen" />
        </div>
      </div>
    </div>
  );
}

function ReadAloudScreen() {
  return (
    <div className="relative flex h-full flex-col p-4">
      <h4 className="font-display text-base font-semibold text-ink">The Selfish Giant</h4>
      <div className="mt-3 flex flex-col gap-1.5">
        {READING_LINES.slice(0, 5).map((w, i) => (
          <div key={i} className={`h-1.5 rounded bg-[#d8d4ca] ${w}`} />
        ))}
      </div>
      <div className="mt-auto rounded-xl border border-ink/10 bg-ink/[0.03] p-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-kothokgreen text-paper">
            <PlayIcon className="ml-0.5 h-3 w-3" />
          </span>
          <div className="flex h-5 flex-1 items-center gap-0.5">
            {WAVE.map((h, i) => (
              <span key={i} className="flex-1 rounded-full bg-kothokgreen/80" style={{ height: `${h}px` }} />
            ))}
          </div>
          <span className="font-mono text-[0.55rem] text-eink-500">0:42</span>
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[0.5rem] text-eink-500">
          <span>English · Ava</span>
          <span>1.0x</span>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen() {
  return (
    <div className="relative flex h-full flex-col p-4">
      <h4 className="font-display text-base font-semibold text-ink">Settings</h4>
      <div className="mt-4 flex flex-col gap-4">
        <div>
          <div className="flex justify-between font-mono text-[0.55rem] text-eink-700">
            <span>Brightness</span>
            <span>70%</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-eink-300">
            <div className="h-1.5 w-2/3 rounded-full bg-ink" />
          </div>
        </div>
        <div>
          <div className="flex justify-between font-mono text-[0.55rem] text-eink-700">
            <span>Font size</span>
            <span>Large</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-eink-300">
            <div className="h-1.5 w-4/5 rounded-full bg-ink" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-ink/10 px-2.5 py-2">
          <span className="text-[0.6rem] text-eink-700">Voice</span>
          <span className="flex items-center gap-1 font-mono text-[0.55rem] text-kothokgreen">
            English · Ava <Chevron className="h-2.5 w-2.5" />
          </span>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-ink/10 px-2.5 py-2">
          <span className="text-[0.6rem] text-eink-700">Bluetooth speaker</span>
          <span className="font-mono text-[0.55rem] text-kothokgreen">Connected</span>
        </div>
      </div>
    </div>
  );
}

export function ScreenContent({ state }: { state: ScreenState }) {
  return (
    <>
      {state === "library" && <LibraryScreen />}
      {state === "reading" && <ReadingScreen />}
      {state === "readAloud" && <ReadAloudScreen />}
      {state === "settings" && <SettingsScreen />}
    </>
  );
}

export function DeviceFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${className} relative`}>
      <div className="absolute -bottom-4 left-1/2 h-5 w-3/4 -translate-x-1/2 rounded-[100%] bg-black/20 blur-lg" />
      <div className="relative aspect-[3/4] w-full rounded-[22px] bg-gradient-to-b from-[#2b2b30] to-[#0e0e12] p-2.5 shadow-2xl ring-1 ring-black/40">
        <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-[#f3f0e8]">
          {children}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

export function DeviceScreen({ state, className = "" }: { state: ScreenState; className?: string }) {
  return (
    <DeviceFrame className={className}>
      <ScreenContent state={state} />
    </DeviceFrame>
  );
}
