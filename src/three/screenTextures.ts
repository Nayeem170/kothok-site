import * as THREE from "three";
import { SW, SH } from "./screens/primitives";
import { drawLibrary } from "./screens/library";
import { drawReading } from "./screens/reading";
import { drawChapters } from "./screens/chapters";
import { drawMenu } from "./screens/menu";

export type ScreenState = "library" | "reading" | "listening" | "chapters" | "menu";

export const SCREEN_ORDER: ScreenState[] = ["library", "reading", "listening", "chapters", "menu"];

function makeCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = SW;
  canvas.height = SH;
  return { canvas, ctx: canvas.getContext("2d")! };
}

function texFrom(draw: (ctx: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas();
  draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function buildScreenTextures(): Record<ScreenState, THREE.CanvasTexture> {
  return {
    library: texFrom(drawLibrary),
    reading: texFrom((c) => drawReading(c, false)),
    listening: texFrom((c) => drawReading(c, true)),
    chapters: texFrom(drawChapters),
    menu: texFrom(drawMenu),
  };
}

export function makeKoboLogoTexture(color: string): THREE.CanvasTexture {
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
  tex.anisotropy = 4;
  tex.needsUpdate = true;
  return tex;
}
