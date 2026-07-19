import * as THREE from "three";

/// The "kobo" wordmark stamped on the bezel below the panel. The screen itself
/// is textured from real device captures - see `Device.tsx`.
export function makeKoboLogoTexture(color: string, anisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, 320, 96);
  ctx.fillStyle = color;
  ctx.font = "600 64px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("kobo", 160, 50);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}
