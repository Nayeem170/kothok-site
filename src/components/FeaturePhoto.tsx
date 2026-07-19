import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { SCENE_IMAGES } from "../images";
import type { ScreenState } from "../images";
import { DeviceFrame, ScreenContent } from "./DeviceScreen";

export function FeaturePhoto({
  state,
  alt,
  className = "",
  style,
  onClick,
}: {
  state: ScreenState;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent<HTMLImageElement>) => void;
}) {
  const candidates = SCENE_IMAGES[state];
  const [index, setIndex] = useState(0);

  if (index >= candidates.length) {
    return (
      <DeviceFrame className={className}>
        <ScreenContent state={state} />
      </DeviceFrame>
    );
  }

  // No srcSet here: the candidates are successive fallbacks, not formats of one
  // image. Deriving a srcSet from them would let the last-resort screenshot
  // override `src` and render the bare UI instead of the scene.
  return (
    <img
      src={candidates[index]}
      alt={alt ?? `${state} scene`}
      onError={() => setIndex((i) => i + 1)}
      onClick={onClick}
      className={className}
      style={style}
      loading="lazy"
    />
  );
}
