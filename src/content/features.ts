import type { ScreenState } from "../images";

type ChipTone = "key" | "caveat" | "plain";

export type SpecChip = {
  label: string;
  value: string;
  tone: ChipTone;
};

export type FeatureCell = {
  id: string;
  title: string;
  line: string;
  chips: SpecChip[];
  state: ScreenState;
  shot: string;
};

export const FEATURES: FeatureCell[] = [
  {
    id: "read-aloud",
    title: "Read aloud",
    line: "Natural-sounding voices read your book over a Bluetooth speaker.",
    chips: [
      { label: "Voices", value: "300+ from Edge TTS", tone: "key" },
      { label: "Output", value: "Bluetooth A2DP", tone: "plain" },
      { label: "Needs", value: "WiFi", tone: "caveat" },
    ],
    state: "readAloud",
    shot: "01-table",
  },
  {
    id: "follow-along",
    title: "Follow along",
    line: "The page turns while it reads to you, so your eyes and ears stay in sync.",
    chips: [
      { label: "Turn", value: "Mid-sentence, no gap", tone: "key" },
      { label: "Sync", value: "Audio drives the page", tone: "plain" },
    ],
    state: "reading",
    shot: "02-hand",
  },
  {
    id: "opens-instantly",
    title: "Opens instantly",
    line: "After the first time, your books are cached and ready to go.",
    chips: [
      { label: "Cache", value: "Parsed-book disk cache", tone: "plain" },
      { label: "Covers", value: "Grid with art", tone: "plain" },
      { label: "Sort", value: "Most recent first", tone: "plain" },
    ],
    state: "library",
    shot: "03-desk",
  },
  {
    id: "wakes-right",
    title: "Wakes up right",
    line: "On the page you left, at the brightness you set, in the voice that matches the book.",
    chips: [
      { label: "Sleep", value: "Keeps page and light", tone: "key" },
      { label: "Voice", value: "Auto per language", tone: "plain" },
      { label: "Font", value: "Resize without losing place", tone: "plain" },
    ],
    state: "settings",
    shot: "04-night",
  },
  {
    id: "anywhere",
    title: "Anywhere",
    line: "Prop it up and let it read while your hands are busy - cooking, walking, on the road.",
    chips: [
      { label: "Hands", value: "Free while it reads", tone: "key" },
      { label: "Output", value: "Any Bluetooth speaker", tone: "plain" },
      { label: "Needs", value: "WiFi", tone: "caveat" },
    ],
    state: "anywhere",
    shot: "05-kitchen",
  },
];
