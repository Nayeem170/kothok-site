type CompareRow = {
  feature: string;
  kothok: string;
  kobo: string;
  koreader: string;
  kothokWeak?: boolean;
};

// Kobo firmware and the KOReader plugin both move. Re-verify on each release and
// update this date, which is rendered under the table.
//
// The voice count moves too - Microsoft adds and retires voices. Last counted at
// 322 (142 locales, 75 languages) from the Edge voice list endpoint, so "300+"
// is stated rather than an exact figure that would go stale between releases.
export const COMPARE_CHECKED_ON = "July 2026";

export const COMPARE: CompareRow[] = [
  {
    feature: "Voices",
    kothok: "300+ Edge neural",
    kobo: "Built in, list not published",
    koreader: "espeak-ng, or Piper models you install",
  },
  {
    feature: "Bengali, Thai and Japanese",
    kothok: "Neural voices",
    kobo: "Not published",
    koreader: "espeak-ng only, no Piper model",
  },
  {
    feature: "Page turns while it reads",
    kothok: "Yes, mid-sentence",
    kobo: "Not published",
    koreader: "Yes, with the plugin",
  },
  {
    feature: "Hardware needed",
    kothok: "A Bluetooth speaker",
    kobo: "A speaker and a keyboard",
    koreader: "A Bluetooth speaker",
  },
  {
    feature: "Setup",
    kothok: "One double-click",
    kobo: "Factory reset, and again to undo",
    koreader: "Reader, then plugin, then voice models",
  },
  {
    feature: "Where it works",
    kothok: "Anywhere",
    kobo: "Europe only",
    koreader: "Anywhere",
  },
  {
    feature: "Works offline",
    kothok: "Reading only",
    kobo: "Yes",
    koreader: "Yes",
    kothokWeak: true,
  },
  {
    feature: "Free and open source",
    kothok: "Yes",
    kobo: "No",
    koreader: "Yes",
  },
];
