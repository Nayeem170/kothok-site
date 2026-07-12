import { useState } from "react";
import { DeviceFrame, ScreenContent } from "./DeviceScreen";
import { DEVICE_IMAGES } from "../images";
import type { ScreenState } from "../images";

export function DeviceImage({
  state,
  className = "",
  alt,
}: {
  state: ScreenState;
  className?: string;
  alt?: string;
}) {
  const candidates = DEVICE_IMAGES[state];
  const [index, setIndex] = useState(0);
  const failed = index >= candidates.length;

  return (
    <DeviceFrame className={className}>
      {!failed ? (
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
