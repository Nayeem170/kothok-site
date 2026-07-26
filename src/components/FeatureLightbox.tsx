import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { FeaturePhoto } from "./FeaturePhoto";
import type { ScreenState } from "../images";

type FeatureLightboxData = {
  title: string;
  state: ScreenState;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function CloseButton({
  onClose,
  buttonRef,
}: {
  onClose: () => void;
  buttonRef: RefObject<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
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
      {title} - {isFullSize ? "scroll to read - click image to fit" : "click image for full size"}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = containerRef.current;
      if (!root) return;
      const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
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
          <button
            type="button"
            aria-label={isFullSize ? "Show normal size" : "Show full size"}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSize();
            }}
            className={`block border-0 bg-transparent p-0 ${isFullSize ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          >
            <FeaturePhoto
              state={feature.state}
              alt={feature.title}
              className={isFullSize ? "block max-w-none" : "max-h-full max-w-full object-contain"}
            />
          </button>
        </div>
      </div>

      <CloseButton onClose={onClose} buttonRef={closeBtnRef} />
      <LightboxCaption title={feature.title} isFullSize={isFullSize} />
    </div>
  );
}
