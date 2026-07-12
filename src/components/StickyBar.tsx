import { useEffect, useState } from "react";
import { DownloadButton } from "./DownloadButton";

export function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const nearBottom = y + vh > docH - 160;
      setShow(y > vh * 0.85 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto mb-4 flex w-[calc(100%-2rem)] max-w-3xl items-center justify-between gap-4 rounded-full border border-ink/10 bg-paper/90 px-5 py-2.5 shadow-lg shadow-ink/10 backdrop-blur-md">
        <span className="truncate font-display text-sm font-semibold tracking-tight text-ink">
          KoThok <span className="text-eink-500">- Read · Listen · Anywhere</span>
        </span>
        <DownloadButton label="Get it" className="px-5 py-2.5" />
      </div>
    </div>
  );
}
