export type ScreenState = "library" | "reading" | "readAloud" | "settings" | "anywhere";

const BASE = import.meta.env.BASE_URL;

/// Each entry is a fallback chain - `FeaturePhoto` advances one step on load
/// error, and drops to a CSS device frame if every entry fails.
///
/// First: a scene photograph with a real device capture composited onto the
/// screen. Second: the bare capture it was built from - a 1072x1448 frame
/// pulled off a Kobo running KoThok, never a mock-up. Regenerate captures with
/// a `--features screenshot` build and the header-hold gesture; see
/// `kothok/src/rendering/screenshot.rs`.
///
/// The scene photos are derived from the originals in `design-source/`, which
/// are gitignored. Re-encode from there rather than regenerating a scene.
export const SCENE_IMAGES: Record<ScreenState, string[]> = {
  readAloud: [`${BASE}images/01-car.jpg`, `${BASE}screens/audio.png`],
  reading: [`${BASE}images/02-hill.jpg`, `${BASE}screens/reading.png`],
  library: [`${BASE}images/03-library.jpg`, `${BASE}screens/library.png`],
  settings: [`${BASE}images/04-night.jpg`, `${BASE}screens/menu.png`],
  anywhere: [`${BASE}images/05-kitchen.jpg`, `${BASE}screens/splash.png`],
};
