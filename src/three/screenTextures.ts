import * as THREE from "three";

export type ScreenState = "library" | "reading" | "listening" | "chapters" | "menu";

export const SCREEN_ORDER: ScreenState[] = ["library", "reading", "listening", "chapters", "menu"];

const SW = 1072;
const SH = 1448;

const UI = {
  track: "#d0d0d0",
  ink: "#111111",
  ready: "#006A4E",
  playing: "#E00000",
  muted: "#8a8a8a",
  rule: "#999999",
  green: "#006A4E",
  dark: "#1a1a1a",
};

const BODY = [
  "One night there flew over the city a little Swallow. His friends had gone away to Egypt six weeks before, but he had stayed behind, for he was in love with the most beautiful Reed.",
  "He had met her early in the spring as he was flying down the river after a big yellow moth, and had been so attracted by her slender waist that he had stopped to talk to her.",
  "“Shall I love you?” said the Swallow, who liked to come to the point at once, and the Reed made him a low bow. So he flew round and round her, and made silver ripples.",
];

const COVERS: { title: string; author: string; color: string; progress: number }[] = [
  { title: "The Happy Prince", author: "Oscar Wilde", color: "#006A4E", progress: 0.05 },
  { title: "Gitanjali", author: "Rabindranath Tagore", color: "#B45309", progress: 0.22 },
  { title: "The Prophet", author: "Kahlil Gibran", color: "#1F2937", progress: 0 },
  { title: "Dubliners", author: "James Joyce", color: "#6D28D9", progress: 0.61 },
  { title: "Kim", author: "Rudyard Kipling", color: "#0E7490", progress: 0 },
  { title: "Moby-Dick", author: "Herman Melville", color: "#9CA3AF", progress: 0.13 },
  { title: "Frankenstein", author: "Mary Shelley", color: "#7F1D1D", progress: 0 },
];

const CHAPTERS = [
  "The Happy Prince",
  "The Nightingale and the Rose",
  "The Selfish Giant",
  "The Devoted Friend",
  "The Remarkable Rocket",
  "Appendix - Notes",
];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function resetText(ctx: CanvasRenderingContext2D) {
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  let line = "";
  let yy = y;
  for (const word of text.split(" ")) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lh;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
  return yy + lh;
}

function wrapClamp(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lh: number,
  maxLines: number
): number {
  let line = "";
  let yy = y;
  let n = 1;
  for (const word of text.split(" ")) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(n === maxLines ? line + "..." : line, x, yy);
      if (n === maxLines) return yy + lh;
      line = word;
      yy += lh;
      n++;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
  return yy + lh;
}

function centerWrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  topY: number,
  maxW: number,
  lh: number,
  maxLines: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    const last = shown[maxLines - 1];
    shown[maxLines - 1] = last.slice(0, Math.max(0, last.length - 1)) + "...";
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  let yy = topY;
  for (const ln of shown) {
    ctx.fillText(ln, cx, yy);
    yy += lh;
  }
}

