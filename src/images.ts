export type ScreenState = "library" | "reading" | "readAloud" | "settings";

export const SCENE_IMAGES: Record<ScreenState, string[]> = {
  library: ["/images/scene-library.webp", "/images/scene-library.png"],
  reading: ["/images/scene-reading.webp", "/images/scene-reading.png"],
  readAloud: ["/images/scene-readaloud.webp", "/images/scene-readaloud.png"],
  settings: ["/images/scene-voicespeed.webp", "/images/scene-voicespeed.png"],
};
