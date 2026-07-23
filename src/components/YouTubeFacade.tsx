import { useState } from "react";

type Props = {
  videoId: string;
  poster: string;
  title: string;
};

export function YouTubeFacade({ videoId, poster, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-2xl">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl ring-1 ring-black/10 shadow-2xl"
    >
      <img
        src={poster}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
        <svg
          className="ml-1 h-7 w-7 text-kothokred md:h-9 md:w-9"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