function drawCoverArt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  book: { title: string; author: string; color: string }
) {
  ctx.save();
  roundRect(ctx, x, y, w, h, 6);
  ctx.clip();
  ctx.fillStyle = book.color;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(x, y, Math.max(3, w * 0.05), h);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(x, y, w, h * 0.14);

  ctx.fillStyle = "#ffffff";
  const ts = Math.max(13, w * 0.135);
  ctx.font = `700 ${ts}px Georgia, serif`;
  centerWrap(ctx, book.title, x + w / 2, y + h * 0.22, w * 0.84, ts * 1.16, 3);

  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = Math.max(1, w * 0.012);
  ctx.beginPath();
  ctx.moveTo(x + w * 0.34, y + h * 0.7);
  ctx.lineTo(x + w * 0.66, y + h * 0.7);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  const as = Math.max(9, w * 0.082);
  ctx.font = `italic ${as}px Georgia, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(book.author, x + w / 2, y + h * 0.8);
  ctx.restore();
  resetText(ctx);
}

function drawProgressBar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, frac: number) {
  const h = 8;
  ctx.fillStyle = "#d0d0d0";
  roundRect(ctx, x, y, w, h, 4);
  ctx.fill();
  ctx.fillStyle = "#111111";
  roundRect(ctx, x, y, Math.max(4, w * frac), h, 4);
  ctx.fill();
}

function drawButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  opts?: { value?: string; bg?: string; fontSize?: number; radius?: number }
) {
  const o = opts || {};
  const bg = o.bg || UI.green;
  const fs = o.fontSize || 24;
  const r = o.radius ?? 10;
  ctx.fillStyle = bg;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `${fs}px Arial, sans-serif`;
  ctx.textBaseline = "middle";
  if (o.value) {
    ctx.textAlign = "left";
    ctx.fillText(label, x + 16, y + h / 2);
    ctx.textAlign = "right";
    ctx.fillText(o.value + "  >", x + w - 16, y + h / 2);
  } else {
    ctx.textAlign = "center";
    ctx.fillText(label, x + w / 2, y + h / 2 + 1);
  }
  resetText(ctx);
}

function drawRule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.fillStyle = UI.rule;
  ctx.fillRect(x, y, w, 2);
}

function drawSliderRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  name: string,
  value: string,
  fill: number
) {
  ctx.fillStyle = UI.ink;
  ctx.font = "24px Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(name, x, y + 24);
  ctx.textAlign = "right";
  ctx.fillText(value, x + w, y + 24);
  resetText(ctx);

  const yy = y + 36;
  drawButton(ctx, x, yy, 96, 56, "-", { fontSize: 40 });
  const tx = x + 96 + 14;
  const tw = w - (96 + 14) * 2;
  ctx.fillStyle = "#dcdcdc";
  roundRect(ctx, tx, yy, tw, 56, 14);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#888888";
  roundRect(ctx, tx, yy, tw, 56, 14);
  ctx.stroke();
  ctx.fillStyle = "#333333";
  roundRect(ctx, tx, yy, Math.max(56, tw * fill), 56, 14);
  ctx.fill();
  drawButton(ctx, x + w - 96, yy, 96, 56, "+", { fontSize: 36 });
  return yy + 56;
}

function drawFooter(ctx: CanvasRenderingContext2D, playing: boolean, status: string) {
  const baseY = SH - 92;
  const trackX = 56;
  const trackW = SW - 200;
  const trackY = baseY + 18;
  const trackH = 10;

  ctx.fillStyle = UI.track;
  roundRect(ctx, trackX, trackY, trackW, trackH, 5);
  ctx.fill();

  const PAGE = 7;
  const PAGES = 142;
  const SAVED = 5;
  const fillW = (PAGE / PAGES) * trackW;

  ctx.fillStyle = UI.ink;
  roundRect(ctx, trackX, trackY, fillW, trackH, 5);
  ctx.fill();

  const sx = trackX + (SAVED / PAGES) * trackW;
  ctx.fillStyle = "#000000";
  roundRect(ctx, sx - 7, trackY - 26, 14, 30, 2);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  roundRect(ctx, sx - 7, trackY - 26, 14, 30, 2);
  ctx.stroke();

  const kx = trackX + fillW;
  const ky = trackY + trackH / 2;
  ctx.fillStyle = UI.ink;
  ctx.beginPath();
  ctx.arc(kx, ky, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.fillStyle = UI.ink;
  ctx.font = "500 26px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(status, SW / 2, baseY + 60);
  resetText(ctx);

  const btnCx = SW - 88 + 32;
  const btnCy = baseY + 3 + 32;
  ctx.fillStyle = playing ? UI.playing : UI.ready;
  ctx.beginPath();
  ctx.arc(btnCx, btnCy, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  if (playing) {
    ctx.fillRect(btnCx - 11, btnCy - 14, 7, 28);
    ctx.fillRect(btnCx + 4, btnCy - 14, 7, 28);
  } else {
    ctx.beginPath();
    ctx.moveTo(btnCx - 8, btnCy - 15);
    ctx.lineTo(btnCx - 8, btnCy + 15);
    ctx.lineTo(btnCx + 15, btnCy);
    ctx.closePath();
    ctx.fill();
  }
}

function drawNavBar(ctx: CanvasRenderingContext2D) {
  const y = SH - 96;
  ctx.fillStyle = "#111111";
  ctx.fillRect(56, y + 8, SW - 112, 1);
  ctx.font = "500 26px Arial, sans-serif";
  ctx.fillStyle = UI.muted;
  ctx.textAlign = "left";
  ctx.fillText("9:41", 56, y + 56);
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "center";
  ctx.fillText("6 books - swipe up/down", SW / 2, y + 56);
  ctx.fillStyle = UI.ink;
  ctx.textAlign = "right";
  ctx.fillText("78%", SW - 56 - 30, y + 56);
  const bx = SW - 56 - 24;
  ctx.strokeStyle = UI.ink;
  ctx.lineWidth = 2;
  roundRect(ctx, bx, y + 42, 22, 12, 2);
  ctx.stroke();
  ctx.fillStyle = UI.ink;
  ctx.fillRect(bx + 22, y + 45, 2, 6);
  ctx.fillRect(bx + 3, y + 45, 13, 6);
  resetText(ctx);
}

function drawReading(ctx: CanvasRenderingContext2D, playing: boolean) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  const padX = 64;
  let y = 70;
  ctx.fillStyle = UI.ink;
  ctx.font = "700 58px Georgia, serif";
  y = wrap(ctx, "The Happy Prince", padX, y, SW - 2 * padX, 66);
  y += 4;
  ctx.fillStyle = UI.muted;
  ctx.font = "italic 30px Georgia, serif";
  ctx.fillText("Oscar Wilde", padX, y);
  y += 34 + 30;
  ctx.fillStyle = UI.ink;
  ctx.font = "34px Georgia, serif";
  for (const p of BODY) {
    y = wrap(ctx, p, padX, y, SW - 2 * padX, 52);
    y += 26;
  }
  drawFooter(ctx, playing, playing ? "Reading aloud · 2:14" : "Page 7 of 142");
}

function drawLibrary(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  const cellH = 438;
  const heroY = 10;
  const hero = COVERS[0];
  const covH = 410;
  const covW = 300;
  const covX = 24;
  const covY = heroY + (cellH - covH) / 2;
  drawCoverArt(ctx, covX, covY, covW, covH, hero);

  const textX = covX + covW + 28;
  const textW = SW - 10 - textX - 20;
  ctx.fillStyle = UI.muted;
  ctx.font = "500 28px Arial, sans-serif";
  ctx.fillText("Continue Reading", textX, heroY + 46);

  const barY = heroY + cellH - 56;
  drawProgressBar(ctx, textX, barY, textW - 96, hero.progress);
  ctx.fillStyle = UI.ink;
  ctx.font = "600 28px Arial, sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(Math.round(hero.progress * 100) + "%", textX + textW, barY + 8);
  resetText(ctx);

  const cols = 3;
  const gap = 14;
  const padX = 10;
  const availW = SW - 2 * padX;
  const cellW = (availW - (cols - 1) * gap) / cols;
  const thumbH = 300;
  const thumbW = Math.min(thumbH * 0.75, cellW * 0.82);
  const rowPitch = cellH + gap;
  const grid = COVERS.slice(1);
  for (let i = 0; i < grid.length; i++) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const cx = padX + c * (cellW + gap);
    const cy = heroY + (r + 1) * rowPitch;
    const tX = cx + (cellW - thumbW) / 2;
    drawCoverArt(ctx, tX, cy + 4, thumbW, thumbH, grid[i]);
    if (grid[i].progress > 0) {
      drawProgressBar(ctx, cx + 10, cy + 4 + thumbH + 16, cellW - 20, grid[i].progress);
    }
  }
  drawNavBar(ctx);
}

function drawChapters(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  const pad = 40;
  ctx.fillStyle = "#000000";
  ctx.font = "700 34px Arial, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText("Chapters", pad, 80);
  ctx.textBaseline = "alphabetic";
  drawButton(ctx, SW - pad - 140, 48, 140, 64, "Close");

  const cur = 2;
  let cy = 150;
  for (let i = 0; i < CHAPTERS.length; i++) {
    const isCur = i === cur;
    if (isCur) {
      ctx.fillStyle = UI.green;
      roundRect(ctx, pad - 12, cy - 6, 6, 56, 3);
      ctx.fill();
    }
    ctx.fillStyle = isCur ? UI.green : UI.ink;
    ctx.font = `${isCur ? "600" : "400"} 30px Georgia, serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(String(i + 1).padStart(2, "0"), pad + 14, cy + 24);
    ctx.fillStyle = isCur ? UI.green : UI.ink;
    wrapClamp(ctx, CHAPTERS[i], pad + 90, cy + 24, SW - pad - (pad + 90) - 20, 34, 1);
    ctx.textBaseline = "alphabetic";
    resetText(ctx);
    cy += 84;
  }

  drawButton(ctx, pad, SH - 36 - 84, SW - 2 * pad, 84, "Open", { fontSize: 32 });
}

