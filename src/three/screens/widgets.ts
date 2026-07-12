import { SW, SH, roundRect, resetText, centerWrap } from "./primitives";

export const UI = {
  track: "#d0d0d0",
  ink: "#111111",
  ready: "#006A4E",
  playing: "#E00000",
  muted: "#8a8a8a",
  rule: "#999999",
  green: "#006A4E",
  dark: "#1a1a1a",
};

export const COVERS: { title: string; author: string; color: string; progress: number }[] = [
  { title: "The Happy Prince", author: "Oscar Wilde", color: "#006A4E", progress: 0.05 },
  { title: "Gitanjali", author: "Rabindranath Tagore", color: "#B45309", progress: 0.22 },
  { title: "The Prophet", author: "Kahlil Gibran", color: "#1F2937", progress: 0 },
  { title: "Dubliners", author: "James Joyce", color: "#6D28D9", progress: 0.61 },
  { title: "Kim", author: "Rudyard Kipling", color: "#0E7490", progress: 0 },
  { title: "Moby-Dick", author: "Herman Melville", color: "#9CA3AF", progress: 0.13 },
  { title: "Frankenstein", author: "Mary Shelley", color: "#7F1D1D", progress: 0 },
];

export function drawCoverArt(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  book: { title: string; author: string; color: string },
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

export function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  frac: number,
) {
  const h = 8;
  ctx.fillStyle = "#d0d0d0";
  roundRect(ctx, x, y, w, h, 4);
  ctx.fill();
  ctx.fillStyle = "#111111";
  roundRect(ctx, x, y, Math.max(4, w * frac), h, 4);
  ctx.fill();
}

export function drawButton(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  opts?: { value?: string; bg?: string; fontSize?: number; radius?: number },
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

export function drawRule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.fillStyle = UI.rule;
  ctx.fillRect(x, y, w, 2);
}

export function drawSliderRow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  name: string,
  value: string,
  fill: number,
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

export function drawFooter(ctx: CanvasRenderingContext2D, playing: boolean, status: string) {
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

export function drawNavBar(ctx: CanvasRenderingContext2D) {
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
