import { useState } from "react";
import { DEVICE_IMAGES } from "../images";
import type { ScreenState } from "../images";
import { DeviceFrame, ScreenContent } from "./DeviceScreen";

export function DeviceImage({
  state,
  alt,
  className = "",
}: {
  state: ScreenState;
  alt?: string;
  className?: string;
}) {
  const candidates = DEVICE_IMAGES[state];
  const [index, setIndex] = useState(0);

  return (
    <DeviceFrame className={className}>
      {index < candidates.length ? (
        <img
          src={candidates[index]}
          alt={alt ?? `${state} screen`}
          onError={() => setIndex((i) => i + 1)}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <ScreenContent state={state} />
      )}
    </DeviceFrame>
  );
}