function drawMenu(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, SW, SH);
  ctx.fillStyle = UI.green;
  ctx.fillRect(0, 0, SW, 4);

  const pad = 24;
  const gap = 18;
  const innerW = SW - 2 * pad;
  let y = pad;

  drawButton(ctx, pad, y, 160, 56, "Library");
  drawButton(ctx, pad + 160 + 12, y, 170, 56, "Reading", { fontSize: 22 });
  ctx.fillStyle = UI.ink;
  ctx.font = "22px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("9:41    78%", SW / 2, y + 28);
  resetText(ctx);
  drawButton(ctx, SW - pad - 56, y, 56, 56, "X", { fontSize: 26 });
  y += 56 + gap;

  drawRule(ctx, pad, y, innerW);
  y += gap;

  y = drawSliderRow(ctx, pad, y, innerW, "Brightness", "50%", 0.5) + gap;
  y = drawSliderRow(ctx, pad, y, innerW, "Speed", "1.0x", 0.5) + gap;
  y = drawSliderRow(ctx, pad, y, innerW, "Font", "36px", (36 - 20) / 40) + gap;
  y = drawSliderRow(ctx, pad, y, innerW, "Volume", "100%", 1.0) + gap;

  drawRule(ctx, pad, y, innerW);
  y += gap;
  drawButton(ctx, pad, y, innerW, 60, "Voice", { value: "Emma (English)", fontSize: 22 });
  y += 60 + gap;

  drawRule(ctx, pad, y, innerW);
  y += gap;
  drawButton(ctx, pad, y, 220, 60, "Home WiFi", { fontSize: 20 });
  drawButton(ctx, pad + 220 + 16, y, 220, 60, "JBL Flip", { fontSize: 20 });
  drawButton(ctx, pad + (220 + 16) * 2, y, innerW - (220 + 16) * 2, 60, "Chapters", { fontSize: 22 });
  y += 60 + gap;

  drawRule(ctx, pad, y, innerW);

  const coverW = 176;
  const coverH = coverW * 1.4;
  const coverX = SW - pad - coverW;
  const coverY = SH - pad - coverH - 10;
  drawCoverArt(ctx, coverX, coverY, coverW, coverH, COVERS[0]);

  const infoW = coverX - pad - 24;
  let iy = SH - pad - 150;
  ctx.textAlign = "left";
  ctx.fillStyle = UI.ink;
  ctx.font = "700 26px Georgia, serif";
  iy = wrap(ctx, "The Happy Prince", pad, iy, infoW, 32);
  ctx.fillStyle = "#777777";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("Oscar Wilde", pad, iy);
  iy += 28;
  ctx.fillStyle = "#333333";
  ctx.font = "20px Arial, sans-serif";
  ctx.fillText("The Selfish Giant", pad, iy);
  iy += 28;
  ctx.fillStyle = "#777777";
  ctx.fillText("Page 7 / 142", pad, iy);
  iy += 28;
  ctx.fillStyle = "#666666";
  ctx.font = "18px Arial, sans-serif";
  wrap(ctx, "swipe: pages · swipe down: menu · double-tap: play", pad, iy, infoW, 24);
  resetText(ctx);
}

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
