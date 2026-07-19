export type ScreenState = "library" | "reading" | "readAloud" | "settings" | "anywhere";

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
  readAloud: ["/images/01-car.jpg", "/screens/audio.png"],
  reading: ["/images/02-hill.jpg", "/screens/reading.png"],
  library: ["/images/03-library.jpg", "/screens/library.png"],
  settings: ["/images/04-night.jpg", "/screens/menu.png"],
  anywhere: ["/images/05-kitchen.jpg", "/screens/splash.png"],
};
