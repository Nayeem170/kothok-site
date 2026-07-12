import { useEffect, useRef, useState } from "react";

type Lang = { code: string; label: string; file: string };

const LANGS: Lang[] = [
  { code: "en", label: "English", file: "en-sample.mp3" },
  { code: "bn", label: "বাংলা", file: "bn-sample.mp3" },
  { code: "ar", label: "العربية", file: "ar-sample.mp3" },
  { code: "hi", label: "हिन्दी", file: "hi-sample.mp3" },
  { code: "th", label: "ไทย", file: "th-sample.mp3" },
  { code: "ja", label: "日本語", file: "ja-sample.mp3" },
];

const BASE = `${import.meta.env.BASE_URL}samples/`;

function PlayPauseIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-eink-300/40">
      <div
        className="h-full rounded-full bg-kothokgreen transition-[width] duration-150 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

function LangChips({ code, onPick }: { code: string; onPick: (code: string) => void }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onPick(lang.code)}
          className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
            lang.code === code ? "bg-ink text-paper" : "bg-ink/5 text-eink-500 hover:text-ink"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export function SamplePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantPlay = useRef(false);
  const [code, setCode] = useState("en");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const active = LANGS.find((lang) => lang.code === code) ?? LANGS[0];

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      // best-effort: play() rejects before a user gesture or if the browser blocks autoplay
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  const pick = (next: string) => {
    wantPlay.current = playing;
    setCode(next);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setProgress(0);
    a.load();
    if (wantPlay.current) {
      wantPlay.current = false;
      // best-effort: play() rejects before a user gesture or if the browser blocks autoplay
      a.play().catch(() => {});
    }
  }, [code]);

  return (
    <div className="mt-8 flex items-center gap-4">
      <button
        onClick={toggle}
        aria-label={playing ? "Pause sample" : "Play sample"}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-colors ${
          playing ? "bg-kothokred" : "bg-kothokgreen"
        }`}
      >
        <PlayPauseIcon playing={playing} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink">Hear a sample</span>
          <span className="text-xs text-eink-500">· {active.label}</span>
        </div>

        <ProgressBar progress={progress} />
        <LangChips code={code} onPick={pick} />
      </div>

      <audio
        ref={audioRef}
        src={BASE + active.file}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onTimeUpdate={(e) => {
          const a = e.currentTarget;
          setProgress(a.duration ? a.currentTime / a.duration : 0);
        }}
      />
    </div>
  );
}
