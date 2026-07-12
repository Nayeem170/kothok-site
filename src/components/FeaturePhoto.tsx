import { useState } from "react";
import { SCENE_IMAGES } from "../images";
import type { ScreenState } from "../images";
import { DeviceFrame, ScreenContent } from "./DeviceScreen";

export function FeaturePhoto({
  state,
  alt,
  className = "",
}: {
  state: ScreenState;
  alt?: string;
  className?: string;
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

  return (
    <img
      src={candidates[index]}
      alt={alt ?? `${state} scene`}
      onError={() => setIndex((i) => i + 1)}
      className={className}
      loading="lazy"
    />
  );
}
