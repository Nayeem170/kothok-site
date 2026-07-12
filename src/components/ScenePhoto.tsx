import { useState } from "react";
import { SCENE_IMAGES } from "../images";
import type { ScreenState } from "../images";

export function ScenePhoto({
  name,
  alt,
  caption,
  sub,
}: {
  name: ScreenState;
  alt: string;
  caption?: string;
  sub?: string;
}) {
  const candidates = SCENE_IMAGES[name];
  const [index, setIndex] = useState(0);

  if (index >= candidates.length) return null;
  const src = candidates[index];

  return (
    <section className="relative w-full overflow-hidden bg-ink">
      <img
        key={src}
        src={src}
        alt={alt}
        onError={() => setIndex((i) => i + 1)}
        className="block h-[60vh] w-full object-cover md:h-[78vh]"
        loading="lazy"
      />
      {caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-6 py-10 md:px-16 md:py-16">
          <p className="max-w-2xl font-display text-2xl font-semibold text-white md:text-4xl">
            {caption}
          </p>
          {sub && <p className="mt-2 max-w-xl text-sm text-white/85 md:text-lg">{sub}</p>}
        </div>
      )}
    </section>
  );
}
