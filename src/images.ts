export type ScreenState = "library" | "reading" | "readAloud" | "settings";

export const DEVICE_IMAGES: Record<ScreenState, string[]> = {
  library: ["/images/screen-library.webp", "/images/screen-library.png"],
  reading: ["/images/screen-reading.webp", "/images/screen-reading.png"],
  readAloud: ["/images/screen-readaloud.webp", "/images/screen-readaloud.png"],
  settings: ["/images/screen-settings.webp", "/images/screen-settings.png"],
};

export const SCENE_IMAGES: Record<ScreenState, string[]> = {
  library: ["/images/scene-library.webp", "/images/scene-library.png"],
  reading: ["/images/scene-reading.webp", "/images/scene-reading.png"],
  readAloud: ["/images/scene-readaloud.webp", "/images/scene-readaloud.png"],
  settings: ["/images/scene-voicespeed.webp", "/images/scene-voicespeed.png"],
};
