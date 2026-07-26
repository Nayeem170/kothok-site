export type Step = {
  n: string;
  title: string;
  body: string;
};

export type Installer = {
  os: string;
  file: string;
  how: string;
};

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Download KoThok",
    body: "Get the installer for your system. No build tools needed.",
  },
  {
    n: "02",
    title: "Plug in your Kobo",
    body: "Connect the reader with the USB cable that came with it.",
  },
  {
    n: "03",
    title: "Double-click the installer",
    body: "It downloads KoThok and copies it to your reader. No terminal, no setup.",
  },
  {
    n: "04",
    title: "Start reading",
    body: 'Eject the reader, then tap "KoThok" in your Kobo menu.',
  },
];

export const INSTALLERS: Installer[] = [
  { os: "Windows", file: "install.bat", how: "Double-click in Explorer" },
  { os: "macOS", file: "install.command", how: "Double-click in Finder" },
  { os: "Linux", file: "install.sh", how: "Run ./install.sh" },
];
