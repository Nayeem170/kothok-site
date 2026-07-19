export type Requirement = {
  label: string;
  value: string;
};

export const REQUIREMENTS: Requirement[] = [
  { label: "Device", value: "Kobo e-reader (tested on Clara Colour)" },
  { label: "Format", value: "EPUB only" },
  { label: "Install", value: "USB copy + one-time KoboRoot.tgz" },
  { label: "Read-aloud", value: "WiFi + Bluetooth A2DP speaker" },
  { label: "First install", value: "NickelMenu adds KoThok to the hamburger menu" },
  { label: "On exit", value: "Clean reboot back to nickel" },
];
