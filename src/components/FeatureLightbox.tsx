import { useEffect } from "react";
import { FeaturePhoto } from "./FeaturePhoto";
import type { ScreenState } from "../images";

type FeatureLightboxData = {
  title: string;
  state: ScreenState;
};

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/25 transition-colors hover:bg-black/70"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  );
}

function LightboxCaption({ title, isFullSize }: { title: string; isFullSize: boolean }) {
  return (
    <div className="pointer-events-none absolute bottom-4 inset-x-0 text-center font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/60">
      {title} -{" "}
      {isFullSize ? "scroll to read - click image to fit" : "click image for full size"}
    </div>
  );
}

export function FeatureLightbox({
  feature,
  isFullSize,
  onToggleSize,
  onClose,
}: {
  feature: FeatureLightboxData;
  isFullSize: boolean;
  onToggleSize: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-lightbox bg-black"
      role="dialog"
      aria-modal="true"
      aria-label={feature.title}
    >
      <div
        className={`absolute inset-0 ${isFullSize ? "overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : "flex items-center justify-center"}`}
        onClick={onClose}
      >
        <div
          className={
            isFullSize
              ? "flex min-h-full items-start justify-center"
              : "flex h-full w-full items-center justify-center"
          }
        >
          <FeaturePhoto
            state={feature.state}
            alt={feature.title}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSize();
            }}
            className={
              isFullSize
                ? "block max-w-none cursor-zoom-out"
                : "max-h-full max-w-full cursor-zoom-in object-contain"
            }
          />
        </div>
      </div>

      <CloseButton onClose={onClose} />
      <LightboxCaption title={feature.title} isFullSize={isFullSize} />
    </div>
  );
}
